
import { ClinicalApiService } from './../clinical.api.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {PatientProblemModel} from '@/app/shared/models/clinical/problemlist.model';

@Component({
  selector: 'app-problem',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    NgbNavModule],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss'
})
export class ProblemComponent {
  favoritesForm!: FormGroup;
  icdVersionList: string[] = ['ICD-9-CM', 'ICD-10-CM', 'SNOMED'];
  searchResults: any[] = [];
  selectedYear!: number;
  searchText: string = '';
  selectedCode: string = '';
  selectedVersion: string = '';
  selectedStartCode: string = '';
  years: number[] = [];
  currentPage: number = 1;
  ProviderId: number = 0;
  pageSize: number = 10;
  pageSizes = [5, 10, 25, 50];
  pageNumbers: number[] = [];
  totalPages: number = 0;
  totalDiagnosisData : number[] = [];
  totalPagesDiagonsisCode: number = 0;
  ICT9Group: any[] = [];
  medicalForm!: FormGroup;
  medicalHistoryData: any[] = [];
  modalService = new NgbModal();
  FilterForm!: FormGroup;
  // @ViewChild('problemModal') problemModal: any;

  DescriptionFilter: any;
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

  cacheItems: string[] = [
    'Provider',
    'BLUniversalToothCodes',
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

  activeTabId = 1;
  selectedRowIndex: any;
  favoritesData: any;
  start: any;
  end: any;
  totalPagesDiagnoseCode:any;

  // add 4 aug
  

  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService, // Assuming you have a ClinicalService to handle API calls
  ) { }

  

