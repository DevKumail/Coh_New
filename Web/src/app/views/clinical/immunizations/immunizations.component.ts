import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { NgIconComponent } from '@ng-icons/core';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-immunizations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    GenericPaginationComponent,
    NgIconComponent,
    FilledOnValueDirective
  ],
  templateUrl: './immunizations.component.html',
  styleUrls: ['./immunizations.component.scss']
})
export class ImmunizationsComponent implements OnInit {
  @Input() clinicalnote: boolean = false;
  @Output() selectionChanged = new EventEmitter<any[]>();
  @Input() set preSelectedIds(ids: number[]) {
    if (ids && ids.length > 0) {
      this.pendingSelections = [...ids];
      if (this.ImmunizationData.length > 0) {
        this.applyPendingSelections();
      }
    }
  }
  private pendingSelections: number[] = [];
  selectAll: boolean = false;
  @ViewChild('immunizationModal') immunizationModal!: TemplateRef<any>;
  buttonText = 'Save';
  ImmunizationForm!: FormGroup;
  providers: any[] = [];
  siteOptions: any[] = [];
  RouteOptions: any[] = [];
  filteredDiagnosisData: any[] = [];
  private patientDataSubscription!: Subscription;

  Active = [{ id: 1, name: 'Active' }, { id: 0, name: 'InActive' }];
  ActiveStatus = [
    { id: 1, name: 'Active' },
    { id: 0, name: 'InActive' },
  ];

