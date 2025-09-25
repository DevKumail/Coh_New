import { Patient } from './../../Scheduling/appointment-dashboard/appointment-dashboard.component';
import { ClinicalApiService } from './../clinical.api.service';
// import Swal from 'sweetalert2';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
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


@Component({
  selector: 'app-problem-list',

  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    NgIconComponent,
  TranslatePipe,
  ],


  templateUrl: './problem-list.component.html',
  styleUrl: './problem-list.component.scss'
})
export class ProblemListComponent implements OnInit {

  medicalForm!: FormGroup;
  submitted: boolean = false;
  currentPage = 1;
  pageSize = 10;
  pageSizes = [5, 10, 25, 50];
  pageNumbers: number[] = [];

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
  diagnosisForm: any
  hrEmployees: any = [];
  form: any;
  Problems: any = {}
  ProblemGrid: any = [];
  Mrno: any;
  userid: any;
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
      providerName: [''], 
      code: ['', Validators.required],
      problem: ['', Validators.required],
      icdVersion: ['', Validators.required],
      confidential: [false],
      isProviderCheck: [false],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required],  
      mrno: ['', Validators.required],     
      patientId: ['', Validators.required] 
    });

    this.FilterForm = this.fb.group({
      icdVersionId: [''],
      searchById: [''],
      startingCode: [''],
      diagnosisEndCode: [''],
      descriptionFilter: ['']

    });
    console.log(this.FilterForm)
    this.FillDropDown

    // Load user id from session storage
    const currentUser = sessionStorage.getItem('userId');
    const parsedUserId = currentUser ? Number(currentUser) : NaN;
    this.userid = Number.isFinite(parsedUserId) ? parsedUserId : 0;

    this.getRowdatapatientproblem()
    this.Problems.ActiveStatus = 1
    // this.loadData();
   
    this.getRowData();
    this.fetchProviders();
    await this.FillCache();

  }
  async GetPatientProblemData() {
  this.loader.show();

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
    userId
  ).then((res: any) => {
    console.log('res', res);
    this.loader.hide();

    this.medicalHistoryData = res.problems?.table1 || [];
    this.problemTotalItems = this.medicalHistoryData.length;
    this.onProblemPageChanged(1); 
    this.filteredProblemData = this.medicalHistoryData || [];

    console.log('this.medicalHistoryData', this.medicalHistoryData);
  });

  this.loader.hide();
}

async onProblemPageChanged(page: number) {
  this.problemCurrentPage = page;
  this.setPagedProblemData();
  // await this.GetPatientProblemData(); // Agar tum data API se reload karna chahte ho
}

