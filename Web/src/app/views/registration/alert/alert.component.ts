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
          try {
            const mrno = this.SearchPatientData?.table2?.[0]?.mrNo || null;
            this.alertForm?.patchValue({ mrno });
          } catch { }
          this.GetPatientAlertsData()
        }
      });

    // Capture selected appointmentId if user switches visits
    try {
      this.patientBannerService.selectedVisit$?.subscribe((visit: any) => {
        this.appID = visit?.appointmentId || 0;
      });
    } catch { }


    await this.GetPatientAlertsData();
    await this.GetAlertType();
    this.alertForm = this.fb.group({
      alertType: [null, Validators.required],
      startDate: ['', Validators.required],
      repeatDate: ['', Validators.required],
      message: ['', Validators.required],
      status: [null, Validators.required],
      // System-decided fields must not be required in the form
      updatedBy: [''],
      enteredBy: [''],
      enteredDate: [''],
      mrno: ['']
    });

    // If patient data already present, patch mrno on form
    try {
      const mrnoInit = this.SearchPatientData?.table2?.[0]?.mrNo || null;
      if (mrnoInit) {
        this.alertForm.patchValue({ mrno: mrnoInit });
      }
    } catch { }

    // Auto-fill updatedBy and enteredBy from localStorage if available
    try {
      const lsUserName = (typeof window !== 'undefined' && window?.localStorage)
        ? (localStorage.getItem('userName') || '')
        : '';
      if (lsUserName) {
        this.alertForm.patchValue({ updatedBy: lsUserName, enteredBy: lsUserName });
      }
    } catch (e) {
      console.warn('Could not access localStorage.userName', e);
    }

    // Auto-fill enteredDate with today's date in yyyy-MM-dd
    const today = new Date();
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    if (!this.alertForm.get('enteredDate')?.value) {
      this.alertForm.patchValue({ enteredDate: todayStr });
    }
    this.alertForm.updateValueAndValidity({ emitEvent: false });

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
    if (this.SearchPatientData == undefined) {
      Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      // this.loader.hide();
      return;
    }

    this.registrationApiService.GetAlertDetailsDb(this.SearchPatientData.table2[0].mrNo).then((res: any) => {
      this.MyAlertsData = [];
      this.alertsTable = res?.alert?.table1 || [];
      if (Array.isArray(this.alertsTable) && this.alertsTable.length > 0) {
        // Normalize to match AlertDTO types (active: boolean)
        this.MyAlertsData = this.alertsTable.map((it: any) => ({
          ...it,
          active: it?.active === true || it?.active === 1,
        }));
        this.filteredAlertsData = this.MyAlertsData;
        console.log(this.MyAlertsData, "alerts");
      }
    }).catch((error: any) => {
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
    // Guard: Patient MRNO must be present
    if (!this.SearchPatientData?.table2?.[0]?.mrNo) {
      Swal.fire('Validation Error', 'MRNO is required. Please load/select a patient first.', 'warning');
      return;
    }

    if (this.alertForm.invalid) {
      try {
        console.group('Form Validation Debug');
        console.log('SearchPatientData.mrNo:', this.SearchPatientData?.table2?.[0]?.mrNo);
        console.log('Form Value:', this.alertForm.value);
        console.log('Form Status:', this.alertForm.status);
        const controls: any = this.alertForm.controls;
        Object.keys(controls).forEach(key => {
          const ctrl = controls[key];
          if (ctrl?.invalid) {
            console.warn(`Invalid control -> ${key}`, {
              value: ctrl.value,
              errors: ctrl.errors
            });
          } else {
            console.log(`Valid control -> ${key}`, { value: ctrl.value });
          }
        });
        console.groupEnd();
      } catch (e) {
        console.error('Error while logging validation debug info', e);
      }
      this.alertForm.markAllAsTouched();
      // Scroll to first invalid control if present
      try {
        const firstInvalidKey = Object.keys(this.alertForm.controls).find(k => this.alertForm.get(k)?.invalid);
        if (firstInvalidKey) {
          const el = document.querySelector(`[formControlName="${firstInvalidKey}"]`) as HTMLElement | null;
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch { }
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    const formValue = this.alertForm.value;
    const lsUserName = (typeof window !== 'undefined' && window?.localStorage)
      ? (localStorage.getItem('userName') || '')
      : '';
    const effectiveUpdatedBy = formValue.updatedBy || lsUserName;
    const effectiveEnteredBy = formValue.enteredBy || lsUserName;
    const today = new Date();
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    const effectiveEnteredDateStr = formValue.enteredDate || todayStr;

    // Additional validation: repeatDate >= startDate
    try {
      const sd = new Date(formValue.startDate);
      const rd = new Date(formValue.repeatDate);
      if (isFinite(sd.getTime()) && isFinite(rd.getTime()) && rd < sd) {
        Swal.fire('Validation Error', 'Repeat Date cannot be earlier than Start Date.', 'warning');
        return;
      }
    } catch { }

    const alert = {
      alertId: 0,
      ruleId: 0,
      mrno: this.SearchPatientData?.table2[0]?.mrNo || null,
      alertMessage: formValue.message,
      active: String(formValue.status) === '1',
      repeatDate: new Date(formValue.repeatDate),
      startDate: new Date(formValue.startDate),
      isFinished: true,
      enteredBy: effectiveEnteredBy,
      enteredDate: new Date(effectiveEnteredDateStr),
      updatedBy: effectiveUpdatedBy,
      appointmentId: Number(this.appID) || 0,
      alertTypeId: parseInt(formValue.alertType),
      comments: formValue.message,
      hasChild: false,
      oldMrno: this.SearchPatientData?.table2[0]?.mrNo || null,
      isDeleted: false,
    } as AlertDTO;

    console.log('this.SearchPatientData?.table2[0]?.mrNo =>', this.SearchPatientData?.table2[0]?.mrNo);

    // Final payload strictly aligned with working POST sample
    const alert2: AlertDTO = alert;


    console.log("🚀 Final Alert Payload:", alert2);

    this.registrationApiService.SubmitAlertType(alert2).subscribe({
      next: (res: any) => {
        const msg = res?.message || 'Patient information created or updated successfully.';
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: msg,
          showConfirmButton: false,
          timer: 1500
        });
        this.alertForm.reset();
        this.GetPatientAlertsData();
      },
      error: (error: any) => {
        let text = error?.error?.message || error?.message || 'Something went wrong';
        // Network error
        if (error?.status === 0) {
          text = 'Cannot reach server. Please check your connection or certificate.';
        }
        // Validation warning
        if (error?.status === 400) {
          Swal.fire('Validation Error', text, 'warning');
          return;
        }
        // Conflict or duplicate
        if (error?.status === 409) {
          Swal.fire('Warning', text, 'warning');
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text });
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

