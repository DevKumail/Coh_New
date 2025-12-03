import { Patient } from './../../Scheduling/appointment-dashboard/appointment-dashboard.component';
import { ClinicalApiService } from './../clinical.api.service';
// import Swal from 'sweetalert2';

import { Component, OnInit, OnChanges, SimpleChanges, TemplateRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoritesComponent } from '../favorites/favorites.component';
//import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import Swal from 'sweetalert2';
import {PatientProblemModel} from '@/app/shared/Models/Clinical/problemlist.model';
import { LoaderService } from '@core/services/loader.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { S } from 'node_modules/@angular/cdk/scrolling-module.d-ud2XrbF8';
import { LucideAlertTriangle } from 'lucide-angular';


@Component({
  selector: 'app-problem-list',
  standalone: true,

  imports: [CommonModule,
    ReactiveFormsModule,

    FormsModule,
    NgbNavModule,
    NgIconComponent,
  TranslatePipe,
  GenericPaginationComponent,
  FilledOnValueDirective
  ],


  templateUrl: './problem-list.component.html',
  styleUrl: './problem-list.component.scss'
})
export class ProblemListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() clinicalnote: boolean = false;
  datePipe = new DatePipe('en-US');
  medicalForm!: FormGroup;
  submitted: boolean = false;
  todayStr!: string;
  isSubmitting: boolean = false;
  currentPage = 1;
  pageSize = 10;
  pageSizes = [5, 10, 25, 50];
  pageNumbers: number[] = [];
    isLoading: boolean = false;
  totalrecord: any;
  medicalHistoryData: any[] = [];
  totalPages = 0;
  modalService = new NgbModal();
  FilterForm!: FormGroup;
  @ViewChild('problemModal') problemModal: any;
  @ViewChild('medicalHistoryModal') medicalHistoryModal!: TemplateRef<any>;
  @Input() editData: any;
  @Input() clinical: boolean = false;
  private pendingEditRecord: any;
  private providerToggleSub?: Subscription;
  protected readonly headingIcon = LucideAlertTriangle;

  DescriptionFilter: any;
  ProviderId: any = 0;
  providerList: any[] = [];
  DiagnosisCode: any;
  // ICDVersions: any;
  // Searchby: any;
  searchForm: any;
  // diagnosisForm: any
  hrEmployees: any = [];
  form: any;
  Problems: any = {}
  ProblemGrid: any = [];
  Mrno: any;
  userid: any;
  id: any;
  MyDiagnosisData: any = [];
  filteredDiagnosisData = [];
  diagnosisList: any;
  ICDVersionId: number = 0;
  universaltoothid: any;
  universaltoothcodearray: any[] = [];
  iCDVersion: any;
  ICT9GroupId: any;
  DiagnosisStartCode: any;
  DiagnosisEndCode: any;
  MyCPTCode: any;
  CPTGroupId: any;
  PairId: any;
  HCPCSCode: any;
  MyHCPSGroupId: any;
  MyHCPCSCode: any;
  SearchPatientData:any;
  MyProblemsData:any;

problemForm:any;
  AllCPTCode: any = 0;
  CPTStartCode: any = '2';
  CPTEndCode: any = '0';
  Description: any = '0';

  AllCode: any = 0;
  UCStartCode: any = '1';
  ServiceStartCode: any = '1';

  HCPCSCodeGrid: any = [];
  UnclassifiedService: any = [];
  ServiceItems: any = [];

  MyDiagnosisCode: any = [];
  CPTCode: any = [];
  selectedallDiagnosis: any;
  selectedDiagnosis: any;
  ICT9Group: any;
PatientId:any;
  ICDVersions: any[] = [];
  problemTotalItems:any;
  filteredProblemData:any;
  problemCurrentPage:any;
  problemPageSize:any;
  pagedProblems:any;

  MyDentalGroups: any[] = [];
  Searchby: any = [{ code: 1, name: 'Diagnosis Code' }, { code: 2, name: 'Diagnosis Code Range' }, { code: 3, name: 'Description' }]
  Active = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }, { id: 0, name: "In Error" }];
  DiagnosisForm: any;
  checked:any;
isProviderCheck:any;
appId:any;
  userId: number | undefined;
