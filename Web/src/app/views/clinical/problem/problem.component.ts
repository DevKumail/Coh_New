
import { ClinicalApiService } from './../clinical.api.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgIcon} from '@ng-icons/core';
import { NgbModal, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
// import { ProblemListComponent } from '../problem-list/problem-list.component';
import { FavoritesComponent } from '../favorites/favorites.component';
import Swal from 'sweetalert2';
import {PatientProblemModel} from '@/app/shared/Models/Clinical/problemlist.model';
import { number } from 'echarts';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { LoaderService } from '@core/services/loader.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-problem',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    NgbNavModule,
  GenericPaginationComponent,
  FilledOnValueDirective,
  TranslatePipe],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss'
})
export class ProblemComponent {
    private patientDataSubscription!: Subscription;
  datePipe = new DatePipe('en-US');
  favoritesForm!: FormGroup;
  icdVersionList: string[] = [];
  searchResults: any[] = [];

  pageNumbers: number[] = [];
  totalPages: number = 0;
  totalDiagnosisData : number[] = [];
  totalPagesDiagonsisCode: number = 0;
  ICT9Group: any[] = [];
  medicalForm!: FormGroup;
  medicalHistoryData: any[] = [];
  modalService = new NgbModal();
  ModalFilterForm!: FormGroup;
  // @ViewChild('problemModal') problemModal: any;
  id: any;
  // DescriptionFilter: any;
  providerList: any[] = [];
  buttonText:any;
  DiagnosisCode: any;
  // ICDVersions: any;
  // Searchby: any;
  searchForm: any;
  diagnosisForm: any
  hrEmployees: any = [];
  form: any;
  Problems: any = {}
  ProblemGrid: any = [];
  Mrno: any;
  userid: any;
  currentUser: any = 0;
  MyDiagnosisData: any = [];
  filteredDiagnosisData = [];
  diagnosisList: any;
  SearchPatientData:any;
  // ICDVersionId: number = 0;
  universaltoothid: any;
  universaltoothcodearray: any[] = [];
  iCDVersion: any;
  ICT9GroupId: any;
  checked:any;


  cacheItems: string[] = [
    'Provider',
    'BLICDVersion',
  ];

  MyDiagnosisCode: any = [];
  CPTCode: any = [];
  selectedallDiagnosis: any;
  selectedDiagnosis: any;
  ICDVersions: any[] = [];

  MyDentalGroups: any[] = [];
  Searchby: any = [{ code: 1, name: 'Diagnosis Code' }, { code: 2, name: 'Diagnosis Code Range' }, { code: 3, name: 'Description' }]
  Active = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }, { id: 0, name: "In Error" }];

  DiagnosisForm: any;

  paginatedDiagnosisCode: any[] = [];
  pageSizeDiagnoseCode: number = 10;
  currentPageDiagnoseCode: number = 1;
  DiagnosisSearched = false; // for empty message display
  submitted: boolean = false; // used by template to show errors

  activeTabId = 1;
  selectedRowIndex: any;
  favoritesTotalItems: number = 0;
  todayStr!: string;
  start: any;
  end: any;
  totalPagesDiagnoseCode:any;
  isProviderCheck:any;
  SelectedVisit: any;
  isSubmitting: boolean = false;
  DescriptionFilter: any = '';
  DiagnosisEndCode: any = '';
  DiagnosisStartCode: any = '';
  ICDVersionId: number = 0;
  active_Index: any;
  showModal: any;
