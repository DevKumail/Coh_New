import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
    Validators,
    FormGroupName,
} from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import Swal from 'sweetalert2';
import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { NgxDaterangepickerBootstrapDirective } from 'ngx-daterangepicker-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FilePondOptions } from "filepond";
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import { InsuranceSubscriberDTO } from '@/app/shared/Models/registration/Coverages/coverage.model';


declare var flatpickr: any;

@Component({
    selector: 'app-covrage-create',
    imports: [ReactiveFormsModule, CommonModule, FormsModule, NgbNavModule,FilePondModule,],
    providers: [provideNgxMask()],

    templateUrl: './covrage-create.component.html',
    styleUrl: './covrage-create.component.scss',
})
export class CovrageCreateComponent implements OnInit {

    @ViewChild('picker') picker!: NgxDaterangepickerBootstrapDirective;

    subscriberForm!: FormGroup;
    policyForm!: FormGroup;
    policyForm1!: FormGroup;
    copayForm!: FormGroup;

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

    activeTabId = 1;
PaginationInfo: any = {};
totalRecord: number = 0;
insuredsubs: any[] = [];
    CarrierId: any;
    ShowAccordian: boolean = true;
    SelectAccordian: boolean = false;

    isRelation = true;
    //policyList: any;
    patient: any;
    modalLg: any;

    policyList = [

    {
      effectiveDate: new Date('2024-01-01'),
      terminationDate: new Date('2024-12-31'),
      groupNo: 'GRP-001',
      noOfVisits: 10,
      amount: 5000,
      status: 'Active',
      isEdit: false
    },
    {
      effectiveDate: new Date('2023-05-01'),
      terminationDate: new Date('2024-04-30'),
      groupNo: 'GRP-002',
      noOfVisits: 5,
      amount: 3000,
      status: 'Expired',
      isEdit: false
    },
    {
      effectiveDate: new Date('2025-01-01'),
      terminationDate: new Date('2025-12-31'),
      groupNo: '',
      noOfVisits: 0,
      amount: 0,
      status: 'Pending',
      isEdit: false
    }
  ];


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private registrationApi: RegistrationApiService,
        private modalService: NgbModal,

    ) {}

    ngOnInit(): void {
        this.initForm();
        this.FillCache();

        this.type = [
            { label: 'Self', value: '1' },
            { label: 'Relationship', value: '2' },
        ];
          this.patient = {
      mrNo: '1001',
      personFirstName: 'Ali',
      patientBirthDate: '1990-01-01'
    };
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
    Deductibles: [''],
    Copay: [''],
    DNDeductible:[''],


    OpCopay: [''],
    IpCopay: [''],
 });

    this.policyForm = this.fb.group({
        effectiveDate: [''],
        terminationDate: [''],
        groupNo: [''],
        noOfVisits: [''],
        amount: [''],
        status: ['']
      })
this.copayForm = this.fb.group({
    serviceType: [''],
    copayPercentage: ['']
  });

this.policyForm1 = this.fb.group({
  effectiveDate: [''],
  terminationDate: [''],
  groupNo: [''],
  noOfVisits: [''],
  amount: [''],
  status: ['']
});

}


openPolicyModal(content :any) {
    this.policyForm1.reset();
    this.modalService.open(content, { size: 'lg' });
}

onSavePolicy(modal: any) {
  if (this.policyForm1.valid) {
    const policy = this.policyForm1.value;

    policy.effectiveDate = this.formatDate(policy.effectiveDate);
    policy.terminationDate = this.formatDate(policy.terminationDate);

    this.patient.policyList = this.patient.policyList || [];
    this.patient.policyList.push(policy);

    modal.close();
  } else {
    Swal.fire('Please fill all required fields in Policy form.');
    this.policyForm1.markAllAsTouched();
  }
}

