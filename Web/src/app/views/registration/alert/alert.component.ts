import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';



@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, NgIconComponent
    , FormsModule
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
@Injectable({
  providedIn: 'root'
})
export class AlertComponent implements OnInit {
  MyAlertsData: any[] = [];
  filteredAlertsData: any[] = [];
  alertForm!: FormGroup;
  getAlert: any[] = [];
  isLoading: boolean = false;
  buttontext = 'save'
  Eentereddate: any;
  enteredby: any;

  Mrno: any;
  appID: any;
  PatientId: any;
  userid: any;
  id: any;

  Alert: any;
  AlertRow: any;

  currentPage: number = 1;
  pageSize: number = 10;
  pageSizes = [5, 10, 25, 50];
  totalPages = 0;
  pageNumbers: number[] = [];

  constructor(private fb: FormBuilder, private router: Router,
  private registrationApiService: RegistrationApiService


  ) { }
  Active = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];



  ngOnInit(): void {
    this.alertForm = this.fb.group({
      alertType: [null, Validators.required],
      repeatDate: [null, Validators.required],
      startDate: [null, Validators.required],
      message: ['', Validators.required],
      status: [null],
      updatedBy: [''],
      enteredBy: [''],
      enteredDate: [null],
    });
this.  GetPatientAlertsData() ;
    this.GetAlertType();

    this.alertForm = this.fb.group({
      alertType: [0, Validators.required],
      startDate: ['', Validators.required],
      repeatDate: ['', Validators.required],
      message: ['', Validators.required],
      status: [0, Validators.required],
      updatedBy: ['', Validators.required],
      enteredBy: ['', Validators.required],
      enteredDate: ['', Validators.required],
      mrno: ['']
    });

    this.calculatePagination();
    const demographicsInfo = localStorage.getItem('Demographics');
    if (demographicsInfo) {
      const demographics = JSON.parse(demographicsInfo);
      this.Mrno = demographics.table2[0].mrNo;      // ✅ Mrno
      this.PatientId = demographics.table2[0].patientId;
      this.alertForm.patchValue({ mrno: this.Mrno }); // Optional if needed
    }
  }

  goBackToList() {
    this.router.navigate(['dashboards/dashboard-2']);
  }

  validation(obj: any) {
    if (obj == null || obj == undefined || obj == 0 || obj == "") {
      return true;
    }
    return false;
  }

  mrno: any
  GetPatientAlertsData() {
    debugger
    this.registrationApiService.GetAlertDetailsDb('1023').then((res: any) => {
      debugger;

      const alertsTable = res?.alert?.table1 || [];
      if (Array.isArray(alertsTable) && alertsTable.length > 0) {
        this.MyAlertsData = alertsTable;
        this.filteredAlertsData = alertsTable;
        console.log(this.MyAlertsData, "alerts")

      } else {
        console.warn("No alert data returned from API.");
        this.MyAlertsData = [];
        this.filteredAlertsData = [];
      }
    }).catch((error: any) => {
      console.error("Failed to fetch alert data", error);
    });

  }
  GetAlertType() {
    debugger
    this.registrationApiService.GetAlertType().then(res => {
      console.log("GetAlertType", res)
      this.getAlert = res.result
    })
  }
  Alerts: any = {}

  onSubmit() {
    if (this.alertForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    const formValue = this.alertForm.value;

    const alert = {
      AlertId: 0,
      Mrno: '1023',
      AlertMessage: formValue.message,
      RepeatDate: new Date(formValue.repeatDate),
      StartDate: new Date(formValue.startDate),
      EnteredBy: formValue.enteredBy,
      EnteredDate: new Date(formValue.enteredDate),
      UpdatedBy: formValue.updatedBy,
      AlertTypeId: parseInt(formValue.alertType),
      Active: parseInt(formValue.status),

      IsDeleted: false,
      Comments: formValue.message,
      HasChild: false,
      OldMrno: null
    };

    console.log("🚀 Final Alert Payload:", alert);

    this.registrationApiService.SubmitAlertType(alert).subscribe({
      next: (res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 2000
        });
        this.alertForm.reset(); // clear form
        this.GetPatientAlertsData();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong'
        });
      }
    });
  }



  // getAlertTypeName(typeId: number): string {
  //   const match = this.getAlert.find((a: any) => a.typeId === typeId);
  //   return match ? match.name : typeId.toString();
  // }
  //add waleed
  getAlertTypeName(typeId: number): string {
  if (typeof typeId !== 'number') {
    console.warn('⚠️ Invalid typeId:', typeId);
    return 'Unknown';
  }

  const match = this.getAlert?.find((a: any) => a.typeId === typeId);
  return match?.name || typeId?.toString?.() || 'Unknown';
}


  get start(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get end(): number {
    return Math.min(this.start + this.pageSize, this.MyAlertsData.length);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.MyAlertsData.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}

