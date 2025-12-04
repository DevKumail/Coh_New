import { routes } from './../../../app.routes';
import { EmailItemType } from '@/app/views/apps/email/types';
import { Component, AfterViewInit, Input, ViewChild, TemplateRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { PageTitleComponent } from '@app/components/page-title.component';
import { UiCardComponent } from '@app/components/ui-card.component';
import { NgIcon } from '@ng-icons/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FilePondModule } from 'ngx-filepond';
import { OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { NgxDaterangepickerBootstrapDirective } from 'ngx-daterangepicker-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CounterDirective } from '@core/directive/counter.directive';
import { vitalsingsDto } from '@/app/shared/Models/Clinical/vitalsings.model';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { LoaderService } from '@core/services/loader.service';
import { error } from 'console';
import { LucideAlertTriangle, LucideAngularModule, TheaterIcon } from 'lucide-angular';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



declare var flatpickr: any;

@Component({
    selector: 'app-vital-signs',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        LucideAngularModule,
        RouterModule,
        NgIconComponent,
        FilePondModule,
        NgbNavModule,
  GenericPaginationComponent,
  TranslatePipe,
  FilledOnValueDirective
    ],
    templateUrl: './vital-signs.component.html',
    styleUrl: './vital-signs.component.scss',
})

export class VitalSignsComponent implements OnInit {
  @Input() clinicalnote: boolean = false;
  selectAll: boolean = false;
  vitalSignsForm!: FormGroup;
  SearchPatientData: any;
  patientDataSubscription!: Subscription;
  protected readonly headingIcon = LucideAlertTriangle;
  todayStr!: string;

  vitalSignsPagedData: any[] = [];
  VitalCurrentPage = 1;
  VitalPageSize = 10;
  VitalTotalItems = 0;
isSubmitting: any;
VitalStart: any;
bpSystolic = 0;
    bpDiastolic = 0;
    heartRate = 0;
    respirationRate = 0;
    temperature = 0;
    weight = 0;
    height = 0;
    bmi = 0;
    spo2 = 0;
    glucose = 0;


  get VitalTotalPages(): number {
    return Math.ceil(this.VitalTotalItems / this.VitalPageSize);
  }

  private focusFirstInvalidControl(): void {
    try {
      setTimeout(() => {
        const firstInvalid = document.querySelector('.is-invalid, .ng-invalid.ng-touched') as HTMLElement | null;
        firstInvalid?.focus({ preventScroll: true } as any);
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } catch {}
  }

  @ViewChild('vitalSignsModal') vitalSignsModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private ClinicalApiService: ClinicalApiService,
    public Loader: LoaderService,
    private PatientData: PatientBannerService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Build today's date string in local timezone: YYYY-MM-DD for min attribute
    try {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      this.todayStr = `${y}-${m}-${d}`;
    } catch {}

    // Dynamic MRNO from banner
    this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) => prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo)
      )
      .subscribe((data: any) => {
        this.SearchPatientData = data;
        const mrNo = this.SearchPatientData?.table2[0]?.mrNo;
        this.vitalSign();
      });

    this.vitalSign();

    // Build form with only entryDate, dailyStartTime (and bpArm) required. Others optional.
    this.vitalSignsForm = this.fb.group(
      {
        entryDate: [null, Validators.required],
        dailyStartTime: [null, Validators.required],
        bpArm: ['left', Validators.required],
        comment: [''],
        bpSystolic: [null],
        bpDiastolic: [null],
        heartRate: [null],
        respirationRate: [null],
        temperature: [null],
        weight: [null],
        height: [null],
        bmi: [{ value: null, disabled: true }],
        spo2: [null],
        glucose: [null],
      }
    , { validators: this.measurementRulesValidator() }
    );

    // Set default Entered Date to today
    try { this.vitalSignsForm.get('entryDate')?.setValue(this.todayStr); } catch {}

    // Custom validation rules applied via subscriptions/group checks
    const systolicCtrl = this.vitalSignsForm.get('bpSystolic');
    const diastolicCtrl = this.vitalSignsForm.get('bpDiastolic');
    // Apply optional range validators based on provided ranges
    systolicCtrl?.addValidators(this.optionalRange(70, 250));
    diastolicCtrl?.addValidators(this.optionalRange(40, 150));
    this.vitalSignsForm.get('heartRate')?.addValidators(this.optionalRange(30, 220));
    this.vitalSignsForm.get('respirationRate')?.addValidators(this.optionalRange(8, 40));
    this.vitalSignsForm.get('temperature')?.addValidators(this.optionalRange(90, 110)); // Fahrenheit
    this.vitalSignsForm.get('weight')?.addValidators(this.optionalRange(1, 300));
    this.vitalSignsForm.get('height')?.addValidators(this.optionalRange(30, 250));
    this.vitalSignsForm.get('spo2')?.addValidators(this.optionalRange(50, 100));
    this.vitalSignsForm.get('glucose')?.addValidators(this.optionalRange(30, 600));
    // Trigger validation status update
    this.vitalSignsForm.updateValueAndValidity({ emitEvent: false });
    systolicCtrl?.valueChanges.subscribe(() => {
      // If systolic has a value, diastolic becomes required (custom error key)
      const hasSys = this.hasValue(systolicCtrl?.value);
      const hasDia = this.hasValue(diastolicCtrl?.value);
      if (hasSys && !hasDia) {
        diastolicCtrl?.setErrors({ ...(diastolicCtrl?.errors || {}), requiredWithSystolic: true });
      } else {
        if (diastolicCtrl?.errors && diastolicCtrl.errors['requiredWithSystolic']) {
          const { requiredWithSystolic, ...rest } = diastolicCtrl.errors;
          diastolicCtrl.setErrors(Object.keys(rest).length ? rest : null);
        }
      }
    });
    diastolicCtrl?.valueChanges.subscribe(() => {
      // Clear custom error if diastolic is provided
      if (diastolicCtrl?.errors && diastolicCtrl.errors['requiredWithSystolic'] && this.hasValue(diastolicCtrl.value)) {
        const { requiredWithSystolic, ...rest } = diastolicCtrl.errors;
        diastolicCtrl.setErrors(Object.keys(rest).length ? rest : null);
      }
    });

    // Auto-calc BMI when height/weight change
    this.vitalSignsForm.get('height')?.valueChanges.subscribe(() => this.updateBmi());
    this.vitalSignsForm.get('weight')?.valueChanges.subscribe(() => this.updateBmi());

    flatpickr('#entryDate', {
      dateFormat: 'Y-m-d',
      minDate: 'today',
      onChange: (selectedDates: any, dateStr: string) => {
        this.vitalSignsForm.get('entryDate')?.setValue(dateStr);
      },
    });


  }


