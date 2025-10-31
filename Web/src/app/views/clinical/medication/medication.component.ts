import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import Swal from 'sweetalert2';
import { ClinicalApiService } from '../clinical.api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIconComponent } from '@ng-icons/core';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-medication',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GenericPaginationComponent,
        TranslatePipe,
        NgIconComponent,
        FilledOnValueDirective
    ],
    templateUrl: './medication.component.html',
    styleUrl: './medication.component.scss'
})
export class MedicationComponent {
    MedicationForm!: FormGroup;
    DrugFilterForm!: FormGroup;
    submitted = false;
    hrEmployees: any[] = [];
    cacheItems: any[] = ['Provider'];
    DrugList: any[] = [];
    PastMedicationData: any = [];
    SearchPatientData: any;
    Mrno: any;
    PastMedicationPaginationInfo: any = {
        Page: 1,
        RowsPerPage: 10,
    };
    PastMedicationTotalItems: number = 0;
    currentMedicationData: any = [];
    modalService = new NgbModal();
    DrugPaginationInfo: any = {
        Page: 1,
        RowsPerPage: 10,
    };
    DrugTotalItems: number = 0;
    currentMedicationPaginationInfo: any = {
        Page: 1,
        RowsPerPage: 10,
    };
    currentMedicationTotalItems: number = 0;
    private patientDataSubscription!: Subscription;
    private appointmentIdSubscription!: Subscription;
    AppointmentId: any;
    constructor(
        private fb: FormBuilder,
        private clinicalApiService: ClinicalApiService,
        private PatientData: PatientBannerService) {

        this.MedicationForm = this.fb.group({
            isProviderCheck: [false],
            providerDescription: [''],
            providerId: [null],
            rx: ['', Validators.required],
            dose: ['', Validators.required],
            route: [null, Validators.required],
            startDate: ['', Validators.required],
            stopDate: ['', Validators.required],
            durationDays: ['', Validators.required],
            frequency: [null, Validators.required],
            weight: ['', Validators.required],
            givenBy: [null, Validators.required],
            givenDate: ['', Validators.required],
            checkedBy: [null, Validators.required],
            checkedDate: ['', Validators.required],
            comments: [null, Validators.required],
        });
        this.DrugFilterForm = this.fb.group({
            search: ['']
        });
    }


    ngOnInit(): void {
        this.FillCache();
        this.GetEMRRoute();
        this.GetComments();
        this.GetFrequency();

        // Wait for patient banner to provide MRNO before loading data
        this.patientDataSubscription = this.PatientData.patientData$
            .pipe(
                filter((data: any) => !!data?.table2?.[0]?.mrNo),
                distinctUntilChanged((prev, curr) =>
                    prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
                )
            )
            .subscribe((data: any) => {
                this.SearchPatientData = data;
                // Set MRNO from banner
                this.Mrno = this.SearchPatientData?.table2?.[0]?.mrNo || '';
                // After assigning, load problems
                this.GetAll_Past_CurrentPrescriptions();
            });

        this.appointmentIdSubscription = this.PatientData.visitAppointments$.subscribe((data: any) => {
            debugger
            this.AppointmentId = data?.table2?.[0]?.appointmentId || '';
        });

        this.GetAll_Past_CurrentPrescriptions();
    }

