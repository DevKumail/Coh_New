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
import { DemographicDTO } from '@/app/shared/Models/registration/Demographics/Demographic.type.model';
import   Swal from 'sweetalert2';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { ViewChild } from '@angular/core';
import { NgxDaterangepickerBootstrapDirective} from "ngx-daterangepicker-bootstrap";

@Component({
  selector: 'app-temporary-demographics',
  imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        FilePondModule,
        NgbNavModule,],
  templateUrl: './temporary-demographics.component.html',
  styleUrl: './temporary-demographics.component.scss'
})
export class TemporaryDemographicsComponent {

      constructor(
        private fb: FormBuilder,
        private router: Router,
        private TemporaryPatientDemographicApiServices: TemporaryPatientDemographicApiServices,
    ) {}

temporaryForm!: FormGroup;


    activeTabId = 1;
    titles: any[] = [];
    countries:any []=[];
    nationalities: any []=[];
    genderOptions:any []=[];

    genderIdentity: any[] = [];
    preferredName:[]=[];
    maritalstatus: any[] = [];
    bloodgroup: any[] = [];
    religion: any[] = [];
    ethinic: any[] = [];
    nationality: any[] = [];
    language: any[] = [];
    MediaChannel: any[] = [];
    MediaItem: any[] = [];
    Emirates: any[] = [];
    FeeSchedule: any[] = [];
    FinancialClass: any[] = [];
    Site: any []=[];
    location: any []=[];
    EntityTypes: any[] = [];
    referred: any[] = [];
    state: any[] = [];
    cities: any[] = [];
    country: any[]=[];
    genders: any[] = [];
    states: any[] = [];
    city: any[] = [];
    relationships: any[]=[];

    CarrierId: any;
    ShowAccordian: boolean = true;
    SelectAccordian: boolean = false;

    isDisabled: boolean = false;
     initializeForm() {
    this.temporaryForm = this.fb.group({
  tempId: [null],
  PersonTitleId: [null, Validators.required],
  personFirstName: ['', Validators.required],
  personMiddleName: ['', Validators.required],
  personLastName: [''],
  gender: [null, Validators.required],
  bdate: [null, Validators.required],
  personAge: [''],
  personHomePhone1: [''],
  personWorkPhone1: [''],
  streetNumber: [''],
  DwellingNumber: [''],
  personZipCode: [''],
  selectedCountry: [null],
  selectedState: [null],
  selectedCity: [null],
  selectedNationality: [null],
  personCellPhone: ['', Validators.required],
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


   ngOnInit(): void {
        this.initializeForm();
        this.fillDropdown();
        this.FillCache();


    }
        fillDropdown() {
        this.FillCache();

    }
FillCache() {
  this.TemporaryPatientDemographicApiServices.getCacheItem({
    entities: [
      'RegTitle',
      'RegGender',
      'RegCountries',
      'Nationality',
      'RegStates',         // Optional - if backend provides states separately
      'RegCities',         // Optional - if backend provides cities separately
    ],
  })
  .then((response: any) => {
    if (response.cache) {
      this.FillDropDown(JSON.parse(JSON.stringify(response)).cache);
    }
  })
  .catch((error: { message: string }) =>
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    })
  );
}
FillDropDown(cache: any) {



        this.countries = this.mapToDropdown(cache.RegCountries, 'CountryId', 'CountryName');
        this.states = this.mapToDropdown(cache.RegStates, 'StateId', 'StateName');
        this.cities = this.mapToDropdown(cache.RegCities, 'CityId', 'CityName');
        this.nationalities = this.mapToDropdown(cache.Nationality, 'NationalityId', 'Nationality');

         this.titles = [
          { name: 'Mr', code: 1 },
          { name: 'Mrs', code: 0 },
        ];

 if (cache.RegGender) {
  this.genders = cache.RegGender.map(
    (item: { GenderId: any; Gender: any }) => {
      return {
        name: item.Gender,
        code: item.GenderId,
      };
    }
  );
}


}

mapToDropdown(data: any[], valueField: string, labelField: string): any[] {
  return data.map(item => ({
    code: item[valueField],
    name: item[labelField]
  }));
}




onSubmit(){

}


  onCountryChange() {
        debugger
        const countryId = this.temporaryForm.get('CountryId')?.value;
        if (countryId) {
            this.TemporaryPatientDemographicApiServices
                .GetStateByCountryId(countryId)
                .then((res: any) => {
                    ;
                    this.states = res;
                    this.temporaryForm.get('StateId')?.setValue(null); // Reset State
                    this.city = [];
                    this.temporaryForm.get('CityId')?.setValue(null); // Reset City
                });
        } else {
            this.states = [];
            this.city = [];
            this.temporaryForm.get('StateId')?.setValue(null);
            this.temporaryForm.get('CityId')?.setValue(null);
        }
    }

    onStateChange() {
        const stateId = this.temporaryForm.get('StateId')?.value;
        ;
        if (stateId) {
            this.TemporaryPatientDemographicApiServices.GetCityByState(stateId).then((res: any) => {
                this.city = res;
                this.temporaryForm.get('CityId')?.setValue(null); // Reset City
            });
        } else {
            this.city = [];
            this.temporaryForm.get('CityId')?.setValue(null);
        }
    }
    onCarrierChange() {
        if (this.CarrierId != null) {
            if (this.CarrierId.name == 'Met Life') {
                this.ShowAccordian = false;
                this.SelectAccordian = true;
            } else {
                this.ShowAccordian = true;
                this.SelectAccordian = false;
            }
        }
    }


    onCancel(){

    }
}
