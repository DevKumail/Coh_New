import { TemporaryPatientDemographicApiServices } from '@/app/shared/Services/TemporaryDempographics/temporarydemographic.api.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FilePondModule } from 'ngx-filepond';
import { OnInit } from '@angular/core';
import   Swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { NgxDaterangepickerBootstrapDirective} from "ngx-daterangepicker-bootstrap";
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask'
import { TempdemographicDto } from '@/app/shared/Models/registration/Tempdemo/Tempdemographic.model';

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
        if (this.tempid != null) {
            //this.GetTempDemographicsByTempId(this.tempid);
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
      const missing = this.getMissingRequiredFields();
      const allInvalid = this.getAllInvalidControls();
      console.warn('Temporary form invalid controls:', allInvalid);
      const requiredList = missing.length
        ? `<div>Please fill required fields:</div><ul style="text-align:left;">${missing
            .map(f => `<li>${f}</li>`)
            .join('')}</ul>`
        : '';
      const invalidList = allInvalid.length
        ? `<div>Other invalid fields:</div><ul style="text-align:left;">${allInvalid
            .map(f => `<li>${f}</li>`)
            .join('')}</ul>`
        : '';
      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        html: `${requiredList}${invalidList}` || 'Please fill all required fields.',
      });
      return;
    }

    const form = this.temporaryForm.getRawValue();
    const patientBirthDateISO = form.patientBirthDate ? new Date(form.patientBirthDate).toISOString() : null;

    // Map reactive form fields to backend DTO expected keys
    const payload: TempdemographicDto = {
      tempId: form.tempId || 0,
      personTitleId: form.personTitleId ?? 0,
      personNationalityId: form.nationality ?? 0,
      personFirstName: form.personFirstName,
      personMiddleName: form.personMiddleName,
      personLastName: form.personLastName || '',
      personSex: form.personSex,
      personAge: form.personAge ? Number(form.personAge) : 0,
      personCellPhone: form.personCellPhone || '',
      personAddress1: form.streetNumber || '',
      personAddress2: form.dwellingNumber || '',
      personCountryId: form.selectedCountry ?? 0,
      personStateId: form.selectedState ?? 0,
      personCityId: form.selectedCity ?? 0,
      personZipCode: form.personZipCode || '',
      personHomePhone1: form.personHomePhone1 || '',
      personWorkPhone1: form.personWorkPhone1 || '',
      personEmail: form.personEmail || '',
      nokFirstName: form.nokFirstName || '',
      nokMiddleName: form.nokMiddleName || '',
      nokLastName: form.nokLastName || '',
      nokRelationshipId: form.nokRelationshipId ?? 0,
      nokHomePhone: form.nokHomePhone || '',
      nokWorkPhone: form.nokWorkPhone || '',
      nokCellNo: form.nokCellNo || '',
      nokSocialSecurityNo: form.nokSocialSecurityNo || '',
      nokAddress1: form.nokAddress1 || '',
      nokAddress2: form.nokAddress2 || '',
      nokCountryId: form.selectedCountryNOK ?? 0,
      nokStateId: form.selectedStateNOK ?? 0,
      nokCityId: form.selectedCityNOK ?? 0,
      nokZipCode: form.nokZipCode || '',
      comments: form.comments || '',
      createdBy: form.createdBy || '',
      updatedBy: form.updatedBy || '',
      active: form.active ?? true,
      patientBirthDate: patientBirthDateISO,
      streetNumber: form.streetNumber || '',
      dwellingNumber: form.dwellingNumber || '',
    } as TempdemographicDto;

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
      dateFormat: 'Y-m-d',
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
    });
  }

  private calculateAge(dob: any): number {
    if (!dob) return NaN;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return NaN;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

}
