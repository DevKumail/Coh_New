
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { ClinicalApiService } from '../clinical.api.service';
import Swal from 'sweetalert2';
import { log } from 'console';
import { AllergyDto } from '@/app/shared/models/clinical/allergy.model';



@Component({
  selector: 'app-allergies',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.scss'
})

export class AllergiesComponent implements OnInit {

  // allergyForm!: FormGroup;


  // allergyTypes: string[] = ['Food', 'Drug', 'Environmental', 'Other'];
  severityOptions: string[] = ['Low', 'Moderate', 'High', 'Critical'];
  // statusOptions: string[] = ['Active', 'Inactive', 'Resolved'];
  //  hrEmployees = [
  //   { providerId: 1, name: 'Dr. Ali' },
  //   { providerId: 2, name: 'Dr. Sana' },
  //   { providerId: 3, name: 'Dr. Ahmed' }
  // ];


  // Dummy data for providers

  allergyData: any[] = [];
  name: any
  name1: any
  allergyType: any;
  allergen: any;
  severity: any;
  reaction: any;
  startDate: any;
  endDate: any;
  status: any;
  // fb: FormBuilder;
  hrEmployees: any[] = [];
  GetAlergy: any;




  currentPage = 1;
  pageSize = 5;
  pageSizes: number[] = [5, 10, 20];
  start = 0;
  end = this.pageSize;
  providerForm: any;
  // hrEmployees: any;
  isProviderCheck: any;
  // ClinicalApiService: any;

