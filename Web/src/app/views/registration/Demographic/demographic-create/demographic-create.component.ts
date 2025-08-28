import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FilePondModule } from 'ngx-filepond';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, ReplaySubject } from 'rxjs';
import { NgxDaterangepickerBootstrapDirective } from 'ngx-daterangepicker-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import Swal from 'sweetalert2';

import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { LoaderService } from '@core/services/loader.service';
import { 
    AssignmentsDTO, 
    ContactDTO, 
    DemographicDTO, 
    FamilyMembersDTO, 
    NextOfKinDTO, 
    ParentDTO 
} from '@/app/shared/Models/registration/Demographics/Demographic.type.model';

declare var flatpickr: any;
import { DemographicPhotoPersonalComponent } from './components/demographic-photo-personal.component';
import { DemographicBasicDetailsComponent } from './components/demographic-basic-details.component';
import { DemographicIdentificationComponent } from './components/demographic-identification.component';
import { DemographicContactComponent } from './components/demographic-contact.component';
import { DemographicEmergencyContactComponent } from './components/demographic-emergency-contact.component';
import { DemographicNextOfKinComponent } from './components/demographic-next-of-kin.component';
import { DemographicSpouseComponent } from './components/demographic-spouse.component';
import { DemographicParentsComponent } from './components/demographic-parents.component';
import { DemographicAssignmentsComponent } from './components/demographic-assignments.component';
import { DemographicFamilyComponent } from './components/demographic-family.component';
import { DemographicTabsComponent } from './components/demographic-tabs.component';

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
        LucideAngularModule,
        DemographicPhotoPersonalComponent,
        DemographicBasicDetailsComponent,
        DemographicIdentificationComponent,
        DemographicContactComponent,
        DemographicEmergencyContactComponent,
        DemographicNextOfKinComponent,
        DemographicSpouseComponent,
        DemographicParentsComponent,
        DemographicAssignmentsComponent,
        DemographicFamilyComponent,
        DemographicTabsComponent
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
    spouseForm!: FormGroup;

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
    isFormSubmitted: boolean = false;

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
        private route: ActivatedRoute,
        private DemographicApiServices: DemographicApiServices,
        private registrationApi: RegistrationApiService,
        public Loader: LoaderService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.fillDropdown();
        
        // Set up real-time validation listeners
        this.setupFormValidationListeners();
        
        // Get MR number from route if editing
        const mrNo = this.route.snapshot.paramMap.get('mrNo');
        if (mrNo) {
            this.getDemographicsByMRNo(mrNo);
        }
    }

    onEmergencyCountryChange() {
        const countryId = this.emergencyContactForm.get('CountryId')?.value;
        if (countryId) {
            this.registrationApi
                .getStateByCountry(countryId)
                .then((res: any) => {
                    this.states = res;
                    this.emergencyContactForm.get('StateId')?.setValue(null);
                    this.city = [];
                    this.emergencyContactForm.get('CityId')?.setValue(null);
                });
        } else {
            this.states = [];
            this.city = [];
            this.emergencyContactForm.get('StateId')?.setValue(null);
            this.emergencyContactForm.get('CityId')?.setValue(null);
        }
    }

    onEmergencyStateChange() {
        const stateId = this.emergencyContactForm.get('StateId')?.value;
        if (stateId) {
            this.registrationApi.getCityByState(stateId).then((res: any) => {
                this.city = res;
                this.emergencyContactForm.get('CityId')?.setValue(null);
            });
        } else {
            this.city = [];
            this.emergencyContactForm.get('CityId')?.setValue(null);
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

        this.demographicForm = this.fb.group({
            PatientPicture: [''],
            practice: [{ value: '', disabled: true }],
            MrNo: [{ value: '', disabled: true }],
            PersonTitleId: [null, Validators.required],
            PersonFirstName: ['', Validators.required],
            PersonMiddleName: [''],
            PersonLastName: ['', Validators.required],
            PersonSexId: [null, Validators.required],
            preferredName: [''],
            genderIdentity: [null, Validators.required],
            PersonMaritalStatus: [null, Validators.required],
            PatientBloodGroupId: [null, Validators.required],
            PatientBirthDate: ['', Validators.required],
            Age: [{ value: '', disabled: true }],
            personSocialSecurityNo: ['', Validators.required],
            LaborCardNo: [''],
            Religion: [null],
            PersonEthnicityTypeId: [null],
            Nationality: [null, Validators.required],
            PrimaryLanguage: [null],
            PersonPassportNo: [''],
            PersonDriversLicenseNo: [''],
            MediaChannelId: [null],
            MediaItemId: [null],
            ResidenceVisaNo: [''],
            EmiratesIDN: [null, Validators.required],
            primarycarephysicianPcp: ['', Validators.required],
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
            CountryId: [null, Validators.required],
            StateId: [null, Validators.required],
            CityId: [null, Validators.required],
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

        this.emergencyContactForm = this.fb.group({
            relationshipId: [''],
            firstName: [''],
            middleName: [''],
            lastName: [''],
            streetName: [''],
            CountryId: [null],
            StateId: [null],
            CityId: [null],
            postalCode: [''],
            cellPhone: [''],
            homePhone: [''],
            workPhone: [''],
            email: [''],
        });

        this.familyForm = this.fb.group({
            mrNo: [''],
            accountType: ['Master'], // Default to Master
            masterMrNo: [''],
            relationshipId: [''],
        });

        this.spouseForm = this.fb.group({
            firstName: [''],
            middleName: [''],
            lastName: [''],
            Sex: [null],
        });
    }

    // Set up real-time validation listeners for reactive icon updates
    setupFormValidationListeners(): void {
        // Listen to demographic form changes
        this.demographicForm.valueChanges.subscribe(() => {
            // Trigger change detection for validation icons
        });

        // Listen to contact form changes
        this.contactForm.valueChanges.subscribe(() => {
            // Trigger change detection for validation icons
        });

        // Listen to other forms as needed
        this.nextForm.valueChanges.subscribe(() => {});
        this.parentsInfo.valueChanges.subscribe(() => {});
        this.emergencyContactForm.valueChanges.subscribe(() => {});
        this.assignmentForm.valueChanges.subscribe(() => {});
        this.familyForm.valueChanges.subscribe(() => {});
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
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Please select a valid image file (JPEG, PNG, GIF)',
                });
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Please select an image smaller than 5MB',
                });
                return;
            }

            this.fileName = file.name;
            this.convertFile(file).subscribe((base64) => {
                this.byteImage = base64;
                this.imageSrc = 'data:' + file.type + ';base64,' + base64;
                this.demographicForm.patchValue({
                    PatientPicture: this.imageSrc,
                });
                
                Swal.fire({
                    icon: 'success',
                    title: 'Photo Uploaded!',
                    text: 'Patient photo has been uploaded successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
            });
        }
    }

    removePhoto() {
        this.fileName = '';
        this.imageSrc = '';
        this.byteImage = '';
        this.demographicForm.patchValue({
            PatientPicture: '',
        });
        
        Swal.fire({
            icon: 'info',
            title: 'Photo Removed',
            text: 'Patient photo has been removed.',
            timer: 1500,
            showConfirmButton: false
        });
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
            this.Emirates = this.mapToDropdown(res as any[], 'id', 'name');
            console.log('Emirates from API:', this.Emirates);
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
        console.log('referred',this.referred)
        this.Emirates = this.mapToDropdown(json.Emirates, 'Emirate', 'Name');
        console.log('Emirates from cache:', this.Emirates);
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
                    const gender = this.gender.find((e: any) => e.name == demographics?.table1[0]?.gender)?.code;
                    const title = this.titles.find((e: any) => e.name == demographics?.table1[0]?.title)?.code;
                    const maritalstatus = this.maritalstatus.find((e: any) => e.name == demographics?.table1[0]?.maritalStatus)?.code;
                    const bloodGroup = this.bloodgroup.find((e: any) => e.name == demographics?.table1[0]?.bloodGroup)?.code;
                    const billingNote = this.billingNote.find((e: any) => e.name == demographics?.table1[0]?.billingNote)?.code;
                    const ethinic = this.ethinic.find((e: any) => e.name == demographics?.table1[0]?.ethinic)?.code;
                    const DOB = demographics?.table1[0]?.patientBirthDate;
                    const emiratesIDN = this.Emirates.find((e: any) => e.name == demographics?.table1[0]?.emiratesIDN)?.code;
                    this.demographicForm.patchValue({
                        PersonFirstName: demographics?.table1[0]?.personFirstName,
                        PersonMiddleName: demographics?.table1[0]?.personMiddleName,
                        PersonLastName: demographics?.table1[0]?.personLastName,
                        PersonSexId: gender,
                        PersonTitleId: title,
                        BillingNote: billingNote,
                        PersonMaritalStatus: maritalstatus,
                        emails: demographics?.table1[0]?.email,
                        PersonEthnicityType: demographics?.table1[0]?.PersonEthnicityType,
                        PatientBloodGroupId: bloodGroup,
                        PatientBirthDate: DOB.split('T')[0] || null,
                        LaborCardNo: demographics?.table1[0]?.LaborCardNo,
                        personSocialSecurityNo: demographics?.table1[0]?.personSocialSecurityNo
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


    onSubmit() {
        // Mark form as submitted to trigger validation icons
        this.isFormSubmitted = true;
        
        // Validate all forms before submission
        const validationErrors = this.validateAllForms();
        
        if (validationErrors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: `<div class="text-start">
                    <p><strong>Please fix the following errors:</strong></p>
                    <ul>
                        ${validationErrors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                </div>`,
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData: DemographicDTO = this.demographicForm.getRawValue();

        if (
            !formData.PatientPicture ||
            formData.PatientPicture === this.defaultImage
        ) {
            formData.PatientPicture = undefined;
        }

        // Keep the actual form values - don't override with defaults
        // The validation should have already ensured required fields are filled
        
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

        const demographic = {
            patientId: 0,
            personFirstName: formData.PersonFirstName,
            personMiddleName: formData.PersonMiddleName || "",
            personLastName: formData.PersonLastName,
            personTitleId: formData.PersonTitleId,
            personSocialSecurityNo: formData.personSocialSecurityNo,
            personPassportNo: formData.PersonPassportNo || "",
            personSexId: formData.PersonSexId,
            personMaritalStatus: formData.PersonMaritalStatus,
            vipPatient: formData.VIPPatient || false,
            practice: formData.practice || "",
            personEthnicityTypeId: formData.PersonEthnicityTypeId || 0,
            patientBirthDate: formData.PatientBirthDate,
            personDriversLicenseNo: formData.PersonDriversLicenseNo || "",
            patientBloodGroupId: formData.PatientBloodGroupId,
            patientPicture: formData.PatientPicture || "",
            genderIdentity: formData.genderIdentity,
            residenceVisaNo: formData.ResidenceVisaNo || "",
            laborCardNo: formData.LaborCardNo || "",
            religion: formData.Religion || 0,
            primaryLanguage: formData.PrimaryLanguage || 0,
            nationality: formData.Nationality,
            empi: "",
            updatedBy: "",
            mediaChannelId: formData.MediaChannelId || 0,
            mediaItemId: formData.MediaItemId || 0,
            emiratesIDN: formData.EmiratesIDN || "",
            personNameArabic: "",
            tabsTypeId: 4,
            billingNote: formData.BillingNote,
            advDirective: formData.AdvDirective || false,
            pregnant: formData.Pregnant || false,
            drugHistConsent: formData.DrugHistConsent || false,
            exemptReporting: formData.ExemptReporting || false,
            dateofDeath: this.demographicForm.get('DeathDate')?.value || null,
            causeofDeath: formData.causeofDeath || "",
            preferredName: formData.preferredName || "",
            primarycarephysicianPcp: formData.primarycarephysicianPcp || "",
            erelationshipId: 0,
            regPatientEmployer: [],
            regAccount: [],
            contact: Contact,
            employment: null,
            emergencyContact: null,
            nextOfKin: null,
            spouse: null,
            parent: null,
            assignments: null,
            familyMembers: null
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
                let errorMessage = 'Something went wrong';
                
                if (error?.error) {
                    if (typeof error.error === 'string') {
                        errorMessage = error.error;
                    } else if (error.error.message) {
                        errorMessage = error.error.message;
                    } else {
                        errorMessage = JSON.stringify(error.error);
                    }
                } else if (error?.message) {
                    errorMessage = error.message;
                }
                
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Error',
                    text: errorMessage,
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


    // Tab validation methods
    isDemographicTabValid(): boolean {
        const form = this.demographicForm;
        const requiredFields = [
            'PersonTitleId', 'PersonFirstName', 'PersonLastName', 'PersonSexId',
            'genderIdentity', 'PersonMaritalStatus', 'PatientBloodGroupId',
            'PatientBirthDate', 'personSocialSecurityNo', 'Nationality',
            'EmiratesIDN', 'primarycarephysicianPcp', 'BillingNote'
        ];
        return requiredFields.every(field => {
            const control = form.get(field);
            return control && control.valid && control.value !== null && control.value !== '';
        });
    }

    isContactTabValid(): boolean {
        const form = this.contactForm;
        const requiredFields = [
            'streetName', 'dwellingNumber', 'CountryId', 'StateId',
            'CityId', 'postalCode', 'cellPhone', 'email'
        ];
        return requiredFields.every(field => {
            const control = form.get(field);
            return control && control.valid && control.value !== null && control.value !== '';
        });
    }

    isEmergencyContactTabValid(): boolean {
        // Emergency contact is optional, so always return true
        // You can add validation logic here if needed
        return true;
    }

    isSpouseTabValid(): boolean {
        // Spouse info is optional; add rules if needed
        return true;
    }

    isNextOfKinTabValid(): boolean {
        // Next of kin info is optional; add rules if needed
        return true;
    }

    isParentsTabValid(): boolean {
        // Parents info is optional; add rules if needed
        return true;
    }

    isAssignmentTabValid(): boolean {
        // Assignment is optional, so always return true
        // You can add validation logic here if needed
        return true;
    }

    isFamilyTabValid(): boolean {
        // Family is optional, so always return true
        // You can add validation logic here if needed
        return true;
    }

    // Method to get tab validation status
    getTabValidationStatus() {
        return {
            demographic: this.isDemographicTabValid(),
            contact: this.isContactTabValid(),
            nextOfKin: this.isNextOfKinTabValid(),
            parents: this.isParentsTabValid(),
            emergencyContact: this.isEmergencyContactTabValid(),
            assignment: this.isAssignmentTabValid(),
            family: this.isFamilyTabValid()
        };
    }

    // Comprehensive form validation with specific error messages
    validateAllForms(): string[] {
        const errors: string[] = [];

        // Demographic form validation
        if (!this.isDemographicTabValid()) {
            const demographicErrors = this.getDemographicValidationErrors();
            errors.push(...demographicErrors);
        }

        // Contact form validation
        if (!this.isContactTabValid()) {
            const contactErrors = this.getContactValidationErrors();
            errors.push(...contactErrors);
        }

        return errors;
    }

    // Get specific demographic validation errors
    getDemographicValidationErrors(): string[] {
        const errors: string[] = [];
        const form = this.demographicForm;

        // Debug form values
        console.log('Form Values Debug:', {
            PersonSexId: form.get('PersonSexId')?.value,
            PersonMaritalStatus: form.get('PersonMaritalStatus')?.value,
            EmiratesIDN: form.get('EmiratesIDN')?.value,
            genderIdentity: form.get('genderIdentity')?.value,
            PatientBloodGroupId: form.get('PatientBloodGroupId')?.value
        });

        if (!form.get('PersonTitleId')?.value) {
            errors.push('Title is required');
        }
        if (!form.get('PersonFirstName')?.value?.trim()) {
            errors.push('First Name is required');
        }
        if (!form.get('PersonLastName')?.value?.trim()) {
            errors.push('Last Name is required');
        }
        if (!form.get('PersonSexId')?.value) {
            console.log('Gender validation failed, value:', form.get('PersonSexId')?.value);
            errors.push('Gender is required');
        }
        if (!form.get('genderIdentity')?.value) {
            errors.push('Gender Identity is required');
        }
        if (!form.get('PersonMaritalStatus')?.value) {
            console.log('Marital Status validation failed, value:', form.get('PersonMaritalStatus')?.value);
            errors.push('Marital Status is required');
        }
        if (!form.get('PatientBloodGroupId')?.value) {
            errors.push('Blood Group is required');
        }
        if (!form.get('PatientBirthDate')?.value) {
            errors.push('Date of Birth is required');
        }
        if (!form.get('personSocialSecurityNo')?.value?.trim()) {
            errors.push('Social Security Number is required');
        }
        if (!form.get('Nationality')?.value) {
            errors.push('Nationality is required');
        }
        if (!form.get('EmiratesIDN')?.value) {
            console.log('Emirates ID validation failed, value:', form.get('EmiratesIDN')?.value);
            errors.push('Emirates ID Type is required');
        }
        if (!form.get('primarycarephysicianPcp')?.value) {
            errors.push('Primary Care Physician is required');
        }
        if (!form.get('BillingNote')?.value?.trim()) {
            errors.push('Billing Note is required');
        }

        return errors;
    }

    // Get specific contact validation errors
    getContactValidationErrors(): string[] {
        const errors: string[] = [];
        const form = this.contactForm;

        if (!form.get('streetName')?.value?.trim()) {
            errors.push('Street Name is required in Contact tab');
        }
        if (!form.get('dwellingNumber')?.value?.trim()) {
            errors.push('Dwelling Number is required in Contact tab');
        }
        if (!form.get('CountryId')?.value) {
            errors.push('Country is required in Contact tab');
        }
        if (!form.get('StateId')?.value) {
            errors.push('State is required in Contact tab');
        }
        if (!form.get('CityId')?.value) {
            errors.push('City is required in Contact tab');
        }
        if (!form.get('postalCode')?.value?.trim()) {
            errors.push('Postal Code is required in Contact tab');
        }
        if (!form.get('cellPhone')?.value?.trim()) {
            errors.push('Cell Phone is required in Contact tab');
        }
        if (!form.get('email')?.value?.trim()) {
            errors.push('Email is required in Contact tab');
        } else if (form.get('email')?.invalid) {
            errors.push('Valid Email is required in Contact tab');
        }

        return errors;
    }
}
