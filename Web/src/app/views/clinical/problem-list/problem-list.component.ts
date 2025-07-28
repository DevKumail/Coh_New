import { ClinicalApiService } from './../clinical.api.service';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoritesComponent } from '../favorites/favorites.component';


@Component({
  selector: 'app-problem-list',

  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    NgIconComponent,

    ],


  templateUrl: './problem-list.component.html',
  styleUrl: './problem-list.component.scss'
})
export class ProblemListComponent implements OnInit {

  medicalForm!: FormGroup;
  currentPage = 1;
  pageSize = 10;
  pageSizes = [5, 10, 25, 50];
  pageNumbers: number[] = [];

  medicalHistoryData: any[] = [];
  totalPages = 0;
  modalService = new NgbModal();
  FilterForm!: FormGroup;
  @ViewChild('problemModal') problemModal: any;
  


  providerList: any[] = [];
DiagnosisCode: any;
ICDVersions: any;
Searchby: any;
searchForm: any;
diagnosisForm: any


  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService, // Assuming you have a ClinicalService to handle API calls
  ) { }

  ngOnInit(): void {
    this.medicalForm = this.fb.group({
      provider: [''],
      providerName: [''],
      code: [''],
      problem: [''],
      icdVersion: [''],
      confidential: [false],
      startDate: [''],
      endDate: [''],
      comments: [''],
      status: [''],
      isProviderCheck: [false]
    });

    this.getRowData();
    this.fetchProviders();
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
  }

  // ✅ Save problem
  onSubmit(): void {
    if (this.medicalForm.invalid) {
      // TODO: Replace with your notification service, e.g. this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    const formData = this.medicalForm.value;

    const problemPayload = {
      providerId: formData.provider,
      providerName: formData.providerName,
      code: formData.code,
      icD9Description: formData.problem,
      icdVersionId: formData.icdVersion,
      confidential: formData.confidential,
      startDate: formData.startDate,
      endDate: formData.endDate,
      comments: formData.comments,
      status: formData.status,
      createdBy: 1, // ← Add actual userId here
      updatedBy: 1,
      mrno: '1023', // ← Add actual MRNo here
      patientId: 1   // ← Add actual patientId here
    };

    this.clinicalApiService.SubmitPatientProblem(problemPayload).then((res:any) => {
      this.getRowData();
      this.onClear();
      // TODO: Replace with your notification service, e.g. this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Problem successfully created' });
    }).catch((error:any) => {
      // TODO: Replace with your notification service, e.g. this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  // ✅ Load patient problem data
  getRowData() {
    const mrno = '1023'; // Replace with actual
    const userId = 1;     // Replace with actual

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
  SubmitPatientProblem(){
    
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
  onCheckboxChange(){

  }


  
  
 openModal() {}
  RoutesearchProblem(){

  }
   filter(e: any) {

    const inputString = e.target.value;
    const trimmedString = inputString.split(' ').filter(Boolean).join(' ');
    console.log(trimmedString); // Output: "Hello, World!"
   //this.MyDiagnosis.filterGlobal(trimmedString, 'contains');
    //this.AllDignosisApis();
  }
  onSearchClick(){

  }
    ClickFilter(modalRef: TemplateRef<any>) {
  this.modalService.open(modalRef, {
    backdrop: 'static',
    size: 'xl',
    centered: true
  });
}
  openProblemModal(){

  }
  onSearch(){

  }
  onSearchByChange(){

  }
  SearchDiagnosis(){

  }
  onRowSelect(){

  }
}