  GetSeverity: any;
  cacheItems: any;
  appId: any;
  Mrno: any;
  PatientId: any;
  userid: any;
  Allergy: any;
  MyAllergiesData: any;
  filteredDiagnosisData: any;
  id: number | undefined;
  than: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ClinicalApiService: ClinicalApiService) { }
  statusOptions = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }, { id: 2, name: "All" }];



  allergyForm!: FormGroup;

  FillCache() {

    this.ClinicalApiService.getCacheItem({ entities: ['Provider'] }).then((response: any) => {
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
  }
  ngOnInit(): void {
     
    this.FillCache();
    this.GetAlergyType();
    this.GetSeverityType();
    this.initForm();
    
     var app =JSON.parse(sessionStorage.getItem('LoadvisitDetail') || '');
    this.appId=app.appointmentId

    let visitAccountDetail: any = sessionStorage.getItem("LoadvisitDetail");
    var Demographicsinfo = sessionStorage.getItem('Demographics');
    if (Demographicsinfo) {
      var Demographics = JSON.parse(sessionStorage.getItem('Demographics') || '');
      this.Mrno = Demographics.table2[0].mrNo;
      this.PatientId = Demographics.table2[0].patientId;
    }





    var currentUser = sessionStorage.getItem('userId');
    console.log('this.userId', currentUser);

    if (currentUser) {
      this.userid = currentUser || 0; 
    }



    this.GetPatientAllergyData();
    this.Allergy.ActiveStatus = 1
  }

  GetPatientAllergyData() {
     
    var mrno = this.Mrno
    this.ClinicalApiService.GetPatientAllergyData(mrno).subscribe((res: any) => {
       
      console.log('res', res);
      this.MyAllergiesData = res.allergys.table1
      this.filteredDiagnosisData = this.MyAllergiesData
      this.onStatusChange()
      console.log('this.MyAllergiesData', this.MyAllergiesData);
    })

  }
  onStatusChange() {

  }
  GetAlergyType() {
    console.log('init');
    let Mrno = '1006';
    this.ClinicalApiService.GetAlergyType().subscribe((res: any) => {
      console.log(res);
      this.GetAlergy = res.result
      console.log( 'GetAlergy =>',res.result)
    })
  }
  GetProviderType() {
    this.ClinicalApiService.GetAlergyByProviderId().subscribe((res: any) => {
      this.hrEmployees = res.result;
    })
  }
  GetSeverityType() {
    this.ClinicalApiService.GetSeverity().then((res: any) => {
      this.GetSeverity = res.result;
      console.log('GetSeverity', this.GetSeverity);

    }).catch((error: any) => {
      console.error('Error:', error);
    });
  }




  initForm() {
    this.allergyForm = this.fb.group({
      providerId: [''],
      allergyType: [''],
      allergen: [''],
      severity: [''],
      reaction: [''],
      startDate: [''],
      endDate: [''],
      status: [''],
      isProviderCheck: [false],
      typeId: [''],
      active: [true],
      updatedBy: [this.userid],
      updatedDate: [new Date().toISOString().split('T')[0]],
      createdBy: [this.userid],
      createdDate: [new Date().toISOString().split('T')[0]],
      appointmentId: [this.userid]

    });
  }



  // loadDummyData() {
  //   this.allergyData = [
  //     {
  //       providerName: 'Dr. Smith',
  //       allergyType: 'Food',
  //       allergen: 'Peanuts',
  //       severity: 'High',
  //       reaction: 'Anaphylaxis',
  //       startDate: '2023-01-01',
  //       endDate: '2023-06-01',
  //       status: 'Active'
  //     },
  //     {
  //       providerName: 'Dr. Johnson',
  //       allergyType: 'Drug',
  //       allergen: 'Penicillin',
  //       severity: 'Moderate',
  //       reaction: 'Rash',
  //       startDate: '2022-03-15',
  //       endDate: '2022-10-20',
  //       status: 'Resolved'
  //     },
  //     {
  //       providerName: 'Dr. Brown',
  //       allergyType: 'Environmental',
  //       allergen: 'Dust',
  //       severity: 'Low',
  //       reaction: 'Sneezing',
  //       startDate: '2024-02-01',
  //       endDate: '2024-07-01',
  //       status: 'Active'
  //     },

  //   ];
  //   this.updatePagination();

  // }

  get MyAlllergyData(): any[] {
    return this.allergyData.slice(this.start, this.end);
  }

  get totalPages(): number {
    return Math.ceil(this.allergyData.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  updatePagination() {
    this.start = (this.currentPage - 1) * this.pageSize;
    this.end = this.start + this.pageSize;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.updatePagination();
  }

  submitAllergyForm() {
    if (this.allergyForm.valid) {
      this.allergyData.push(this.allergyForm.value);
      this.allergyForm.reset();
      this.updatePagination();
    }
  }

  editAllergy(index: number) {
    const globalIndex = this.start + index;
    const selected = this.allergyData[globalIndex];
    this.allergyForm.patchValue(selected);
    this.allergyData.splice(globalIndex, 1);
    this.updatePagination();
  }

  deleteAllergy(index: number) {
    const globalIndex = this.start + index;
    this.allergyData.splice(globalIndex, 1);
    this.updatePagination();
  }

  resetForm() {
    this.allergyForm.reset();
  }
  DropFilled() {
    this.Allergy.typeId = ""
    this.Allergy.allergen = ""
    this.Allergy.providerId = ""
    this.Allergy.severityCode = ""
    this.Allergy.reaction = ""
    this.Allergy.startDate = ""
    this.Allergy.endDate = ""
    this.Allergy.status = ""
    this.isProviderCheck = false;
  }





  mrno = "1006";

  submit() {
     debugger
    const formValue = this.allergyForm.value;

    const payload: AllergyDto = {
      // allergyType: this.id ?? 0,
      // allergyType:formValue.allergyType ,
       allergyid:formValue.allergyType ,
      typeId: formValue.allergyType,
      allergen: formValue.allergen,
      severityCode: formValue.severity,
      reaction: formValue.reaction,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      status: formValue.status,
      active: true,
      updatedBy: this.userid,
      // updatedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString().split('T')[0],

      providerId: formValue.providerId,
      mrno: '1006',
      createdBy: this.userid,
      // createdDate: new Date().toISOString(),
      createdDate: new Date().toISOString().split('T')[0],
      appointmentId: this.userid,
      
    };

    console.log('Payload:', payload);

    this.ClinicalApiService.SubmitPatientAllergies(payload).then(() => {
      this.DropFilled();
      this.GetPatientAllergyData();

      Swal.fire('Success', 'Allergies Successfully Created', 'success');
    }).catch((error: any) => {
      Swal.fire('Error', error.message || 'Something went wrong', 'error');
    });
  }



}

