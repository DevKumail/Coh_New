import { Component, OnInit, AfterViewInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent, NgIcon } from '@ng-icons/core';
import { LucideAngularModule, LucideHome, LucideChevronRight, LucideAlertTriangle } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { Subscription, switchMap } from 'rxjs';
import { LoaderService } from '@core/services/loader.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { AllergyDto} from '@/app/shared/Models/Clinical/allergy.model'
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { ClinicalActivityService } from '@/app/shared/Services/clinical-activity.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var flatpickr: any;

@Component({
  selector: 'app-allergies',
  imports: [CommonModule,
    ReactiveFormsModule,
    GenericPaginationComponent,
    FormsModule,
    NgIcon,
    LucideAngularModule,
    TranslatePipe,
    FilledOnValueDirective],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.scss'
})

export class AllergiesComponent implements OnInit, AfterViewInit {
  @Input() clinicalnote: boolean = false;
  @ViewChild('allergyModal') allergyModal!: TemplateRef<any>;
  selectAll: boolean = false;

  private focusFirstInvalidControl(): void {
    try {
      setTimeout(() => {
        const firstInvalid = document.querySelector('.is-invalid, .ng-invalid.ng-touched') as HTMLElement | null;
        firstInvalid?.focus({ preventScroll: true } as any);
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } catch {}
  }
  buttonText: string | undefined;

  // lucide-angular icons for breadcrumb and heading
  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly headingIcon = LucideAlertTriangle;
  todayStr!: string;

    resetForm(): void {
      if (!this.allergyForm) return;
      try {
        const empId = this.SelectedVisit?.employeeId;
        const exists = Array.isArray(this.hrEmployees)
          ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
          : false;
        const defaultProvider = exists ? empId : null;
        this.allergyForm.reset({
          providerId: defaultProvider,
          allergyType: '',
          allergen: '',
          severity: '',
          reaction: '',
          startDate: this.todayStr,
          endDate: '',
          status: 1,
          isProviderCheck: false,
          typeId: '',
          active: true,
          updatedBy: this.userid,
          updatedDate: new Date().toISOString().split('T')[0],
          createdBy: this.userid,
          createdDate: new Date().toISOString().split('T')[0],
          appointmentId: this.appId
        });

        // Re-apply provider default safely
        this.setProviderFromSelectedVisit();
        // Trigger status rules to disable endDate for Active
        this.allergyForm.get('status')?.setValue(1, { emitEvent: true });

        // Mark pristine/untouched
        this.allergyForm.markAsPristine();
        this.allergyForm.markAsUntouched();
        this.id = undefined;
        this.buttonText = undefined;
      } catch (e) {
        console.warn('resetForm failed', e);
      }
    }

  openModal(): void {
    this.resetForm();
    this.modalService.open(this.allergyModal, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  ngAfterViewInit(): void {
    // Initialize date pickers after view is ready
    this.initDatePickers();
  }

  private initDatePickers() {
    const startEl = document.querySelector('#allergyStartDate') as HTMLInputElement | null;
    const endEl = document.querySelector('#allergyEndDate') as HTMLInputElement | null;
    if (!startEl && !endEl) {
      setTimeout(() => this.initDatePickers(), 100);
      return;
    }
    this.ensureFlatpickr().then(() => {
      try {
        if (startEl && !startEl.getAttribute('data-fp-applied')) {
          flatpickr(startEl, {
            dateFormat: 'd/m/Y',
            allowInput: true,
            onChange: (_sd: any, dateStr: string) => {
              this.allergyForm?.patchValue({ startDate: dateStr });
            },
          });
          startEl.setAttribute('data-fp-applied', '1');
        }
        if (endEl && !endEl.getAttribute('data-fp-applied')) {
          flatpickr(endEl, {
            dateFormat: 'd/m/Y',
            allowInput: true,
            onChange: (_sd: any, dateStr: string) => {
              this.allergyForm?.patchValue({ endDate: dateStr });
            },
          });
          endEl.setAttribute('data-fp-applied', '1');
        }
      } catch (e) {
        console.warn('Flatpickr init failed (Allergy):', e);
      }
    });
  }

  private ensureFlatpickr(): Promise<void> {
    return new Promise<void>((resolve) => {
      const w = window as any;
      if (typeof w.flatpickr === 'function') {
        resolve();
        return;
      }
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
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
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
  SearchPatientData: any
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
  private patientDataSubscription: Subscription | undefined;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ClinicalApiService: ClinicalApiService,
    private loader: LoaderService,
    private PatientData: PatientBannerService,
    private clinicalActivityService: ClinicalActivityService,
    private modalService: NgbModal) { }
  statusOptions = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];



  allergyForm!: FormGroup;

  async FillCache() {

    await this.ClinicalApiService.getCacheItem({ entities: ['Provider'] }).then((response: any) => {
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
      try { this.setProviderFromSelectedVisit(); } catch {}

    }
  }
  isSubmitting = false;
  SelectedVisit: any;
  private setProviderFromSelectedVisit(): void {
    try {
      if (!this.allergyForm) { return; }
      const empId = this.SelectedVisit?.employeeId;
      if (!empId) { return; }
      const exists = Array.isArray(this.hrEmployees)
        ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
        : false;
      const ctrl = this.allergyForm.get('providerId');
      if (!ctrl) { return; }
      ctrl.setValue(exists ? empId : null, { emitEvent: false });
      ctrl.markAsDirty();
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity({ onlySelf: true });
    } catch {}
  }
  async ngOnInit(){
    try {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      this.todayStr = `${y}-${m}-${d}`;
    } catch {}
    this.patientDataSubscription = this.PatientData.patientData$
  .pipe(
    filter((data: any) => !!data?.table2?.[0]?.mrNo),
    distinctUntilChanged((prev, curr) =>
      prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
    )
  )
  .subscribe((data: any) => {
    console.log(' Subscription triggered with MRNO:', data?.table2?.[0]?.mrNo);
    this.SearchPatientData = data;
    this.GetPatientAllergyData();
  });


     this.PatientData.selectedVisit$.subscribe((data: any) => {
        this.SelectedVisit = data;
        console.log('Selected Visit medical-list', this.SelectedVisit);
        if (this.SelectedVisit) {
          this.setProviderFromSelectedVisit();
        }
      });


    await this.FillCache();
    await this.GetAlergyType();
    await this.GetSeverityType();
    await this.initForm();
    // If a visit is already selected, default provider to SelectedVisit.employeeId
    this.setProviderFromSelectedVisit();
    // Default Start Date to today
    try { this.allergyForm.get('startDate')?.setValue(this.todayStr); } catch {}
    await this.GetPatientAllergyData();

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

    // Defer picker initialization until the form and template are in the DOM
    setTimeout(() => this.initDatePickers(), 0);
  }





  async GetPatientAllergyData() {
    // this.loader.show();
    this.allergieTotalItems = 0;
    const mrno = this.SearchPatientData.table2[0].mrNo
    if(!mrno){
      // Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      // this.loader.hide();
      return;
    }
    // this.loader.show();

    await this.ClinicalApiService.GetPatientAllergyData(mrno, this.pagegination.currentPage, this.pagegination.pageSize ).then((res: any) => {
      console.log('res', res);
      // this.loader.hide();
      this.MyAllergiesData = res.allergys?.table1 || [];
      this.allergieTotalItems = res.allergys?.table2[0]?.totalCount || 0;
    })
    // this.loader.hide();

  }

  async GetAlergyType() {
    // this.loader.show();
    console.log('init');
    await this.ClinicalApiService.GetAlergyType().then((res: any) => {
      console.log(res);
      this.GetAlergy = res.result;
      this.loader.hide();
      console.log('GetAlergy =>', res.result)
    })
    this.loader.hide();
  }
  async GetProviderType() {
    // this.loader.show();
    await this.ClinicalApiService.GetAlergyByProviderId().subscribe((res: any) => {
      this.hrEmployees = res.result;
      this.loader.hide();
    })
    // this.loader.show();
  }
  async GetSeverityType() {
    // this.loader.show();
    await this.ClinicalApiService.GetSeverity().then((res: any) => {
      this.GetSeverity = res.result;
      console.log('GetSeverity', this.GetSeverity);
      this.loader.hide();
    }).catch((error: any) => {
      this.loader.hide();
      console.error('Error:', error);
    });
    this.loader.hide();
  }

  initForm() {
  this.allergyForm = this.fb.group({
    providerId: [null, Validators.required],
    allergyType: ['', Validators.required],
    allergen: ['', Validators.required],
    severity: ['', Validators.required],
    reaction: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    status: [1, Validators.required],
    isProviderCheck: [false],
    typeId: [''],
    active: [true],
    updatedBy: [this.userid],
    updatedDate: [new Date().toISOString().split('T')[0]],
    createdBy: [this.userid],
    createdDate: [new Date().toISOString().split('T')[0]],
    appointmentId: [this.userid]
  });
  // Apply reactive enable/disable + validators for endDate based on status (Inactive=0)
  const endCtrl = this.allergyForm.get('endDate');
  const statusCtrl = this.allergyForm.get('status');
  const applyStatusRules = (val: any) => {
    const v = Number(val);
    if (v === 0) {
      endCtrl?.enable({ emitEvent: false });
      endCtrl?.setValidators([Validators.required]);
    } else {
      endCtrl?.reset('', { emitEvent: false });
      endCtrl?.clearValidators();
      endCtrl?.disable({ emitEvent: false });
    }
    endCtrl?.updateValueAndValidity({ onlySelf: true });
  };
  applyStatusRules(statusCtrl?.value);
  statusCtrl?.valueChanges.subscribe(applyStatusRules);
}

  alertForm!: FormGroup;


  // mrno = "1006";

submit() {
    console.log( 'this.allergyForm =>',this.allergyForm.value);

  if (this.allergyForm.invalid) {
  this.allergyForm.markAllAsTouched(); // show validation messages
  this.focusFirstInvalidControl();
  Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
    return;
  }

  if(this.SearchPatientData == undefined){
    // Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
    return;
  }


  this.isSubmitting = true;

  const formValue = this.allergyForm.value;

  // Parse dd/MM/yyyy to Date and then to yyyy-MM-dd string for backend
  const parseDMYToDate = (input: any): Date | null => {
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
  };
  const toYMD = (d: Date | null): string => {
    if (!d) return '';
    const adj = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return adj.toISOString().slice(0, 10);
  };

  const sd = parseDMYToDate(formValue.startDate);
  const ed = parseDMYToDate(formValue.endDate);
  if (!sd) {
    Swal.fire('Validation Error', 'Please enter a valid Start Date (dd/MM/yyyy).', 'warning');
    this.isSubmitting = false;
    return;
  }
  // Only validate end date when status is Inactive (0)
  if (Number(formValue.status) === 0) {
    if (!ed) {
      Swal.fire('Validation Error', 'Please enter a valid End Date (dd/MM/yyyy).', 'warning');
      this.isSubmitting = false;
      return;
    }
    if (ed < sd) {
      Swal.fire('Validation Error', 'End Date cannot be earlier than Start Date.', 'warning');
      this.isSubmitting = false;
      return;
    }
  }

  const payload: AllergyDto = {
    allergyid: this.id || 0,
    typeId: formValue.allergyType,
    allergen: formValue.allergen,
    severityCode: formValue.severity,
    reaction: formValue.reaction,
    startDate: toYMD(sd),
    endDate: toYMD(ed),
    status: formValue.status,
    // OldMrno: this.SearchPatientData?.table2?.length ? this.SearchPatientData.table2[0].mrNo : 0,
    active: true,
    updatedBy: this.userid,
    updatedDate: new Date().toISOString().split('T')[0],
    providerId: formValue.providerId,
    mrno: this.SearchPatientData?.table2?.length ? this.SearchPatientData.table2[0].mrNo : 0,
    createdBy: this.userid,
    createdDate: new Date().toISOString().split('T')[0],
    appointmentId: this.userid
  };

  this.ClinicalApiService.SubmitPatientAllergies(payload).then(() => {
    this.DropFilled();
    this.GetPatientAllergyData();
    this.isSubmitting = false;

    // Emit clinical activity
    const providerName = this.hrEmployees.find(p => p.providerId === formValue.providerId)?.name || 'Unknown Provider';
    const allergyTypeName = this.GetAlergy?.find((a: any) => a.alergyTypeId === formValue.allergyType)?.alergyName || formValue.allergyType;
    const severityName = this.GetSeverity?.find((s: any) => s.id === formValue.severity)?.severityName || formValue.severity;
    this.clinicalActivityService.addActivity({
      timestamp: new Date(),
      activityType: this.id ? 'update' : 'create',
      module: 'Allergy',
      providerName: providerName,
      mrNo: this.SearchPatientData?.table2?.[0]?.mrNo || '',
      patientName: this.SearchPatientData?.table2?.[0]?.patientName || '',
      details: payload,
      summary: `${allergyTypeName} - ${formValue.allergen} (${formValue.reaction || 'No reaction noted'}) - Severity: ${severityName || 'Not specified'}`
    });

    // Close modal after successful submission
    this.modalService.dismissAll();

    Swal.fire('Success', 'Allergies Successfully Created', 'success');
  }).catch((error: any) => {
    this.isSubmitting = false;
    Swal.fire('Error', error.message || 'Something went wrong', 'error');
  }).finally(() => {
    this.isSubmitting = false;
  });
}




  formatDate(date: string): string {
    return date ? date.split('T')[0] : '';
  }

  private formatDateDMY(value: any): string {
    try {
      const d = new Date(value);
      if (!isFinite(d.getTime())) return '';
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch { return ''; }
  }

  private formatDateYMDForInput(value: any): string {
    try {
      if (!value) return '';
      const d = new Date(value);
      if (!isFinite(d.getTime())) return '';
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch { return ''; }
  }


  onCheckboxChange2() {
     ;
    this.isProviderCheck
    const isChecked = this.isProviderCheck; // Get the checked state
    this.isProviderCheck = isChecked;
    console.log('providerCheck Checkbox Value:', this.isProviderCheck);
  }
  DropFilled() {
    const empId = this.SelectedVisit?.employeeId;
    const exists = Array.isArray(this.hrEmployees)
      ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
      : false;
    const defaultProvider = exists ? empId : null;
    this.allergyForm.reset({
      providerId: defaultProvider,
      allergyType: '',
      allergen: '',
      severity: '',
      reaction: '',
      startDate: this.todayStr,
      endDate: '',
      status: 1, // Active by default
      isProviderCheck: false,
      typeId: '',
      active: true,
      updatedBy: this.userid,
      updatedDate: new Date().toISOString().split('T')[0],
      createdBy: this.userid,
      createdDate: new Date().toISOString().split('T')[0],
      appointmentId: this.appId
    });

    // Ensure provider default is applied if form already exists
    this.setProviderFromSelectedVisit();

    // Trigger status rules to disable endDate for Active
    try {
      const statusCtrl = this.allergyForm.get('status');
      statusCtrl?.setValue(1, { emitEvent: true });
    } catch {}

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
        this.loader.show();
        this.ClinicalApiService.DeleteAllergy(id)
          .then((res: any) => {
            this.DropFilled();
            this.GetPatientAllergyData();
            this.loader.hide();
            Swal.fire({
              title: 'Deleted!',
              text: 'Allergy has been successfully deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          })
          .catch((error) => {
            this.loader.hide();
            Swal.fire({
              title: 'Error!',
              text: error.message || 'Something went wrong.',
              icon: 'error'
            });
          });
      }
    });
    this.loader.hide();

  }


editAllergy(allergy: any) {

  console.log('Editing Allergy:', allergy);
  this.buttonText = 'Update';
  this.id = allergy.allergyId;
  this.allergyForm.patchValue({
    providerId: allergy.providerId,
    allergyType: allergy.typeId,
    allergen: allergy.allergen,
    severity: allergy.severity,
    reaction: allergy.reaction,
    startDate: this.formatDateYMDForInput(allergy.startDate),
    endDate: this.formatDateYMDForInput(allergy.endDate),
    status: allergy.status === 'Active' ? 1 : 0
  });

  // Open modal for editing
  this.modalService.open(this.allergyModal, {
    size: 'xl',
    centered: true,
    backdrop: 'static'
  });
}

  ngOnDestroy(){
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }
  }


pagegination : any = {
  currentPage: 1,
  pageSize: 10,
}
allergieTotalItems = 0;
pagedallergie: any[] = [];

async onallergiePageChanged(page: number) {
  this.pagegination.currentPage = page;
  await this.GetPatientAllergyData();
}


  get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }

  toggleSelectAll(): void {
    this.MyAllergiesData.forEach(allergy => {
      allergy.selected = this.selectAll;
    });
  }

  onCheckboxChange(): void {
    this.selectAll = this.MyAllergiesData.length > 0 &&
                     this.MyAllergiesData.every(allergy => allergy.selected);
  }

  getSelectedAllergies(): any[] {
    return this.MyAllergiesData.filter(allergy => allergy.selected);
  }

}