problemPageSize: number = 5;
problemTotalItems: any;
problemCurrentPage: number = 1;
MHPaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
  problemData: any[] = [];   // Full list of problems
  pagedProblems: any[] = [];

  // Favorites/Search (inline) state
  SearchList: any[] = [];
  searchTotalItems: number = 0;
  PaginationInfo: any = {
    Page: 1,
    RowsPerPage: 5
  };
  favPaginationInfo: any = {
    Page: 1,
    RowsPerPage: 5
  };
  favoritesTabActive: boolean = false;

  // add 4 aug

  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService,
     private loader: LoaderService,
        private PatientData: PatientBannerService, 
  ) { }



  private setProviderFromSelectedVisit(): void {
    try {
      if (!this.medicalForm) { return; }
      const empId = this.SelectedVisit?.employeeId;
      if (!empId) { return; }
      // If provider doesn't exist in dropdown list, keep placeholder
      const exists = Array.isArray(this.hrEmployees)
        ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
        : false;
      const valueToSet = exists ? empId : null;
      const ctrl = this.medicalForm.get('providerId');
      if (!ctrl) { return; }
      ctrl.setValue(valueToSet, { emitEvent: false });
      ctrl.markAsDirty();
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity({ onlySelf: true });
    } catch {}
  }

  async ngOnInit() {
    try {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      this.todayStr = `${y}-${m}-${d}`;
    } catch {}
    this.currentUser = sessionStorage.getItem('userId') || 0;

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

        this.PatientData.selectedVisit$.subscribe((data: any) => {
        this.SelectedVisit = data;
        console.log('Selected Visit medical-list', this.SelectedVisit);
        if (this.SelectedVisit) {
          this.setProviderFromSelectedVisit();
        }
      });

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

    // Ensure provider defaults from SelectedVisit right after form init
    try { this.setProviderFromSelectedVisit(); } catch {}
    // Set default Start Date to today
    try { this.medicalForm.get('startDate')?.setValue(this.todayStr); } catch {}


    this.ModalFilterForm = this.fb.group({
      icdVersionId: ['2'],
      searchById: ['1'],
      startingCode: [''],
      diagnosisEndCode: [''],
      descriptionFilter: ['']
    });

    // Apply conditional validators for modal filters like problem-list
    const applyModalFilterValidators = (mode: any) => {
      const startCtrl = this.ModalFilterForm.get('startingCode');
      const endCtrl = this.ModalFilterForm.get('diagnosisEndCode');
      const descCtrl = this.ModalFilterForm.get('descriptionFilter');
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

    // Initialize and subscribe to search type changes
    try { applyModalFilterValidators(this.ModalFilterForm.get('searchById')?.value); } catch {}
    this.ModalFilterForm.get('searchById')?.valueChanges.subscribe((val: any) => {
      applyModalFilterValidators(val);
      // Clear inputs so user must re-enter based on new mode
      this.ModalFilterForm.get('startingCode')?.setValue('', { emitEvent: false });
      this.ModalFilterForm.get('diagnosisEndCode')?.setValue('', { emitEvent: false });
      this.ModalFilterForm.get('descriptionFilter')?.setValue('', { emitEvent: false });
      // Reset modal pagination to first page on mode change
      this.ModalPaginationInfo.Page = 1;
      // Reset submitted state so previous errors don't persist across modes
      this.submitted = false;
      // Mark untouched/pristine to avoid showing errors immediately
      this.ModalFilterForm.get('startingCode')?.markAsPristine();
      this.ModalFilterForm.get('diagnosisEndCode')?.markAsPristine();
      this.ModalFilterForm.get('descriptionFilter')?.markAsPristine();
      this.ModalFilterForm.get('startingCode')?.markAsUntouched();
      this.ModalFilterForm.get('diagnosisEndCode')?.markAsUntouched();
      this.ModalFilterForm.get('descriptionFilter')?.markAsUntouched();
    });

    this.favoritesForm = this.fb.group({
      icdVersionId: ['2'],
      searchById: ['1'],
      startingCode: [''],
      endingCode: [''],
      description: ['']
    });
    this.Problems.ActiveStatus = 1
 
    this.FillCache();
    this.GetPatientProblemData();    

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

// // // // PROBLEM WORK START // // // // 
  async GetPatientProblemData() {
  this.loader.show();
  this.medicalHistoryData = [];
  this.problemTotalItems = 0;
  const mrNo = this.SearchPatientData?.table2?.[0]?.mrNo;
  const userIdStr = sessionStorage.getItem('userId');
  const userId = userIdStr ? Number(userIdStr) : 0;
    if (!mrNo || !userId) {
      Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      this.loader.hide();
      return;
    }
  this.loader.show();
  await this.clinicalApiService.GetPatientProblemData(
    false,
    mrNo,
    userId,
    this.MHPaginationInfo.Page,
    this.MHPaginationInfo.RowsPerPage
  ).then((res: any) => {
    this.loader.hide();
    this.medicalHistoryData = res.patientProblems?.table1 || [];
    this.problemTotalItems = res.patientProblems?.table2?.[0]?.totalCount || 0;
  });
  this.loader.hide();
}

onMedicalPageChanged(page: number){
  this.MHPaginationInfo.Page = page;
  this.GetPatientProblemData();
}

editproblem(record: any) {
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

onPROBSubmit() {
    if (this.medicalForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Form is invalid. Please fill in all required fields.',
      });
      // this.submitted = true;
      this.medicalForm.markAllAsTouched();
      // try { this.focusFirstInvalidControl(); } catch {}
      return;
    }

    if(!this.SearchPatientData?.table2?.[0]?.mrNo){
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'MrNo is a required field. Please load a patient.',
      });
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
      appointmentId:formData.appId,
      providerId: formData.providerId,
      icd9: this.selectedDiagnosis.icD9Code,
      icd9description: this.selectedDiagnosis.descriptionFull,
      icdversionId: this.selectedDiagnosis.icdVersionId,
      confidential: formData.isConfidentential || false,
      startDate: formData.startDate,
      endDate: formData.endDate,
      comments: formData.comments,
      status: status || 0,
      createdBy: this.currentUser || 0,
      updatedBy: this.currentUser || 0,
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
      isHl7msgCreated: false,
      isMedicalHistory: false,
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
      Swal.fire({
        icon: 'success',
        title: 'Submitted Successfully',
        text: 'Patient problem has been submitted.',
      });
      this.id = 0;
      this.GetPatientProblemData();
      this.onPROBClear();
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

onPROBClear(){
  // decide provider value based on existence in hrEmployees
  const empId = this.SelectedVisit?.employeeId;
  const exists = Array.isArray(this.hrEmployees)
    ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
    : false;
  const providerValue = exists ? empId : null;
  this.medicalForm.patchValue({
    providerId: providerValue,
    problem: '',
    comments: '',
    status: '',
    startDate: this.todayStr,
    endDate: '',
    providerName: '', 
    isConfidentential: false,
    isProviderCheck: false 
  })
  this.medicalForm.markAsPristine();
  this.medicalForm.markAsUntouched();
    //this.submitted = false;
  }

  deleteproblem(Id:number) {
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
      this.clinicalApiService.DeletePatientProblem(Id).then((response: any) => {
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
// // // // PROBLEM WORK END // // // // 



// // // // DROPDOWN WORK // // // // 
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
    console.log(iCDVersion, 'jp')
    if (provider) {
      provider = provider.map((item: { EmployeeId: any; FullName: any; }) => {
        return {
          name: item.FullName,
          providerId: item.EmployeeId
        };
      });
      this.hrEmployees = provider;
      console.log(this.hrEmployees);
      // Now that providers are available, re-apply provider from SelectedVisit
      try { this.setProviderFromSelectedVisit(); } catch {}
    }
    if (iCDVersion) {
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
      console.log(iCDVersion, 'lett testt')
      this.ICDVersions = iCDVersion;
      console.log(this.ICDVersions);
    }
  }
// // // // DROPDOWN WORK END // // // // 


// // // // MODAL WORK START // // // //
modalRefInstance: any;
modaltotalrecord: any = 0;
ModalPaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5,
};
ModalSearchDiagnosis() {
  // Validate modal filters before searching
  if (!this.ModalFilterForm) { return; }
  // Mark that user attempted to submit search in modal
  this.submitted = true;
  const mode = String(this.ModalFilterForm.get('searchById')?.value || '');
  const start = (this.ModalFilterForm.get('startingCode')?.value || '').toString().trim();
  const end = (this.ModalFilterForm.get('diagnosisEndCode')?.value || '').toString().trim();
  const desc = (this.ModalFilterForm.get('descriptionFilter')?.value || '').toString().trim();

      const markAll = () => {
      this.ModalFilterForm.get('startingCode')?.markAsTouched();
      this.ModalFilterForm.get('diagnosisEndCode')?.markAsTouched();
      this.ModalFilterForm.get('descriptionFilter')?.markAsTouched();
    };

  // Show Swal-style validation like problem-list
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
  this.loader.show();
  this.clinicalApiService.DiagnosisCodebyProvider(
    this.ModalFilterForm.value.icdVersionId || 0,
    this.ModalPaginationInfo.Page,
    this.ModalPaginationInfo.RowsPerPage,
    this.ModalFilterForm.value.startingCode, 
    this.ModalFilterForm.value.diagnosisEndCode, 
    this.ModalFilterForm.value.descriptionFilter,
  ).then((response: any) => {
    this.DiagnosisCode = response?.table1 || [];
    this.modaltotalrecord = response?.table2?.[0]?.totalRecords || 0;
    this.loader.hide();
  })
  this.loader.hide();
}
ClickFilter(modalRef: TemplateRef<any>) {
  this.DiagnosisCode = [];
  this.modaltotalrecord = 0;
  // Reset submitted flag when opening modal so previous errors don't persist
  this.submitted = false;
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
onRowSelect(diagnosis: any, modal: any) {
  this.medicalForm.patchValue({ problem: diagnosis?.descriptionFull });
  this.selectedDiagnosis = diagnosis;
  modal.close(diagnosis); 
}
onModalDiagnosisPageChanged(page: number){
  this.ModalPaginationInfo.Page = page;
  this.ModalSearchDiagnosis();
}
// // // // MODAL WORK END // // // //


// // // // FAV WORK START // // // // 
async onFAVSearch() {
  this.loader.show();
  const ICDVersionId = this.favoritesForm.value.icdVersionId || 0;
  const DiagnosisStartCode = this.favoritesForm.value.startingCode || '';
  const DiagnosisEndCode = this.favoritesForm.value.endingCode || '';
  const DescriptionFilter = this.favoritesForm.value.description || '';
  const PageNumber = this.PaginationInfo.Page || 1; 
  const PageSize = this.PaginationInfo.RowsPerPage || 5;

  await this.clinicalApiService.DiagnosisCodebyProvider(ICDVersionId, PageNumber, PageSize, DiagnosisStartCode, DiagnosisEndCode, DescriptionFilter).then((response: any) => {
    this.SearchList = response?.table1 || [];
    this.searchTotalItems = response?.table2[0]?.totalRecords || 0;
    console.log(this.SearchList, 'this.SearchList');
    this.loader.hide();
  })
  this.loader.hide();
}
async onsearchlistPageChanged(page: number) {
  this.PaginationInfo.Page = page;
  await this.onFAVSearch();
}
async onFAVClear(){
  this.favoritesForm.patchValue({
    icdVersionId: '',
    searchById: '1',
    startingCode: '',
    endingCode: '',
    description: ''
  });
  this.PaginationInfo.Page = 1;
  this.PaginationInfo.RowsPerPage = 5;
  await this.onFAVSearch();
}
// // // // FAV WORK END // // // // 
}