    async FillCache() {
        await this.clinicalApiService.getCacheItems({ entities: this.cacheItems }).then((response: any) => {
            if (response.cache != null) {
                this.FillDropDown(response);
            }
        })
            .catch((error: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Something went wrong!',
                    confirmButtonColor: '#d33'
                })
            })
    };

    FillDropDown(response: any) {
        let jParse = JSON.parse(JSON.stringify(response)).cache;
        let provider = JSON.parse(jParse).Provider;
        if (provider) {
            provider = provider.map((item: { EmployeeId: any; FullName: any; }) => {
                return {
                    name: item.FullName,
                    providerId: item.EmployeeId
                };
            });
            this.hrEmployees = provider;
        }
    };

    GetRoute: any = []
    GetEMRRoute() {
        this.clinicalApiService.GetEMRRoute().then((res: any) => {
            this.GetRoute = res.result
        })
    }
    getComments: any = []
    GetComments() {
        this.clinicalApiService.GetComments().then((res: any) => {
            this.getComments = res.result
        })
    }
    getfrequency: any = []
    GetFrequency() {
        this.clinicalApiService.GetFrequency().then((res: any) => {
            this.getfrequency = res.result
        })
    }

    onCurrentMedicationPageChanged(event: any) {
        this.currentMedicationPaginationInfo.Page = event.page;
        this.currentMedicationPaginationInfo.RowsPerPage = event.rowsPerPage;
        // this.SearchMedication();
    }
    onPastMedicationPageChanged(event: any) {
        this.PastMedicationPaginationInfo.Page = event.page;
        this.PastMedicationPaginationInfo.RowsPerPage = event.rowsPerPage;
    }
    
    onSubmit() {
        this.submitted = true;
        if (this.MedicationForm.invalid) {
            this.MedicationForm.markAllAsTouched();
            Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
            return;
        }

        const v = this.MedicationForm.value;
        // Date validation: stopDate >= startDate
        const sd = v.startDate ? new Date(v.startDate) : null;
        const ed = v.stopDate ? new Date(v.stopDate) : null;
        if (sd && ed && ed < sd) {
            Swal.fire('Validation Error', 'Stop Date cannot be earlier than Start Date.', 'warning');
            return;
        }

        const payload: any = {
            rx: v.rx,
            dose: v.dose,
            route: v.route,
            startDate: v.startDate,
            stopDate: v.stopDate,
            duration: v.durationDays,
            frequency: v.frequency,
            givenBy: v.givenBy,
            givenDate: v.givenDate,
            checkedBy: v.checkedBy,
            checkedDate: v.checkedDate,
            comments: v.comments,
            providerId: v.isProviderCheck ? 0 : v.providerId,
            providerDescription: v.isProviderCheck ? v.providerDescription : '',
            mrno: this.Mrno || '',
            createdBy: sessionStorage.getItem('userId'),
            // AppointmentId: ,
        };

        this.clinicalApiService.SubmitPrescription(payload)
            .then(() => {
                Swal.fire('Success', 'Medication successfully created', 'success');
                this.GetAll_Past_CurrentPrescriptions();
                this.onClear();
                this.submitted = false;
            })
            .catch((error: any) => {
                Swal.fire('Error', error?.message || 'Failed to submit medication', 'error');
            });
    }


    onClear() {
        this.MedicationForm.reset();
        this.submitted = false;
    }

    SearchDrug() {
        const keyword = this.DrugFilterForm.value.search || '';
        this.clinicalApiService.SearchByPrescription(keyword, this.DrugPaginationInfo.Page, this.DrugPaginationInfo.RowsPerPage).then((res: any) => {
            this.DrugList = res?.prescription?.table1 || []
            this.DrugTotalItems = res?.prescription?.table2?.[0]?.totalCount || 0
        })
    }
    onDelete(id: any) {

    }
    onEdit(record: any) {

    }
    onDrugPageChanged(event: any) {
        this.DrugPaginationInfo.Page = event.page;
        this.SearchDrug();
    }

    onDrugSelect(data: any, modal: any) {
        this.MedicationForm.patchValue({ rx: data?.tradeName });
        modal.close(data);
    }

    modalRefInstance: any;
    ClickRx(modalRef: TemplateRef<any>) {
        this.DrugList = [];
        this.DrugTotalItems = 0;
        this.modalRefInstance = this.modalService.open(modalRef, {
            backdrop: 'static',
            size: 'xl',
            centered: true
        });
        this.modalRefInstance.result.then((result: any) => {
            if (result) {
                console.log('Modal returned:', result);
            }
        }).catch(() => {
            // Modal dismissed without selecting
            console.log('Modal dismissed');
        });
    }

    GetAll_Past_CurrentPrescriptions() {

        if (!this.Mrno) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please load a patient',
                confirmButtonColor: '#d33'
            })
            return;
        }
        this.clinicalApiService.GetAll_Past_CurrentPrescriptions(this.Mrno)
            .then((res: any) => {
                const MyMedicationData = res?.prescription?.table1 || [];
                console.log('this.MyMedicationData', MyMedicationData);

                const currentDate = new Date();
                this.currentMedicationData = [];
                this.PastMedicationData = [];

                MyMedicationData.forEach((medication: any) => {
                    const stopDate = new Date(medication.stopDate);

                    const isInvalidStopDate =
                        !medication.stopDate ||
                        isNaN(stopDate.getTime()) ||
                        stopDate.getFullYear() === 1970; // handles '1970-01-01T00:00:00'

                    if (isInvalidStopDate || stopDate > currentDate) {
                        this.currentMedicationData.push(medication);
                    } else {
                        this.PastMedicationData.push(medication);
                    }
                });

                console.log('✅ Current Medications:', this.currentMedicationData);
                console.log('📜 Past Medications:', this.PastMedicationData);
            })
            .catch(error => {
                console.error('❌ Error fetching prescriptions:', error);
            });

    }
}
