
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
// import { ClinicalApiService } from 'src/app/services/clinical-api.service';
import { ClinicalApiService } from '../clinical.api.service';
import { Injectable } from '@angular/core';


@Component({
  selector: 'app-allergies',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.scss'
})

export class AllergiesComponent implements OnInit {
  validation(value: any): boolean {
  return value === null || value === undefined || value === '';
}
  MyAllergiesData: any[] = [];
  filteredDiagnosisData: any[] = [];  
  cacheItems: string[] = [];

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
FillCache() {
  const cacheItems = [
      'Provider'];

  this.clinicalApiService.getCacheItem({ entities: cacheItems }).then((response:any) => {
    if (response.cache != null) {
     this.FillDropDown(response);
    }
  }).catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Something went wrong while fetching cache data.'
    });
  });
}
   GetAlergyType() {
  this.clinicalApiService.GetAlergyType().then((res: any) => {
    this.GetAlergy = res.result;
  });
}

    GetSeverity: any = []
  GetSeverityType() {
    this.clinicalApiService.GetSeverity().then((res:any) => {
      this.GetSeverity = res.result
    })
  }
   GetPatientAllergyData(mrno: string) {
     

    this.clinicalApiService.GetPatientAllergyData(mrno).then((res:any) => {
       

      const allergyTable = res?.allergys?.table1;
debugger
      if (Array.isArray(allergyTable) && allergyTable.length > 0) {
        this.MyAllergiesData = allergyTable;
        this.filteredDiagnosisData = allergyTable;

        console.log(" Allergy Records Found =>", this.MyAllergiesData.length);
        console.log(" First Record =>", this.MyAllergiesData[0]);


      } else {
        console.warn("No allergy data returned from API.");
        this.MyAllergiesData = [];
        this.filteredDiagnosisData = [];
      }
    }).catch((error:any) => {
      console.error("Failed to fetch allergy data", error);
    });
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
    this.isProviderCheck=false;
    // this.Allergy.severityCode = 0;
  }
  // FillDropDown(response: any) {
  //   this.allergyTypes = response.cache.filter((item:any) => item.entityName === 'AllergyType').map((item:any) => item.entityValue);
  //   this.severityOptions = response.cache.filter((item:any) => item.entityName === 'Severity').map((item:any) => item.entityValue);
  //   this.statusOptions = response.cache.filter((item:any) => item.entityName === 'Status').map((item:any) => item.entityValue);
  // }
    FillDropDown(response: any) {
 debugger
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;

    if (provider) {
      provider = provider.map((item: { EmployeeId: any; FullName: any; }) => {
        return {
          name: item.FullName,
          providerId: item.EmployeeId
        };
      });
      this.provider = provider;
      console.log('this.provider => ',this.provider);
      
    }
  }

alertForm!: FormGroup;

submitAllergyForm() {
  if (this.allergyForm.get('providerId')?.invalid) {
    Swal.fire('Error', 'Select Provider', 'error');
    return;
  }
  if (this.allergyForm.get('typeId')?.invalid) {
    Swal.fire('Error', 'Select Allergy Type', 'error');
    return;
  }

  if (this.allergyForm.get('allergen')?.invalid) {
    Swal.fire('Error', 'Enter Allergen', 'error');
    return;
  }


  if (this.allergyForm.get('severity')?.invalid) {
    Swal.fire('Error', 'Select Severity', 'error');
    return;
  }

  if (this.allergyForm.get('reaction')?.invalid) {
    Swal.fire('Error', 'Enter Reaction', 'error');
    return;
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
  // this.Allergy = {
  //   ...formValues,
  //   createdBy: userId,
  //   updatedBy: userId,
  //   mrno: this.Mrno || '1024',
  //   patientId: this.PatientId || 0,
  //   AppointmentId: this.appId || 0,
  //   providerDescription: this.allergyForm.get('providerDescription'),
  //   allergyId: this.id ?? 0
  // };
  formValues.createdBy = userId;
formValues.updatedBy = userId;
formValues.mrno = this.Mrno || '1006';
formValues.patientId = this.PatientId || 0;
formValues.appointmentId = 104080;
this.Allergy = formValues;

  console.log('this.Allergy', this.Allergy);
  
  this.clinicalApiService.SubmitPatientAllergies(this.Allergy).then((list:any) => {
    this.DropFilled();
    this.GetPatientAllergyData(this.Mrno);
       this.allergyForm.reset({
    allergyId: 0,
    typeId: null,
    allergen: '',
    reaction: '',
    startDate: '',
    endDate: '',
    status: 0,
    active: true,
    updatedBy: 0,
    updatedDate: new Date().toISOString(),
    providerId: null,
    mrno: '',
    createdBy: 0,
    createdDate: new Date().toISOString(),
    severityCode: null,
    isHl7msgCreated: false,
    reviewedDate: new Date().toISOString(),
    reviewedBy: '',
    errorReason: '',
    oldMrno: '',
    isDeleted: false,
    appointmentId: 0,    
    providerDescription: ''
  });
    Swal.fire({
      position: 'center', 
      icon: 'success',
      title: 'Allergies Successfully Created',
      showConfirmButton: false,
      timer: 2000
    });
      // this.allergyForm.reset();
  }).catch((error:any) => {
    Swal.fire('Error', error.message || 'An error occurred', 'error');
  });
  this.allergyForm.reset();


}



  onCheckboxChange2() {
    debugger;
    this.isProviderCheck
    const isChecked = this.providerCheck; // Get the checked state
    this.providerCheck=isChecked;
    console.log('providerCheck Checkbox Value:', this.isProviderCheck);
  }

  }

  // editAllergy(index: number) {
  //   const globalIndex = this.start + index;
  //   const selected = this.allergyData[globalIndex];
  //   this.allergyForm.patchValue(selected);
  //   this.allergyData.splice(globalIndex, 1);
  //   this.updatePagination();
  // }

  // deleteAllergy(index: number) {
  //   const globalIndex = this.start + index;
  //   this.allergyData.splice(globalIndex, 1);
  //   this.updatePagination();
  // }

  // resetForm() {
  //   this.allergyForm.reset();
  // }



