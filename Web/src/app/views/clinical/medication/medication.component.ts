import { Component, TemplateRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import Swal from 'sweetalert2';
import { ClinicalApiService } from '../clinical.api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
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
        FilledOnValueDirective,
        NgbNavModule
    ],
    templateUrl: './medication.component.html',
    styleUrl: './medication.component.scss'
})
export class MedicationComponent {
    @Input() clinicalnote: boolean = false;
    @ViewChild('medicationModal') medicationModal!: TemplateRef<any>;
    MedicationForm!: FormGroup;
    DrugFilterForm!: FormGroup;
    submitted = false;
    isSubmitting: boolean = false;
    hrEmployees: any[] = [];
    cacheItems: any[] = ['Provider'];
    DrugList: any[] = [];
    PastMedicationData: any = [];
    SearchPatientData: any;
    Mrno: any;
    PastMedicationPaginationInfo: any = {
        Page: 1,
        RowsPerPage: 3,
    };
    PastMedicationTotalItems: number = 0;
    currentMedicationData: any = [];
    modalService = new NgbModal();
    DrugPaginationInfo: any = {
        Page: 1,
        RowsPerPage: 3,
    };
    DrugTotalItems: number = 0;
    currentMedicationPaginationInfo: any = {
        Page: 1,
        RowsPerPage: 3,
    };
    Id: any;
    SelectedVisit: any;
    currentMedicationTotalItems: number = 0;
    private patientDataSubscription!: Subscription;
    private appointmentIdSubscription!: Subscription;
    AppointmentId: any;
    todayStr: string = '';
    activeTabId: number = 1;
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
            // weight: ['', Validators.required],
            givenBy: [null, Validators.required],
            givenDate: ['', Validators.required],
            checkedBy: [null, Validators.required],
            checkedDate: ['', Validators.required],
            comments: [null],
        });
        this.DrugFilterForm = this.fb.group({
            search: ['']
        });
    }


    ngOnInit(): void {
        // Build today's date string in local timezone: YYYY-MM-DD
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        this.todayStr = `${y}-${m}-${d}`;

        // Set default start date to today
        this.MedicationForm.get('startDate')?.setValue(this.todayStr);

        this.FillCache();
        this.GetEMRRoute();
        this.GetComments();
        this.GetFrequency();

        // Toggle provider inputs: clear dropdown when outside clinic is checked, clear text when unchecked
        const isProviderCtrl = this.MedicationForm.get('isProviderCheck');
        const providerIdCtrl = this.MedicationForm.get('providerId');
        const providerDescCtrl = this.MedicationForm.get('providerDescription');
        isProviderCtrl?.valueChanges.subscribe((isOutside: boolean) => {
            if (isOutside) {
                providerIdCtrl?.setValue(null);
                providerIdCtrl?.markAsPristine();
                providerIdCtrl?.markAsUntouched();
            } else {
                providerDescCtrl?.setValue('');
                providerDescCtrl?.markAsPristine();
                providerDescCtrl?.markAsUntouched();
            }
        });

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
                this.GetAllCurrentPrescriptions();
                this.GetAllPastPrescriptions();
            });

    this.PatientData.selectedVisit$.subscribe((data: any) => {
        this.SelectedVisit = data;
        console.log('Selected Visit medical-list', this.SelectedVisit);
        if (this.SelectedVisit) {
            this.AppointmentId = this.SelectedVisit?.appointmentId || '';
          this.setProviderFromSelectedVisit();
        }
      });
        this.setProviderFromSelectedVisit();
        this.GetAllCurrentPrescriptions();
        this.GetAllPastPrescriptions();
    }


      private setProviderFromSelectedVisit(): void {
    try {
      if (!this.MedicationForm) { return; }
      const empId = this.SelectedVisit?.employeeId;
      if (!empId) { return; }
      const exists = Array.isArray(this.hrEmployees)
        ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
        : false;
      const ctrl = this.MedicationForm.get('providerId');
      if (!ctrl) { return; }
      ctrl.setValue(exists ? empId : null, { emitEvent: false });
      ctrl.markAsDirty();
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity({ onlySelf: true });
    } catch {}
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
                  try { this.setProviderFromSelectedVisit(); } catch {}

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
        this.currentMedicationPaginationInfo.Page = event;
        this.GetAllCurrentPrescriptions();
    }
    onPastMedicationPageChanged(event: any) {
        this.PastMedicationPaginationInfo.Page = event;
        this.GetAllPastPrescriptions();
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
            medicationId: this.Id,
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
            medicationCheckedById: v.checkedBy,
            medicationGivenById: v.givenBy,
            checkedDate: v.checkedDate,
            comments: v.comments,
            providerId: v.isProviderCheck ? 0 : v.providerId,
            outSideClinicProviderName: v.isProviderCheck ? v.providerDescription : '',
            appointmentId: this.AppointmentId,
            mrno: this.Mrno || '',
            // audit fields will be set below based on create/update
        };

        // Set audit fields conditionally (create vs update)
        const nowIso = new Date().toISOString();
        const currentUser = sessionStorage.getItem('userId');
        if (this.Id) {
            // Update flow
            payload.updatedBy = currentUser;
            payload.updatedDate = nowIso;
            // Ensure create fields are not sent on update
            delete payload.createdBy;
            delete payload.createdDate;
        } else {
            // Create flow
            payload.createdBy = currentUser;
            payload.createDate = nowIso;
            // Ensure update fields are not sent on create
            delete payload.updatedBy;
            delete payload.updatedDate;
        }

        this.isSubmitting = true;
        this.clinicalApiService.SubmitPrescription(payload)
            .then(() => {
                Swal.fire('Success', 'Medication successfully saved', 'success');
                this.GetAllCurrentPrescriptions();
                this.GetAllPastPrescriptions();
                this.onClear();
                this.submitted = false;
                this.modalService.dismissAll();
            })
            .catch((error: any) => {
                Swal.fire('Error', error?.message || 'Failed to submit medication', 'error');
            })
            .finally(() => {
                this.isSubmitting = false;
            });
    }


    onClear() {
        this.MedicationForm.reset();
        this.submitted = false;
        this.Id = null;
        this.MedicationForm.get('isProviderCheck')?.setValue(false);
        // Re-apply default start date after clearing
        this.MedicationForm.get('startDate')?.setValue(this.todayStr);
    }

    openMedicationModal() {
        this.onClear();
        this.modalService.open(this.medicationModal, {
            size: 'xl',
            centered: true,
            backdrop: 'static'
        });
    }

    SearchDrug() {
        const keyword = this.DrugFilterForm.value.search || '';
        this.clinicalApiService.SearchByPrescription(keyword, this.DrugPaginationInfo.Page, this.DrugPaginationInfo.RowsPerPage).then((res: any) => {
            this.DrugList = res?.prescription?.table1 || []
            this.DrugTotalItems = res?.prescription?.table2?.[0]?.totalCount || 0
        })
    }
    onDelete(id: any) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't Delete this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.clinicalApiService.DeletePrescription(id).then(() => {
                    Swal.fire('Deleted!', 'Medication has been deleted.', 'success');
                    this.GetAllCurrentPrescriptions();
                    this.GetAllPastPrescriptions();
                })
            }
        })
    }
    onEdit(record: any) {
        this.Id = record?.medicationId || record?.id || null;

        const formatToDateInput = (value: any): string | null => {
            if (!value) return null;
            try {
                const s = String(value);
                if (s.includes('T')) {
                    return s.split('T')[0];
                }
                const d = new Date(s);
                if (isNaN(d.getTime())) return null;
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${dd}`;
            } catch { return null; }
        };

        const isOutside = (record?.providerId === 0) || !!record?.outSideClinicProviderName;

        this.MedicationForm.patchValue({
            // Provider fields
            isProviderCheck: isOutside,
            providerDescription: isOutside ? (record?.outSideClinicProviderName || record?.providerDescription || '') : '',
            providerId: isOutside ? null : (record?.providerId ?? null),

            // Rx details
            rx: record?.rx ?? '',
            dose: record?.dose ?? '',
            route: record?.routeId ?? record?.route ?? null,

            // Dates and duration
            startDate: formatToDateInput(record?.startDate),
            stopDate: formatToDateInput(record?.stopDate),
            durationDays: record?.duration ?? '',
            frequency: record?.frequencyId ?? record?.frequency ?? null,

            // Given/Checked
            weight: record?.weight ?? this.MedicationForm.get('weight')?.value ?? '',
            givenBy: record?.medicationGivenByID ?? null,
            givenDate: formatToDateInput(record?.givenDate),
            checkedBy: record?.medicationCheckedByID ?? null,
            checkedDate: formatToDateInput(record?.checkedDate),

            // Comments
            comments: record?.commentId ?? null,
        });

        this.modalService.open(this.medicationModal, {
            size: 'xl',
            centered: true,
            backdrop: 'static'
        });
    }
    onDrugPageChanged(event: any) {
        this.DrugPaginationInfo.Page = event;
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
            }
        }).catch(() => {
        });
    }

    // GetAll_Past_CurrentPrescriptions() {

    //     if (!this.Mrno) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'Please load a patient',
    //             confirmButtonColor: '#d33'
    //         })
    //         return;
    //     }
    //     this.clinicalApiService.GetAll_Past_CurrentPrescriptions(this.Mrno)
    //         .then((res: any) => {
    //             const MyMedicationData = res?.prescription?.table1 || [];

    //             const currentDate = new Date();
    //             this.currentMedicationData = [];
    //             this.PastMedicationData = [];

    //             MyMedicationData.forEach((medication: any) => {
    //                 const stopDate = new Date(medication.stopDate);

    //                 const isInvalidStopDate =
    //                     !medication.stopDate ||
    //                     isNaN(stopDate.getTime()) ||
    //                     stopDate.getFullYear() === 1970; // handles '1970-01-01T00:00:00'

    //                 if (isInvalidStopDate || stopDate > currentDate) {
    //                     this.currentMedicationData.push(medication);
    //                 } else {
    //                     this.PastMedicationData.push(medication);
    //                 }
    //             });

    //             console.log('✅ Current Medications:', this.currentMedicationData);
    //             console.log('📜 Past Medications:', this.PastMedicationData);
    //         })
    //         .catch(error => {
    //         });

    // }


    GetAllPastPrescriptions() {
        if (!this.Mrno) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please load a patient',
                confirmButtonColor: '#d33'
            })
            return;
        }
        this.PastMedicationTotalItems = 0;
        this.clinicalApiService.GetAllPastPrescriptions(this.Mrno,this.PastMedicationPaginationInfo.Page,this.PastMedicationPaginationInfo.RowsPerPage)
            .then((res: any) => {
                this.PastMedicationData = res?.prescription?.table1 || [];;
                this.PastMedicationTotalItems = res?.prescription?.table2?.[0]?.totalRecords || 0;
            })
            .catch((error: any) => {
            });

    }

        GetAllCurrentPrescriptions() {
        if (!this.Mrno) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please load a patient',
                confirmButtonColor: '#d33'
            })
            return;
        }
        this.currentMedicationTotalItems = 0;
        this.clinicalApiService.GetAllCurrentPrescriptions(this.Mrno,this.currentMedicationPaginationInfo.Page,this.currentMedicationPaginationInfo.RowsPerPage)
            .then((res: any) => {
                this.currentMedicationData = res?.prescription?.table1 || [];;
                this.currentMedicationTotalItems = res?.prescription?.table2?.[0]?.totalRecords || 0;
            })
            .catch((error: any) => {
            });

    }



}