  async ngOnInit() {

    this.FillDropDown

    // this.medicalForm = this.fb.group({
    //   // provider: [''],
    //   providerId: [null],
    //   providerName: [''],
    //   code: [''],
    //   problem: [''],
    //   icdVersion: [''],
    //   confidential: [false],
    //   startDate: [''],
    //   endDate: [''],
    //   comments: [''],
    //   status: [''],
    //   isProviderCheck: [false]
    // });
    this.medicalForm = this.fb.group({
  providerId: [null],
  providerName: [''],
  code: [''],
  problem: [''],
  icdVersion: [null],
  icdVersionValue: [''], 
  startDate: [null],
  endDate: [null],
  status: [null],
  comments: [''],
  confidential: [false],
  appointmentId: [null] 
});


    this.FilterForm = this.fb.group({
      icdVersionId: [''],
      searchById: [''],
      startingCode: [''],
      diagnosisEndCode: [''],
      descriptionFilter: ['']

    });

    this.favoritesForm = this.fb.group({
      icdVersion: [''],
      searchCode: [''],
      startingCode: ['']
    });

    this.loadYears();
    console.log(this.FilterForm)
    this.FillDropDown

    this.getRowdatapatientproblem()
    this.Problems.ActiveStatus = 1
    // this.loadData();

    this.getRowData();
    this.fetchProviders();
    this.FillCache();

  }
  loadYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }
  onSubmit(): void {
    debugger
    if (this.medicalForm.invalid) {
      
      return;
    }

    const formData = this.medicalForm.value;

    // const problemPayload:PatientProblemModel = {
      
    //   providerId: formData.providerId,
    //   providerName: formData.providerName,
    //   code: formData.code,
    //   icd9description: formData.problem,
    //   icdversionId: formData.icdVersion,
    //   confidential: formData.confidential,
    //   startDate: formData.startDate,
    //   endDate: formData.endDate,
    //   comments: formData.comments,
    //   status: formData.status,
    //   createdBy: 1,
    //   updatedBy: 1,
    //   mrno: '1006',
    //   patientId: 1,
    //   id: 0,
    //   icd9code: '',
    //   icdVersionValue: '',
    //   activeStatus: 0,
    //   icd9: '',
    //   active: false,
    //   updatedDate: undefined,
    //   createdDate: undefined,
    //   diagnosisPriority: '',
    //   diagnosisType: '',
    //   outsideClinic: '',
    //   errorReason: '',
    //   oldMrno: '',
    //   isDeleted: false,
    //   startstrdate: '',
    //   endstrdate: '',
    //   providerDescription: ''
    // };
//     const problemPayload: PatientProblemModel = {
//   id: 0,
//   appointmentId: formData.appointmentId, 
//   providerId: formData.providerId,
//   icd9: formData.code, 
//   icd9code: formData.code,
//   icd9description: formData.problem,
//   comments: formData.comments,
//   icdversionId: formData.icdVersion,
//   icdVersionValue: formData.icdVersionValue, 
//   startDate: formData.startDate,
//   endDate: formData.endDate,
//   status: formData.status,
//   activeStatus: 1,
//   active: true,
//   confidential: formData.confidential,
//   createdBy: 2,
//   updatedBy: 2,
//   mrno: '1006',
//   patientId: 6,
//   updatedDate: new Date(),
//   createdDate: new Date(),
//   diagnosisPriority: '',
//   diagnosisType: '',
//   outsideClinic: '',
//   errorReason: '',
//   oldMrno: '',
//   isDeleted: false,
//   startstrdate: '',  
//   endstrdate: '',
//   providerDescription: '',
//   socialHistory: false,
//   isHl7msgCreated: false,
//   isMedicalHistory: false,
//   caseId: null,
// };
const problemPayload: Partial<PatientProblemModel> = {
  activeStatus: 1,
  appointmentId: formData.appId,
  confidential: formData.confidential,
  icdVersionValue: formData.problem,
  icd9: formData.code,
  icd9code: formData.code,
  icd9description: formData.problem,
  icdversionId: formData.icdVersion,
  providerId: formData.providerId,
  comments: formData.comments,
  createdBy: 2,
  mrno: '1006',
  patientId: 6,
  startDate: formData.startDate,
  status: 1,
  updatedBy: 2
};

    this.clinicalApiService.SubmitPatientProblem(problemPayload).then((res: any) => {
      this.getRowData();
      this.onClear();
        Swal.fire({
    icon: 'success',
    title: 'Submitted Successfully',
    text: 'Patient problem has been submitted.',
    confirmButtonText: 'OK'
  });
      
    }).catch((error: any) => {
    
    });
  }
  onClear(): void {
    this.medicalForm.reset();
  }
  async FillCache() {


    // await this.clinicalApiService.getCacheItems({ entities: ['Provider'] }).then((response: any) => {
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

    // 31july
    let universaltoothcode = JSON.parse(jParse).BLUniversalToothCodes;
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
      console.log('poioipoio')
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
      console.log(iCDVersion, 'lett testt')
      this.ICDVersions = iCDVersion;
      console.log(this.ICDVersions);


    }
  }

  // ✅ Load patient problem data
  getRowData() {
    const mrno = '1006'; 
    const userId = 1;     

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

  fetchProviders() {

    this.providerList = [
      { id: 1, name: 'Dr. Ali' },
      { id: 2, name: 'Dr. Sara' }
    ];
  }

  getRowdatapatientproblem() {

    let mrno = this.Mrno
    let UserId = this.userid
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

  onStatusChange() {
    throw new Error('Method not implemented.');
  }

  onCheckboxChange() {

  }

  // ClickFilter(modalRef: TemplateRef<any>) {

  //   this.activeTabId = 2;
  //   this.modalService.open(modalRef, {
  //     backdrop: 'static',
  //     size: 'xl',
  //     centered: true
  //   });
  // }
  selectRow() { }

  SearchDiagnosis() {
    console.log(this.FilterForm.value)

    debugger
    this.DiagnosisCode = [];
    this.clinicalApiService.DiagnosisCodebyProvider(this.ICDVersionId, this.DiagnosisStartCode, this.DiagnosisEndCode, this.DescriptionFilter).then((response: any) => {
      this.DiagnosisCode = response.table1;
      this.totalDiagnosisData = Array( Math.ceil(this.DiagnosisCode.length / this.pageSizeDiagnoseCode)).fill(0);
      // this.totalDiagnosisData =  Array(this.totalDiagnosisData).fill(0);
      this.DiagnosisSearched = true;
      this.currentPageDiagnoseCode = 1;
      this.loadPaginatedData();
      console.log(this.DiagnosisCode, 'this.DiagnosisCode');

    })
  }

  loadPaginatedData() {
    const start = (this.currentPageDiagnoseCode - 1) * this.pageSizeDiagnoseCode;
    const end = start + this.pageSizeDiagnoseCode;
    this.paginatedDiagnosisCode = this.DiagnosisCode.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPageDiagnoseCode = page;
    this.loadPaginatedData();
  }


  // onRowSelect(row: any , modal : any) {

  //    modal.close(row.descriptionFull);
  //   // optionally close modal or use row data
  // }

  openProblemModal() {

  }
  onSearch() {

  }
  onSearchByChange() {

  }
  // add 4aug
  calculateTotalPages() {
  const total = Math.ceil(this.DiagnosisCode.length / this.pageSize);
  this.totalPagesDiagnoseCode = Array.from({ length: total }, (_, i) => i + 1);
}
onRowSelect(diagnosis: any, modal: any) {
  // Modal ko close krdo aur selected diagnosis bhej do
  modal.close(diagnosis.descriptionFull);  // ⬅️ Yahan se data bhej rahe hain
}
ClickFilter(modalRef: TemplateRef<any>) {
  const modalRefInstance = this.modalService.open(modalRef, {
    size: 'xl',
    backdrop: 'static',
    centered: true
  });

  modalRefInstance.result.then((result: any) => {
    if (result) {
      this.medicalForm.patchValue({ problem: result });  // ✅ Yeh input field me value set karega
    }
  }).catch(() => {
    console.log("Modal dismissed");
  });
}


}
