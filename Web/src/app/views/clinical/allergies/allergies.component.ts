import { Component, OnInit, AfterViewInit } from '@angular/core';
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

declare var flatpickr: any;

@Component({
  selector: 'app-allergies',
  imports: [CommonModule,
    ReactiveFormsModule,
    GenericPaginationComponent,
    FormsModule,
    NgIcon,
    LucideAngularModule,
    TranslatePipe],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.scss'
})

export class AllergiesComponent implements OnInit, AfterViewInit {
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

    resetForm(): void {
      if (!this.allergyForm) return;
      try {
        Object.keys(this.allergyForm.controls).forEach(key => {
          const control = this.allergyForm.get(key);
          control?.setValue("");
          control?.markAsPristine();
          control?.markAsUntouched();
        });
        this.allergyForm.markAsPristine();
        this.allergyForm.markAsUntouched();
        this.id = undefined;
        this.buttonText = undefined;
      } catch (e) {
        console.warn('resetForm failed', e);
      }
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
    private PatientData: PatientBannerService) { }
  statusOptions = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }, { id: 2, name: "All" }];



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

    }
  }
  isSubmitting = false;

  async ngOnInit(){
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

    await this.FillCache();
    await this.GetAlergyType();
    await this.GetSeverityType();
    await this.initForm();
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
    this.loader.show();
    if(this.SearchPatientData == undefined){
      Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      this.loader.hide();
      return;
    }
    this.loader.show();
    debugger
    console.log( 'mrNo =>',this.SearchPatientData.table2[0].mrNo);

    await this.ClinicalApiService.GetPatientAllergyData
    (this.SearchPatientData?.table2?.length ? this.SearchPatientData.table2[0].mrNo : 0,).then((res: any) => {
      console.log('res', res);
      this.loader.hide();
      this.MyAllergiesData = res.allergys?.table1 || [];
      this.allergieTotalItems = this.MyAllergiesData.length;
      this.onallergiePageChanged(1)
      this.filteredDiagnosisData = this.MyAllergiesData || [];
      console.log('this.MyAllergiesData', this.MyAllergiesData);
    })
    this.loader.hide();

  }

  async GetAlergyType() {
    this.loader.show();
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
    this.loader.show();
    await this.ClinicalApiService.GetAlergyByProviderId().subscribe((res: any) => {
      this.hrEmployees = res.result;
      this.loader.hide();
    })
    this.loader.show();
  }
  async GetSeverityType() {
    this.loader.show();
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
    providerId: ['', Validators.required],
    allergyType: ['', Validators.required],
    allergen: ['', Validators.required],
    severity: ['', Validators.required],
    reaction: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['', Validators.required],
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
    Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
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
  if (!sd || !ed) {
    Swal.fire('Validation Error', 'Please enter valid dates in dd/MM/yyyy format.', 'warning');
    this.isSubmitting = false;
    return;
  }
  if (ed < sd) {
    Swal.fire('Validation Error', 'End Date cannot be earlier than Start Date.', 'warning');
    this.isSubmitting = false;
    return;
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
  debugger
  console.log('Editing Allergy:', allergy);
  this.buttonText = 'Update';
  this.id = allergy.allergyId;
  this.allergyForm.patchValue({
    providerId: allergy.providerId,
    allergyType: allergy.typeId,
    allergen: allergy.allergen,
    severity: allergy.severity,
    reaction: allergy.reaction,
    startDate: this.formatDateDMY(allergy.startDate),
    endDate: this.formatDateDMY(allergy.endDate),
    status: allergy.status === 'Active' ? 1 : 2
  });
}

  ngOnDestroy(){
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }
  }


allergieCurrentPage = 1;
allergiePageSize = 5;
allergieTotalItems = 0;
pagedallergie: any[] = [];

async onallergiePageChanged(page: number) {
  this.allergieCurrentPage = page;
  this.setPagedallergieData();
  // await this.GetPatientAllergyData();
}

setPagedallergieData() {
  const startIndex = (this.allergieCurrentPage - 1) * this.allergiePageSize;
  const endIndex = startIndex + this.allergiePageSize;
  this.pagedallergie = this.MyAllergiesData.slice(startIndex, endIndex);

}

  get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }

}
