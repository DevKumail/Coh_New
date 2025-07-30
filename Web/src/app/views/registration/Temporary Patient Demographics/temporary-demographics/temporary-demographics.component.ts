import { Api } from 'datatables.net';
import { TemporaryPatientDemographicApiServices } from '@/app/shared/Services/TemporaryDempographics/temporarydemographic.api.service';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { EmailItemType } from '@/app/views/apps/email/types';
import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
import { AfterViewInit  } from '@angular/core';
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
import { Observable, ReplaySubject } from 'rxjs';
import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import   Swal from 'sweetalert2';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
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

     this.FillCache();

    // this.router.queryParams.subscribe(async (queryparam) => {
    //   this.tempid = queryparam['id'];
    //   if (this.tempid) {
    //     await this.FillDropDown(this.tempid);
    //   }
    // });
  }



  initializeForm() {
    this.temporaryForm = this.fb.group({
      tempId: [{ value: '', disabled: true }],
      personTitleId: [null],
      personFirstName: ['', Validators.required],
      personMiddleName: ['', Validators.required],
      personLastName: [''],
      personSex: [null, Validators.required],
      patientBirthDate: [],
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
      personCellPhone: [''],
      personEmail: [''],
      nokFirstName: [''],
      nokSocialSecurityNo: [''],
      nokZipCode: [''],
      nokHomePhone: [''],
      nokAddress1: [''],
      selectedCountryNOK: [null],
      selectedStateNOK: [null],
      selectedCityNOK: [null],
      comments: ['']
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

//   onSubmit() {
//     if (this.temporaryForm.invalid) {
//       this.temporaryForm.markAllAsTouched();
//       Swal.fire({
//         icon: 'warning',
//         title: 'Form Incomplete',
//         text: 'Please fill all required fields.',
//       });
//       return;
//     }

//     const payload = this.temporaryForm.value;
//     this.TemporaryPatientDemographicApiServices
//       .submitTempDemographic(payload)
//       .then(() => {
//         Swal.fire({
//           icon: 'success',
//           title: 'Saved',
//           text: 'Temporary demographic saved successfully!',
//         });
//         this.router.navigate(['registration/temporary-patient-demographics']);
//       })
//       .catch((err: any) => {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: err?.message || 'Failed to save data.',
//         });
//       });
//   }
onSubmit() {
  if (this.temporaryForm.invalid) {
    this.temporaryForm.markAllAsTouched();
    Swal.fire({
      icon: 'warning',
      title: 'Form Incomplete',
      text: 'Please fill all required fields.',
    });
    return;
  }

  const payload: TempdemographicDto = this.temporaryForm.value;

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
// onSubmit(): void {
//     if (this.temporaryForm.valid) {
//       const demographicData: TempdemographicDto = this.temporaryForm.value;

//       this.api.post('https://your-api-url/api/TemporaryDemographic', demographicData)
//         .subscribe({
//           next: (response:any) => {
//             console.log('✅ Data saved successfully:', response);
//             alert('Data saved successfully!');
//             this.temporaryForm.reset();  // Optional: reset form after save
//           },
//           error: (error) => {
//             console.error('❌ Error saving data:', error);
//             alert('Failed to save data. Please try again.');
//           }
//         });

//     } else {
//       console.warn('❗ Form is invalid');
//       alert('Please fill all required fields.');
//     }
//   }

  onCancel() {
    this.router.navigate(['registration/temporary patient demographics']);
  }

    ngAfterViewInit(): void {
    flatpickr('#deathDate', {
      dateFormat: 'Y-m-d',
      maxDate: 'today', // prevent future dates
      onChange: (selectedDates: any, dateStr: string) => {
        this.temporaryForm.get('DeathDate')?.setValue(dateStr);
      },
    });

    flatpickr('#birthDate', {
    dateFormat: 'Y-m-d',
    maxDate: 'today', // typically DOB should not be in the future
    onChange: (selectedDates: any, dateStr: string) => {
      this.temporaryForm.get('PatientBirthDate')?.setValue(dateStr);
    },
  });
  }
}

