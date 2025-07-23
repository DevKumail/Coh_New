import { states } from '@/app/views/forms/other-plugins/data';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule,Validators  } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import Swal from 'sweetalert2';
import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';



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
  Address1: any[] = [];
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
facilities: any[] = [];

  CarrierId: any;
    ShowAccordian: boolean = true;
    SelectAccordian: boolean = false;



  isRelation = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationApi: RegistrationApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.FillCache();

 this.type = [
      { label: 'Self', value: '1' },
      { label: 'Relationship', value: '2' },

    ];

  }

  initForm() {
    this.subscriberForm = this.fb.group({
      CompanyOrIndividual: [''],
      InsuranceRel: [''],
      Address1: [''],
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
      EnteredBy: [''],
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
        //console.log('cache => ', response.cache);
        this.FillDropDown(response);
      }
    });

    this.registrationApi.GetInsuranceRelation().subscribe((res: any) => {
      this.InsuranceRelation = res;
    //   console.log('InsuranceRelation:', this.InsuranceRelation);
    });
  }


  FillDropDown(response: any) {
  let jParse = JSON.parse(JSON.stringify(response)).cache;
    let reghrEmployee = JSON.parse(jParse).HREmployeeType;
    let regmaritalStatus = JSON.parse(jParse).RegMaritalStatus;
    let reggender = JSON.parse(jParse).RegGender;
    let regbgroup = JSON.parse(jParse).RegBloodGroup;
    let regcountries = JSON.parse(jParse).RegCountries;
    let regstates = JSON.parse(jParse).RegStates;
    let regcities = JSON.parse(jParse).RegCities;
    let regrelationships = JSON.parse(jParse).RegRelationShip;
    let regroles = JSON.parse(jParse).SecRole;
    let regfacility = JSON.parse(jParse).RegFacility;
    let regBLPayer = JSON.parse(jParse).BLPayer;
    let regBLPayerPlan = JSON.parse(jParse).BLPayerPlan;
    let regTitles = JSON.parse(jParse).RegTitle;
    let regBLPayerPackage = JSON.parse(jParse).BLPayerPackage;

    if (regfacility) {
      regfacility = regfacility.map((item: { ID: any; Name: any }) => {
        return {
          name: item.Name,
          code: item.ID,
        };
      });

      //this.facilities = regfacility;
    }

    if (regroles) {
      regroles = regroles.map((item: { RoleId: any; RoleName: any }) => {
        return {
          name: item.RoleName,
          code: item.RoleId,
        };
      });

      //this.roles = regroles;
    }

    if (regrelationships) {
      regrelationships = regrelationships.map(
        (item: { RelationshipId: any; Relationship: any }) => {
          return {
            name: item.Relationship,
            code: item.RelationshipId,
          };
        }
      );

      //this.relationships = regrelationships;
    }

    if (regcountries) {
      regcountries = regcountries.map((item: { CountryId: any; Name: any }) => {
        return {
          name: item.Name,
          code: item.CountryId,
        };
      });

      this.Country = regcountries.slice(0, 100);
    }

    if (reghrEmployee) {
      reghrEmployee = reghrEmployee.map(
        (item: { TypeID: any; TypeDescription: any }) => {
          return {
            name: item.TypeDescription,
            code: item.TypeID,
          };
        }
      );

      this.employeetypes = reghrEmployee;
    }

    if (regmaritalStatus) {
      regmaritalStatus = regmaritalStatus.map(
        (item: { MaritalStatusId: any; MaritalStatus: any }) => {
          return {
            name: item.MaritalStatus,
            code: item.MaritalStatusId,
          };
        }
      );

      this.maritalstatuses = regmaritalStatus;
    }

    if (reggender) {
      reggender = reggender.map((item: { GenderId: any; Gender: any }) => {
        return {
          name: item.Gender,
          code: item.GenderId,
        };
      });

      this.genders = reggender;
    }

    if (regbgroup) {
      regbgroup = regbgroup.map(
        (item: { BloodGroupId: any; BloodGroup: any }) => {
          return {
            name: item.BloodGroup,
            code: item.BloodGroupId,
          };
        }
      );

      this.bloodgroups = regbgroup;
    }

    if (regBLPayer) {
      //;
      regBLPayer = regBLPayer.map((item: { PayerId: any; PayerName: any }) => {
        return {
          name: item.PayerName,
          code: item.PayerId,
        };
      });
      //;
      this.BLPayer = regBLPayer;
    }

    if (regBLPayerPlan) {
      regBLPayerPlan = regBLPayerPlan.map(
        (item: { PlanId: any; PlanName: any }) => {
          return {
            name: item.PlanName,
            code: item.PlanId,
          };
        }
      );
      //;
      this.BLPayerPlan = regBLPayerPlan;
    }

    if (regBLPayerPackage) {
      regBLPayerPackage = regBLPayerPackage.map(
        (item: { PayerPackageId: any; PackageName: any }) => {
          return {
            name: item.PackageName,
            code: item.PayerPackageId,
          };
        }
      );
      //;
      this.BLPayerPackage = regBLPayerPackage;
    }

    if (regTitles) {
      regTitles = regTitles.map((item: { TitleId: any; Title: any }) => {
        return {
          name: item.Title,
          code: item.TitleId,
        };
      });
      //;
      this.titles = regTitles;

      //console.log('Titles:', this.titles);
    }

    // this.registrationApi.GetInsuranceRelation().subscribe((res) => {
    // });
  }


