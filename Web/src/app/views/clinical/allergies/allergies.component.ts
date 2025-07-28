
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
  buttonText: string | undefined;

  resetForm() {
    throw new Error('Method not implemented.');
  }



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
  // cacheItems: any ;
  appId: any;
  Mrno: any;
  PatientId: any;
  userid: any;
  Allergy: any;
  // MyAllergiesData: any;
  // filteredDiagnosisData: any;
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
    this.GetPatientAllergyData();

    var app = JSON.parse(sessionStorage.getItem('LoadvisitDetail') || '');
    this.appId = app.appointmentId

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

    // var mrno = this.Mrno
    var mrno = '1006'
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
      console.log('GetAlergy =>', res.result)
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


  alertForm!: FormGroup;


  mrno = "1006";

  submit() {
    debugger
    const formValue = this.allergyForm.value;

    const payload: AllergyDto = {
      // allergyType: this.id ?? 0,
      // allergyType:formValue.allergyType ,
      allergyid: this.id || 0,
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
  formatDate(date: string): string {
    return date ? date.split('T')[0] : '';
  }


  onCheckboxChange2() {
    debugger;
    this.isProviderCheck
    const isChecked = this.isProviderCheck; // Get the checked state
    this.isProviderCheck = isChecked;
    console.log('providerCheck Checkbox Value:', this.isProviderCheck);
  }
  DropFilled() {
    this.allergyForm.reset({
      typeId: '',
      allergen: '',
      severity: '',
      reaction: '',
      startDate: '',
      endDate: '',
      status: '',
      isProviderCheck: false,
      active: true,
      updatedBy: this.userid,
      updatedDate: new Date().toISOString().split('T')[0],
      createdBy: this.userid,
      createdDate: new Date().toISOString().split('T')[0],
      appointmentId: this.appId
    });

  }



  deleteAllergy(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this allergy record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ClinicalApiService.DeleteAllergy(id)
          .then((res: any) => {
            this.DropFilled();
            this.GetPatientAllergyData();
            Swal.fire({
              title: 'Deleted!',
              text: 'Allergy has been successfully deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error!',
              text: error.message || 'Something went wrong.',
              icon: 'error'
            });
          });
      }
    });
  }

  //  editAllergy(i: any) {
  //   debugger
  //   this.buttonText = 'Update';
  //  this.Allergy.typeId = i.typeId
  //  this.Allergy.allergen = i.allergen
  //  this.Allergy.providerId = i.providerId;
  //  this.Allergy.severityCode = i.severity
  //  this.Allergy.reaction = i.reaction
  //  this.id=i.allergyId;
  //  if(i.status=='Active')
  //   {
  //     this.Allergy.status = 1
  //   }
  //   else
  //   {
  //     this.Allergy.status = 2
  //   }
  //  this.Allergy.startDate = new Date(i.startDate)
  //  this.Allergy.endDate = new Date (i.endDate)

  // }
editAllergy(allergy: any) {
  this.buttonText = 'Update';
  this.id = allergy.allergyId;
  this.allergyForm.patchValue({
    providerId: allergy.providerId,
    allergyType: allergy.typeId,
    allergen: allergy.allergen,
    severity: allergy.severity,
    reaction: allergy.reaction,
    startDate: this.formatDate(allergy.startDate),
    endDate: this.formatDate(allergy.endDate),
    status: allergy.status === 'Active' ? 1 : 2
  });
}

}
