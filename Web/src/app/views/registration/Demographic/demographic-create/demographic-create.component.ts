import { title } from 'process';
import { bootstrapApplication } from '@angular/platform-browser';
import { EmailItemType } from '@/app/views/apps/email/types';
import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
import { Component, AfterViewInit } from '@angular/core';
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
import { AssignmentsDTO, ContactDTO, DemographicDTO, FamilyMembersDTO, NextOfKinDTO, ParentDTO } from '@/app/shared/Models/registration/Demographics/Demographic.type.model';
import Swal from 'sweetalert2';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { ViewChild } from '@angular/core';
import { NgxDaterangepickerBootstrapDirective } from 'ngx-daterangepicker-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { LoaderService } from '@core/services/loader.service';
import { e } from 'node_modules/@angular/cdk/scrolling-module.d-ud2XrbF8';

declare var flatpickr: any;

@Component({
    selector: 'app-demographic-create',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        FilePondModule,
        NgbNavModule,
        NgxMaskDirective,
        //NgxDaterangepickerootstrapModule,
    ],
    providers: [provideNgxMask()],

    standalone: true,
    templateUrl: './demographic-create.component.html',
    styleUrl: './demographic-create.component.scss',
})
export class DemographicCreateComponent implements OnInit, AfterViewInit {
    @ViewChild('picker') picker!: NgxDaterangepickerBootstrapDirective;

    demographicForm!: FormGroup;
    contactForm!: FormGroup;
    nextForm!: FormGroup;
    parentsInfo!: FormGroup;
    emergencyContactForm!: FormGroup;
    assignmentForm!: FormGroup;
    familyForm!: FormGroup;

    activeTabId = 1;
    titles: any[] = [];
    gender: any[] = [];
    genderIdentity: any[] = [];
    preferredName: [] = [];
    maritalstatus: any[] = [];
    bloodgroup: any[] = [];
    laborCardNo: any[] = [];
    religion: any[] = [];
    ethinic: any[] = [];
    billingNote: any[] = [];
    nationality: any[] = [];
    language: any[] = [];
    MediaChannel: any[] = [];
    MediaItem: any[] = [];
    Emirates: any[] = [];
    FeeSchedule: any[] = [];
    FinancialClass: any[] = [];
    Site: any[] = [];
    location: any[] = [];
    EntityTypes: any[] = [];
    referred: any[] = [];
    state: any[] = [];
    citie: any[] = [];
    Country: any;
    genders: any[] = [];
    states: any[] = [];
    city: any[] = [];
    relationships: any[] = [];

    qid: any;

    isLoading: boolean = false;

    CarrierId: any;
    ShowAccordian: boolean = true;
    SelectAccordian: boolean = false;

