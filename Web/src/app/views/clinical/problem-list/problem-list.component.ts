import { Patient } from './../../Scheduling/appointment-dashboard/appointment-dashboard.component';
import { ClinicalApiService } from './../clinical.api.service';
// import Swal from 'sweetalert2';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoritesComponent } from '../favorites/favorites.component';
//import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import Swal from 'sweetalert2';
import {PatientProblemModel} from '@/app/shared/models/clinical/problemlist.model';
import { LoaderService } from '@core/services/loader.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';


@Component({
  selector: 'app-problem-list',

  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    NgIconComponent,
  TranslatePipe,
  GenericPaginationComponent
  ],


  templateUrl: './problem-list.component.html',
  styleUrl: './problem-list.component.scss'
})
export class ProblemListComponent implements OnInit {
  datePipe = new DatePipe('en-US');
  medicalForm!: FormGroup;
  submitted: boolean = false;
  currentPage = 1;
  pageSize = 10;
  pageSizes = [5, 10, 25, 50];
  pageNumbers: number[] = [];
  totalrecord: any;
  medicalHistoryData: any[] = [];
  totalPages = 0;
  modalService = new NgbModal();
  FilterForm!: FormGroup;
  @ViewChild('problemModal') problemModal: any;

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
isConfidentential:any;
  checked:any;
isProviderCheck:any;
appId:any;
  userId: number | undefined;

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



  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService, 
    private loader: LoaderService,
    private PatientData: PatientBannerService,
  ) { }

  async ngOnInit() {
    debugger
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
        this.GetPatientProblemData();
        const mrno = this.Mrno;


      });

    
    // var app =JSON.parse(localStorage.getItem('LoadvisitDetail') || '');
    // this.appId=app.appointmentId
    this.FillDropDown

    this.medicalForm = this.fb.group({
      providerId: ['', Validators.required],
      problem: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required],  
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      providerName: [''], 
      confidential: [false],
      isProviderCheck: [false] 
    });

    this.FilterForm = this.fb.group({
      icdVersionId: [''],
      searchById: [''],
      startingCode: [''],
      endingCode: [''],
      description: ['']

    });
    console.log(this.FilterForm)
    this.FillDropDown

    // Load user id from session storage
    const currentUser = sessionStorage.getItem('userId');
    const parsedUserId = currentUser ? Number(currentUser) : NaN;
    this.userid = Number.isFinite(parsedUserId) ? parsedUserId : 0;
    this.Problems.ActiveStatus = 1
    // this.loadData();
   
    await this.GetPatientProblemData();
    await this.FillCache();

  }






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
  debugger;
  console.log('mrNo =>', mrNo);

  await this.clinicalApiService.GetPatientProblemData(
    mrNo,
    userId,
    this.MHPaginationInfo.Page,
    this.MHPaginationInfo.RowsPerPage
  ).then((res: any) => {
    console.log('res', res);
    this.loader.hide();

    this.medicalHistoryData = res.patientProblems?.table1 || [];
    this.problemTotalItems = res.patientProblems?.table2?.[0]?.totalCount || 0;
    this.filteredProblemData = this.medicalHistoryData || [];

    console.log('this.medicalHistoryData', this.medicalHistoryData);
  });

  this.loader.hide();
}


  // ✅ Clear form
  onClear(): void {
  this.medicalForm.reset();
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
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'MrNo is a required field. Please load a patient.',
    });
    return;
  }
  debugger

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
    confidential: formData.confidential || false,
    startDate: formData.startDate,
    endDate: formData.endDate,
    comments: formData.comments,
    status: status || 0,
    createdBy: this.userid || 0,
    updatedBy: this.userid || 0,
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
    isMedicalHistory: false,
    caseId: null,
    errorReason: '',
    oldMrno: '',
    isDeleted: false,
    startstrdate: formData.startDate ? formData.startDate.split('T')[0] : '',
    endstrdate: formData.endDate ? formData.endDate.split('T')[0] : '',
    providerDescription: formData.providerName || ''
  };

  console.log('Submitting Patient Problem Payload:', problemPayload);

  this.clinicalApiService.SubmitPatientProblem(problemPayload).then((res: any) => {
    console.log("my payload", res);
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
  });
}



  modalRefInstance: any;
  ClickFilter(modalRef: TemplateRef<any>) {

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
    debugger
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
    debugger
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

    }
    if (universaltoothcode) {
      debugger;
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
      debugger;
      iCDVersion = iCDVersion.map(
        (item: { ICDVersionId: any; ICDVersion: any }) => {
          return {
            name: item.ICDVersion,
            code: item.ICDVersionId,
          };
        });
      debugger
      const item = {
        name: 'ALL',
        code: 0,
      };
      iCDVersion.push(item);
      this.ICDVersions = iCDVersion;
      console.log(this.ICDVersions);


    }
  }
  SearchDiagnosis() {
    debugger
    this.DiagnosisCode = [];
    this.totalrecord = 0;
    this.loader.show();
    console.log(this.FilterForm.value);

    this.ICDVersionId = this.FilterForm.value.icdVersionId || 0;
    this.DiagnosisStartCode = this.FilterForm.value.startingCode;
    this.DiagnosisEndCode = this.FilterForm.value.endingCode;
    this.DescriptionFilter = this.FilterForm.value.description;
    
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
    this.SearchDiagnosis();
    }


    

    async onProblemPageChanged(page: number) {
      this.MHPaginationInfo.Page = page;
      this.GetPatientProblemData();
      }



      onEdit(record: any) {
        debugger
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

}
