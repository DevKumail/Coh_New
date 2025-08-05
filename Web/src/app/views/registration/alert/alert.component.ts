import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { AlertDTO } from '@/app/shared/Models/Clinical/alert.model';
import { AlertType } from '@/app/shared/Models/Clinical/alert-type.model';


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
 MyAlertsData: AlertDTO[] = [];
  filteredAlertsData: any[] = [];
  alertForm!: FormGroup;
  getAlert: AlertType[] = [];
  isLoading: boolean = false;
  buttontext = 'save'
  Eentereddate: any;
  enteredby: any;
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
  SearchPatientData: any

  constructor(private fb: FormBuilder, private router: Router,
  private registrationApiService: RegistrationApiService,
  private patientBannerService: PatientBannerService,


  ) { }
  Active = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];



  async ngOnInit() {
         this.patientBannerService.patientData$
          .pipe(
            filter((data: any) => !!data?.table2?.[0]?.mrNo),
            distinctUntilChanged((prev, curr) =>
              prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
            )
          )
          .subscribe((data: any) => {
            console.log('✅ Subscription triggered with MRNO in Alert Component:', data?.table2?.[0]?.mrNo);
            this.SearchPatientData = data;
            if (this.SearchPatientData) {
               this.GetPatientAlertsData()
            }
          });


    await this.GetPatientAlertsData();
    await this.GetAlertType();
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

  alertsTable: any
  GetPatientAlertsData() {
    if(this.SearchPatientData == undefined){
      Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      // this.loader.hide();
      return;
    }

    this.registrationApiService.GetAlertDetailsDb(this.SearchPatientData.table2[0].mrNo).then((res: any) => {
      this.MyAlertsData = [];
      this.alertsTable = res?.alert?.table1 || [];
      if (Array.isArray(this.alertsTable) && this.alertsTable.length > 0) {
        this.MyAlertsData = this.alertsTable || [];
        this.filteredAlertsData = this.alertsTable;
        console.log(this.MyAlertsData, "alerts")
    }}).catch((error: any) => {
      console.error("Failed to fetch alert data", error);
    });

  }
  GetAlertType() {

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
      Mrno: this.SearchPatientData?.table2[0]?.mrNo || null,
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

    console.log( 'this.SearchPatientData?.table2[0]?.mrNo =>' ,this.SearchPatientData?.table2[0]?.mrNo);

    const alert2: AlertDTO = {
  alertId: 0,
  mrno: this.SearchPatientData?.table2[0]?.mrNo || null,
  alertMessage: formValue.message,
  repeatDate: new Date(formValue.repeatDate),
  startDate: new Date(formValue.startDate),
  enteredBy: formValue.enteredBy,
  enteredDate: new Date(formValue.enteredDate),
  updatedBy: formValue.updatedBy,
  alertTypeId: parseInt(formValue.alertType),
  active: parseInt(formValue.status),
  isDeleted: false,
  comments: formValue.message,
  hasChild: false,
  oldMrno: null,
};


    console.log("🚀 Final Alert Payload:", alert);

    this.registrationApiService.SubmitAlertType(alert2).subscribe({
      next: (res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
        this.alertForm.reset(); // clear form
        this.GetPatientAlertsData();
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong'
        });
      }
    });
  }




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