    uploadedImage: string | ArrayBuffer | null = null;
    byteImage: string = '';
    imageSrc: string = '';
    fileName: string = '';
    defaultImage: string = 'assets/images/default-avatar.png';
    familyMembers: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private DemographicApiServices: DemographicApiServices,
        private registrationApi: RegistrationApiService,
        public Loader: LoaderService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.fillDropdown();
        this.FillCache();
        const patient = history.state.patient;
        debugger
        if (patient != null) {
            this.getDemographicsByMRNo(patient.mrNo);
        }
    }

    ngAfterViewInit(): void {
        flatpickr('#deathDate', {
            dateFormat: 'Y-m-d',
            maxDate: 'today', // prevent future dates
            onChange: (selectedDates: any, dateStr: string) => {
                this.demographicForm.get('DeathDate')?.setValue(dateStr);
            },
        });

        flatpickr('#birthDate', {
            dateFormat: 'Y-m-d',
            maxDate: 'today', // typically DOB should not be in the future
            onChange: (selectedDates: any, dateStr: string) => {
                this.demographicForm.get('PatientBirthDate')?.setValue(dateStr);
                this.calculateAgeOnChangeDOB(); // call your age calculation
            },
        });
    }

    initializeForm() {
        // this.demographicForm = this.fb.group({
        //     PatientPicture: [''],
        //     practice: [{ value: '', disabled: true }],
        //     MrNo: [{ value: '', disabled: true }],
        //     PersonTitleId: ['', Validators.required],
        //     PersonFirstName: ['', Validators.required],
        //     PersonMiddleName: [''],
        //     PersonLastName: ['', Validators.required],
        //     PersonSexId: ['', Validators.required],
        //     preferredName: [''],
        //     genderIdentity: [0, Validators.required],
        //     PersonMaritalStatus: [0, Validators.required],
        //     PatientBloodGroupId: [0, Validators.required],
        //     PatientBirthDate: ['', Validators.required],
        //     Age: [{ value: '', disabled: true }],
        //     personSocialSecurityNo: ['', Validators.required],
        //     LaborCardNo: [''],
        //     Religion: [''],
        //     PersonEthnicityTypeId: [''],
        //     Nationality: [0, Validators.required],
        //     PrimaryLanguage: [''],
        //     PersonPassportNo: [''],
        //     PersonDriversLicenseNo: [''],
        //     MediaChannelId: [''],
        //     MediaItemId: [''],
        //     ResidenceVisaNo: [''],
        //     EmiratesIDN: [null, Validators.required],
        //     primarycarephysicianPcp: [0, Validators.required],
        //     causeofDeath: [''],
        //     DeathDate: [null],

        //     BillingNote: ['', Validators.required],
        //     VIPPatient: [false],
        //     Pregnant: [false],
        //     AdvDirective: [false],
        //     DrugHistConsent: [false],
        //     ExemptReporting: [false],
        // }); 

        this.demographicForm = this.fb.group({
            PatientPicture: [''],
            practice: [{ value: '', disabled: true }],
            MrNo: [{ value: '', disabled: true }],
            PersonTitleId: [0, Validators.required],
            PersonFirstName: ['', Validators.required],
            PersonMiddleName: [''],
            PersonLastName: ['', Validators.required],
            PersonSexId: [0, Validators.required],
            preferredName: [''],
            genderIdentity: [0, Validators.required],
            PersonMaritalStatus: [0, Validators.required],
            PatientBloodGroupId: [0, Validators.required],
            PatientBirthDate: ['', Validators.required],
            Age: [{ value: '', disabled: true }],
            personSocialSecurityNo: ['', Validators.required],
            LaborCardNo: [''],
            Religion: [0],  // ✅ fixed
            PersonEthnicityTypeId: [0],  // ✅ fixed
            Nationality: [0, Validators.required],
            PrimaryLanguage: [0],  // ✅ fixed
            PersonPassportNo: [''],
            PersonDriversLicenseNo: [''],
            MediaChannelId: [0],  // ✅ fixed
            MediaItemId: [0],  // ✅ fixed
            ResidenceVisaNo: [''],
            EmiratesIDN: [null, Validators.required],
            primarycarephysicianPcp: [0, Validators.required],
            causeofDeath: [''],
            DeathDate: [null],
            BillingNote: ['', Validators.required],
            VIPPatient: [false],
            Pregnant: [false],
            AdvDirective: [false],
            DrugHistConsent: [false],
            ExemptReporting: [false],
          });

          
        this.contactForm = this.fb.group({
            streetName: ['', Validators.required],
            dwellingNumber: ['', Validators.required],
            CountryId: [Validators.required],
            StateId: [Validators.required],
            CityId: [Validators.required],
            faxNo: [''],
            postalCode: ['', Validators.required],
            homePhone: [''],
            cellPhone: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],
            ],
            workPhone: [''],
            email: ['', [Validators.required, Validators.email]],
        });
        this.nextForm = this.fb.group({
            relationshipId: [''],
            firstName: [''],
            middleName: [''],
            lastName: [''],
            streetName: [''],
            postalCode: [''],
            CountryId: [''],
            StateId: [''],
            CityId: [''],
            cellPhone: [''],
            homePhone: [''],
            workPhone: [''],
            email: [''],
        });

        this.parentsInfo = this.fb.group({

            fatherFirstName: [''],
            fatherMiddleName: [''],
            fatherLastName: [''],
            fatherHomePhone: [''],
            fatherCellPhone: [''],
            fatherPhoneNo: [''],
            fatherEmail: [''],

            motherFirstName: [''],
            motherMiddleName: [''],
            motherLastName: [''],
            motherHomePhone: [''],
            motherCellPhone: [''],
            motherPhoneNo: [''],
            motherEmail: [''],
        });

        this.emergencyContactForm = this.fb.group({
            relationship: [''],
            firstName: [''],
            middleName: [''],
            lastName: [''],
            streetName: [''],
            dwellingNumber: [''],
            faxNo: [''],
            postalCode: [''],
            CountryId: [''],
            StateId: [''],
            CityId: [''],
            cellPhone: [''],
            homePhone: [''],
            workPhone: [''],
            email: [''],
        });

        this.assignmentForm = this.fb.group({
            proofOfIncomeCheck: [false],
            proofOfIncome: [''],
            providerId: [''],
            feeScheduleId: [''],
            financialClassId: [''],
            locationId: [''],
            siteId: [''],
            consentStatus: [''], // Signed or Unsigned
            signedDate: [''],
            expiryDate: [''],
            entityTypeId: [''],
            entityNameId: [''],
            providerReferredId: [''],
        });

        this.familyForm = this.fb.group({
            mrNo: [''],
            accountType: ['Master'], // Default to Master
            masterMrNo: [''],
            relationshipId: [''],
        });
    }

    calculateAgeOnChangeDOB() {
        const dob = this.demographicForm.get('PatientBirthDate')?.value;
        if (dob) {
            const age = this.getAge(dob);
            this.demographicForm.patchValue({ Age: age });
        }
    }

    getAge(dob: Date): number {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event: any) =>
            result.next(btoa(event.target.result.toString()));
        return result;
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.fileName = file.name;
            this.convertFile(file).subscribe((base64) => {
                this.byteImage = base64;
                this.imageSrc = 'data:image/png;base64,' + base64;
                this.demographicForm.patchValue({
                    PatientPicture: this.imageSrc,
                });
            });
        }
    }

    fillDropdown() {
        this.FillCache();
        this.GetRegGenderIdentity();
        this.getEmiratesType();
        this.getFeeSchedule();
        this.getFinancialClass();
        this.getEntityTypes();
    }

    GetRegGenderIdentity() {
        this.DemographicApiServices.GetGenderIdentity().subscribe({
            next: (res: any) => {
                this.genderIdentity = res.getIdentityType;
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gender Identity Error',
                    text: err.message || 'Something went wrong',
                });
            },
        });
    }

    getEmiratesType() {
        this.DemographicApiServices.getAllEmirates().subscribe((res) => {
            this.Emirates = res as any[];
        });
    }

    getFeeSchedule() {
        this.DemographicApiServices.getAllFeeSchedule().subscribe((res) => {
            this.FeeSchedule = res as any[];
        });
    }

    getFinancialClass() {
        this.DemographicApiServices.getAllFinancialClass().subscribe((res) => {
            this.FinancialClass = res as any[];
        });
    }

    getEntityTypes() {
        this.DemographicApiServices.getAllEntityTypes().subscribe((res) => {
            this.EntityTypes = res as any[];
        });
    }

    FillCache() {
        this.DemographicApiServices.getCacheItem({
            entities: [
                'RegBloodGroup',
                'Provider',
                'PromotionalMediaChannel',
                'RegEthnicityTypes',
                'Language',
                'RegGender',
                'Emirates',
                'RegMaritalStatus',
                'Nationality',
                'Religion',
                'PromotionalMediaItem',
                'RegTitle',
                'RegCountries',
                'RegRelationShip',
                'RegLocationTypes',
                'EmiratesIDN',
            ],
        })
            .then((response: any) => {
                if (response.cache) {
                    this.FillDropDown(
                        JSON.parse(JSON.stringify(response)).cache
                    );
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

    FillDropDown(jParse: any) {
        const json = JSON.parse(jParse);

        this.bloodgroup = this.mapToDropdown(
            json.RegBloodGroup,
            'BloodGroupId',
            'BloodGroup'
        );
        this.gender = this.mapToDropdown(json.RegGender, 'GenderId', 'Gender');
        this.maritalstatus = this.mapToDropdown(
            json.RegMaritalStatus,
            'MaritalStatusId',
            'MaritalStatus'
        );
        this.nationality = this.mapToDropdown(
            json.Nationality,
            'NationalityId',
            'NationalityName'
        );
        this.religion = this.mapToDropdown(
            json.Religion,
            'ReligionId',
            'ReligionName'
        );
        this.language = this.mapToDropdown(
            json.Language,
            'LanguageId',
            'LanguageName'
        );
        this.titles = this.mapToDropdown(json.RegTitle, 'TitleId', 'Title');
        this.MediaChannel = this.mapToDropdown(
            json.PromotionalMediaChannel,
            'MediaChannelId',
            'Name'
        );
        this.MediaItem = this.mapToDropdown(
            json.PromotionalMediaItem,
            'MediaItemId',
            'Name'
        );
        this.ethinic = this.mapToDropdown(
            json.RegEthnicityTypes,
            'TypeId',
            'Name'
        );
        this.referred = this.mapToDropdown(
            json.Provider,
            'EmployeeId',
            'FullName'
        );
        this.Emirates = this.mapToDropdown(json.Emirates, 'Emirate', 'Name');
        let regcountries = JSON.parse(jParse).RegCountries;
        let reggender = JSON.parse(jParse).RegGender;
        let relationships = JSON.parse(jParse).RegRelationShip;
        let site = JSON.parse(jParse).RegLocationTypes;

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

        if (site) {
            this.Site = site.map((item: { TypeId: any; Name: any }) => ({
                id: item.TypeId,
                name: item.Name,
            }));
        }

        if (relationships) {
            relationships = relationships.map(
                (item: { RelationshipId: any; Relationship: any }) => {
                    return {
                        name: item.Relationship,
                        code: item.RelationshipId,
                    };
                }
            );
            this.relationships = relationships;
        }
    }

    mapToDropdown(
        source: any[],
        valueField: string,
        labelField: string
    ): any[] {
        if (!Array.isArray(source)) return [];
        return source.map((item) => ({
            code: item[valueField],
            name: item[labelField],
        }));
    }

    getDemographicsByMRNo(MrNo: string = '') {
        this.DemographicApiServices.getDemographicsByMRNo(MrNo)
            .then((demographics: any) => {
                if (demographics?.table1?.length > 0) {
                    console.log('responce', demographics.table1[0]);

                    const data: DemographicDTO = demographics.table1[0];

                    this.demographicForm.patchValue(data);
                    const gender =  this.gender.find((e: any) => e.name == demographics?.table1[0]?.gender)?.code;
                    const title =  this.titles.find((e: any) => e.name == demographics?.table1[0]?.title)?.code;
                    const maritalstatus = this.maritalstatus.find((e:any) => e.name == demographics?.table1[0]?.maritalStatus)?.code;
                    const bloodGroup = this.bloodgroup.find((e:any) => e.name == demographics?.table1[0]?.bloodGroup)?.code;
                    const billingNote = this.billingNote.find((e:any) => e.name == demographics?.table1[0]?.billingNote)?.code;
                    const ethinic = this.ethinic.find((e:any) => e.name == demographics?.table1[0]?.ethinic)?.code;
                    //const LaborCardNo = this.laborCardNo.find((e: any) => e.name == demographics?.table1[0]?.LaborCardNo)?.code;
                    const DOB = demographics?.table1[0]?.patientBirthDate;
                    const emiratesIDN = this.Emirates.find((e:any) => e.name == demographics?.table1[0]?.emiratesIDN)?.code;
                    this.demographicForm.patchValue({
                    PersonFirstName: demographics?.table1[0]?.personFirstName,
                    PersonMiddleName: demographics?.table1[0]?.personMiddleName,
                    PersonLastName: demographics?.table1[0]?.personLastName,
                    PersonSexId: gender,
                    PersonTitleId:title,
                    BillingNote: billingNote,

                    PersonMaritalStatus:  maritalstatus,
                    emails: demographics?.table1[0]?.email,
                    PersonEthnicityType: demographics?.table1[0]?.PersonEthnicityType,

                    PatientBloodGroupId: bloodGroup,
                    PatientBirthDate: DOB.split('T')[0] || null,
                    LaborCardNo: demographics?.table1[0]?.LaborCardNo,
                    personSocialSecurityNo: demographics?.table1[0]?.personSocialSecurityNo,


                });
                    this.imageSrc = data.PatientPicture ?? '';
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to load demographic data.',
                });
            });
    }

    ngAfterViewIniti(): void {
        this.FillDropDown(this.qid);
    }

    onSubmit() {
        const formData: DemographicDTO = this.demographicForm.getRawValue();

        if (
            !formData.PatientPicture ||
            formData.PatientPicture === this.defaultImage
        ) {
            formData.PatientPicture = undefined;
        }

        formData.practice = formData.practice || '';
        formData.MrNo = formData.MrNo || '';
        formData.PersonFirstName = formData.PersonFirstName || '';
        formData.PersonLastName = formData.PersonLastName || '';
        formData.PersonSexId = formData.PersonSexId || 0;
        formData.genderIdentity = formData.genderIdentity || 0;
        formData.PersonMaritalStatus = formData.PersonMaritalStatus || 0;
        formData.PatientBloodGroupId = formData.PatientBloodGroupId || 0;
        formData.PatientBirthDate = formData.PatientBirthDate || new Date();
        formData.personSocialSecurityNo = formData.personSocialSecurityNo || '';
        formData.Nationality = formData.Nationality || 0;
        formData.EmiratesIDN = formData.EmiratesIDN || '';
        formData.primarycarephysicianPcp =
        formData.primarycarephysicianPcp || 0;
        formData.BillingNote = formData.BillingNote || '';
        
        const Contact: ContactDTO = {
            streetName : this.contactForm.get('streetName')?.value,
            dwellingNumber : this.contactForm.get('dwellingNumber')?.value,
            countryId : this.contactForm.get('CountryId')?.value,
            stateId : this.contactForm.get('StateId')?.value,
            cityId : this.contactForm.get('CityId')?.value,
            fax : this.contactForm.get('faxNo')?.value,
            postalCode : this.contactForm.get('postalCode')?.value,
            cellPhone : this.contactForm.get('cellPhone')?.value,
            homePhone : this.contactForm.get('homePhone')?.value,
            workPhone : this.contactForm.get('workPhone')?.value,
            email : this.contactForm.get('email')?.value,
        };

        const NextOfKin: NextOfKinDTO = {
            relationshipId: this.nextForm.get('relationshipId')?.value,
            firstName: this.nextForm.get('firstName')?.value,
            middleName: this.nextForm.get('middleName')?.value,
            lastName: this.nextForm.get('lastName')?.value,
            streetName: this.nextForm.get('streetName')?.value,
            countryId: this.nextForm.get('CountryId')?.value,
            stateId: this.nextForm.get('StateId')?.value,
            cityId: this.nextForm.get('CityId')?.value,
            postalCode: this.nextForm.get('postalCode')?.value,
            cellPhone: this.nextForm.get('cellPhone')?.value,
            homePhone: this.nextForm.get('homePhone')?.value,
            workPhone: this.nextForm.get('workPhone')?.value,
            email: this.nextForm.get('email')?.value,
        };

        

        const Parent: ParentDTO = {
            firstName: this.parentsInfo.get('fatherFirstName')?.value,
            middleName: this.parentsInfo.get('fatherMiddleName')?.value,
            lastName: this.parentsInfo.get('fatherLastName')?.value,
            homePhone: this.parentsInfo.get('fatherHomePhone')?.value,
            cellPhone: this.parentsInfo.get('fatherCellPhone')?.value,
            email: this.parentsInfo.get('fatherEmail')?.value,
            motherFirstName: this.parentsInfo.get('motherFirstName')?.value,
            mothermiddleName: this.parentsInfo.get('motherMiddleName')?.value,
            motherLastName: this.parentsInfo.get('motherLastName')?.value,
            motherHomePhone: this.parentsInfo.get('motherHomePhone')?.value,
            motherCellPhone: this.parentsInfo.get('motherCellPhone')?.value,
            motherEmail: this.parentsInfo.get('motherEmail')?.value,
        };

        const Assignments: AssignmentsDTO = {
            proofOfIncome: this.assignmentForm.get('proofOfIncome')?.value,
            providerId: this.assignmentForm.get('providerId')?.value,
            feeScheduleId: this.assignmentForm.get('feeScheduleId')?.value,
            financialClassId: this.assignmentForm.get('financialClassId')?.value,
            locationId: this.assignmentForm.get('locationId')?.value,
            siteId: this.assignmentForm.get('siteId')?.value,
            signedDate: this.assignmentForm.get('signedDate')?.value,
            unsignedDate: this.assignmentForm.get('expiryDate')?.value,
            entityTypeId: this.assignmentForm.get('entityTypeId')?.value,
            entityNameId: this.assignmentForm.get('entityNameId')?.value,
            referredById: this.assignmentForm.get('referredById')?.value,
        };

        const FamilyMembers: FamilyMembersDTO = {
            mrNo: this.familyForm.get('mrNo')?.value,
            accountTypeId: 0, 
            // this.familyForm.get('accountType')?.value,
            masterMrNo: this.familyForm.get('masterMrNo')?.value,
            relationshipId: this.familyForm.get('relationshipId')?.value,
        }; 

        const demographic: DemographicDTO = {
            ...formData,
            // VIPPatient: this.demographicForm.get('isVIP')?.value ?? false,
            // Pregnant: this.demographicForm.get('isPregnant')?.value ?? false,
            // AdvDirective: this.demographicForm.get('isDirective')?.value ?? false,
            // DrugHistConsent: this.demographicForm.get('isDrugHist')?.value ?? false,
            // ExemptReporting: this.demographicForm.get('isExpReporting')?.value ?? false,
            Contact: Contact,
            NextOfKin: null,
            // NextOfKin,
            Parent: null,
            // Parent,
            Assignments: null,
            // Assignments,
            FamilyMembers: null,
            // FamilyMembers,
            Employment: null,
            EmergencyContact: null,
            Spouse: null,
            regPatientEmployer: null,
            regAccount: null
            };

        this.DemographicApiServices.submitDemographic(demographic).subscribe({
            next: (res: any) => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Demographic saved successfully!',
                    showConfirmButton: false,
                    timer: 2000,
                });
                this.router.navigate(['/registration/demographic']);
            },
            error: (error: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text:
                        error?.error || error.message || 'Something went wrong',
                });
            },
        });
    }

    cancel() {
        this.router.navigate(['/registration/demographics']);
    }

    showcheckBox: boolean = false;
    MyEmployment: any[] = [];
    selectedRowIds: Set<number> = new Set();
    currentMaxId: number = 0;

    OnCountryChange(countryId: any) {
        this.contactForm.patchValue({ CountryId: countryId });
        this.DemographicApiServices.getStateByCountry(countryId).then(
            (response) => {
                this.state = response as any[];
            }
        );
    }

    OnStateChange(State: any) {
        if (State?.value?.stateId) {
            this.DemographicApiServices.getCityByState(
                State.value.stateId
            ).then((response) => {
                this.citie = response as any[];
            });
        } else {
            this.citie = [];
        }
    }

    onCountryChange() {
        const countryId = this.contactForm.get('CountryId')?.value;
        if (countryId) {
            this.registrationApi
                .getStateByCountry(countryId)
                .then((res: any) => {
                    this.states = res;
                    this.contactForm.get('StateId')?.setValue(null); // Reset State
                    this.city = [];
                    this.contactForm.get('CityId')?.setValue(null); // Reset City
                });
        } else {
            this.states = [];
            this.city = [];
            this.contactForm.get('StateId')?.setValue(null);
            this.contactForm.get('CityId')?.setValue(null);
        }
    }

    onStateChange() {
        const stateId = this.contactForm.get('StateId')?.value;
        if (stateId) {
            this.registrationApi.getCityByState(stateId).then((res: any) => {
                this.city = res;
                this.contactForm.get('CityId')?.setValue(null); // Reset City
            });
        } else {
            this.city = [];
            this.contactForm.get('CityId')?.setValue(null);
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
    goBack() {
        this.router.navigate(['registration/demographics']);
    }
}
