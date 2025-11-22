import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { LucideAngularModule, LucideHome, LucideChevronRight, LucideBell, LucideEdit } from 'lucide-angular';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { AlertDTO } from '@/app/shared/Models/Clinical/alert.model';

declare var flatpickr: any;
import { AlertType } from '@/app/shared/Models/Clinical/alert-type.model';
import { NgIconComponent } from '@ng-icons/core';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';


@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
  CommonModule,
  ReactiveFormsModule, 
  LucideAngularModule, 
  FormsModule,
  NgIconComponent,
  NgbTooltip,
  TranslatePipe,
  GenericPaginationComponent,
  FilledOnValueDirective
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
@Injectable({
  providedIn: 'root'
})
export class AlertComponent implements OnInit, AfterViewInit {
  // lucide-angular icons for template
  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly bellIcon = LucideBell;
  protected readonly editIcon = LucideEdit;
 MyAlertsData: AlertDTO[] = [];
  filteredAlertsData: any[] = [];
  pagedAlerts: AlertDTO[] = [];
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
  // Track which alert is being edited (null means create mode)
  editingAlertId: number | null = null;

  Alert: any;
  AlertRow: any;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizes = [5, 10, 25, 50];
  totalPages = 0;
  totalItems = 0;
  pageNumbers: (number | string)[] = [];
  SearchPatientData: any

  constructor(private fb: FormBuilder, private router: Router,
    private registrationApiService: RegistrationApiService,
    private patientBannerService: PatientBannerService,


  ) { }
  Active = [
    { id: 1, name: "Active" },
    { id: 0, name: "InActive" },
    { id: 2, name: "Completed" }
  ];



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
      // Carry the record id to support update
      alertId: [0],
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

    // Auto-fill enteredBy from sessionStorage if available (AuthService writes here)
    try {
      const ssUserName = (typeof window !== 'undefined' && window?.sessionStorage)
        ? (sessionStorage.getItem('userName') || '')
        : '';
      if (ssUserName) {
        this.alertForm.patchValue({ enteredBy: ssUserName, updatedBy: null });
      }
    } catch (e) {
      console.warn('Could not access sessionStorage.userName', e);
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


    // Defer picker initialization until the form is in the DOM
    setTimeout(() => this.initDatePickers(), 0);

    // Ensure Repeat Date validation reflects current mode (default: save => not required)
    this.updateRepeatDateValidator();
  }

  ngAfterViewInit(): void {
    // Fallback: in case form was already rendered, initialize pickers
    this.initDatePickers();
  }

  private initDatePickers() {
    const startEl = document.querySelector('#alertStartDate') as HTMLInputElement | null;
    const repeatEl = document.querySelector('#alertRepeatDate') as HTMLInputElement | null;
    if (!startEl && !repeatEl) {
      // Form not yet in DOM; try again shortly
      setTimeout(() => this.initDatePickers(), 100);
      return;
    }
    this.ensureFlatpickr().then(() => {
      try {
        if (startEl && !startEl.getAttribute('data-fp-applied')) {
          flatpickr(startEl, {
            dateFormat: 'd/m/Y',
            allowInput: true,
            // Disallow selecting any date before today
            minDate: 'today',
            onChange: (_sd: any, dateStr: string) => {
              this.alertForm?.patchValue({ startDate: dateStr });
            },
            // Extra guard: if user typed a backdate and blurred, correct it
            onClose: (selectedDates: any[], dateStr: string, instance: any) => {
              const todayZero = new Date();
              todayZero.setHours(0, 0, 0, 0);
              const parsed = this.parseDMYToDate(dateStr);
              if (parsed) {
                const startZero = new Date(parsed);
                startZero.setHours(0, 0, 0, 0);
                if (startZero < todayZero) {
                  try { Swal.fire('Validation', 'Start Date cannot be in the past.', 'warning'); } catch {}
                  instance.setDate(new Date(), true); // also triggers onChange to patch form
                }
              }
            }
          });
          startEl.setAttribute('data-fp-applied', '1');
        }
        if (repeatEl && !repeatEl.getAttribute('data-fp-applied')) {
          flatpickr(repeatEl, {
            dateFormat: 'd/m/Y',
            allowInput: true,
            // Disallow selecting any date before today
            minDate: 'today',
            onChange: (_sd: any, dateStr: string) => {
              this.alertForm?.patchValue({ repeatDate: dateStr });
            },
            // Extra guard to prevent manual backdate typing
            onClose: (selectedDates: any[], dateStr: string, instance: any) => {
              const todayZero = new Date();
              todayZero.setHours(0, 0, 0, 0);
              const parsed = this.parseDMYToDate(dateStr);
              if (parsed) {
                const repZero = new Date(parsed);
                repZero.setHours(0, 0, 0, 0);
                if (repZero < todayZero) {
                  try { Swal.fire('Validation', 'Repeat Date cannot be in the past.', 'warning'); } catch {}
                  instance.setDate(new Date(), true);
                }
              }
            }
          });
          repeatEl.setAttribute('data-fp-applied', '1');
        }
      } catch (e) {
        console.warn('Flatpickr init failed:', e);
      }
    });
  }

