import { TemporaryPatientDemographicApiServices } from '@/app/shared/Services/TemporaryDempographics/temporarydemographic.api.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { LucideAngularModule, LucideHome, LucideChevronRight, LucideIdCard, LucideSave, LucideX } from 'lucide-angular';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FilePondModule } from 'ngx-filepond';
import { OnInit } from '@angular/core';
import   Swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { NgxDaterangepickerBootstrapDirective} from "ngx-daterangepicker-bootstrap";
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask'
import { TempdemographicDto } from '@/app/shared/Models/registration/Tempdemo/Tempdemographic.model';
import { SecureStorageService } from '@core/services/secure-storage.service';

declare var flatpickr: any;

@Component({
  selector: 'app-temporary-demographics',
  standalone: true,
  imports: [
        CommonModule,NgxMaskDirective,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        LucideAngularModule,
        FilePondModule,
        NgbNavModule,NgxMaskDirective],


        providers: [
    provideNgxMask()
  ],
  templateUrl: './temporary-demographics.component.html',
  styleUrl: './temporary-demographics.component.scss'
})


export class TemporaryDemographicsComponent implements OnInit {

@ViewChild('picker') picker!: NgxDaterangepickerBootstrapDirective;

  // lucide-angular icons for breadcrumb, heading, and buttons
  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly headingIcon = LucideIdCard;
  protected readonly saveIcon = LucideSave;
  protected readonly cancelIcon = LucideX;

  temporaryForm!: FormGroup;
  activeTabId = 1;

  titles: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  nationality: any[] = [];
  personSexId: any[] = [];
  relationships: any[] = [];