  hrEmployees: any[] = [];
  selectedProvider: any;
  appId: any;
  Mrno: any;
  PatientId: any;
  providerCheck: any;
  user: any;
  siteId: any;
  immunization: any = {};
  SearchPatientData: any;
  SelectedVisit : any
  isSubmitting: boolean = false;
  constructor(
    private clinical: ClinicalApiService,
    private fb: FormBuilder,
    private PatientData: PatientBannerService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // Get current date in yyyy-MM-dd format
    const today = new Date();
    const currentDate = today.getFullYear() + '-' +
                        String(today.getMonth() + 1).padStart(2, '0') + '-' +
                        String(today.getDate()).padStart(2, '0');

    // Build Reactive Form mirroring Medication style
    this.ImmunizationForm = this.fb.group({
      isProviderCheck: [false],
      providerDescription: [''],
      providerId: [null, Validators.required], // Required by default (inside clinic)
      immTypeId: [null, Validators.required],
      comments: [''],
      dose: [''],
      manufacturerName: [''],
      lotNumber: [''],
      startDate: [currentDate], // Set default current date
      expiryDate: [''],
      nextInjectionDate: [''],
      description: [''],
      SiteInjection: [null],
      routeId: [null],
      status: [1],
      ActiveStatus: [1]
    });


    this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) =>
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )
      )
      .subscribe((data: any) => {
        this.SearchPatientData = data;
        // Set MRNO from banner
        this.Mrno = this.SearchPatientData?.table2?.[0]?.mrNo || '';
        this.PatientId = this.SearchPatientData?.table2?.[0]?.patientId || '';
        // After assigning,
        this.GetPatientImmunizationData();
      });


      this.PatientData.selectedVisit$.subscribe((data: any) => {
        this.SelectedVisit = data;
        console.log('Selected Visit medical-list', this.SelectedVisit);
        if (this.SelectedVisit) {
            this.appId = this.SelectedVisit?.appointmentId || '';

          this.setProviderFromSelectedVisit();
        }
      });

    this.setProviderFromSelectedVisit();
    this.GetPatientImmunizationData();



    // Toggle provider inputs and validations
    const isProviderCtrl = this.ImmunizationForm.get('isProviderCheck');
    const providerIdCtrl = this.ImmunizationForm.get('providerId');
    const providerDescCtrl = this.ImmunizationForm.get('providerDescription');
    isProviderCtrl?.valueChanges.subscribe((isOutside: boolean) => {
      if (isOutside) {
        // Outside clinic - make providerDescription required, remove providerId validation
        providerIdCtrl?.clearValidators();
        providerIdCtrl?.setValue(null);
        providerIdCtrl?.markAsPristine();
        providerIdCtrl?.markAsUntouched();
        providerIdCtrl?.updateValueAndValidity();

        providerDescCtrl?.setValidators([Validators.required]);
        providerDescCtrl?.updateValueAndValidity();
      } else {
        // Inside clinic - make providerId required, remove providerDescription validation
        providerDescCtrl?.clearValidators();
        providerDescCtrl?.setValue('');
        providerDescCtrl?.markAsPristine();
        providerDescCtrl?.markAsUntouched();
        providerDescCtrl?.updateValueAndValidity();

        providerIdCtrl?.setValidators([Validators.required]);
        providerIdCtrl?.updateValueAndValidity();
      }
    });

    this.GetEMRSite();
    this.GetEMRRoute();
    this.FillCache();
    this.GetImmunizationType();




    this.user = sessionStorage.getItem('userId');

    this.GetPatientImmunizationData();
    this.ImmunizationForm.patchValue({ ActiveStatus: 1 });
  }


   openModal(): void {
    this.DropFilled();
    this.modalService.open(this.immunizationModal, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  private setProviderFromSelectedVisit(): void {
    try {
      if (!this.ImmunizationForm) { return; }
      const empId = this.SelectedVisit?.employeeId;
      if (!empId) { return; }
      const exists = Array.isArray(this.hrEmployees)
        ? this.hrEmployees.some((p: any) => String(p?.providerId) === String(empId))
        : false;
      const ctrl = this.ImmunizationForm.get('providerId');
      if (!ctrl) { return; }
      ctrl.setValue(exists ? empId : null, { emitEvent: false });
      ctrl.markAsDirty();
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity({ onlySelf: true });
    } catch {}
  }

  GetEMRSite() {
    this.clinical
      .GetSite()
      .then((res: any) => {
        this.siteOptions = res.result;
      })
      .catch((error: any) => {
        console.error('Error fetching site options', error);
      });
  }

  GetEMRRoute() {
    this.clinical
      .GetRoute()
      .then((res: any) => {
        this.RouteOptions = res.result;
      })
      .catch((error: any) => {
        console.error('Error fetching route options', error);
      });
  }

  getImmunization: any = [];
  selectedImmunization: any = {};
  GetImmunizationType() {
    this.clinical.GetImmunizationType().then((res: any) => {
      this.getImmunization = res.result;
    });
  }

  FillCache() {
    this.clinical
      .getCacheItem({ entities: ['Provider'] })
      .then((response: any) => {
        if (response.cache != null) {
          this.FillDropDown(response);
        }
      })
      .catch((error: any) => {
        console.error('Error loading cache', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || 'Error loading cache'
        });
      });
  }

  FillDropDown(response: any) {
    const jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;

    if (provider) {
      provider = provider.map((item: { EmployeeId: any; FullName: any }) => {
        return {
          name: item.FullName,
          providerId: item.EmployeeId,
        };
      });
      this.hrEmployees = provider;
      try { this.setProviderFromSelectedVisit(); } catch {}

    }
  }

  onProviderChange(event: any) {
    const val = event?.target?.value ?? event;
    this.selectedProvider = val;
  }
id: any
onEdit(data: any) {
  this.id = data.id
  // Helper: Convert any date/time to yyyy-MM-dd for date input
  const formatToDateInput = (val: any): string | null => {
    if (!val) return null;
    const s = String(val);
    if (s.includes('T')) return s.split('T')[0]; // Handles ISO format
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  // Determine if provider is outside or internal
  const isOutside = !!data?.providerName || (data?.providerId === 0) || !!data?.providerDescription;

  // Patch form values
  this.ImmunizationForm.patchValue({
    isProviderCheck: isOutside,
    providerDescription: isOutside ? (data?.providerName || data?.providerDescription || '') : '',
    providerId: isOutside ? null : (data?.providerId ?? null),

    immTypeId: data?.immTypeId ?? null,
    comments: data?.comments ?? '',
    dose: data?.dose ?? '',
    manufacturerName: data?.manufacturerName ?? '',
    lotNumber: data?.lotNumber ?? '',

    startDate: formatToDateInput(data?.startDate),
    expiryDate: formatToDateInput(data?.expiryDate),
    nextInjectionDate: formatToDateInput(data?.nextInjectionDate),

    description: data?.description ?? '',
    SiteInjection: data?.siteInjection ?? null,
    routeId: data?.routeId ?? null,

    status: data?.status === 1 || data?.status === 'Active' ? 1 : 0,
    ActiveStatus: data?.active ? 1 : 0
  });

  console.log('Form Patched:', this.ImmunizationForm.value);
}



  onCheckboxChange2() {
    const isChecked = this.providerCheck;
    this.providerCheck = isChecked;
    console.log('providerCheck Checkbox Value:', isChecked);
  }

  DropFilled() {
    // Get current date in yyyy-MM-dd format
    const today = new Date();
    const currentDate = today.getFullYear() + '-' +
                        String(today.getMonth() + 1).padStart(2, '0') + '-' +
                        String(today.getDate()).padStart(2, '0');

    this.ImmunizationForm.reset();
    this.ImmunizationForm.patchValue({
      status: 1,
      ActiveStatus: 1,
      isProviderCheck: false,
      startDate: currentDate // Reset to current date
    });
  }

  submit() {
    if (this.ImmunizationForm.invalid) {
      this.ImmunizationForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Please fill all required fields.'
      });
      return;
    }

    const v = this.ImmunizationForm.value;
    this.isSubmitting = true;

    if(v.isProviderCheck){
      var payload: any = {
      id : this.id || 0,
      providerId: null,
      providerName: v.isProviderCheck ? v.providerDescription : '',
      immTypeId: v.immTypeId,
      comments: v.comments,
      description: v.description,
      manufacturerName: v.manufacturerName,
      updatedBy: this.user,
      mrno: this.Mrno,
      patientId: this.PatientId,
      AppointmentId: this.appId,
      status: v.status,
      createdBy: this.user,
      UpdatedBy: this.user
    };
    } else {
    var payload: any = {
      id : this.id || 0,
      providerId: v.isProviderCheck ? 0 : v.providerId,
      providerName: v.isProviderCheck ? v.providerDescription : '',
      immTypeId: v.immTypeId,
      comments: v.comments,
      dose: v.dose,
      manufacturerName: v.manufacturerName,
      lotNumber: v.lotNumber,
      startDate: v.startDate,
      expiryDate: v.expiryDate,
      nextInjectionDate: v.nextInjectionDate,
      description: v.description,
      siteInjection: v.SiteInjection,
      routeId: v.routeId,
      status: v.status,
      mrno: this.Mrno,
      patientId: this.PatientId,
      AppointmentId: this.appId,
      createdBy: this.user,
      UpdatedBy: this.user
    };
}


    this.clinical
      .InsertOrUpdatePatientImmunization(payload)
      .then(() => {
        this.DropFilled();
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Immunization successfully created'
        });
        this.GetPatientImmunizationData();
        this.id = 0;
      })
      .catch((error: any) => Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Error creating immunization'
      }))
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  ImmunizationData: any[] = [];

  paginationInfo: any = {
    PageNumber: 1,
    PageSize: 10,
  }
  totalimmunizationCount: any = 0;
  GetPatientImmunizationData() {
    const status = this.ImmunizationForm.get('ActiveStatus')?.value;
    this.clinical.GetPatientImmunizationData(this.Mrno, this.paginationInfo.PageNumber, this.paginationInfo.PageSize, status).then((res: any) => {
      this.ImmunizationData = res.patient?.table1 || [];
      this.totalimmunizationCount = res.patient?.table2?.[0]?.totalRecords || 0;
      
      // Apply pending selections after data loads
      if (this.pendingSelections.length > 0) {
        this.applyPendingSelections();
      }
    });
  }

  onImmunizationPageChanged(event: any) {
    this.paginationInfo.PageNumber = event;
    this.GetPatientImmunizationData();
  }


  delete(id: number) {
    Swal.fire({
      icon: 'question',
      title: 'Are you sure?',
      text: 'Do you want to delete this immunization?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clinical.DeleteImmunization(id).then(() => {
          this.DropFilled();
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Immunization successfully deleted'
          });
          this.GetPatientImmunizationData();
        })
          .catch((error: any) => Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.message || 'Error deleting immunization'
          }));
      }
    });
  }

  onStatusChange() {
    this.paginationInfo.PageNumber = 1;
    this.GetPatientImmunizationData();
  }

  toggleSelectAll(): void {
    this.ImmunizationData.forEach((immunization: any) => {
      immunization.selected = this.selectAll;
    });
    this.emitSelectionChange();
  }

  onCheckboxChange(): void {
    this.selectAll = this.ImmunizationData.length > 0 &&
                     this.ImmunizationData.every((immunization: any) => immunization.selected);
    this.emitSelectionChange();
  }

  getSelectedImmunizations(): any[] {
    return this.ImmunizationData.filter((immunization: any) => immunization.selected);
  }

  emitSelectionChange(): void {
    const selectedItems = this.getSelectedImmunizationsForNote();
    this.selectionChanged.emit(selectedItems);
  }

  getSelectedImmunizationsForNote(): any[] {
    return this.ImmunizationData
      .filter((immunization: any) => immunization.selected)
      .map((immunization: any) => ({
        immunizationId: immunization.id,
        providerName: immunization.fullName || immunization.providerName,
        isOutsideClinic: !immunization.fullName,
        immTypeName: immunization.immTypeName,
        dose: immunization.dose,
        routeName: immunization.routeName,
        startDate: immunization.startDate,
        nextInjectionDate: immunization.nextInjectionDate,
        siteName: immunization.siteName,
        status: immunization.status
      }));
  }

  clearSelection(): void {
    this.selectAll = false;
    this.ImmunizationData.forEach((immunization: any) => {
      immunization.selected = false;
    });
    this.emitSelectionChange();
  }

  private applyPendingSelections(): void {
    if (this.pendingSelections.length > 0) {
      this.ImmunizationData.forEach((immunization: any) => {
        if (this.pendingSelections.includes(immunization.id)) {
          immunization.selected = true;
        }
      });
      this.selectAll = this.ImmunizationData.length > 0 &&
                       this.ImmunizationData.every((immunization: any) => immunization.selected);
      this.pendingSelections = [];
      this.emitSelectionChange();
    }
  }
}