  // Dynamically load flatpickr if not already available
  private ensureFlatpickr(): Promise<void> {
    return new Promise<void>((resolve) => {
      const w = window as any;
      if (typeof w.flatpickr === 'function') {
        resolve();
        return;
      }
      // Avoid injecting twice
      if (document.getElementById('fp-script')) {
        const check = setInterval(() => {
          if (typeof (window as any).flatpickr === 'function') {
            clearInterval(check);
            resolve();
          }
        }, 50);
        setTimeout(() => clearInterval(check), 5000);
        return;
      }
      const link = document.createElement('link');
      link.id = 'fp-style';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.id = 'fp-script';
      script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      script.onload = () => resolve();
      script.onerror = () => resolve(); // Resolve anyway to avoid blocking
      document.body.appendChild(script);
    });
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

  paginationInfo: any = {
    pageNumber: 1,
    pageSize: 5,
  };
  GetPatientAlertsData() {
    if (this.SearchPatientData == undefined) {
      // Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      // this.loader.hide();
      return;
    }

    this.registrationApiService.GetAlertDetailsDb(this.SearchPatientData.table2[0].mrNo,this.paginationInfo.pageNumber,this.paginationInfo.pageSize).then((res: any) => {
      this.MyAlertsData = [];
      this.alertsTable = res?.alert?.table1 || [];
      this.totalItems  = res?.alert?.table2?.[0]?.totalRecords || 0;
      if (Array.isArray(this.alertsTable) && this.alertsTable.length > 0) {
        // Normalize to match AlertDTO types and ensure alertId exists as number
        this.MyAlertsData = this.alertsTable.map((it: any) => {
          const normalized: any = { ...it };
          // Normalize boolean
          normalized.active = it?.active === true || it?.active === 1;
          // Normalize alertId from multiple possible back-end keys
          const idCandidate = it?.alertId ?? it?.AlertId ?? it?.AlertID ?? it?.ALERTID ?? it?.id ?? it?.ID ?? 0;
          normalized.alertId = Number(idCandidate) || 0;
          // Normalize updatedDate from common backend casings
          normalized.updatedDate = it?.updatedDate ?? it?.UpdatedDate ?? it?.UPDATEDDATE ?? null;
          return normalized as AlertDTO;
        });
        this.filteredAlertsData = this.MyAlertsData;
      }
    }).catch((error: any) => {
      console.error("Failed to fetch alert data", error);
    });

  }


  onAlertPageChanged(event: any) {
    console.log(event);
    this.paginationInfo.pageNumber = event;
    this.GetPatientAlertsData();
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
    const today = new Date();
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    const effectiveEnteredDateStr = formValue.enteredDate || todayStr;
    // Additional validation: Start Date is always required; Repeat Date only required in update mode
    let sd = this.parseDMYToDate(formValue.startDate);
    if (!sd) {
      Swal.fire('Validation Error', 'Please enter a valid Start Date in dd/MM/yyyy format.', 'warning');
      return;
    }
    let rd: Date | null = null;
    if (this.buttontext === 'update') {
      const hasRepeat = !!formValue.repeatDate;
      if (hasRepeat) {
        rd = this.parseDMYToDate(formValue.repeatDate);
        if (!rd) {
          Swal.fire('Validation Error', 'Please enter a valid Repeat Date in dd/MM/yyyy format.', 'warning');
          return;
        }
        // Disallow past repeat date (must be today or future)
        const todayZero2 = new Date();
        todayZero2.setHours(0, 0, 0, 0);
        const rdZero = new Date(rd);
        rdZero.setHours(0, 0, 0, 0);
        if (rdZero < todayZero2) {
          Swal.fire('Validation Error', 'Repeat Date cannot be in the past.', 'warning');
          return;
        }
        if (rd < sd) {
          Swal.fire('Validation Error', 'Repeat Date cannot be earlier than Start Date.', 'warning');
          return;
        }
      } else {
        // user didn't provide a repeat date; keep it null
        rd = null;
      }
    } else {
      // In create mode, send repeatDate as null
      rd = null;
    }

    // Determine the id to send for update
    const selectedId = Number(this.editingAlertId || this.alertForm?.get('alertId')?.value || 0) || 0;
    const alert = {
      // Ensure backend receives the correct identifier for update
      alertId: selectedId,

      ruleId: 0,
      mrno: this.SearchPatientData?.table2?.[0]?.mrNo || null,
      alertMessage: formValue.message,
      active: String(formValue.status) === '1',
      repeatDate: rd,
      startDate: sd,
      isFinished: String(formValue.status) === '2',
      enteredBy: this.SearchPatientData?.table2?.[0]?.mrNo || null,
      enteredDate: new Date(effectiveEnteredDateStr),
      updatedBy: sessionStorage.getItem('userId') || '',
      appointmentId: Number(this.appID) || 0,
      alertTypeId: parseInt(formValue.alertType),
      comments: formValue.message,
      hasChild: false,
      oldMrno: this.SearchPatientData?.table2?.[0]?.mrNo || null,
      isDeleted: false,
    } as AlertDTO & { AlertId?: number };

    // Some backends expect PascalCase for IDs (e.g., AlertId). Send both just in case.
    if (alert.alertId && alert.alertId > 0) {
      (alert as any).AlertId = alert.alertId;
    }

    // Guard: If user is updating but alertId is 0, stop and inform
    if (this.buttontext === 'update' && (!alert.alertId || alert.alertId === 0)) {
      Swal.fire('Validation Error', 'Cannot update: missing Alert ID. Please reselect the alert to edit.', 'warning');
      return;
    }

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
        // Reset editing state and button text after successful save/update
        this.editingAlertId = null;
        this.buttontext = 'save';
        // Rehydrate auto fields after reset: enteredBy only; updatedBy stays null for next insert
        try {
          const ssUserName = (typeof window !== 'undefined' && window?.sessionStorage)
            ? (sessionStorage.getItem('userName') || '')
            : '';
          if (ssUserName) {
            this.alertForm.patchValue({ enteredBy: ssUserName, updatedBy: null });
          }
        } catch {}
        const today = new Date();
        const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10);
        this.alertForm.patchValue({ enteredDate: todayStr, mrno: this.SearchPatientData?.table2?.[0]?.mrNo || null });
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

  // Helper to format date values for input[type=date]
  private formatDateForInputDMY(value: any): string {
    try {
      const d = new Date(value);
      if (!isFinite(d.getTime())) return '';
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch { return ''; }
  }

  private parseDMYToDate(input: any): Date | null {
    if (!input) return null;
    try {
      if (typeof input === 'string') {
        const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m) {
          const dd = parseInt(m[1], 10);
          const mm = parseInt(m[2], 10) - 1;
          const yyyy = parseInt(m[3], 10);
          const d = new Date(yyyy, mm, dd);
          return isFinite(d.getTime()) ? d : null;
        }
      }
      const d2 = new Date(input);
      return isFinite(d2.getTime()) ? d2 : null;
    } catch { return null; }
  }

  // Load a row into the form for editing
  editAlert(item: any) {
     ;
    if (!item) return;
    // Prevent editing of completed alerts
    if (item?.isFinished) {
      try { Swal.fire('Info', 'Completed alerts cannot be edited.', 'info'); } catch {}
      return;
    }
    const pickedId = Number(item?.alertID ?? item?.AlertId ?? item?.AlertID ?? item?.ALERTID ?? item?.id ?? item?.ID ?? 0) || 0;
    this.editingAlertId = pickedId;
    // Patch the form with item data
    const patch = {
      alertId: pickedId,
      alertType: item.alertTypeId ?? null,
      startDate: this.formatDateForInputDMY(item.startDate),
      repeatDate: this.formatDateForInputDMY(item.repeatDate),
      message: item.alertMessage ?? item.comments ?? '',
      status: (item.active === true || item.active === 1) ? 1 : 0,
      mrno: this.SearchPatientData?.table2?.[0]?.mrNo || null,
    } as any;
    this.alertForm.patchValue(patch);

    // If existing repeat date is in the past, auto-correct it to today in update mode
    try {
      const parsedRep = this.parseDMYToDate(this.alertForm.get('repeatDate')?.value);
      const todayZero = new Date();
      todayZero.setHours(0, 0, 0, 0);
      if (parsedRep) {
        const repZero = new Date(parsedRep);
        repZero.setHours(0, 0, 0, 0);
        if (repZero < todayZero) {
          const todayStrDMY = this.formatDateForInputDMY(new Date());
          this.alertForm.patchValue({ repeatDate: todayStrDMY });
        }
      }
    } catch {}

    // Ensure updatedBy is set to current user for the eventual update
    try {
      const ssUserName = (typeof window !== 'undefined' && window?.sessionStorage)
        ? (sessionStorage.getItem('userName') || '')
        : '';
      if (ssUserName) {
        this.alertForm.patchValue({ updatedBy: ssUserName });
      }
    } catch {}

    // Switch submit button to Update
    this.buttontext = 'update';

    // Repeat Date should be required in update mode
    this.updateRepeatDateValidator();

    // Now that the Repeat Date input is visible in the DOM (only in update mode),
    // re-initialize flatpickr to attach the date picker to it.
    // Use setTimeout to ensure the view has updated before initialization.
    setTimeout(() => this.initDatePickers(), 0);

    // Scroll to the form for user convenience
    try { window?.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  }

  // Clear form and reset to create mode
  clearForm() {
    try {
      const ssUserName = (typeof window !== 'undefined' && window?.sessionStorage)
        ? (sessionStorage.getItem('userName') || '')
        : '';
      const today = new Date();
      const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

      this.alertForm.reset({
        alertId: 0,
        alertType: null,
        startDate: '',
        repeatDate: '',
        message: '',
        status: null,
        updatedBy: null,
        enteredBy: ssUserName,
        enteredDate: todayStr,
        mrno: this.SearchPatientData?.table2?.[0]?.mrNo || null,
      });
    } catch {
      // Fallback minimal reset
      this.alertForm.reset();
    }
    this.editingAlertId = null;
    this.buttontext = 'save';
    // Repeat Date not required in create mode
    this.updateRepeatDateValidator();
  }




  getAlertTypeName(typeId: number): string {
  if (typeof typeId !== 'number') {
    console.warn('⚠️ Invalid typeId:', typeId);
    return 'Unknown';
  }

  const match = this.getAlert?.find((a: any) => a.typeId === typeId);
  return match?.name || typeId?.toString?.() || 'Unknown';
}


  // Compute column class so fields stretch when Repeat Date is hidden
  getFormColClass(): string {
    return this.buttontext === 'update' ? 'col-lg-3' : 'col-lg-4';
  }
  
  // Ensure Repeat Date is optional; validate only when provided
  private updateRepeatDateValidator() {
    const ctrl = this.alertForm?.get('repeatDate');
    if (!ctrl) return;
    ctrl.clearValidators();
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  get isRtl(): boolean {
  try {
    return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
  } catch {
    return false;
  }
}
}

