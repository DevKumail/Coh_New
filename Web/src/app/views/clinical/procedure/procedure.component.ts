import { ClinicalApiService } from './../clinical.api.service';
import {
    Component,
    OnInit,
    OnChanges,
    SimpleChanges,
    TemplateRef,
    Input,
    OnDestroy,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LoaderService } from '@core/services/loader.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
    selector: 'app-procedure',
    standalone: true,

    imports: [
        CommonModule,
        ReactiveFormsModule,

        FormsModule,
        NgbNavModule,
        NgIconComponent,
        TranslatePipe,
        GenericPaginationComponent,
        FilledOnValueDirective,
    ],

    templateUrl: './procedure.component.html',
    styleUrl: './procedure.component.scss',
})
export class ProcedureComponent implements OnInit, OnChanges, OnDestroy {
    datePipe = new DatePipe('en-US');
    procedureForm!: FormGroup;
    submitted: boolean = false;
    todayStr!: string;
    isSubmitting: boolean = false;
    isLoading: boolean = false;
    totalrecord: any;
    procedureHistoryData: any[] = [];
    modalService = new NgbModal();
    FilterForm!: FormGroup;
    @Input() editData: any;
    private pendingEditRecord: any;
    private providerToggleSub?: Subscription;

    DescriptionFilter: any;
    DiagnosisCode: any;
    hrEmployees: any = [];
    Procedures: any = {};
    Mrno: any;
    userid: any;
    id: any;
    universaltoothid: any;
    universaltoothcodearray: any[] = [];
    DiagnosisStartCode: any;
    DiagnosisEndCode: any;
    SearchPatientData: any;
    procedureTotalItems: any;
    filteredProcedureData: any;

    ActiveStatus = [
        { id: 1, name: 'Active' },
        { id: 2, name: 'InActive' },
    ];

    type=[
        { id: 1, name: 'General' },
        { id: 2, name: 'Surgical' },
    ]

    Searchby: any = [
        { code: 1, name: 'Diagnosis Code' },
        { code: 2, name: 'Diagnosis Code Range' },
        { code: 3, name: 'Description' },
    ];
    checked: any;
    isProviderCheck: any;
    SelectedVisit: any;
    selectedDiagnosis: any;
    private patientDataSubscription!: Subscription;

    private focusFirstInvalidControl(): void {
        try {
            setTimeout(() => {
                const firstInvalid = document.querySelector(
                    '.is-invalid, .ng-invalid.ng-touched',
                ) as HTMLElement | null;
                firstInvalid?.focus({ preventScroll: true } as any);
                firstInvalid?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            });
        } catch {}
    }

    private setProviderFromSelectedVisit(): void {
        try {
            if (!this.procedureForm) {
                return;
            }
            const empId = this.SelectedVisit?.employeeId;
            if (!empId) {
                return;
            }
            // If provider isn't in hrEmployees, keep placeholder (null)
            const exists = Array.isArray(this.hrEmployees)
                ? this.hrEmployees.some(
                      (p: any) => String(p?.providerId) === String(empId),
                  )
                : false;
            const ctrl = this.procedureForm.get('providerId');
            if (!ctrl) {
                return;
            }
            ctrl.setValue(exists ? empId : null, { emitEvent: false });
            ctrl.markAsDirty();
            ctrl.markAsTouched();
            ctrl.updateValueAndValidity({ onlySelf: true });
        } catch {}
    }

    private updateProviderValidators(isOutside: boolean): void {
        if (!this.procedureForm) return;
        const providerIdCtrl = this.procedureForm.get('providerId');
        const providerNameCtrl = this.procedureForm.get('providerName');
        if (!providerIdCtrl || !providerNameCtrl) return;

        if (isOutside) {
            // Outside Clinic: free dropdown, require text input
            providerIdCtrl.clearValidators();
            providerNameCtrl.setValidators([Validators.required]);
            // Clear dropdown value
            providerIdCtrl.setValue(null, { emitEvent: false });
        } else {
            // Internal: require dropdown, free text input
            providerIdCtrl.setValidators([Validators.required]);
            providerNameCtrl.clearValidators();
            // Clear text field
            providerNameCtrl.setValue('', { emitEvent: false });
        }
        providerIdCtrl.updateValueAndValidity({ emitEvent: false });
        providerNameCtrl.updateValueAndValidity({ emitEvent: false });
    }