formatDate(date: string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // Format: YYYY-MM-DD
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

        this.registrationApi
            .getCacheItem({ entities: cacheItems })
            .then((response: any) => {
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


        }

        if (regcountries) {
            regcountries = regcountries.map(
                (item: { CountryId: any; Name: any }) => {
                    return {
                        name: item.Name,
                        code: item.CountryId,
                    };
                }
            );

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
            reggender = reggender.map(
                (item: { GenderId: any; Gender: any }) => {
                    return {
                        name: item.Gender,
                        code: item.GenderId,
                    };
                }
            );

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
            regBLPayer = regBLPayer.map(
                (item: { PayerId: any; PayerName: any }) => {
                    return {
                        name: item.PayerName,
                        code: item.PayerId,
                    };
                }
            );
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

    }

    showRelation() {
        const selectedType = this.subscriberForm.get(
            'CompanyOrIndividual'
        )?.value;

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
        this.policyTable.push(
            this.fb.group({
                effectiveDate: [''],
                terminationDate: [''],
                groupNo: [''],
                noOfVisits: [''],
                amount: [''],
                status: [''],
            })
        );
    }

    removePolicyRow(index: number) {
        this.policyTable.removeAt(index);
    }

    addCopayRow() {
        this.copayTable.push(
            this.fb.group({
                serviceType: [''],
                deductible: [''],
            })
        );
    }

    removeCopayRow(index: number) {
        this.copayTable.removeAt(index);
    }



    // insertsubscriber() {
    //     debugger
    //     if (this.subscriberForm.invalid) {
    //         Swal.fire('Error', 'Please fill all required fields', 'error');
    //         this.subscriberForm.markAllAsTouched();
    //         return;
    //     }

    //     const username = sessionStorage.getItem('userName');

    //     this.subscriberForm.patchValue({
    //         EnteredBy: username,
    //     });

    //     const data = this.subscriberForm.value;

    //     this.registrationApi
    //         .InsertSubscriber(data)
    //         .then((res: any) => {
    //             if (res.success) {
    //                 Swal.fire({
    //                     position: 'center',
    //                     icon: 'success',
    //                     title: 'Subscriber inserted successfully',
    //                     showConfirmButton: false,
    //                     timer: 2000,
    //                 });
    //                 this.subscriberForm.reset();
    //             } else {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Error',
    //                     text: res?.message || 'Failed to insert subscriber',
    //                 });
    //             }
    //         })
    //         .catch((error) => {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text:
    //                     error?.error?.message ||
    //                     error?.message ||
    //                     'Something went wrong',
    //             });
    //         });
    // }

    insertsubscriber() {
    debugger;
    if (this.subscriberForm.invalid) {
        Swal.fire('Error', 'Please fill all required fields', 'error');
        this.subscriberForm.markAllAsTouched();
        return;
    }

    const username = sessionStorage.getItem('userName');

    this.subscriberForm.patchValue({
        EnteredBy: username,
    });

    const dto: InsuranceSubscriberDTO = {
        ...this.subscriberForm.value,
        BirthDate: this.subscriberForm.value.BirthDate // ensure it’s in string format (e.g. ISO)
            ? new Date(this.subscriberForm.value.BirthDate).toISOString()
            : '',
        policyList: this.patient?.policyList || [],
    };

    this.registrationApi.InsertSubscriber(dto)
        .then((res: any) => {
            if (res.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Subscriber inserted successfully',
                    showConfirmButton: false,
                    timer: 2000,
                });
                this.subscriberForm.reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res?.message || 'Failed to insert subscriber',
                });
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.error?.message || error?.message || 'Something went wrong',
            });
        });
}

    cancel() {
        // this.subscriberForm.reset();
        this.router.navigate(['coverages']);
    }

    getStateByCountry(countryId: number) {
        this.registrationApi.getStateByCountry(countryId).then((res: any) => {
            this.states = res;
            this.subscriberForm.get('StateId')?.setValue(null); // Reset state
            this.city = [];
            this.subscriberForm.get('CityId')?.setValue(null); // Reset city
        });
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

    onCountryChange() {
        const countryId = this.subscriberForm.get('CountryId')?.value;
        if (countryId) {
            this.registrationApi
                .getStateByCountry(countryId)
                .then((res: any) => {
                    this.states = res;
                    this.subscriberForm.get('StateId')?.setValue(null); // Reset State
                    this.city = [];
                    this.subscriberForm.get('CityId')?.setValue(null); // Reset City
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

  ngAfterViewInit(): void {
  flatpickr('#BirthDate', {
    dateFormat: 'Y-m-d',
    maxDate: 'today'  // Optional: future date disable karne ke liye
  });
   flatpickr('#effectiveDate', {
    dateFormat: 'Y-m-d',
    maxDate: 'today'  // Optional
  });

  flatpickr('#terminationDate', {
    dateFormat: 'Y-m-d',
    maxDate: 'today'  // Optional
  });
}

openLargeModal(content: any) {
  const carrierId = this.subscriberForm.get('CarrierId')?.value;
  if (!carrierId) {
    Swal.fire('Please fill Insurance Carrier.');
    return;
  }

  this.modalService.open(content, { size: 'lg' });
}

onFilePondFileUpdate(event: any): void {
  const files = event?.length ? event : [];
//   if (files.length > 0) {
//     this.selectedFile = files[0].file;
//   } else {
//     this.selectedFile = null;
//   }
}

uploadImage(){

}

userFilePondConfig = {
        imageResizeTargetWidth: 200,
        imageResizeTargetHeight: 200,
        stylePanelLayout: "compact circle",
        styleLoadIndicatorPosition: "center bottom",
        styleProgressIndicatorPosition: "right bottom",
        styleButtonRemoveItemPosition: "left bottom",
        styleButtonProcessItemPosition: "right bottom",
        allowImagePreview: true,
        imagePreviewHeight: 100,
        labelIdle: `<svg  xmlns="http://www.w3.org/2000/svg"  width="32"  height="32"  viewBox="0 0 24 24"  fill="none"  stroke="#9ba6b7"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-camera"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>`,
    }


     editPolicy(policy: any) {
    policy.original = { ...policy };
    policy.isEdit = true;
  }

  savePolicy(policy: any) {
    policy.isEdit = false;
    delete policy.original;
    console.log('Saved:', policy);
  }

  cancelEdit(policy: any) {
    Object.assign(policy, policy.original);
    policy.isEdit = false;
    delete policy.original;
  }


openModal(content: any) {
  this.modalService.open(content, { size: 'lg' });
}

//  GetCoveragesList(Data: any) {

//     this.registrationApi.GetCoverageList(Data,this.PaginationInfo)
//       .then((inssub) => {

//         this.totalRecord=inssub.table2[0].totalCount

//         if (inssub.table1) {

//           let inssubarray: any[] = [];

//           for (let i = 0; i < inssub.table1.length; i++) {
//             let subscriberName = inssub.table1[i].subscriberName;
//             let insuranceCarrier = inssub.table1[i].insuranceCarrier;
//             let insuranceIDNo = inssub.table1[i].insuranceIDNo;
//             let subscriberId = inssub.table1[i].subscriberId;
//             let type = inssub.table1[i].typeinText;
//             let active = inssub.table1[i].active;
//             let carrierAddress = inssub.table1[i].carrierAddress;
//             let mrNo = inssub.table1[i].mrNo;
//             inssubarray.push({
//               subscriberId: inssub.table1[i].subscriberId,
//               subscriberName: inssub.table1[i].subscriberName,
//               insuranceCarrier: inssub.table1[i].insuranceCarrier,
//               insuranceIDNo: inssub.table1[i].insuranceIDNo,
//               mrNo: inssub.table1[i].mrNo,
//               type: inssub.table1[i].typeinText,
//               active: inssub.table1[i].active,
//               carrierAddress: inssub.table1[i].carrierAddress,
//             });
//           }

//           this.insuredsubs = inssubarray;
//         }
//       })
//       .catch((error) =>
//         this.registrationApi.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: error.message,
//         })
//       );
//   }

// GetCoveragesList(Data: any) {
//   this.registrationApi.GetCoverageList(Data, this.PaginationInfo)
//     .then((inssub) => {
//         this.totalRecord = 0;
//       if (inssub.table2 && inssub.table2.length > 0) {
//         this.totalRecord = inssub.table2[0].totalCount;
//       }

//       if (inssub.table1 && Array.isArray(inssub.table1)) {
//         this.insuredsubs = inssub.table1.map((item: any) => ({
//           subscriberId: item.subscriberId,
//           subscriberName: item.subscriberName,
//           insuranceCarrier: item.insuranceCarrier,
//           insuranceIDNo: item.insuranceIDNo,
//           mrNo: item.mrNo,
//           type: item.typeinText,
//           active: item.active,
//           carrierAddress: item.carrierAddress
//         }));
//       }
//     })
//    .catch((error) => {

//   this.registrationApi.add({
//     severity: 'error',
//     summary: 'Error',
//     detail: error.message || 'Something went wrong.'

//   });
// });
// }


}


interface Policy {
  effectiveDate: Date;
  terminationDate: Date;
  groupNo: string;
  noOfVisits: number;
  amount: number;
  status: string;
  isEdit?: boolean; // Add this property to control edit mode
}

interface CoverageResponse {
  table1: any[];
  table2: { totalCount: number }[];
}