openVitalSignsModal(): void {
  this.clearForm();
  this.modalService.open(this.vitalSignsModal, {
    size: 'xl',
    centered: true,
    backdrop: 'static'
  });
}

onSubmit() {
  this.isSubmitting = true;
  const form = this.vitalSignsForm;

  // Rule 1: entryDate and dailyStartTime required are handled by control validators.

  // Re-evaluate validators and show inline errors only
  form.updateValueAndValidity();

  // Special case: Show SweetAlert for the 'at least one measurement' rule
  if (form.hasError('noMeasurement')) {
    const measurementFields = [
      'bpSystolic','bpDiastolic','heartRate','respirationRate','temperature','weight','height','spo2','glucose'
    ];
    measurementFields.forEach(f => form.get(f)?.markAsTouched());
    Swal.fire({
      icon: 'warning',
      title: 'Validation',
      text: 'At least one measurement is required.',
    });
    this.isSubmitting = false;
    return;
  }

  if (form.invalid) {
    form.markAllAsTouched();
    this.focusFirstInvalidControl();
    this.isSubmitting = false;
    return;
  }

  // Combine Entered Date and Start Time into a local datetime string (no timezone)
  const dateStr: string | null = this.vitalSignsForm?.value?.entryDate || null;
  const timeStr: string | null = this.vitalSignsForm?.value?.dailyStartTime || null;
  let combinedEntryDateStr: string | null = null;
  if (dateStr && timeStr) {
    // Format: YYYY-MM-DDTHH:mm (no timezone)
    combinedEntryDateStr = `${dateStr}T${timeStr}`;
  } else if (dateStr) {
    combinedEntryDateStr = `${dateStr}`;
  }

  const payload: vitalsingsDto = {
    ID: this.Id || 0,
    MRNo: this.SearchPatientData?.table2?.[0]?.mrNo || '',
    EntryDate: combinedEntryDateStr,
    UpdateDate: new Date(),
    UpdateBy: 'admin',
    BPSystolic: this.vitalSignsForm?.value?.bpSystolic,
    BPDiastolic: this.vitalSignsForm?.value?.bpDiastolic,
    BPArm: this.vitalSignsForm?.value.bpArm === 'right' ? 1 : 0,
    PulseRate: this.vitalSignsForm?.value.heartRate,
    HeartRate: this.vitalSignsForm?.value.heartRate,
    RespirationRate: this.vitalSignsForm?.value.respirationRate,
    Temperature: this.vitalSignsForm?.value.temperature,
    Weight: this.vitalSignsForm?.value.weight,
    Height: this.vitalSignsForm?.value.height,
    BMI: this.vitalSignsForm.get('bmi')?.value,
    SPO2: this.vitalSignsForm?.value.spo2,
    Glucose: this.vitalSignsForm?.value.glucose,
    Comment: this.vitalSignsForm?.value.comment,
  };


  // ✅ Corrected: properly set API call
  let apiCall: Promise<any>;
  if (this.Id && this.Id !== 0) {
    apiCall = this.ClinicalApiService.VitalSignUpdate(payload);
  } else {
    apiCall = this.ClinicalApiService.VitalSignInsert(payload);
  }

  apiCall.then(() => {
      this.isSubmitting = false;
      Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: 'Vital signs saved successfully!',
        confirmButtonText: 'OK'
      }).then(() => {
        this.clearForm();
        this.vitalSign();
        this.modalService.dismissAll();
      });
    })
    .catch((err: any) => {
      this.isSubmitting = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Failed to save vital signs.',
      });
    });
}