SelectedVisit: any;
  private patientDataSubscription!: Subscription;

  private focusFirstInvalidControl(): void {
    try {
      setTimeout(() => {
        const firstInvalid = document.querySelector('.is-invalid, .ng-invalid.ng-touched') as HTMLElement | null;
        firstInvalid?.focus({ preventScroll: true } as any);
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } catch {}
  }

  private setProviderFromSelectedVisit(): void {
    try {
      if (!this.medicalForm) { return; }
      const empId = this.SelectedVisit?.employeeId;
      if (!empId) { return; }
      // If provider isn't in hrEmployees, keep placeholder (null)
      const exists = Array.isArray(this.hrEmployees)
        ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
        : false;
      const ctrl = this.medicalForm.get('providerId');
      if (!ctrl) { return; }
      ctrl.setValue(exists ? empId : null, { emitEvent: false });
      ctrl.markAsDirty();
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity({ onlySelf: true });
    } catch {}
  }

  private updateProviderValidators(isOutside: boolean): void {
    const providerIdCtrl = this.medicalForm?.get('providerId');
    const providerDescCtrl = this.medicalForm?.get('providerDescription');
    if (!providerIdCtrl || !providerDescCtrl) { return; }

    if (isOutside) {
      providerIdCtrl.clearValidators();
      providerDescCtrl.setValidators([Validators.required]);
    } else {
      providerIdCtrl.setValidators([Validators.required]);
      providerDescCtrl.clearValidators();
    }
    providerIdCtrl.updateValueAndValidity({ emitEvent: false });
    providerDescCtrl.updateValueAndValidity({ emitEvent: false });
  }

  ngOnDestroy(): void {
    try { this.providerToggleSub?.unsubscribe(); } catch {}
  }



  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService,
    private loader: LoaderService,
    private PatientData: PatientBannerService,
  ) { }

  async ngOnInit() {
    // Log clinicalnote value at initialization
    console.log('=== ProblemListComponent Initialized ===');
    console.log('clinicalnote input value:', this.clinicalnote);
    console.log('clinical input value:', this.clinical);

    // Build today's date string (YYYY-MM-DD) for min attribute on startDate
    try {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      this.todayStr = `${y}-${m}-${d}`;
    } catch {}

    // Wait for patient banner to provide MRNO before loading data
    console.log('clinicalnote', this.clinicalnote);
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
        this.GetPatientProblemData();
        const mrno = this.Mrno;
      });

      debugger
      this.PatientData.selectedVisit$.subscribe((data: any) => {
        this.SelectedVisit = data;
        console.log('Selected Visit medical-list', this.SelectedVisit);
        if (this.SelectedVisit) {
          this.setProviderFromSelectedVisit();
        }
      });



    // var app =JSON.parse(localStorage.getItem('LoadvisitDetail') || '');
    // this.appId=app.appointmentId
    this.FillDropDown

    this.medicalForm = this.fb.group({
      providerId: [null, Validators.required],
      problem: ['', Validators.required],
      comments: [''],
      status: ['Active', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      providerName: [''],
      providerDescription:[''],
      isConfidentential: [false],
      isProviderCheck: [false]
    });

    // Toggle validators based on provider outside clinic checkbox
    try {
      this.updateProviderValidators(this.medicalForm.get('isProviderCheck')?.value);
      this.providerToggleSub = this.medicalForm.get('isProviderCheck')?.valueChanges
        .subscribe((isOutside: boolean) => this.updateProviderValidators(isOutside));
    } catch {}

    // Ensure provider is set if SelectedVisit already available
    this.setProviderFromSelectedVisit();
    // Set default Start Date to today
    try { this.medicalForm.get('startDate')?.setValue(this.todayStr); } catch {}

    this.FilterForm = this.fb.group({
      icdVersionId: ['2'],
      searchById: ['1'],
      startingCode: [''],
      endingCode: [''],
      description: ['']

    });
    console.log(this.FilterForm)
    this.FillDropDown

    // Apply conditional validators for modal filters
    const applyFilterValidators = (mode: any) => {
      const startCtrl = this.FilterForm.get('startingCode');
      const endCtrl = this.FilterForm.get('endingCode');
      const descCtrl = this.FilterForm.get('description');
      if (!startCtrl || !endCtrl || !descCtrl) { return; }

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
    try { applyFilterValidators(this.FilterForm.get('searchById')?.value); } catch {}
    this.FilterForm.get('searchById')?.valueChanges.subscribe((val: any) => {
      applyFilterValidators(val);
      // Clear inputs so user must re-enter based on new mode
      this.FilterForm.get('startingCode')?.setValue('', { emitEvent: false });
      this.FilterForm.get('endingCode')?.setValue('', { emitEvent: false });
      this.FilterForm.get('description')?.setValue('', { emitEvent: false });
      // Mark untouched/pristine to avoid showing errors immediately
      this.FilterForm.get('startingCode')?.markAsPristine();
      this.FilterForm.get('endingCode')?.markAsPristine();
      this.FilterForm.get('description')?.markAsPristine();
      this.FilterForm.get('startingCode')?.markAsUntouched();
      this.FilterForm.get('endingCode')?.markAsUntouched();
      this.FilterForm.get('description')?.markAsUntouched();
    });

    // Load user id from session storage
    const currentUser = sessionStorage.getItem('userId');
    const parsedUserId = currentUser ? Number(currentUser) : NaN;
    this.userid = Number.isFinite(parsedUserId) ? parsedUserId : 0;
    this.Problems.ActiveStatus = 1
    // this.loadData();

    await this.GetPatientProblemData();
    await this.FillCache();

    // Apply any pending edit received before init
    if (this.pendingEditRecord) {
      try { this.applyEditRecord(this.pendingEditRecord); } catch {}
      this.pendingEditRecord = null;
    }


       // Enforce endDate rules based on status and startDate (UI + Reactive validation)
    const endDateCtrl = this.medicalForm.get('endDate');
    const startDateCtrl = this.medicalForm.get('startDate');
    const statusCtrl = this.medicalForm.get('status');

    const applyStatusRules = (val: string) => {
      if (val === 'Inactive') {
        endDateCtrl?.enable({ emitEvent: false });
        endDateCtrl?.setValidators([
          Validators.required,
          this.minDateValidator('startDate')
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
    statusCtrl?.valueChanges.subscribe((val: string) => applyStatusRules(val));
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
    // Track clinicalnote input changes
    if (changes['clinicalnote']) {
      console.log('=== clinicalnote Input Changed ===');
      console.log('Previous Value:', changes['clinicalnote'].previousValue);
      console.log('Current Value:', changes['clinicalnote'].currentValue);
      console.log('First Change:', changes['clinicalnote'].firstChange);
    }

    if (changes['editData'] && changes['editData'].currentValue) {
      const record = changes['editData'].currentValue;
      if (this.medicalForm) {
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
      this.medicalForm.patchValue({
        problem: record?.problem || '',
        comments: record?.comments || '',
        startDate: record?.startDate ? this.datePipe.transform(record.startDate, 'yyyy-MM-dd') : '',
        endDate: record?.endDate ? this.datePipe.transform(record.endDate, 'yyyy-MM-dd') : '',
      });
      const statusVal = (record?.status || '').toString().toLowerCase();
      if (statusVal.includes('active')) {
        this.medicalForm.get('status')?.setValue('Active');
      } else if (statusVal.includes('inactive')) {
        this.medicalForm.get('status')?.setValue('Inactive');
      }
    } catch {}
  }






  async GetPatientProblemData() {
  // this.loader.show();
  this.medicalHistoryData = [];
  this.problemTotalItems = 0;

  const mrNo = this.SearchPatientData?.table2?.[0]?.mrNo;
  const userIdStr = sessionStorage.getItem('userId');
  const userId = userIdStr ? Number(userIdStr) : 2;
  if (!mrNo) {
    // Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
    // this.loader.hide();
    return;
  }

  // this.loader.show();
   ;
  console.log('mrNo =>', mrNo);

  await this.clinicalApiService.GetPatientProblemData(
    true,
    mrNo,
    userId || 2,
    this.MHPaginationInfo.Page,
    this.MHPaginationInfo.RowsPerPage
  ).then((res: any) => {
    console.log('res', res);
    // this.loader.hide();

    this.medicalHistoryData = res.patientProblems?.table1 || [];
    this.problemTotalItems = res.patientProblems?.table2?.[0]?.totalCount || 0;
    this.filteredProblemData = this.medicalHistoryData || [];

    console.log('this.medicalHistoryData', this.medicalHistoryData);
  });

  this.loader.hide();
}


  // ✅ Clear form
  openMedicalHistoryModal(): void {
    this.onClear();
    this.modalService.open(this.medicalHistoryModal, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  onClear(): void {
  //this.medicalForm.reset();
  const empId = this.SelectedVisit?.employeeId;
  const exists = Array.isArray(this.hrEmployees)
    ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
    : false;
  this.medicalForm.patchValue({
    providerId: exists ? empId : null,
    problem: '',
    comments: '',
    status: 'Active',
    startDate: this.todayStr,
    endDate: '',
    providerName: '',
    isConfidentential: false,
    isProviderCheck: false
  })
  this.submitted = false;
  }
    DropFilled (){
    this.Problems.ProviderId = ""
    this.Problems.ICDVersionValue = ""
    this.Problems.comments = ""
    this.Problems.startDate = ""
    this.Problems.endDate = ""
    this.Problems.status = ""
    this.checked = ""
    this.Problems.providerDescription=""
    this.isProviderCheck=false;

  }
   reloadForm(){
    this.DropFilled();
  }

  onSubmit() {

  if (this.medicalForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Error',
      text: 'Form is invalid. Please fill in all required fields.',
    });
    this.submitted = true;
    this.medicalForm.markAllAsTouched();
    try { this.focusFirstInvalidControl(); } catch {}
    return;
  }

  if(!this.SearchPatientData?.table2?.[0]?.mrNo){
    // Swal.fire({
    //   icon: 'warning',
    //   title: 'Validation Error',
    //   text: 'MrNo is a required field. Please load a patient.',
    // });
    return;
  }


  const formData = this.medicalForm.value;
  console.log('medicalForm =>',this.medicalForm.value);
  var status;
  if(formData.status == "Active" ){
    status = 1
  } else if(formData.status == "Inactive"){
    status = 2
  }

  const problemPayload: PatientProblemModel = {
    id: this.id,
    providerId: formData.providerId,
    icd9: this.selectedDiagnosis.icD9Code,
    icd9description: this.selectedDiagnosis.descriptionFull,
    icdversionId: this.selectedDiagnosis.icdVersionId,
    confidential: formData.isConfidentential || false,
    startDate: formData.startDate,
    endDate: formData.endDate,
    comments: formData.comments,
    status: status || 0,
    createdBy: this.userid || 0,
    updatedBy: this.userid || 0,
    appointmentId: this.SelectedVisit?.appointmentId,
    // mrno: '1006',

    mrno:  this.SearchPatientData?.table2?.[0]?.mrNo || 0,
    patientId: this.SearchPatientData?.table2?.[0]?.patientId || 0,
    activeStatus: 1,
    active: true,
    updatedDate: new Date(),
    createdDate: new Date(),
    diagnosisPriority: 'Primary',
    diagnosisType: 'Diagnosis',
    socialHistory: false,
    outsideClinic: 'No',
    // confidential: formData.confidential,
    isHl7msgCreated: false,
    isMedicalHistory: true,
    caseId: null,
    errorReason: '',
    oldMrno: '',
    isDeleted: false,
    startstrdate: formData.startDate ? formData.startDate.split('T')[0] : '',
    endstrdate: formData.endDate ? formData.endDate.split('T')[0] : '',
    providerDescription: formData.providerDescription  || ''
  };

  console.log('Submitting Patient Problem Payload:', problemPayload);

  this.isSubmitting = true;
  this.clinicalApiService.SubmitPatientProblem(problemPayload).then((res: any) => {
    console.log("my payload", res);
    this.modalService.dismissAll();
    Swal.fire({
      icon: 'success',
      title: 'Submitted Successfully',
      text: 'Patient problem has been submitted.',
    });
    this.id = 0;
    this.GetPatientProblemData();
    this.onClear();
  }).catch((error: any) => {
    Swal.fire({
      icon: 'error',
      title: 'Submission Error',
      text: 'An error occurred while submitting the patient problem.',
    });
    console.error('Submission error:', error);
  }).finally(() => {
    this.isSubmitting = false;
  });
}



  modalRefInstance: any;
  ClickFilter(modalRef: TemplateRef<any>) {
    this.FilterForm.patchValue({
      icdVersionId: 2,
      searchById: 1,
      startingCode: null,
      endingCode: null,
      description: null
    });

    this.DiagnosisCode = [];
    this.totalrecord = 0;
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


  cacheItems: string[] = [
    'Provider',
    'BLUniversalToothCodes',
    'BLICDVersion',
  ];

  onRowSelect(diagnosis: any, modal: any) {

    this.medicalForm.patchValue({ problem: diagnosis?.descriptionFull });
    this.selectedDiagnosis = diagnosis;
    modal.close(diagnosis);
    console.log("diagnosis waleed",diagnosis)

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
  }
  FillDropDown(response: any) {

    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;
    let iCDVersion = JSON.parse(jParse).BLICDVersion;

    // 31july
    let universaltoothcode = JSON.parse(jParse).BLUniversalToothCodes;

    if (provider) {
      provider = provider.map((item: { EmployeeId: any; FullName: any; }) => {
        return {
          name: item.FullName,
          providerId: item.EmployeeId
        };
      });
      this.hrEmployees = provider;
      console.log(this.hrEmployees);
      // Re-apply provider default now that list is loaded
      try { this.setProviderFromSelectedVisit(); } catch {}

    }
    if (universaltoothcode) {
       ;
      universaltoothcode = universaltoothcode.map(
        (item: { ToothCode: any; Tooth: any }) => {
          return {
            name: item.Tooth,
            code: item.ToothCode,
          };
        });
      this.universaltoothid = universaltoothcode[0].code
      this.universaltoothcodearray = universaltoothcode;
      console.log(this.universaltoothcodearray, 'universal tooth code');
    }
    if (iCDVersion) {
       ;
      iCDVersion = iCDVersion.map(
        (item: { ICDVersionId: any; ICDVersion: any }) => {
          return {
            name: item.ICDVersion,
            code: item.ICDVersionId,
          };
        });

      const item = {
        name: 'ALL',
        code: 0,
      };
      iCDVersion.push(item);
      this.ICDVersions = iCDVersion;
      console.log(this.ICDVersions);


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
      Swal.fire('Validation Error', 'Please enter Code to search.', 'warning');
      return;
    }
    if (mode === '2' && (!start || !end)) {
      markAll();
      Swal.fire('Validation Error', 'Please enter both Starting Code and Ending Code.', 'warning');
      return;
    }
    if (mode === '3' && !desc) {
      markAll();
      Swal.fire('Validation Error', 'Please enter Description to search.', 'warning');
      return;
    }

    this.DiagnosisCode = [];
    this.totalrecord = 0;
    this.loader.show();
    console.log(this.FilterForm.value);

    this.ICDVersionId = this.FilterForm.value.icdVersionId || 0;
    this.DiagnosisStartCode = start || '';
    this.DiagnosisEndCode = end || '';
    this.DescriptionFilter = desc || '';

    const PageNumber = this.PaginationInfo.Page;
    const PageSize = this.PaginationInfo.RowsPerPage;


    this.clinicalApiService.DiagnosisCodebyProvider(
      this.ICDVersionId,
      PageNumber,
      PageSize,
      this.DiagnosisStartCode,
      this.DiagnosisEndCode,
      this.DescriptionFilter,
    ).then((response: any) => {
      this.DiagnosisCode = response?.table1;
      this.totalrecord = response?.table2?.[0]?.totalRecords;
    this.loader.hide();
      console.log(this.DiagnosisCode, 'this.DiagnosisCode');

    })
    this.loader.hide();
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

    this.ICDVersionId = this.FilterForm.value.icdVersionId || 0;
    this.DiagnosisStartCode = start || '';
    this.DiagnosisEndCode = end || '';
    this.DescriptionFilter = desc || '';

    const PageNumber = this.PaginationInfo.Page;
    const PageSize = this.PaginationInfo.RowsPerPage;
        this.isLoading = true;


    this.clinicalApiService.DiagnosisCodebyProvider(
      this.ICDVersionId,
      PageNumber,
      PageSize,
      this.DiagnosisStartCode,
      this.DiagnosisEndCode,
      this.DescriptionFilter,
    ).then((response: any) => {
      this.DiagnosisCode = response?.table1;
      this.totalrecord = response?.table2?.[0]?.totalRecords;
      this.isLoading = false;
    this.loader.hide();
    })
    this.loader.hide();
    this.isLoading = false;
  }


    PaginationInfo: any = {
      Page: 1,
      RowsPerPage: 5
    };

    MHPaginationInfo: any = {
      Page: 1,
      RowsPerPage: 5
    };

  async onDiagnosisPageChanged(page: number) {
    this.PaginationInfo.Page = page;
    this.SearchDiagnosisOnPageChange();
    }




    async onProblemPageChanged(page: number) {
      this.MHPaginationInfo.Page = page;
      this.GetPatientProblemData();
      }



      onEdit(record: any) {

      this.id = record?.id,
      this.selectedDiagnosis = {
        icD9Code :  record?.icD9,
        descriptionFull : record?.icD9Description,
        icdVersionId : record?.icdVersionID,
      }


        this.medicalForm.patchValue(
          {
            providerId: record?.providerId,
            problem: record?.icD9Description,
            comments: record?.comments,
            isConfidentential: record?.confidential,
            startDate: this.datePipe.transform(record?.startDate, 'yyyy-MM-dd') || '',
            endDate: this.datePipe.transform(record?.endDate, 'yyyy-MM-dd') || '',
          }
        );
        if(record?.status == "Active"){
          this.medicalForm.get('status')?.setValue('Active');
        }else{
          this.medicalForm.get('status')?.setValue('Inactive');
        }
      }

    onDelete(id: any){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
      this.clinicalApiService.DeletePatientProblem(id).then((response: any) => {
        this.GetPatientProblemData();
    Swal.fire({
      icon: 'success',
      title: 'Deleted Successfully',
    })
    this.loader.hide();
      console.log(this.DiagnosisCode, 'this.DiagnosisCode');

    })
  } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your record is safe :)',
          'error'
        );
      }
    })

    this.loader.hide();
    }

}