setPagedProblemData() {
  const startIndex = (this.problemCurrentPage - 1) * this.problemPageSize;
  const endIndex = startIndex + this.problemPageSize;
  this.pagedProblems = this.MyProblemsData.slice(startIndex, endIndex);
}



  get start(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get end(): number {
    const endValue = this.start + this.pageSize;
    return endValue > this.medicalHistoryData.length ? this.medicalHistoryData.length : endValue;
  }

  get paginatedData() {
    return this.medicalHistoryData.slice(this.start, this.end);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.end < this.medicalHistoryData.length) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
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


//   const formData = this.medicalForm.value;

//   // const problemPayload: PatientProblemModel = {

//   //   id: 0,  // New problem → ID = 0 or undefined depending on backend
//   //   providerId: formData.providerId,
//   //   // providerName: formData.providerName || '',
//   //   icd9: formData.code,
//   //   icd9description: formData.problem,
//   //   icdversionId: formData.icdVersion,
//   //   confidential: formData.confidential,
//   //   startDate: formData.startDate,
//   //   endDate: formData.endDate,
//   //   comments: formData.comments,
//   //   status: formData.status,
//   //   createdBy: 1,
//   //   updatedBy: 1,
//   //   mrno: '1023',
//   //   patientId: 1,


//   //   active: true,
//   //   updatedDate: new Date(),
//   //   createdDate: new Date(),
//   //   diagnosisPriority: 'Primary',
//   //   diagnosisType: 'Diagnosis',
//   //   socialHistory: false,
//   //   outsideClinic: 'No',
//   //   isHl7msgCreated: false,
//   //   isMedicalHistory: false,
//   //   caseId: null,
//   //   errorReason: '',
//   //   oldMrno: '',
//   //   isDeleted: false,
//   //   startstrdate: formData.startDate?.toISOString().split('T')[0] || '',
//   //   endstrdate: formData.endDate?.toISOString().split('T')[0] || '',
//   //   providerDescription: formData.providerName || ''
//   // };
//   const problemPayload :PatientProblemModel= {
//     appointmentId: 104080,
//     providerId: formData.provider,
//     icd9: formData.code, // ICD9 code (e.g. "100.0")
//     icd9code: formData.code, // Same as icd9
//     icd9description: formData.problem, // e.g. "Leptospirosis icterohemorrhagica"
//     icdversionId: formData.icdVersion,
//     icdVersionValue: formData.problem, // description again
//     confidential: formData.confidential,
//     startDate: formData.startDate, // must be Date object
//     comments: formData.comments,
//     status: formData.status,
//     createdBy: 2,
//     updatedBy: 2,
//     mrno: '1006',
//     patientId: 6,
//     activeStatus: 1,
//     id: 0,
//     active: false,
//     diagnosisPriority: '',
//     diagnosisType: '',
//     outsideClinic: '',
//     errorReason: '',
//     oldMrno: '',
//     isDeleted: false,
//     startstrdate: '',
//     endstrdate: '',
//     providerDescription: '',

//   };

//   console.log('Submitting Patient Problem Payload:', problemPayload);

//   this.clinicalApiService.SubmitPatientProblem(problemPayload).then((res: any) => {
//     console.log("my payload",res);

//     this.getRowData();
//     this.onClear();
//   }).catch((error: any) => {
//     console.error('Submission error:', error);
//   });
// }
onSubmit() {
  if (this.medicalForm.invalid) {
    this.submitted = true;
    this.medicalForm.markAllAsTouched();
    try { this.focusFirstInvalidControl(); } catch {}
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
    id: 0,
    appointmentId:formData.appId,
    providerId: formData.providerId,
    icd9: formData.code,
    icd9code: formData.code,
    icd9description: formData.problem,
    icdversionId: formData.icdVersion,
    icdVersionValue: formData.problem,
    confidential: formData.confidential,
    startDate: formData.startDate,
    endDate: formData.endDate,
    comments: formData.comments,
    status: status || 0,
    createdBy: this.userid || 0,
    updatedBy: this.userid || 0,
    // mrno: '1006', 
    
    mrno: this.Mrno || (this.SearchPatientData?.table2?.length ? this.SearchPatientData.table2[0].mrNo : 0),                           
    patientId: 6,
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
    this.getRowData();
    this.onClear();
  }).catch((error: any) => {
    console.error('Submission error:', error);
  });
}


// onSubmit(): void {
//   debugger
//   if (this.medicalForm.invalid) {
//     return;
//   }

//   const formData = this.medicalForm.value;

//   const problemPayload: PatientProblemModel = {
//     id: 0,
//     appointmentId: 104080,                          // Or dynamically set this
//     providerId: formData.providerId,
//     providerDescription: formData.providerName || '',
//     icd9: formData.code,
//     icd9code: formData.code,
//     icd9description: formData.problem,
//     icdversionId: formData.icdVersion,
//     icdVersionValue: formData.problem,             // Same as icd9description
//     confidential: formData.confidential,
//     startDate: formData.startDate,
//     endDate: formData.endDate,
//     comments: formData.comments,
//     status: formData.status,
//     createdBy: 2,                                   // Replace with actual user ID
//     updatedBy: 2,
//     mrno: '1006',                                   // Replace with dynamic MRNo if needed
//     patientId: 6,                                   // Replace with dynamic patientId if needed
//     activeStatus: 1,
//     active: true,
//     updatedDate: new Date(),
//     createdDate: new Date(),
//     diagnosisPriority: 'Primary',
//     diagnosisType: 'Diagnosis',
//     socialHistory: false,
//     outsideClinic: 'No',
//     isHl7msgCreated: false,
//     isMedicalHistory: false,
//     caseId: null,
//     errorReason: '',
//     oldMrno: '',
//     isDeleted: false,
//     startstrdate: formData.startDate ? formData.startDate.split('T')[0] : '',
//     endstrdate: formData.endDate ? formData.endDate.split('T')[0] : '',
//   };