    ngOnDestroy(): void {
        try {
            this.providerToggleSub?.unsubscribe();
        } catch {}
    }

    constructor(
        private fb: FormBuilder,
        private clinicalApiService: ClinicalApiService,
        private loader: LoaderService,
        private PatientData: PatientBannerService,
    ) {}

    async ngOnInit() {
        // Build today's date string (YYYY-MM-DD) for min attribute on startDate
        try {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const d = String(now.getDate()).padStart(2, '0');
            this.todayStr = `${y}-${m}-${d}`;
        } catch {}

        // Wait for patient banner to provide MRNO before loading data
        this.patientDataSubscription = this.PatientData.patientData$
            .pipe(
                filter((data: any) => !!data?.table2?.[0]?.mrNo),
                distinctUntilChanged(
                    (prev, curr) =>
                        prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo,
                ),
            )
            .subscribe((data: any) => {
                this.SearchPatientData = data;
                // Set MRNO from banner
                this.Mrno = this.SearchPatientData?.table2?.[0]?.mrNo || '';
                // After assigning, load Procedures
                this.GetPatientProcedureData();
                const mrno = this.Mrno;
            });

        this.PatientData.selectedVisit$.subscribe((data: any) => {
            this.SelectedVisit = data;
            if (this.SelectedVisit) {
                this.setProviderFromSelectedVisit();
            }
        });

        this.procedureForm = this.fb.group({
            providerId: [null, Validators.required],
            procedure: ['', Validators.required],
            status: ['Active', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            procedureType: ['', Validators.required],
            comments: [''],
            providerName: [''],
            isPerformedOnFacility:[false],
            isProviderCheck: [false],
            ActiveStatus: [1],
        });

        // Set default Start Date to today
        try { this.procedureForm.get('startDate')?.setValue(this.todayStr); } catch {}

        // Toggle validators based on provider outside clinic checkbox
        try {
            this.updateProviderValidators(
                this.procedureForm.get('isProviderCheck')?.value,
            );
            this.providerToggleSub = this.procedureForm
                .get('isProviderCheck')
                ?.valueChanges.subscribe((isOutside: boolean) => {
                    this.updateProviderValidators(isOutside);
                });
        } catch {}

        // Ensure provider is set if SelectedVisit already available
        this.setProviderFromSelectedVisit();

        this.FilterForm = this.fb.group({
            searchById: ['1'],
            startingCode: [''],
            endingCode: [''],
            description: [''],
        });

        // Apply conditional validators for modal filters
        const applyFilterValidators = (mode: any) => {
            const startCtrl = this.FilterForm.get('startingCode');
            const endCtrl = this.FilterForm.get('endingCode');
            const descCtrl = this.FilterForm.get('description');
            if (!startCtrl || !endCtrl || !descCtrl) {
                return;
            }

            startCtrl.clearValidators();
            endCtrl.clearValidators();
            descCtrl.clearValidators();

            const m = String(mode);
            if (m === '1') {
                // Code
                startCtrl.setValidators([Validators.required]);
            } else if (m === '2') {
                // Code Range
                startCtrl.setValidators([Validators.required]);
                endCtrl.setValidators([Validators.required]);
            } else if (m === '3') {
                // Description
                descCtrl.setValidators([Validators.required]);
            }

            startCtrl.updateValueAndValidity({ emitEvent: false });
            endCtrl.updateValueAndValidity({ emitEvent: false });
            descCtrl.updateValueAndValidity({ emitEvent: false });
        };

        // Initialize with default selection and subscribe to changes
        try {
            applyFilterValidators(this.FilterForm.get('searchById')?.value);
        } catch {}
        this.FilterForm.get('searchById')?.valueChanges.subscribe(
            (val: any) => {
                applyFilterValidators(val);
                // Clear inputs so user must re-enter based on new mode
                this.FilterForm.get('startingCode')?.setValue('', {
                    emitEvent: false,
                });
                this.FilterForm.get('endingCode')?.setValue('', {
                    emitEvent: false,
                });
                this.FilterForm.get('description')?.setValue('', {
                    emitEvent: false,
                });
                // Mark untouched/pristine to avoid showing errors immediately
                this.FilterForm.get('startingCode')?.markAsPristine();
                this.FilterForm.get('endingCode')?.markAsPristine();
                this.FilterForm.get('description')?.markAsPristine();
                this.FilterForm.get('startingCode')?.markAsUntouched();
                this.FilterForm.get('endingCode')?.markAsUntouched();
                this.FilterForm.get('description')?.markAsUntouched();
            },
        );

        // Load user id from session storage
        const currentUser = sessionStorage.getItem('userId');
        const parsedUserId = currentUser ? Number(currentUser) : NaN;
        this.userid = Number.isFinite(parsedUserId) ? parsedUserId : 0;
        this.Procedures.ActiveStatus = 1;
        // this.loadData();

        await this.GetPatientProcedureData();
        await this.FillCache();

        // Apply any pending edit received before init
        if (this.pendingEditRecord) {
            try {
                this.applyEditRecord(this.pendingEditRecord);
            } catch {}
            this.pendingEditRecord = null;
        }

        // Enforce endDate rules based on status and startDate (UI + Reactive validation)
        const endDateCtrl = this.procedureForm.get('endDate');
        const startDateCtrl = this.procedureForm.get('startDate');
        const statusCtrl = this.procedureForm.get('status');

        const applyStatusRules = (val: string) => {
            if (val === 'Inactive') {
                endDateCtrl?.enable({ emitEvent: false });
                endDateCtrl?.setValidators([
                    Validators.required,
                    this.minDateValidator('startDate'),
                ]);
            } else {
                endDateCtrl?.reset('', { emitEvent: false });
                endDateCtrl?.clearValidators();
                endDateCtrl?.disable({ emitEvent: false });
            }
            endDateCtrl?.updateValueAndValidity({ onlySelf: true });
        };

        // Initialize and subscribe
        applyStatusRules(statusCtrl?.value);
        statusCtrl?.valueChanges.subscribe((val: string) =>
            applyStatusRules(val),
        );
        startDateCtrl?.valueChanges.subscribe(() => {
            endDateCtrl?.updateValueAndValidity({ onlySelf: true });
        });

        startDateCtrl?.valueChanges.subscribe(() => {
            // Clear end date whenever start date changes, then revalidate
            endDateCtrl?.setValue('', { emitEvent: false });
            endDateCtrl?.updateValueAndValidity({ onlySelf: true });
        });
    }

    // Validator to enforce endDate >= startDate
    minDateValidator(otherControlName: string) {
        return (control: any) => {
            if (!control || !control.parent) return null;
            const endValue = control.value;
            const startValue = control.parent.get(otherControlName)?.value;
            if (!endValue || !startValue) return null;
            return endValue < startValue ? { minDate: true } : null;
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['editData'] && changes['editData'].currentValue) {
            const record = changes['editData'].currentValue;
            if (this.procedureForm) {
                this.applyEditRecord(record);
            } else {
                this.pendingEditRecord = record;
            }
        }
    }

    private applyEditRecord(record: any): void {
        // If record has icd fields, reuse existing onEdit handler
        if (record?.icD9Description || record?.icD9) {
            this.onEdit(record);
            return;
        }
        // Fallback mapping for favorites payload shape
        try {
            this.id = record?.id ?? this.id;
            this.procedureForm.patchValue({
                procedure: record?.procedure || '',
                comments: record?.comments || '',
                startDate: record?.startDate
                    ? this.datePipe.transform(record.startDate, 'yyyy-MM-dd')
                    : '',
                endDate: record?.endDate
                    ? this.datePipe.transform(record.endDate, 'yyyy-MM-dd')
                    : '',
            });
            const statusVal = (record?.status || '').toString().toLowerCase();
            if (statusVal.includes('active')) {
                this.procedureForm.get('status')?.setValue('Active');
            } else if (statusVal.includes('inactive')) {
                this.procedureForm.get('status')?.setValue('Inactive');
            }
        } catch {}
    }

    async GetPatientProcedureData() {
        this.procedureHistoryData = [];
        this.procedureTotalItems = 0;

        const mrNo = this.SearchPatientData?.table2?.[0]?.mrNo;
        if (!mrNo) {
            Swal.fire(
                'Validation Error',
                'MrNo is a required field. Please load a patient.',
                'warning',
            );
            return;
        }

        const status = this.procedureForm.get('ActiveStatus')?.value;
        await this.clinicalApiService
            .GetPatientProceduresList(
                status,
                mrNo,
                this.MHPaginationInfo.Page,
                this.MHPaginationInfo.RowsPerPage,
            )
            .then((res: any) => {
                console.log('res', res);
                this.procedureHistoryData = res.data?.table1 || [];
                this.procedureTotalItems = res.data?.table2?.[0]?.totalRecords || 0;
            });
    }

    // ✅ Clear form
    onClear(): void {
        //this.procedureForm.reset();
        const empId = this.SelectedVisit?.employeeId;
        const exists = Array.isArray(this.hrEmployees)
            ? this.hrEmployees.some(
                  (p: any) => String(p?.providerId) === String(empId),
              )
            : false;
        this.procedureForm.patchValue({
            providerId: exists ? empId : null,
            procedure: '',
            comments: '',
            status: 'Active',
            startDate: this.todayStr,
            endDate: '',
            providerName: '',
            isPerformedOnFacility: false,
            isProviderCheck: false,
        });
        this.submitted = false;
    }

    onSubmit() {
        if (this.procedureForm.invalid) {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Form is invalid. Please fill in all required fields.',
            });
            this.submitted = true;
            this.procedureForm.markAllAsTouched();
            try {
                this.focusFirstInvalidControl();
            } catch {}
            return;
        }

