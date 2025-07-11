import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RegistrationApiService } from '../../registration.api.service';
import { ApiService } from '@core/services/api.service';


@Component({
  selector: 'app-covrage-create',
  imports: [ReactiveFormsModule, CommonModule, FormsModule,],
  templateUrl: './covrage-create.component.html',
  styleUrl: './covrage-create.component.scss'
})

export class CovrageCreateComponent implements OnInit {
  subscriberForm!: FormGroup;

  type: any[] = [];
  InsuranceRelation: any[] = [];
  titles: any[] = [];
  Country: any[] = [];
  states: any[] = [];
  city: any[] = [];
  genders: any[] = [];
  maritalstatuses: any[] = [];
  employeetypes: any[] = [];
  bloodgroups: any[] = [];
  BLPayer: any[] = [];
  BLPayerPlan: any[] = [];
  BLPayerPackage: any[] = [];

  form!: FormGroup; // ya

  isRelation = true;

  constructor(
    private fb: FormBuilder,
        public apiService: ApiService,

    private registrationApi: RegistrationApiService,
    // private demoGrpahicsService: DemographicsService,
    // private messageService: MessageService,
    // private userService: UsersService,
  ) {}

//   ngOnInit(): void {
//     this.initForm();
//     this.FillCache();
//   }
ngOnInit(): void {
  this.initForm();       // Initialize your form group
  this.FillCache();      // Load initial data like Country list

  // 👇 Country change listener
  this.form.get('CountryId')?.valueChanges.subscribe((selectedCountry) => {
    if (selectedCountry?.code) {
      this.registrationApi.getStateByCountry(selectedCountry.code).then((res: any) => {
        this.states = res;
        this.form.get('StateId')?.setValue(null); // Reset state
        this.city = [];                            // Clear cities
        this.form.get('CityId')?.setValue(null);   // Reset city
      });
    } else {
      this.states = [];
      this.city = [];
    }
  });

  // 👇 State change listener
  this.form.get('StateId')?.valueChanges.subscribe((selectedState) => {
    if (selectedState?.stateId) {
      this.registrationApi.getCityByState(selectedState.stateId).then((res: any) => {
        this.city = res;
        this.form.get('CityId')?.setValue(null); // Reset city
      });
    } else {
      this.city = [];
    }
  });
}


  initForm() {
    this.subscriberForm = this.fb.group({
      CompanyOrIndividual: [''],
      InsuranceRel: [''],
      Suffix: [''],
      FirstName: [''],
      MiddleName: [''],
      LastName: [''],
      InsuredPhone: [''],
      BirthDate: [''],
      Sex: [''],
      InsuredIdNo: [''],
      CountryId: [''],
      StateId: [''],
      CityId: [''],
      ZipCode: [''],
      CarrierId: [''],
      selectedBLPayerPlan: [''],
      selectedBLPayerPackage: [''],
      Inactive: [false],
      regInsurancePolicy: this.fb.array([]),
      regDeduct: this.fb.array([]),
    });
  }

  FillCache() {
    const cacheItems = [
      'HREmployeeType',
      'RegBloodGroup',
      'RegMaritalStatus',
      'RegGender',
      'RegCountries',
      'RegStates',
      'RegCities',
      'RegRelationShip',
      'RegTitle',
      'BLPayer',
      'BLPayerPlan',
      'BLPayerPackage',
    ];

    this.registrationApi.getCacheItem({ entities: cacheItems }).then((response: any) => {
      if (response.cache != null) {
        console.log( 'cache => ',response.cache);

        this.FillDropDown(response);
      }
    });

    this.registrationApi.GetInsuranceRelation().subscribe((res: any) => {
      this.InsuranceRelation = res;
    });

  }

  FillDropDown(response: any) {
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let data = JSON.parse(jParse);

    this.titles = this.mapToDropdown(data.RegTitle, 'Title', 'TitleId');
    // this.Country = this.mapToDropdown(data.RegCountries, 'Name', 'CountryId');
    // this.states = this.mapToDropdown(data.RegStates, 'Name', 'StateID');
    // this.city = this.mapToDropdown(data.RegCities, 'Name', 'CityId');
    this.genders = this.mapToDropdown(data.RegGender, 'Gender', 'GenderId');
    // this.maritalstatuses = this.mapToDropdown(data.RegMaritalStatus, 'MaritalStatus', 'MaritalStatusId');
    // this.employeetypes = this.mapToDropdown(data.HREmployeeType, 'TypeDescription', 'TypeID');
    // this.bloodgroups = this.mapToDropdown(data.RegBloodGroup, 'BloodGroup', 'BloodGroupId');
    // this.BLPayer = this.mapToDropdown(data.BLPayer, 'PayerName', 'PayerId');
    // this.BLPayerPlan = this.mapToDropdown(data.BLPayerPlan, 'PlanName', 'PlanId');
    // this.BLPayerPackage = this.mapToDropdown(data.BLPayerPackage, 'PackageName', 'PayerPackageId');

    this.type = [
      { label: 'Self', value: '1' },
      { label: 'Relationship', value: '2' },
    ];
  }

  mapToDropdown(array: any[], labelField: string, valueField: string) {
    return array.map(item => ({
      name: item[labelField],
      code: item[valueField]
    }));
  }

  onCountryChange(event: any) {
    this.registrationApi.getStateByCountry(event.code).then((res: any) => {
      this.states = res;
    });
  }

  onStateChange(event: any) {
    this.registrationApi.getCityByState(event.stateId).then((res: any) => {
      this.city = res;
    });
  }

  showRelation() {
    const val = this.subscriberForm.get('CompanyOrIndividual')?.value;
    this.isRelation = val == '2';
  }

  get policyTable(): FormArray {
    return this.subscriberForm.get('regInsurancePolicy') as FormArray;
  }

  get copayTable(): FormArray {
    return this.subscriberForm.get('regDeduct') as FormArray;
  }

  addPolicyRow() {
    this.policyTable.push(this.fb.group({
      effectiveDate: [''],
      terminationDate: [''],
      groupNo: [''],
      noOfVisits: [''],
      amount: [''],
      status: ['']
    }));
  }

  removePolicyRow(index: number) {
    this.policyTable.removeAt(index);
  }

  addCopayRow() {
    this.copayTable.push(this.fb.group({
      serviceType: [''],
      deductible: ['']
    }));
  }

  removeCopayRow(index: number) {
    this.copayTable.removeAt(index);
  }

  insertsubscriber() {
    if (this.subscriberForm.valid) {
      const data = this.subscriberForm.value;
      console.log('Submitting Subscriber:', data);
      this.registrationApi.InsertSubscriber(data).then((res: any) => {
        if (res.success) {
          // TODO: Replace with actual notification service if available
          // Example: this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscriber inserted' });
          console.log('Subscriber inserted successfully');
        }
      });
    } else {
      this.subscriberForm.markAllAsTouched();
    }
  }

  cancel() {
    this.subscriberForm.reset();
  }
}