//   this.clinicalApiService.SubmitPatientProblem(problemPayload).then((res: any) => {
//     this.getRowData();
//     this.onClear();
//     // Add success toast here
//   }).catch((error: any) => {
//     // Add error toast here
//   });
// }






  
  getRowData() {
    // const mrno = '1006'; 
    const mrno=this.Mrno;
    const userIdStr = sessionStorage.getItem('userId');
    const userId = userIdStr ? Number(userIdStr) : 0;     
    if (!mrno || !userId) { return; }

    this.clinicalApiService.GetRowDataOfPatientProblem(mrno, userId).then((res: any) => {
      const problems = res?.patientProblems?.table1 || [];
      this.medicalHistoryData = problems.map((item: any) => ({
        provider: item.providerName,
        problem: item.icD9Description,
        comments: item.comments,
        confidential: item.confidential ? true : false,
        status: item.status,
        startDate: item.startDate,
        endDate: item.endDate
      }));

      this.totalPages = Math.ceil(this.medicalHistoryData.length / this.pageSize);
      this.pageNumbers = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    });
  }
  SubmitPatientProblem() {

  }


  fetchProviders() {

    this.providerList = [
      { id: 1, name: 'Dr. Ali' },
      { id: 2, name: 'Dr. Sara' }
    ];
  }
  GetRowDataOfPatientProblem(mrno: string, userId: number) {
    return this.clinicalApiService.GetRowDataOfPatientProblem(mrno, userId).then((res: any) => {
      const problems = res?.patientProblems?.table1 || [];
      this.medicalHistoryData = problems.map((item: any) => ({
        provider: item.providerName,
        problem: item.icD9Description,
        comments: item.comments,
        confidential: item.confidential ? true : false,
        status: item.status,
        startDate: item.startDate,
        endDate: item.endDate
      }));

      this.totalPages = Math.ceil(this.medicalHistoryData.length / this.pageSize);
      this.pageNumbers = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    });

  }




  openModal() { }
  RoutesearchProblem() {

  }
  filter(e: any) {

    const inputString = e.target.value;
    const trimmedString = inputString.split(' ').filter(Boolean).join(' ');
    console.log(trimmedString); // Output: "Hello, World!"
    //this.MyDiagnosis.filterGlobal(trimmedString, 'contains');
    //this.AllDignosisApis();
  }
  onSearchClick() {

  }
  modalRefInstance: any;
  ClickFilter(modalRef: TemplateRef<any>) {
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
  openProblemModal() {

  }
  onSearch() {

  }
  onSearchByChange() {

  }

  onRowSelect() {

  }
  async FillCache() {

    await this.clinicalApiService.getCacheItems({ entities: ['Provider'] }).then((response: any) => {
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

    // 31july
    let universaltoothcode = JSON.parse(jParse).BLUniversalToothCodes;
    let iCDVersion = JSON.parse(jParse).BLICDVersion;

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
    console.log(this.FilterForm.value)
    return
    debugger
    this.DiagnosisCode = [];
    this.clinicalApiService.DiagnosisCodebyProvider(this.ICDVersionId, this.DiagnosisStartCode, this.DiagnosisEndCode, this.DescriptionFilter).then((response: any) => {
      this.DiagnosisCode = response.table1;
      console.log(this.DiagnosisCode, 'this.DiagnosisCode');

    })
  }
  provider(event: any) {

    this.AllDignosisApis();
    this.loadICD9Gropu();
    // this.loadCPTGroup();
    // this.loadHCPCSGroup();

    this.AllServicesApis();
  }
  selectDiagnosis() { }
  AllDignosisApis() {


    this.clinicalApiService.MyDiagnosisCodebyProvider(this.ProviderId, this.ICT9GroupId, this.ICDVersionId).then((response: any) => {
      debugger
      this.clinicalApiService = response.table1;
      console.log(this.clinicalApiService, 'MyDiagnosisCode');
      debugger
    })

  }

  loadICD9Gropu() {
    this.clinicalApiService.GetICD9CMGroupByProvider(this.ProviderId).then((response) => {
      console.log(response, 'Group');
      this.ICT9Group = response;

      this.ICT9Group = this.ICT9Group.map(
        (item: { groupId: any; groupName: any }) => {
          return {
            name: item.groupName,
            code: item.groupId,
          };
        });
      const item = {
        name: 'ALL',
        code: 0,
      };
      this.ICT9Group.push(item);


    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong!',
        confirmButtonColor: '#d33'
      });
    });


  }


  getRowdatapatientproblem() {

    let mrno = this.Mrno
    let UserIdStr = sessionStorage.getItem('userId')
    let UserId = UserIdStr ? Number(UserIdStr) : 0;
    if (!mrno || !UserId) { return; }
    this.ProblemGrid = []
    var flag = 1;
    this.clinicalApiService.GetRowDataOfPatientProblem(mrno, UserId).then((res: any) => {
      debugger
      console.log('getRowdatapatientproblem res', res);
      let length = res.patientProblems.table1.length
      let data = res.patientProblems.table1
      for (let i = 0; i < length; i++) {
        let array: any = []
        array.comments = data[i].comments
        array.ICDVersionValue = data[i].icD9Description
        array.startDate = data[i].startDate
        array.endDate = data[i].endDate
        array.ProviderID = data[i].providerName
        array.code = data[i].icD9
        array.icdVersion = data[i].icdVersionID
        array.confidential = data[i].confidential
        if (array.confidential == false) {
          array.confidential = 'No'
        }
        else {
          array.confidential = 'Yes'
        }
        array.status = data[i].status
        array.providername = data[i].providerId
        array.id = data[i].id
        array.icdVersion = data[i].icdVersion
        this.ProblemGrid.push(array)
      }
      this.MyDiagnosisData = this.ProblemGrid
      this.filteredDiagnosisData = this.MyDiagnosisData
      debugger
      console.log('MyDiagnosisData', this.ProblemGrid)
      this.onStatusChange()

    })
  }
  searchingName: string = 'Starting Code';
  searchBy(e: any) {

    if (e.value == 3) {
      this.searchingName = 'Code Description';
    }
    else {
      this.DescriptionFilter = '';
      this.searchingName = 'Starting Code';
    }

  }
  AllServicesApis() {


    this.clinicalApiService.MyCptCodebyProvider(this.ProviderId, this.CPTGroupId).then((response: any) => {
      this.MyCPTCode = response.table1
      console.log(this.MyCPTCode, 'this.MyCPTCode');
    })
    this.clinicalApiService.MyHCPCSCodebyProvider(this.ProviderId, this.MyHCPSGroupId, this.HCPCSCode, this.DescriptionFilter, this.PairId).then((response: any) => {
      this.MyHCPCSCode = response.table1;
      console.log(this.MyHCPCSCode, 'this.MyHCPCSCode');

    })



    this.clinicalApiService.CPTCodebyProvider(this.AllCPTCode, this.CPTStartCode, this.CPTEndCode, this.Description).then((response: any) => {
      this.CPTCode = response.table1;
      console.log(this.CPTCode, 'this.CPTCode');

    })






    this.clinicalApiService.UnclassifiedServicebyProvider(this.AllCode, this.UCStartCode, this.DescriptionFilter).then((response: any) => {
      this.UnclassifiedService = response.table1
      console.log(this.UnclassifiedService, 'this.UnclassifiedService');

    })

    this.clinicalApiService.ServiceItemsbyProvider(this.AllCode, this.ServiceStartCode, this.DescriptionFilter).then((response: any) => {
      this.ServiceItems = response.table1
      console.log(this.ServiceItems, 'this.ServiceItems');

    })

  }


  onStatusChange() {
    throw new Error('Method not implemented.');
  }

  Rows() {
    debugger
    let data: any = [];


    for (let i = 0; i < this.selectedDiagnosis.length; i++) {
      let oldData = {

        ICDCode: undefined,
        version: undefined,
        description: undefined,
        typeofDiagnosis: '',
        yearofOnset: '',
        versionId: 0,

      };
      oldData.ICDCode = this.selectedDiagnosis[i].icD9Code;
      oldData.version = this.selectedDiagnosis[i].icdVersion;
      oldData.versionId = this.selectedDiagnosis[i].icdVersionId;
      oldData.description = this.selectedDiagnosis[i].providerDescription;
      oldData.typeofDiagnosis = '';
      oldData.yearofOnset = '';
      data.push(oldData);

    }
    this.MyDiagnosisData = data;
    if (this.selectedallDiagnosis.length > 0) {
      for (let i = 0; i < this.selectedallDiagnosis.length; i++) {
        let oldData = {

          ICDCode: undefined,
          version: undefined,
          description: undefined,
          typeofDiagnosis: '',
          yearofOnset: '',
          versionId: 0,

        };
        oldData.ICDCode = this.selectedallDiagnosis[i].icD9Code;
        oldData.version = this.selectedallDiagnosis[i].icdVersion;
        oldData.versionId = this.selectedallDiagnosis[i].icdVersionId;
        oldData.description = this.selectedallDiagnosis[i].descriptionFull;
        oldData.typeofDiagnosis = '';
        oldData.yearofOnset = '';

        this.MyDiagnosisData.push(oldData);

      }
    }
    console.log(this.MyDiagnosisData, "kun");
  }

}