showRelation() {
  const selectedType = this.subscriberForm.get('CompanyOrIndividual')?.value;

  this.isRelation = selectedType === '2';

  if (selectedType === '1') {
    this.subscriberForm.get('InsuranceRel')?.disable();
    this.subscriberForm.get('InsuranceRel')?.reset();
  } else {
    this.subscriberForm.get('InsuranceRel')?.enable();
  }
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

// insertsubscriber() {
//   if (this.subscriberForm.invalid) {
//     Swal.fire('Error', 'Please fill all required fields', 'error');
//     this.subscriberForm.markAllAsTouched();
//     return;
//   }

//   const data = this.subscriberForm.value;
//   console.log('Submitting Subscriber:', data);

//   this.registrationApi.InsertSubscriber(data).then((res: any) => {
//     if (res.success) {
//       Swal.fire({
//         position: 'center',
//         icon: 'success',
//         title: 'Subscriber inserted successfully',
//         showConfirmButton: false,
//         timer: 2000
//       });
//       this.subscriberForm.reset();
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: res?.message || 'Failed to insert subscriber'
//       });
//     }
//   }).catch(error => {
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: error?.message || 'Something went wrong'
//     });
//   });
// }

insertsubscriber() {
  if (this.subscriberForm.invalid) {
    Swal.fire('Error', 'Please fill all required fields', 'error');
    this.subscriberForm.markAllAsTouched();
    return;
  }

  const username = sessionStorage.getItem('userName');

  this.subscriberForm.patchValue({
    EnteredBy: username
  });

  const data = this.subscriberForm.value;

  this.registrationApi.InsertSubscriber(data).then((res: any) => {
    if (res.success) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Subscriber inserted successfully',
        showConfirmButton: false,
        timer: 2000
      });
      this.subscriberForm.reset();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res?.message || 'Failed to insert subscriber'
      });
    }
}).catch(error => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: error?.error?.message || error?.message || 'Something went wrong'
  });
});
}


  cancel() {
    this.subscriberForm.reset();
  }

getStateByCountry(countryId: number) {

  this.registrationApi.getStateByCountry(countryId).then((res: any) => {
    this.states = res;
    this.subscriberForm.get('StateId')?.setValue(null); // Reset state
    this.city = [];
    this.subscriberForm.get('CityId')?.setValue(null);  // Reset city
  });
}

  onCarrierChange() {
    if (this.CarrierId != null) {
      if ((this.CarrierId.name == 'Met Life')) {
        this.ShowAccordian = false;
        this.SelectAccordian = true;
      } else {
        this.ShowAccordian = true;
        this.SelectAccordian = false;
      }
    }
  }


onCountryChange() {
  const countryId = this.subscriberForm.get('CountryId')?.value;
  if (countryId) {
    this.registrationApi.getStateByCountry(countryId).then((res: any) => {

        this.states = res;
      this.subscriberForm.get('StateId')?.setValue(null); // Reset State
      this.city = [];
      this.subscriberForm.get('CityId')?.setValue(null);  // Reset City
    });
  } else {
    this.states = [];
    this.city = [];
    this.subscriberForm.get('StateId')?.setValue(null);
    this.subscriberForm.get('CityId')?.setValue(null);
  }
}

onStateChange() {
  const stateId = this.subscriberForm.get('StateId')?.value;

  if (stateId) {
    this.registrationApi.getCityByState(stateId).then((res: any) => {
      this.city = res;
      this.subscriberForm.get('CityId')?.setValue(null); // Reset City
    });
  } else {
    this.city = [];
    this.subscriberForm.get('CityId')?.setValue(null);
  }
}

}
