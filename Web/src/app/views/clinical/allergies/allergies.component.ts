
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
  imports: [ CommonModule,
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

  allergyForm!: FormGroup;

  // Dropdown Options
  allergyTypes: string[] = [];
  severityOptions: string[] = [];
  statusOptions: string[] = [];
  provider: any[] = [];


  allergyData: any[] = [];
   Allergy: any = {}
  //  ClinicalApiService: any;
  GetAlergy: any[] = [];
  providerCheck: any;
  clinical: any;
  Mrno: any = '1006';
  listener: any;
  appId: any;
  PatientId: any
  userid: any
  id:any;
  isProviderCheck: any ;


  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  pageSizes: number[] = [5, 10, 20];
  start = 0;
  end = this.pageSize;

  constructor(private fb: FormBuilder, private router: Router,private clinicalApiService: ClinicalApiService,) {}
   ActiveStatus = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];

    private clinicalApi: ClinicalApiService,
    private fb: FormBuilder,
    private router: Router
    ) {}

  ngOnInit() {
    this.initForm();
    this.loadDummyData();
    this.updatePagination();
     this.FillCache();
    this.GetAlergyType();
    this.GetSeverityType();
    this.GetPatientAllergyData(this.Mrno);

  }

//   initForm() {
//     this.allergyForm = this.fb.group({
//   providerDescription: [''],
//   providerId: ['', Validators.required],
//   allergyType: ['', Validators.required],
//   allergen: ['', Validators.required],
//   severity: ['', Validators.required],
//   reaction: ['', Validators.required],
//   startDate: ['', Validators.required],
//   endDate: ['', Validators.required],
//   status: [false,Validators.required] // Optional, if not required
// });

//   }
initForm() {
  this.allergyForm = this.fb.group({
    allergyId: [0,Validators.required], // number
    typeId: [''], // number (this is actually allergyType in your old code)
    allergen: ['', Validators.required], // string
    reaction: ['', Validators.required], // string
    startDate: ['', Validators.required], // date string
    endDate: ['', Validators.required], // date string
    status: [0], // number
    active: [true], // boolean
    updatedBy: [0], // number
    updatedDate: [new Date().toISOString()], // string
    // providerId: [null, Validators.required], // number
    providerId: ['', Validators.required] ,
    mrno: [''], // string
    createdBy: [0], // number
    createdDate: [new Date().toISOString()], // string
    SeverityCode: ['', Validators.required], // number
    isHl7msgCreated: [true], // boolean
    reviewedDate: [new Date().toISOString()], // string
    reviewedBy: [''], // string
    errorReason: [''], // string
    oldMrno: [''], // string
    isDeleted: [true], // boolean
    appointmentId: [0], // number
    providerDescription: [''] // string
  });
}


  loadDummyData() {
    this.allergyData = [

    ];
    this.updatePagination();
  }

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
      'Provider'
����];

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

  if (this.allergyForm.get('startDate')?.invalid) {
    Swal.fire('Error', 'Select Start Date', 'error');
    return;
  }

  if (this.allergyForm.get('endDate')?.invalid) {
    Swal.fire('Error', 'Select End Date', 'error');
    return;
  }
debugger
const userId = Number(sessionStorage.getItem('userId'));
  // Map form values to Allergy object
  let formValues = this.allergyForm.value;

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