        if (!this.SearchPatientData?.table2?.[0]?.mrNo) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'MrNo is a required field. Please load a patient.',
            });
            return;
        }

        const formData = this.procedureForm.value;
        console.log('procedureForm =>', this.procedureForm.value);
        var status;
        if (formData.status == 'Active') {
            status = 1;
        } else if (formData.status == 'Inactive') {
            status = 2;
        }

        const isOutside = !!this.procedureForm.get('isProviderCheck')?.value;
        const problemPayload: any = {
            id: this.id,
            providerName: isOutside ? (formData.providerName || '') : '',
            providerId: isOutside ? null : formData.providerId,
            confidential: formData.isConfidentential || false,
            startDate: formData.startDate,
            endDate: formData.endDate,
            comments: formData.comments,
            active: status || 0,
            createdBy: this.userid || 0,
            updatedBy: this.userid || 0,
            appointmentId: this.SelectedVisit?.appointmentId,
            mrno: this.SearchPatientData?.table2?.[0]?.mrNo || 0,
            patientId: this.SearchPatientData?.table2?.[0]?.patientId || 0,
            procedureType: formData.procedureType,
            procedureDescription: formData.procedure,
            procedure: formData.procedure,
            performedOnFacility: formData.isPerformedOnFacility,
            ProcedureDateTime: formData.startDate,
            ProcedureEndDateTime: formData.endDate,
        };

        console.log('Submitting Patient procedure Payload:', problemPayload);

        this.isSubmitting = true;
        this.clinicalApiService
            .SubmitPatientProcedure(problemPayload)
            .then((res: any) => {
                console.log('my payload', res);
                Swal.fire({
                    icon: 'success',
                    title: 'Submitted Successfully',
                    text: 'Patient procedure has been submitted.',
                });
                this.id = 0;
                this.GetPatientProcedureData();
                this.onClear();
            })
            .catch((error: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Error',
                    text: 'An error occurred while submitting the Patient procedure.',
                });
                console.error('Submission error:', error);
            })
            .finally(() => {
                this.isSubmitting = false;
            });
    }

    modalRefInstance: any;
    ClickFilter(modalRef: TemplateRef<any>) {
        this.FilterForm.patchValue({
            searchById: 1,
            startingCode: null,
            endingCode: null,
            description: null,
        });

        this.DiagnosisCode = [];
        this.totalrecord = 0;
        this.modalRefInstance = this.modalService.open(modalRef, {
            backdrop: 'static',
            size: 'xl',
            centered: true,
        });
        this.modalRefInstance.result
            .then((result: any) => {
                if (result) {
                    console.log('Modal returned:', result);
                }
            })
            .catch(() => {});
    }

    cacheItems: string[] = ['Provider', 'BLUniversalToothCodes'];

    onRowSelect(diagnosis: any, modal: any) {
        this.procedureForm.patchValue({
            procedure: diagnosis?.descriptionFull,
        });
        this.selectedDiagnosis = diagnosis;
        modal.close(diagnosis);
    }
    async FillCache() {
        await this.clinicalApiService
            .getCacheItems({ entities: this.cacheItems })
            .then((response: any) => {
                if (response.cache != null) {
                    this.FillDropDown(response);
                }
            })
            .catch((error: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Something went wrong!',
                    confirmButtonColor: '#d33',
                });
            });
    }
    FillDropDown(response: any) {
        let jParse = JSON.parse(JSON.stringify(response)).cache;
        let provider = JSON.parse(jParse).Provider;

        // 31july
        let universaltoothcode = JSON.parse(jParse).BLUniversalToothCodes;

        if (provider) {
            provider = provider.map(
                (item: { EmployeeId: any; FullName: any }) => {
                    return {
                        name: item.FullName,
                        providerId: item.EmployeeId,
                    };
                },
            );
            this.hrEmployees = provider;
            try {
                this.setProviderFromSelectedVisit();
            } catch {}
        }
        if (universaltoothcode) {
            universaltoothcode = universaltoothcode.map(
                (item: { ToothCode: any; Tooth: any }) => {
                    return {
                        name: item.Tooth,
                        code: item.ToothCode,
                    };
                },
            );
            this.universaltoothid = universaltoothcode[0].code;
            this.universaltoothcodearray = universaltoothcode;
        }
    }

    SearchDiagnosisOnPageChange() {
        // Validate required fields based on search type
        const mode = String(this.FilterForm.value?.searchById || '1');
        const startRaw = this.FilterForm.value?.startingCode;
        const endRaw = this.FilterForm.value?.endingCode;
        const descRaw = this.FilterForm.value?.description;
        const start = typeof startRaw === 'string' ? startRaw.trim() : startRaw;
        const end = typeof endRaw === 'string' ? endRaw.trim() : endRaw;
        const desc = typeof descRaw === 'string' ? descRaw.trim() : descRaw;

        const markAll = () => {
            this.FilterForm.get('startingCode')?.markAsTouched();
            this.FilterForm.get('endingCode')?.markAsTouched();
            this.FilterForm.get('description')?.markAsTouched();
        };

        if (mode === '1' && !start) {
            markAll();
            Swal.fire(
                'Validation Error',
                'Please enter Code to search.',
                'warning',
            );
            return;
        }
        if (mode === '2' && (!start || !end)) {
            markAll();
            Swal.fire(
                'Validation Error',
                'Please enter both Starting Code and Ending Code.',
                'warning',
            );
            return;
        }
        if (mode === '3' && !desc) {
            markAll();
            Swal.fire(
                'Validation Error',
                'Please enter Description to search.',
                'warning',
            );
            return;
        }

        this.DiagnosisCode = [];
        this.totalrecord = 0;
        this.loader.show();
        console.log(this.FilterForm.value);

        this.DiagnosisStartCode = start || '';
        this.DiagnosisEndCode = end || '';
        this.DescriptionFilter = desc || '';

        const PageNumber = this.PaginationInfo?.Page || 1;
        const PageSize = this.PaginationInfo?.RowsPerPage || 5;

        this.clinicalApiService
            .ProceduresList(
                this.DiagnosisStartCode,
                this.DiagnosisEndCode,
                this.DescriptionFilter,
                PageNumber,
                PageSize,
            )
            .then((response: any) => {
                this.DiagnosisCode = response?.table1;
                this.totalrecord = response?.table2?.[0]?.totalRecords;
                this.loader.hide();
                console.log(this.DiagnosisCode, 'this.DiagnosisCode');
            })
            .catch((error) => {
                console.error(
                    'Error fetching procedures on page change:',
                    error,
                );
                this.loader.hide();
            });
    }

    SearchDiagnosis() {
        // Validate required fields based on search type
        this.PaginationInfo.Page = 1;
        this.PaginationInfo.RowsPerPage = 5;
        this.totalrecord = 0;
        const mode = String(this.FilterForm.value?.searchById || '1');
        const startRaw = this.FilterForm.value?.startingCode;
        const endRaw = this.FilterForm.value?.endingCode;
        const descRaw = this.FilterForm.value?.description;
        const start = typeof startRaw === 'string' ? startRaw.trim() : startRaw;
        const end = typeof endRaw === 'string' ? endRaw.trim() : endRaw;
        const desc = typeof descRaw === 'string' ? descRaw.trim() : descRaw;

        const markAll = () => {
            this.FilterForm.get('startingCode')?.markAsTouched();
            this.FilterForm.get('endingCode')?.markAsTouched();
            this.FilterForm.get('description')?.markAsTouched();
        };

        if (mode === '1' && !start) {
            markAll();
            // Swal.fire('Validation Error', 'Please enter Code to search.', 'warning');
            return;
        }
        if (mode === '2' && (!start || !end)) {
            markAll();
            // Swal.fire('Validation Error', 'Please enter both Starting Code and Ending Code.', 'warning');
            return;
        }
        if (mode === '3' && !desc) {
            markAll();
            // Swal.fire('Validation Error', 'Please enter Description to search.', 'warning');
            return;
        }

        this.DiagnosisCode = [];
        this.totalrecord = 0;
        this.loader.show();
        console.log(this.FilterForm.value);

        this.DiagnosisStartCode = start || '';
        this.DiagnosisEndCode = end || '';
        this.DescriptionFilter = desc || '';

        const PageNumber = this.PaginationInfo.Page;
        const PageSize = this.PaginationInfo.RowsPerPage;
        this.isLoading = true;

        this.clinicalApiService
            .ProceduresList(
                this.DiagnosisStartCode,
                this.DiagnosisEndCode,
                this.DescriptionFilter,
                PageNumber,
                PageSize,
            )
            .then((response: any) => {
                this.DiagnosisCode = response?.table1;
                this.totalrecord = response?.table2?.[0]?.totalRecords;
                this.isLoading = false;
                this.loader.hide();
            })
            .catch((error) => {
                console.error('Error fetching procedures:', error);
                this.isLoading = false;
                this.loader.hide();
            });
        this.loader.hide();
        this.isLoading = false;
    }

    PaginationInfo: any = {
        Page: 1,
        RowsPerPage: 5,
    };

    MHPaginationInfo: any = {
        Page: 1,
        RowsPerPage: 3,
    };

    async onDiagnosisPageChanged(page: number) {
        this.PaginationInfo.Page = page;
        this.SearchDiagnosisOnPageChange();
    }

    async onProcedurePageChanged(page: number) {
        this.MHPaginationInfo.Page = page;
        this.GetPatientProcedureData();
    }

    onEdit(record: any) {
        ((this.id = record?.id),
            (this.selectedDiagnosis = {
                descriptionFull: record?.procedureDescription,
            }));

        // Determine if provider is outside (has providerName string)
        const isOutside = !!record?.providerName && String(record.providerName).trim().length > 0;

        this.procedureForm.patchValue({
            isProviderCheck: isOutside,
            providerName: isOutside ? (record?.providerName || '') : '',
            providerId: isOutside ? null : (record?.providerId ?? null),
            procedure: record?.procedureDescription,
            comments: record?.comments,
            procedureType: record?.procedureType,
            isPerformedOnFacility: record?.performedOnFacility,
            startDate:
                this.datePipe.transform(record?.startDate, 'yyyy-MM-dd') || '',
            endDate:
                this.datePipe.transform(record?.procedureEndDateTime, 'yyyy-MM-dd') || '',
        });
        if (record?.status == 'Active') {
            this.procedureForm.get('status')?.setValue('Active');
        } else {
            this.procedureForm.get('status')?.setValue('Inactive');
        }
    }

    onDelete(id: any) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then((result) => {
            if (result.isConfirmed) {
                this.loader.show();
                this.clinicalApiService
                    .DeletePatientProblem(id)
                    .then((response: any) => {
                        this.GetPatientProcedureData();
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted Successfully',
                        });
                        this.loader.hide();
                        console.log(this.DiagnosisCode, 'this.DiagnosisCode');
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your record is safe :)', 'error');
            }
        });

        this.loader.hide();
    }
    onStatusChange() {
        this.MHPaginationInfo.Page = 1;
        this.GetPatientProcedureData();
    }
}