  // UI State
  CarrierId: any;
  ShowAccordian: boolean = true;
  SelectAccordian: boolean = false;
  isDisabled: boolean = false;
  tempid!: number;
  TemporaryDemographic: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private secureStorage: SecureStorageService,
    private TemporaryPatientDemographicApiServices: TemporaryPatientDemographicApiServices,
  ) {}

   ngOnInit() {
    this.TemporaryDemographic = {};
    this.initializeForm();

    // Auto-calc age when DOB changes
    const dobCtrl = this.temporaryForm.get('patientBirthDate');
    if (dobCtrl) {
      dobCtrl.valueChanges.subscribe((val: any) => {
        const age = this.calculateAge(val);
        const ageCtrl = this.temporaryForm.get('personAge');
        if (ageCtrl) ageCtrl.setValue(isNaN(age) ? '' : age, { emitEvent: false });
      });
    }

    this.FillCache();

   debugger
        // Prefer Router navigation state; fallback to window.history.state for refresh/reuse
        const nav = this.router.getCurrentNavigation();
        const navState: any = nav?.extras?.state ?? (window.history && (window.history.state as any)) ?? {};
        const stateId = navState?.tempId;
        const stateTemp = navState?.temp;

        // Fallback to secure storage on page refresh
        const storedId = this.secureStorage.getItem('tempEditId');

        if (stateId != null) {
            this.tempid = Number(stateId);
        } else if (storedId) {
            this.tempid = Number(storedId);
        }

        // If a full temp object is provided via state, prefill the form
        if (stateTemp) {
          // Keep a copy for submit fallbacks (e.g., NOK IDs when fields hidden)
          this.TemporaryDemographic = stateTemp;
          this.prefillFromTemp(stateTemp);
          // Populate dependent dropdowns if IDs exist
          this.prefillRegion(stateTemp);
        } else if (this.tempid) {
          // Fallback: load from API by id (e.g., on page refresh)
          this.loadTempById(this.tempid);
        }

        // Clear once consumed to avoid stale usage
        if (this.tempid) {
            this.secureStorage.removeItem('tempEditId');
            // this.GetTempDemographicsByTempId(this.tempid); // TODO: load details into form
        }
  }



  initializeForm() {
    this.temporaryForm = this.fb.group({
      tempId: [{ value: '', disabled: true }],
      personTitleId: [null],
      personFirstName: ['', Validators.required],
      personMiddleName: [''],
      personLastName: ['', Validators.required],
      personSex: [null, Validators.required],
      patientBirthDate: [null, Validators.required],
      personAge: [''],
      personHomePhone1: [''],
      personWorkPhone1: [''],
      streetNumber: [''],
      dwellingNumber: [''],
      personZipCode: [''],
      selectedCountry: [null],
      selectedState: [null],
      selectedCity: [null],
      nationality: [null],
      personCellPhone: ['', Validators.required],
      personEmail: [''],
      nokFirstName: [''],
      nokMiddleName: [''],
      nokLastName: [''],
      nokRelationshipId: [0],
      nokSocialSecurityNo: [''],
      nokZipCode: [''],
      nokHomePhone: [''],
      nokWorkPhone: [''],
      nokCellNo: [''],
      nokAddress1: [''],
      nokAddress2: [''],
      selectedCountryNOK: [null],
      selectedStateNOK: [null],
      selectedCityNOK: [null],
      comments: [''],
      createdBy: [''],
      updatedBy: [''],
      active: [true]
    });
  }

  async FillCache(): Promise<void> {
    try {
      const response: any = await this.TemporaryPatientDemographicApiServices.getCacheItem({
        entities: [
          'RegTitle',
          'RegGender',
          'RegCountries',
          'Nationality',
          'RegStates',
          'RegCities',
        ],
      });
      if (response?.cache) {
        this.FillDropDown(response.cache);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  }

  FillDropDown(cache: any) {
    const parsed = JSON.parse(cache);

    if (parsed.RegCountries) {
      this.countries = parsed.RegCountries.map((item: any) => ({
        name: item.Name,
        code: item.CountryId
      })).slice(0, 100);
    }

    if (parsed.Nationality) {
      this.nationality = parsed.Nationality.map((item: any) => ({
        name: item.NationalityName,
        code: item.NationalityId
      })).slice(0, 100);
    }

    if (parsed.states) {
      this.states = parsed.states.map((item: any) => ({
        name: item.StateName,
        code: item.StateId
      })).slice(0, 100);
    }

    if (parsed.RegGender) {
      this.personSexId = parsed.RegGender.map((item: any) => ({
        name: item.Gender,
        code: item.GenderId
      }));
    }

    if (parsed.RegRelationShip) {
      this.relationships = parsed.RegRelationShip.map((item: any) => ({
        name: item.Relation,
        code: item.RelationId
      }));
    }

    this.titles = [
      { name: 'Mr', code: 1 },
      { name: 'Mrs', code: 2 }
    ];
  }



  mapToDropdown(data: any[], valueField: string, labelField: string): any[] {
    return data.map(item => ({
      code: item[valueField],
      name: item[labelField]
    }));
  }

  onCountryChange() {
    const countryId = this.temporaryForm.get('selectedCountry')?.value;
    if (countryId) {
      this.TemporaryPatientDemographicApiServices
        .GetStateByCountryId(countryId)
        .then((res: any) => {
          this.states = this.mapToDropdown(res, 'stateId', 'name');
          this.temporaryForm.get('selectedState')?.setValue(null);
          this.cities = [];
          this.temporaryForm.get('selectedCity')?.setValue(null);
        });
    } else {
      this.states = [];
      this.cities = [];
      this.temporaryForm.get('selectedState')?.setValue(null);
      this.temporaryForm.get('selectedCity')?.setValue(null);
    }
  }

  onStateChange() {
    const stateId = this.temporaryForm.get('selectedState')?.value;
    if (stateId) {
      this.TemporaryPatientDemographicApiServices
        .GetCityByState(stateId)
        .then((res: any) => {
          this.cities = this.mapToDropdown(res, 'cityId', 'name');
          this.temporaryForm.get('selectedCity')?.setValue(null);
        });
    } else {
      this.cities = [];
      this.temporaryForm.get('selectedCity')?.setValue(null);
    }
  }

  onCarrierChange() {
    if (this.CarrierId && this.CarrierId.name === 'Met Life') {
      this.ShowAccordian = false;
      this.SelectAccordian = true;
    } else {
      this.ShowAccordian = true;
      this.SelectAccordian = false;
    }
  }

  onSubmit() {
    this.temporaryForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    if (this.temporaryForm.invalid) {
      this.temporaryForm.markAllAsTouched();
      // Show a simple, user-friendly message without listing field names
      Swal.fire({
        icon: 'warning',
        title: 'Required fields missing',
        text: 'Please fill all required fields.',
      });
      // Bring user attention to the first invalid control
      this.focusFirstInvalidControl();
      return;
    }

    const form = this.temporaryForm.getRawValue();
    const parsedDob = this.parseDMYToDate(form.patientBirthDate);
    const patientBirthDateISO = parsedDob ? parsedDob.toISOString() : null;

    const textOrEmpty = (v: any) => (v === undefined || v === null ? '' : String(v));
    const idOrZero = (v: any) => (v === undefined || v === null || v === '' ? 0 : v);
    // Prefer NOK form value; else fallback to loaded NOK value; else fallback to person's region; else null
    const preferNokOrPerson = (nokVal: any, loadedNokVal: any, personVal: any): number | null => {
      const nfv = Number(nokVal);
      if (!isNaN(nfv) && nfv > 0) return nfv;
      const lnv = Number(loadedNokVal);
      if (!isNaN(lnv) && lnv > 0) return lnv;
      const pv = Number(personVal);
      if (!isNaN(pv) && pv > 0) return pv;
      return null;
    };

    // Map reactive form fields to backend DTO expected keys
    const payload: TempdemographicDto = {
      tempId: form.tempId || 0,
      personTitleId: idOrZero(form.personTitleId),
      personNationalityId: idOrZero(form.nationality),
      personFirstName: textOrEmpty(form.personFirstName),
      personMiddleName: textOrEmpty(form.personMiddleName),
      personLastName: textOrEmpty(form.personLastName),
      personSex: textOrEmpty(form.personSex),
      personAge: form.personAge ? Number(form.personAge) : 0,
      personCellPhone: textOrEmpty(form.personCellPhone),
      personAddress1: textOrEmpty(form.streetNumber),
      personAddress2: textOrEmpty(form.dwellingNumber),
      personCountryId: idOrZero(form.selectedCountry),
      personStateId: idOrZero(form.selectedState),
      personCityId: idOrZero(form.selectedCity),
      personZipCode: textOrEmpty(form.personZipCode),
      personHomePhone1: textOrEmpty(form.personHomePhone1),
      personWorkPhone1: textOrEmpty(form.personWorkPhone1),
      personEmail: textOrEmpty(form.personEmail),
      nokFirstName: textOrEmpty(form.nokFirstName),
      nokMiddleName: textOrEmpty(form.nokMiddleName),
      nokLastName: textOrEmpty(form.nokLastName),
      nokRelationshipId: idOrZero(form.nokRelationshipId),
      nokHomePhone: textOrEmpty(form.nokHomePhone),
      nokWorkPhone: textOrEmpty(form.nokWorkPhone),
      nokCellNo: textOrEmpty(form.nokCellNo),
      nokSocialSecurityNo: textOrEmpty(form.nokSocialSecurityNo),
      nokAddress1: textOrEmpty(form.nokAddress1),
      nokAddress2: textOrEmpty(form.nokAddress2),
      nokCountryId: preferNokOrPerson(form.selectedCountryNOK, this.TemporaryDemographic?.nokCountryId, form.selectedCountry) as any,
      nokStateId: preferNokOrPerson(form.selectedStateNOK, this.TemporaryDemographic?.nokStateId, form.selectedState) as any,
      nokCityId: preferNokOrPerson(form.selectedCityNOK, this.TemporaryDemographic?.nokCityId, form.selectedCity) as any,
      nokZipCode: textOrEmpty(form.nokZipCode),
      comments: textOrEmpty(form.comments),
      createdBy: textOrEmpty(form.createdBy),
      updatedBy: textOrEmpty(form.updatedBy),
      active: form.active ?? true,
      patientBirthDate: patientBirthDateISO,
      streetNumber: textOrEmpty(form.streetNumber),
      dwellingNumber: textOrEmpty(form.dwellingNumber),
    } as TempdemographicDto;

    // Clean nullable NOK region IDs: if null, omit from payload entirely
    if ((payload as any).nokCountryId === null) {
      delete (payload as any).nokCountryId;
    }
    if ((payload as any).nokStateId === null) {
      delete (payload as any).nokStateId;
    }
    if ((payload as any).nokCityId === null) {
      delete (payload as any).nokCityId;
    }

    this.TemporaryPatientDemographicApiServices
      .submitTempDemographic(payload)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: 'Temporary demographic saved successfully!',
        });
        this.router.navigate(['registration/temporary-patient-demographics']);
      })
      .catch((err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.message || 'Failed to save data.',
        });
      });
  }

  onCancel() {
    this.router.navigate(['registration/temporary-patient-demographics']);
  }

  private async loadTempById(id: number): Promise<void> {
    try {
      const res: any = await this.TemporaryPatientDemographicApiServices.GetTempDemographicsByTempId(id);
      if (res) {
        // Some APIs return arrays or an object; handle both
        const obj = Array.isArray(res) ? (res[0] ?? null) : res;
        if (obj) {
          // Keep a copy for submit fallbacks
          this.TemporaryDemographic = obj;
          this.prefillFromTemp(obj);
          await this.prefillRegion(obj);
        }
      }
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.message || 'Failed to load details.' });
    }
  }

  private async prefillRegion(temp: any): Promise<void> {
    const countryId = temp?.personCountryId ?? this.temporaryForm.get('selectedCountry')?.value;
    const stateId = temp?.personStateId ?? this.temporaryForm.get('selectedState')?.value;
    const cityId = temp?.personCityId ?? this.temporaryForm.get('selectedCity')?.value;

    try {
      if (countryId) {
        const states = (await this.TemporaryPatientDemographicApiServices.GetStateByCountryId(countryId)) as any[];
        this.states = this.mapToDropdown(states || [], 'stateId', 'name');
        this.temporaryForm.get('selectedCountry')?.setValue(countryId);
      }

      if (stateId) {
        const cities = (await this.TemporaryPatientDemographicApiServices.GetCityByState(stateId)) as any[];
        this.cities = this.mapToDropdown(cities || [], 'cityId', 'name');
        this.temporaryForm.get('selectedState')?.setValue(stateId);
      }

      if (cityId) {
        this.temporaryForm.get('selectedCity')?.setValue(cityId);
      }
    } catch (e) {
      // If any of these fail, keep already patched raw values
      console.warn('Prefill region failed', e);
    }
  }

  private prefillFromTemp(temp: any): void {
    if (!temp || !this.temporaryForm) return;
    const form = this.temporaryForm;
    const controls = Object.keys(form.controls);

    // 1) Direct key-to-key mapping when names match
    controls.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(temp, key)) {
        form.get(key)?.setValue(temp[key]);
      }
    });

    // 2) Explicit aliases and normalizations
    if (temp.tempId != null) {
      form.get('tempId')?.setValue(temp.tempId);
    }

    // Name handling from a combined full name, only if explicit fields empty
    if (temp.personFullName && (!form.get('personFirstName')?.value || !form.get('personLastName')?.value)) {
      const parts = String(temp.personFullName).trim().split(/\s+/);
      if (parts.length) {
        form.get('personFirstName')?.setValue(parts[0]);
        if (parts.length > 2) {
          form.get('personMiddleName')?.setValue(parts.slice(1, -1).join(' '));
        }
        if (parts.length > 1) {
          form.get('personLastName')?.setValue(parts[parts.length - 1]);
        }
      }
    }

    // Gender normalization (accept 'Male'/'Female'/'Other' or codes)
    if (temp.personSex != null) {
      form.get('personSex')?.setValue(temp.personSex);
    } else if (temp.gender != null) {
      form.get('personSex')?.setValue(temp.gender);
    }

    // DOB normalization; accept ISO strings or yyyy-MM-dd and display as dd/MM/yyyy
    const dob = temp.patientBirthDate || temp.dob || temp.DOB;
    if (dob) {
      try {
        const d = new Date(dob);
        if (!isNaN(d.getTime())) {
          // Use dd/MM/yyyy for UI
          form.get('patientBirthDate')?.setValue(this.formatDateDMY(d));
        } else if (typeof dob === 'string') {
          // Keep as-is; user may have dd/MM/yyyy already
          form.get('patientBirthDate')?.setValue(dob);
        }
      } catch {
        if (typeof dob === 'string') form.get('patientBirthDate')?.setValue(dob);
      }
    }

    // Contact details if present
    if (temp.personCellPhone != null) form.get('personCellPhone')?.setValue(temp.personCellPhone);
    if (temp.personEmail != null) form.get('personEmail')?.setValue(temp.personEmail);
    if (temp.personHomePhone1 != null) form.get('personHomePhone1')?.setValue(temp.personHomePhone1);
    if (temp.personWorkPhone1 != null) form.get('personWorkPhone1')?.setValue(temp.personWorkPhone1);

    // Address and zip
    if (temp.streetNumber != null) form.get('streetNumber')?.setValue(temp.streetNumber);
    if (temp.dwellingNumber != null) form.get('dwellingNumber')?.setValue(temp.dwellingNumber);
    // Fallbacks from personAddress1/2 if street/dwelling missing
    if (!form.get('streetNumber')?.value && temp.personAddress1 != null) form.get('streetNumber')?.setValue(temp.personAddress1);
    if (!form.get('dwellingNumber')?.value && temp.personAddress2 != null) form.get('dwellingNumber')?.setValue(temp.personAddress2);
    if (temp.personZipCode != null) form.get('personZipCode')?.setValue(temp.personZipCode);

    // Country/State/City if available in object
    if (temp.personCountryId != null) form.get('selectedCountry')?.setValue(temp.personCountryId);
    if (temp.personStateId != null) form.get('selectedState')?.setValue(temp.personStateId);
    if (temp.personCityId != null) form.get('selectedCity')?.setValue(temp.personCityId);
    // Nationality code
    if (temp.personNationalityId != null) form.get('nationality')?.setValue(temp.personNationalityId);

    // NOK details
    if (temp.nokRelationshipId != null) form.get('nokRelationshipId')?.setValue(temp.nokRelationshipId);
    if (temp.nokHomePhone != null) form.get('nokHomePhone')?.setValue(temp.nokHomePhone);
    if (temp.nokWorkPhone != null) form.get('nokWorkPhone')?.setValue(temp.nokWorkPhone);
    if (temp.nokCellNo != null) form.get('nokCellNo')?.setValue(temp.nokCellNo);
    if (temp.nokSocialSecurityNo != null) form.get('nokSocialSecurityNo')?.setValue(temp.nokSocialSecurityNo);
    if (temp.nokAddress1 != null) form.get('nokAddress1')?.setValue(temp.nokAddress1);
    if (temp.nokAddress2 != null) form.get('nokAddress2')?.setValue(temp.nokAddress2);
    if (temp.nokZipCode != null) form.get('nokZipCode')?.setValue(temp.nokZipCode);
    if (temp.nokCountryId != null) form.get('selectedCountryNOK')?.setValue(temp.nokCountryId);
    if (temp.nokStateId != null) form.get('selectedStateNOK')?.setValue(temp.nokStateId);
    if (temp.nokCityId != null) form.get('selectedCityNOK')?.setValue(temp.nokCityId);

    // NOK name handling if provided as full name
    if (temp.nokFullName) {
      const parts = String(temp.nokFullName).trim().split(/\s+/);
      if (parts.length) {
        form.get('nokFirstName')?.setValue(parts[0]);
        if (parts.length > 2) form.get('nokMiddleName')?.setValue(parts.slice(1, -1).join(' '));
        if (parts.length > 1) form.get('nokLastName')?.setValue(parts[parts.length - 1]);
      }
    }

    // Misc fields
    if (temp.comments != null) form.get('comments')?.setValue(temp.comments);
    if (temp.createdBy != null) form.get('createdBy')?.setValue(temp.createdBy);
    if (temp.updatedBy != null) form.get('updatedBy')?.setValue(temp.updatedBy);
    if (temp.active != null) form.get('active')?.setValue(!!temp.active);
  }

  private focusFirstInvalidControl(): void {
    // Defer to allow template to update .is-invalid classes
    setTimeout(() => {
      const firstInvalid = document.querySelector('.is-invalid') as HTMLElement | null;
      if (firstInvalid) {
        // Try to focus the input/select
        firstInvalid.focus({ preventScroll: true } as any);
        // Smooth scroll into view
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  private getMissingRequiredFields(): string[] {
    const fieldMap: { key: string; label: string }[] = [
      { key: 'personFirstName', label: 'First Name' },
      { key: 'personSex', label: 'Gender' },
      { key: 'personCellPhone', label: 'Cell Phone' },
      { key: 'patientBirthDate', label: 'Date of Birth' },
    ];
    const missing: string[] = [];
    for (const f of fieldMap) {
      const ctrl = this.temporaryForm.get(f.key);
      if (ctrl && ctrl.invalid) {
        missing.push(f.label);
      }
    }
    return missing;
  }

  private getAllInvalidControls(): string[] {
    const labels: Record<string, string> = {
      tempId: 'Temporary Patient Id',
      personTitleId: 'Title',
      personFirstName: 'First Name',
      personMiddleName: 'Middle Name',
      personLastName: 'Last Name',
      personSex: 'Gender',
      patientBirthDate: 'Date of Birth',
      personAge: 'Age',
      personHomePhone1: 'Home Phone',
      personWorkPhone1: 'Work Phone',
      streetNumber: 'Street Number',
      dwellingNumber: 'Dwelling Number',
      personZipCode: 'Zip/Postal Code',
      selectedCountry: 'Country',
      selectedState: 'State',
      selectedCity: 'City',
      nationality: 'Nationality',
      personCellPhone: 'Cell Phone',
      personEmail: 'Email',
      comments: 'Comment',
    };
    const invalid: string[] = [];
    Object.keys(this.temporaryForm.controls).forEach(key => {
      const ctrl = this.temporaryForm.get(key);
      if (ctrl && ctrl.invalid) {
        invalid.push(labels[key] || key);
      }
    });
    return invalid;
  }

  ngAfterViewInit(): void {
    // Initialize birth date picker and bind to correct control name
    flatpickr('#birthDate', {
      dateFormat: 'd/m/Y',
      maxDate: 'today',
      onChange: (_selectedDates: any, dateStr: string) => {
        const ctrl = this.temporaryForm.get('patientBirthDate');
        if (ctrl) ctrl.setValue(dateStr);
        const ageCtrl = this.temporaryForm.get('personAge');
        if (ageCtrl) {
          const age = this.calculateAge(dateStr);
          ageCtrl.setValue(isNaN(age) ? '' : age, { emitEvent: false });
        }
      },
      allowInput: true,
    });
  }

  private calculateAge(dob: any): number {
    if (!dob) return NaN;
    const birth = this.parseDMYToDate(dob) || new Date(dob);
    if (isNaN(birth.getTime())) return NaN;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // Helpers for dd/MM/yyyy
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

}