PageInfo: any = {
  CurrentPage: 1,
  PageSize: 10,
}

  vitalSign(){
     this.vitalSignsPagedData = [];
    this.vitalTotalItems = 0
    if (!this.SearchPatientData?.table2?.[0]?.mrNo) {
      // Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      return;
    }

    const mrNo = this.SearchPatientData?.table2?.[0]?.mrNo || '';
    this.ClinicalApiService.SummarySheet(mrNo,this.PageInfo.CurrentPage,this.PageInfo.PageSize).then((res:any)=>{
    console.log('vital Sign RESULT: ',res);
    this.vitalSignsPagedData = res?.vitalSigns.table1 || []
    this.vitalTotalItems = res?.vitalSigns.table2?.[0]?.totalRecords || 0;
    })
  }

    vitalCurrentPage = 1;
    vitalPageSize = 5;
    vitalTotalItems = 0;
    pagedvital: any[] = [];

    async onvitalPageChanged(page: number) {
    this.PageInfo.CurrentPage = page;
    this.vitalSign();
    }


    get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }

  ngOnDestroy(): void {
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }
  }
  Id: any;

  editVital(vital: any) {

    this.Id = vital?.id;
    // Extract local date (YYYY-MM-DD) and time (HH:mm) from stored datetime
    const rawDateTime: any = vital?.entryDate ?? vital?.EntryDate ?? null;
    let datePart: string | null = null;
    let timePart: string | null = null;
    if (rawDateTime) {
      const str = String(rawDateTime);
      if (str.includes('T')) {
        const [d, t] = str.split('T');
        datePart = d || null;
        timePart = (t || '').substring(0,5) || null; // HH:mm
      } else {
        // Fallback: try Date parsing
        const dObj = new Date(str);
        if (!isNaN(dObj.getTime())) {
          const y = dObj.getFullYear();
          const m = String(dObj.getMonth() + 1).padStart(2, '0');
          const d = String(dObj.getDate()).padStart(2, '0');
          datePart = `${y}-${m}-${d}`;
          const hh = String(dObj.getHours()).padStart(2, '0');
          const mm = String(dObj.getMinutes()).padStart(2, '0');
          timePart = `${hh}:${mm}`;
        }
      }
    }
    this.vitalSignsForm.patchValue({
        entryDate: datePart,
        dailyStartTime: timePart ?? vital?.dailyStartTime ?? null,
        temperature: vital?.temperature,
        respirationRate: vital?.respirationRate,
        bpSystolic: vital?.bpSystolic,
        bpDiastolic: vital?.bpDiastolic,
        spo2: vital?.spO2,
        height: vital?.height,
        weight: vital?.weight,
        bmi: vital?.bmi,
        comment: vital?.comment,
        heartRate: vital?.heartrate,
        glucose: vital?.glucose,
    });
    this.modalService.open(this.vitalSignsModal, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
}

  clearForm() {
    try {
      this.vitalSignsForm.reset({
        entryDate: this.todayStr,
        dailyStartTime: null,
        bpArm: 'left',
        comment: '',
        bpSystolic: null,
        bpDiastolic: null,
        heartRate: null,
        respirationRate: null,
        temperature: null,
        weight: null,
        height: null,
        bmi: null,
        spo2: null,
        glucose: null,
      });
      this.vitalSignsForm.markAsPristine();
      this.vitalSignsForm.markAsUntouched();
    } catch {}
  }

  private hasValue(v: any): boolean {
    return v !== null && v !== undefined && String(v).trim() !== '';
  }

  // Group validator: at least one measurement required; diastolic required when systolic provided; BMI range check
  private measurementRulesValidator() {
    return (group: FormGroup) => {
      const fields = [
        'bpSystolic','bpDiastolic','heartRate','respirationRate','temperature','weight','height','spo2','glucose'
      ];
      const anyFilled = fields.some(k => this.hasValue(group.get(k)?.value));

      const sys = group.get('bpSystolic')?.value;
      const dia = group.get('bpDiastolic')?.value;

      // manage diastolic requiredWithSystolic
      if (this.hasValue(sys) && !this.hasValue(dia)) {
        const ctrl = group.get('bpDiastolic');
        const current = ctrl?.errors || {};
        ctrl?.setErrors({ ...current, requiredWithSystolic: true });
      } else {
        const ctrl = group.get('bpDiastolic');
        if (ctrl?.errors && ctrl.errors['requiredWithSystolic']) {
          const { requiredWithSystolic, ...rest } = ctrl.errors;
          ctrl.setErrors(Object.keys(rest).length ? rest : null);
        }
      }

      // BMI range check (disabled control)
      const bmi = this.vitalSignsForm?.get('bmi')?.value;
      const bmiOut = this.hasValue(bmi) && (!isFinite(Number(bmi)) || Number(bmi) < 10 || Number(bmi) > 70);

      const groupErrors: any = {};
      if (!anyFilled) groupErrors.noMeasurement = true;
      if (bmiOut) groupErrors.bmiOutOfRange = true;

      return Object.keys(groupErrors).length ? groupErrors : null;
    };
  }

  // Optional range validator: passes when empty, errors when outside min/max
  private optionalRange(min: number, max: number) {
    return (control: any) => {
      const v = control?.value;
      if (v === null || v === undefined || String(v).trim() === '') return null;
      const n = Number(v);
      if (!isFinite(n)) return { notNumber: true };
      if (n < min || n > max) return { outOfRange: { min, max } };
      return null;
    };
  }

  private updateBmi(): void {
    const hCm = this.vitalSignsForm.get('height')?.value;
    const wKg = this.vitalSignsForm.get('weight')?.value;
    const bmiCtrl = this.vitalSignsForm.get('bmi');
    const h = Number(hCm);
    const w = Number(wKg);
    if (isFinite(h) && isFinite(w) && h > 0 && w > 0) {
      const hMeters = h / 100;
      const bmi = w / (hMeters * hMeters);
      const rounded = Math.round(bmi);
      if (bmiCtrl?.value !== rounded) {
        bmiCtrl?.setValue(rounded, { emitEvent: false });
      }
    } else {
      if (bmiCtrl?.value !== null) {
        bmiCtrl?.setValue(null, { emitEvent: false });
      }
    }
  }

  toggleSelectAll(): void {
    this.vitalSignsPagedData.forEach((vital: any) => {
      vital.selected = this.selectAll;
    });
  }

  onCheckboxChange(): void {
    this.selectAll = this.vitalSignsPagedData.length > 0 &&
                     this.vitalSignsPagedData.every((vital: any) => vital.selected);
  }

  getSelectedVitals(): any[] {
    return this.vitalSignsPagedData.filter((vital: any) => vital.selected);
  }
}
