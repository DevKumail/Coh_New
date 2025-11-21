import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CryoStoragePlaceComponent } from '../cryo-storage-place/cryo-storage-place.component';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';

@Component({
  selector: 'app-preservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CryoStoragePlaceComponent],
  templateUrl: './preservation.component.html',
  styleUrls: ['./preservation.component.scss']
})
export class PreservationComponent implements OnChanges {
  @Input() preservationData: any;
  form: FormGroup;
  showStorage: boolean = false;
  hrEmployees: any = [];
  cacheItems: string[] = ['Provider'];
  AllDropdownValues: any = [];
  dropdowns: any = [];
  strawColors: any[] = [];

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
    this.form.get('colour1')?.valueChanges.subscribe(() => {
      // Trigger change detection
    });
    this.form.get('colour2')?.valueChanges.subscribe(() => {
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



  submit() {}

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
      
      this.form.patchValue({
        storagePlace: e.storagePlace ?? '',
        position: e.position ?? '',
        colour: e.colour ?? ''
      });
      
      // Disable fields again
      this.form.get('storagePlace')?.disable();
      this.form.get('position')?.disable();
    }
    this.showStorage = false;
  }
}
