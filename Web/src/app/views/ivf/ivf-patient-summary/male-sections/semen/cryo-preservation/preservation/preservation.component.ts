import { Component, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service'
import { CryoStoragePlaceComponent } from '../cryo-storage-place/cryo-storage-place.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Page } from '@/app/shared/enum/dropdown.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CryoStoragePlaceComponent],
  templateUrl: './preservation.component.html',
  styleUrls: ['./preservation.component.scss']
})
export class PreservationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() preservationData: any;
  @Output() saved = new EventEmitter<void>();
  form: FormGroup;
  showStorage: boolean = false;
  hrEmployees: any = [];
  cacheItems: string[] = ['Provider'];
  AllDropdownValues: any = [];
  dropdowns: any = [];
  strawColors: any[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private patientBannerService: PatientBannerService,
    private sharedservice: SharedService,
    private ivfApiService: IVFApiService
  ) {
    this.form = this.fb.group({
      collectionDate: [null],
      collectionTime: [null],
      freezingDate: [null, Validators.required],
      freezingTime: [null, Validators.required],
      patientId: [''],
      cryoContract: [''],
      cryopreservedBy: [''],
      originallyFromClinic: [''],
      storageDate: [null],
      storedBy: [''],
      typeOfMaterial: ['', Validators.required],
      sampleId: [''],
      strawId: [''],
      status: [''],
      numberOfStraws: [1],
      useCryoStorage: [true],
      storagePlace: ['', Validators.required],
      storagePlaceId: [null],
      position: [''],
      colour: [''],
      colour1: [''],
      colour2: [''],
      forResearch: [false],
      reasonForResearch: [''],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.FillCache();
    this.getAlldropdown();
    this.loadStrawColors();
    
    // Disable storagePlace and position fields
    this.form.get('storagePlace')?.disable();
    this.form.get('position')?.disable();
    
    // Subscribe to color changes to update background
    this.form.get('colour1')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // Trigger change detection
    });
    this.form.get('colour2')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // Trigger change detection
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preservationData'] && this.preservationData) {
      this.populateFormWithData();
    }
  }

  populateFormWithData(): void {
    if (!this.preservationData) return;

    // Parse collection date time
    let collectionDate = null;
    let collectionTime = null;
    if (this.preservationData.collectionDateTime) {
      const dt = new Date(this.preservationData.collectionDateTime);
      collectionDate = dt.toISOString().split('T')[0]; // YYYY-MM-DD
      collectionTime = dt.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    }

    // Format patient ID as "ID | Name"
    const patientIdDisplay = this.preservationData.malePatientId && this.preservationData.malePatientName
      ? `${this.preservationData.malePatientId} | ${this.preservationData.malePatientName}`
      : '';

    this.form.patchValue({
      collectionDate: collectionDate,
      collectionTime: collectionTime,
      patientId: patientIdDisplay
    });

    // Disable the fields to make them read-only
    this.form.get('collectionDate')?.disable();
    this.form.get('collectionTime')?.disable();
    this.form.get('patientId')?.disable();

    // If an existing preservation is passed, prefill all relevant fields
    const existing = (this.preservationData as any)?.existingPreservation;
    if (existing) {
      // Helpers to split date/time
      const toDateInput = (dt: string | null) => dt ? new Date(dt).toISOString().split('T')[0] : null;
      const toTimeInput = (dt: string | null) => {
        if (!dt) return null;
        const d = new Date(dt);
        return d.toTimeString().split(' ')[0].substring(0,5);
      };

      // Enable storage fields temporarily
      this.form.get('storagePlace')?.enable();
      this.form.get('position')?.enable();
      this.form.get('storagePlaceId')?.enable();

      this.form.patchValue({
        freezingDate: toDateInput(existing.freezingDateTime),
        freezingTime: toTimeInput(existing.freezingDateTime),
        cryopreservedBy: existing.cryopreservedById ?? null,
        originallyFromClinic: existing.originallyFromClinicId ?? null,
        storageDate: toDateInput(existing.storageDateTime),
        storedBy: existing.storedById ?? null,
        typeOfMaterial: existing.materialTypeId ?? null,
        strawId: existing.strawStartNumber ?? null,
        numberOfStraws: existing.strawCount ?? 0,
        status: existing.statusId ?? null,
        cryoContract: existing.cryoContractId ?? null,
        useCryoStorage: !!existing.preserveUsingCryoStorage,
        storagePlace: existing.preservationCode ?? '',
        storagePlaceId: existing.storagePlaceId ?? null,
        position: existing.position ?? '',
        colour1: existing.colorId ?? null,
        forResearch: !!existing.forResearch,
        reasonForResearch: existing.reasonForResearchId ?? null,
        note: existing.notes ?? ''
      });

      // Disable again
      this.form.get('storagePlace')?.disable();
      this.form.get('position')?.disable();
      this.form.get('storagePlaceId')?.disable();
    }
  }

  loadStrawColors(): void {
    this.ivfApiService.GetAllStrawColors().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.strawColors = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading straw colors:', error);
      }
    });
  }

  getSelectedColor(controlName: string): string {
    const selectedColorId = this.form.get(controlName)?.value;
    if (selectedColorId && this.strawColors.length > 0) {
      const selectedColor = this.strawColors.find(c => c.colorId === selectedColorId);
      return selectedColor ? selectedColor.colorCode : 'transparent';
    }
    return 'transparent';
  }

  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }
  
  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFMaleCryoPreservation).subscribe((res: any) => {
      this.AllDropdownValues = res;
      this.getAllDropdown(res);
      console.log(this.AllDropdownValues);
    })
    this.FillCache();
  }

  opts(key: string) {
    return this.dropdowns?.[key] || [];
  }

   FillCache() {
        this.sharedservice.getCacheItem({ entities: this.cacheItems }).subscribe((response: any) => {
                if (response.cache != null) {
                    this.FillDropDown(response);
                }
            })
    }
    FillDropDown(response: any) {
        let jParse = JSON.parse(JSON.stringify(response)).cache;
        let provider = JSON.parse(jParse).Provider;

        if (provider) {
            provider = provider.map(
                (item: { EmployeeId: any; FullName: any; EmployeeType: any }) => {
                    return {
                        name: item.FullName,
                        providerId: item.EmployeeId,
                        employeeType: item.EmployeeType,
                    };
                },
            );
            this.hrEmployees = provider;
            try {
            } catch {}
        }
    }



  submit() {
    const v = this.form.getRawValue();

    // Combine date and time helpers
    const toDateTime = (dateStr: any, timeStr: any) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      const [hh, mm] = (timeStr || '00:00').split(':');
      d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
      return d.toISOString();
    };

    const existingId = (this.preservationData as any)?.existingPreservation?.cryoPreservationId ?? null;

    // Build payloads for create vs update shapes
    const createPayload = {
      sampleId: this.preservationData?.sampleId ?? 0,
      preservationCode: v.storagePlace || '',
      freezingDateTime: toDateTime(v.freezingDate, v.freezingTime),
      cryopreservedById: Number(v.cryopreservedBy) || null,
      originallyFromClinicId: Number(v.originallyFromClinic) || null,
      storageDateTime: toDateTime(v.storageDate, null),
      storedById: Number(v.storedBy) || null,
      materialTypeId: Number(v.typeOfMaterial) || null,
      strawStartNumber: Number(v.strawId) || null,
      strawCount: Number(v.numberOfStraws) || 0,
      statusId: Number(v.status) || null,
      cryoContractId: Number(v.cryoContract) || null,
      preserveUsingCryoStorage: !!v.useCryoStorage,
      storagePlaceId: Number(v.storagePlaceId) || null,
      position: v.position || '',
      colorId: Number(v.colour1) || null,
      forResearch: !!v.forResearch,
      reasonForResearchId: Number(v.reasonForResearch) || null,
      notes: v.note || '',
      createdBy: 0
    };

    const updatePayload = {
      cryoPreservationId: Number(existingId),
      freezingDateTime: toDateTime(v.freezingDate, v.freezingTime),
      cryopreservedById: Number(v.cryopreservedBy) || null,
      originallyFromClinicId: Number(v.originallyFromClinic) || null,
      storageDateTime: toDateTime(v.storageDate, null),
      storedById: Number(v.storedBy) || null,
      materialTypeId: Number(v.typeOfMaterial) || null,
      strawStartNumber: Number(v.strawId) || null,
      strawCount: Number(v.numberOfStraws) || 0,
      statusId: Number(v.status) || null,
      cryoContractId: Number(v.cryoContract) || null,
      preserveUsingCryoStorage: !!v.useCryoStorage,
      storagePlaceId: Number(v.storagePlaceId) || null,
      position: v.position || '',
      colorId: Number(v.colour1) || null,
      forResearch: !!v.forResearch,
      reasonForResearchId: Number(v.reasonForResearch) || null,
      notes: v.note || '',
      updatedBy: 0,
      preservationCode: v.storagePlace || ''
    };

    this.isSaving = true;
    const request$ = existingId
      ? this.ivfApiService.UpdateCryoPreservation(updatePayload)
      : this.ivfApiService.CreateCryoPreservation(createPayload);

    request$.subscribe({
      next: (res) => {
        console.log('Cryo preservation saved', res);
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: 'Cryo preservation saved successfully',
          timer: 1500,
          showConfirmButton: false
        });
        this.saved.emit();
      },
      error: (err) => {
        console.error('Failed to save cryo preservation', err);
        Swal.fire({
          icon: 'error',
          title: 'Save failed',
          text: 'Unable to save cryo preservation'
        });
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  openStoragePlace(){
    this.showStorage = true;
  }

  onStorageBack() {
    this.showStorage = false;
  }

  onStorageSelected(e: any) {
    if (e) {
      // Enable fields temporarily to set values
      this.form.get('storagePlace')?.enable();
      this.form.get('position')?.enable();
      this.form.get('storagePlaceId')?.enable();

      this.form.patchValue({
        storagePlace: e.storagePlace ?? '',
        storagePlaceId: e.storagePlaceId ?? null,
        position: e.position ?? '',
        colour: e.colour ?? ''
      });

      // Disable fields again
      this.form.get('storagePlace')?.disable();
      this.form.get('position')?.disable();
      this.form.get('storagePlaceId')?.disable();
    }
    this.showStorage = false;
  }

  // teardown
  private destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
