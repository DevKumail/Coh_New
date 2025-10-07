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
import { LucideAngularModule, LucideHome, LucideChevronRight, LucideUsers } from 'lucide-angular';
import { Observable, ReplaySubject } from 'rxjs';
import { NgxDaterangepickerBootstrapDirective } from 'ngx-daterangepicker-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import Swal from 'sweetalert2';

import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { LoaderService } from '@core/services/loader.service';
import {
    Assignments as AssignmentsModel,
    Contact as ContactModel,
    Demographic as DemographicModel,
    FamilyMembers as FamilyMembersModel,
    NextOfKin as NextOfKinModel,
    Parent as ParentModel
} from '@/app/shared/Models/registration/Demographics/Demographic.model';

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
import { DemographicDTO } from '@/app/shared/Models/registration/Demographics/Demographic.type.model';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
    selector: 'app-demographic-create',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        TranslatePipe,
        FilePondModule,
        NgbNavModule,
        LucideAngularModule,
        DemographicPhotoPersonalComponent,
        DemographicIdentificationComponent,
        DemographicContactComponent,
        DemographicEmergencyContactComponent,
        DemographicNextOfKinComponent,
        DemographicSpouseComponent,
        DemographicParentsComponent,
        DemographicAssignmentsComponent,
        DemographicFamilyComponent,
        DemographicTabsComponent,
        FilledOnValueDirective
    ],
    providers: [provideNgxMask()],

    standalone: true,
    templateUrl: './demographic-create.component.html',
    styleUrl: './demographic-create.component.scss',
})
export class DemographicCreateComponent implements OnInit, AfterViewInit {
    @ViewChild('picker') picker!: NgxDaterangepickerBootstrapDirective;

    // lucide-angular icons for breadcrumb + heading
    protected readonly homeIcon = LucideHome;
    protected readonly chevronRightIcon = LucideChevronRight;
    protected readonly headingIcon = LucideUsers;

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
    // preferredName: [] = [];
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
    // Shared caches (keep, but not used for tab dropdown lists)
    states: any[] = [];
    city: any[] = [];
    EmploymentTypes :any [ ] = [];
    // Per-tab dropdown sources to avoid cross-tab interference
    contactStates: any[] = [];
    contactCities: any[] = [];
    emergencyStates: any[] = [];
    emergencyCities: any[] = [];
    nextStates: any[] = [];
    nextCities: any[] = [];
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
    defaultImage: string = 'assets/images/patient.jpg';
    preferredName: string = '';
    familyMembers: any;
    patientId: any;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private DemographicApiServices: DemographicApiServices,
        private registrationApi: RegistrationApiService,
        public Loader: LoaderService,
        private secureStorage: SecureStorageService,

    ) {}

    async ngOnInit() {
        this.initializeForm();
        this.fillDropdown();
        
        // Set up real-time validation listeners
        this.setupFormValidationListeners();
        




          // Prefer Router navigation state; fallback to window.history.state for refresh/reuse
  const nav = this.router.getCurrentNavigation();
  const navState: any = nav?.extras?.state ?? (window.history && (window.history.state as any)) ?? {};
  const statemrNo = navState?.patientId;
  console.log('statepatientId =>',statemrNo);
  const statepatient = navState?.patient;
  console.log('statepatient =>',statepatient);
  if(statepatient){
      this.patientId = statepatient.patientId;
  }

  // Fallback to secure storage on page refresh
  const storedId = this.secureStorage.getItem('demographicEditId');

  if (statemrNo != null) {
    this.qid = Number(statemrNo);
    await this.getDemographicsByMRNo(this.qid);
  } else if (storedId) {  
    this.qid = Number(storedId);
    await this.getDemographicsByMRNo(this.qid);
  }

  // Clear once consumed to avoid stale usage
  if (this.qid) {
    this.secureStorage.removeItem('demographicEditId');
  }






        // Get MR number from route if editing
        const mrNo = this.route.snapshot.paramMap.get('mrNo');
        console.log('mrNo', mrNo);
        
        if (mrNo) {
            this.getDemographicsByMRNo(mrNo);
        }

    }

    private focusFirstInvalidControl(): void {
        // Defer to allow template to update validation classes
        setTimeout(() => {
            // Search across all forms for the first invalid control
            const selector = 'form .ng-invalid.ng-touched, form .ng-invalid[formcontrolname]';
            const firstInvalid = document.querySelector(selector) as HTMLElement | null;
            if (firstInvalid) {
                try { firstInvalid.focus({ preventScroll: true } as any); } catch {}
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    async onEmergencyCountryChange() {
        const countryId = this.emergencyContactForm.get('CountryId')?.value;
        if (countryId) {
            await this.registrationApi
                .getStateByCountry(countryId)
                .then((res: any) => {
                    this.emergencyStates = Array.isArray(res)
                        ? res.map((item: any) => ({
                            stateId: item?.stateId ?? item?.StateId ?? item?.code ?? null,
                            name: item?.name ?? item?.StateName ?? item?.stateName ?? ''
                        }))
                        : [];
                    this.emergencyContactForm.get('StateId')?.setValue(null);
                    this.emergencyCities = [];
                    this.emergencyContactForm.get('CityId')?.setValue(null);
                });
        } else {
            this.emergencyStates = [];
            this.emergencyCities = [];
            this.emergencyContactForm.get('StateId')?.setValue(null);
            this.emergencyContactForm.get('CityId')?.setValue(null);
        }
    }

    async onEmergencyStateChange() {
        const stateId = this.emergencyContactForm.get('StateId')?.value;
        if (stateId) {
            await this.registrationApi.getCityByState(stateId).then((res: any) => {
                this.emergencyCities = Array.isArray(res)
                    ? res.map((item: any) => ({
                        cityId: item?.cityId ?? item?.CityId ?? item?.code ?? null,
                        name: item?.name ?? item?.CityName ?? item?.cityName ?? ''
                    }))
                    : [];
                this.emergencyContactForm.get('CityId')?.setValue(null);
            });
        } else {
            this.emergencyCities = [];
            this.emergencyContactForm.get('CityId')?.setValue(null);
        }
    }

    ngAfterViewInit(): void {
        flatpickr('#deathDate', {
            dateFormat: 'd/m/Y',
            maxDate: 'today', // prevent future dates
            onChange: (selectedDates: any, dateStr: string) => {
                this.demographicForm.get('DeathDate')?.setValue(dateStr);
            },
        });

        flatpickr('#birthDate', {
            dateFormat: 'd/m/Y',
            maxDate: 'today', // typically DOB should not be in the future
            onChange: (selectedDates: any, dateStr: string) => {
                this.demographicForm.get('PatientBirthDate')?.setValue(dateStr);
                this.calculateAgeOnChangeDOB(); // call your age calculation
            },
        });
    }

    // Format incoming date (ISO string or date-like) to dd/MM/yyyy for the UI pickers
    private formatToDMY(input: any): string | null {
        if (!input) return null;
        try {
            // If string with T, split
            let s = typeof input === 'string' ? input : '';
            if (s.includes('T')) s = s.split('T')[0]; // yyyy-MM-dd
            // If already dd/MM/yyyy, return as-is
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
            // If yyyy-MM-dd, convert
            const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (isoMatch) {
                const [, y, m, d] = isoMatch;
                return `${d}/${m}/${y}`;
            }
            // Fallback: try Date
            const d = new Date(input);
            if (!isFinite(d.getTime())) return null;
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        } catch {
            return null;
        }
    }

    initializeForm() {

        this.demographicForm = this.fb.group({
            imageSrc: [''],
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
            dwellingNumber: [''],
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
                this.imageSrc = 'data:' + file.type + ';base64,' + base64; // for preview only
                // Store only raw base64 in the form to match backend expectations
                this.demographicForm.patchValue({
                    PatientPicture: this.byteImage,
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
        this.DemographicApiServices.getAllFeeSchedule().subscribe((res: any) => {
            this.FeeSchedule = res || [];
        });
    }

    getFinancialClass() {
        this.DemographicApiServices.getAllFinancialClass().subscribe((res: any) => {
            this.FinancialClass = res || [];
        });
    }

    getEntityTypes() {
        this.DemographicApiServices.getAllEntityTypes().subscribe((res: any ) => {
            this.EntityTypes = res || [];
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
                'RegMaritalStatus',
                'Nationality',
                'Religion',
                'PromotionalMediaItem',
                'RegTitle',
                'RegCountries',
                'RegRelationShip',
                'RegLocationTypes',
                'EmiratesIDN',
                'RegLocations',
                'RegEmploymentType',
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
        // this.Emirates = this.mapToDropdown(json.Emirates, 'Emirate', 'Name');
        // console.log('Emirates from cache:', this.Emirates);
        let regcountries = JSON.parse(jParse).RegCountries;
        let reggender = JSON.parse(jParse).RegGender;
        let relationships = JSON.parse(jParse).RegRelationShip;
        let site = JSON.parse(jParse).RegLocationTypes;
        let locations = JSON.parse(jParse).RegLocations;
        let employmentType = JSON.parse(jParse).RegEmploymentType;

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
        if (locations) {
            this.location = locations.map((item: { LocationId: any; Name: any }) => ({
                id: item.LocationId,
                name: item.Name,
            }));
        }
        if (employmentType) {
            this.EmploymentTypes = employmentType.map((item: { EmploymentTypeId: any; Name: any }) => ({
                id: item.EmploymentTypeId,
                name: item.Name,
            }));
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


    async getDemographicsByMRNo(patientId: string = '') {
        this.Loader.show();
        await this.DemographicApiServices.getDemographicsBypatientId(patientId)
            .then( async (demographics: any) => {
                const Table1 = demographics?.Table1 || demographics?.table1 || [];
                const Table2 = demographics?.Table2 || demographics?.table2 || [];
                if (Table1.length > 0) {
                    const t1: any = Table1[0];
                    console.log('response', t1);

                    // Patch raw in case keys match
                    this.demographicForm.patchValue(t1);

                    const genderName = t1.Gender ?? t1.gender;
                    const titleName = t1.Title ?? t1.title;
                    const maritalName = t1.MaritalStatus ?? t1.maritalStatus;
                    const bloodGroupName = t1.BloodGroup ?? t1.bloodGroup;
                    const ethnicityName = t1.EthnicityType ?? t1.ethnicityType;
                    const DOB = t1.patientBirthDate ?? t1.PatientBirthDate;
                    const emiratesIdCode = t1.emiratesIDN ?? t1.EmiratesIDN;
                    const nationalityName = t1.NationalityName ?? t1.nationalityName;
                    const genderIdentityId = t1.GenderIdentity ?? t1.genderIdentity;
                    const religionNameVal = t1.ReligionName ?? t1.religionName;
                    const languageNameVal = t1.LanguageName ?? t1.languageName;
                    const pcpVal = t1.PrimarycarephysicianPCP ?? t1.primarycarephysicianPCP;
                    const mediaChannelName = t1.MediaChannel ?? t1.mediaChannel;
                    const mediaItemName = t1.MediaItem ?? t1.mediaItem;

                    const gender = this.gender.find((e: any) => e.name == genderName)?.code;
                    const title = this.titles.find((e: any) => e.name == titleName)?.code;
                    const maritalstatus = this.maritalstatus.find((e: any) => e.name == maritalName)?.code;
                    const bloodGroup = this.bloodgroup.find((e: any) => e.name == bloodGroupName)?.code;
                    const ethinic = this.ethinic.find((e: any) => e.name == ethnicityName)?.code;
                    const emiratesIDN = this.Emirates.find((e: any) => e.code == emiratesIdCode)?.code;
                    const Nationality  =  this.nationality.find((e: any) => e.name == nationalityName)?.code;
                    const genderIdentity = this.genderIdentity.find((e: any) => e.genderId == genderIdentityId)?.genderId;
                    const religionName = this.religion.find((e: any) => e.name == religionNameVal)?.code;
                    const languageName = this.language.find((e: any) => e.name == languageNameVal)?.code;
                    const primarycarephysicianPCP = this.referred.find((e: any) => e.code == pcpVal)?.code;
                    const mediaChannel = this.MediaChannel.find((e: any) => e.name == mediaChannelName)?.code;
                    const mediaItem = this.MediaItem.find((e: any) => e.name == mediaItemName)?.code;
                    
                    this.demographicForm.patchValue({
                        imageSrc: t1?.patientPicture,
                        PersonTitleId: title,
                        PersonFirstName: (t1?.PersonFirstName ?? t1?.personFirstName) || '',
                        PersonMiddleName: (t1?.PersonMiddleName ?? t1?.personMiddleName) || '',
                        PersonLastName: (t1?.PersonLastName ?? t1?.personLastName) || '',
                        PersonSexId: gender,
                        preferredName: t1?.PreferredName ?? t1?.preferredName,
                        genderIdentity: genderIdentity,
                        PersonMaritalStatus: maritalstatus,
                        PatientBloodGroupId: bloodGroup,
                        PatientBirthDate: this.formatToDMY(DOB) || null,
                        
                        VIPPatient: !!(t1?.vipPatient ?? t1?.VIPPatient),
                        // Identification
                        personSocialSecurityNo: (t1?.personSocialSecurityNo ?? t1?.PersonSocialSecurityNo) || '',
                        LaborCardNo: (t1?.laborCardNo ?? t1?.LaborCardNo) || '',
                        Nationality: Nationality,
                        Religion: religionName,
                        PersonEthnicityTypeId: ethinic,
                        PersonPassportNo: (t1?.personPassportNo ?? t1?.PersonPassportNo) || '',
                        PersonDriversLicenseNo: (t1?.personDriversLicenseNo ?? t1?.PersonDriversLicenseNo) || '',
                        ResidenceVisaNo: (t1?.residenceVisaNo ?? t1?.ResidenceVisaNo) || '',
                        PrimaryLanguage: languageName,
                        EmiratesIDN: emiratesIDN,
                        primarycarephysicianPcp: primarycarephysicianPCP,
                        MediaChannelId: mediaChannel,
                        MediaItemId: mediaItem,
                        causeofDeath: t1?.CauseofDeath ?? t1?.causeofDeath,
                        DeathDate: this.formatToDMY(t1?.DateofDeath ?? t1?.dateofDeath) || null,
                        BillingNote: t1?.BillingNote ?? t1?.billingNote,
                });
                this.calculateAgeOnChangeDOB();
                
                // ---------------- Bind Table2 to respective tabs ----------------
                const table2 = Table2;
                for (const row of table2) {
                    const tabId = Number(row?.TabsTypeId ?? row?.tabsTypeId);
                    switch (tabId) {
                        case 1: { // Contact Residence
                            // Resolve Country/State/City by names if provided
                            const countryId = this.Country?.find((c: any) => (c?.name || '').toLowerCase() === ((row?.CountryName ?? row?.countryName) || '').toLowerCase())?.code ?? null;
                            // Patch basic fields first
                            this.contactForm.patchValue({
                                streetName: (row?.StreetName ?? row?.streetName) || '',
                                dwellingNumber: row?.dwellingNumber || '',
                                faxNo: (row?.fax ?? row?.faxNo) || '',
                                postalCode: row?.postalCode || '',
                                homePhone: (row?.homePhone ?? row?.HomePhone) || '',
                                cellPhone: (row?.CellPhone ?? row?.cellPhone) || '',
                                workPhone: (row?.workPhone1 ?? row?.WorkPhone ?? row?.workPhone) || '',
                                email: row?.email || '',
                            });
                            if (countryId) {
                                this.contactForm.get('CountryId')?.setValue(countryId);
                                await this.onContactCountryChange();
                                // After states loaded, resolve state by name or id
                                const stateId = this.contactStates?.find((s: any) =>
                                    ((s?.name || s?.stateName || s?.StateName || '').toLowerCase() === ((row?.StateName ?? row?.stateName) || '').toLowerCase()) || (s?.stateId && s?.stateId === (row?.StateId ?? row?.stateId))
                                )?.stateId ?? null;
                                if (stateId) {
                                    this.contactForm.get('StateId')?.setValue(stateId);
                                    await this.onContactStateChange();
                                    // After cities loaded, resolve city by name or id
                                    const cityId = this.contactCities?.find((c: any) =>
                                        ((c?.name || c?.cityName || c?.CityName || '').toLowerCase() === ((row?.CityName ?? row?.cityName) || '').toLowerCase()) || (c?.cityId && c?.cityId === (row?.CityId ?? row?.cityId))
                                    )?.cityId ?? null;
                                    if (cityId) {
                                        this.contactForm.get('CityId')?.setValue(cityId);
                                    }
                                }
                            }
                            break;
                        }
                        case 4: { // Emergency Contact
                            this.emergencyContactForm.patchValue({
                                relationshipId: (row?.RelationshipId ?? row?.relationshipId) || '',
                                firstName: (row?.FirstName ?? row?.firstName) || '',
                                middleName: (row?.MiddleName ?? row?.middleName) || '',
                                lastName: (row?.LastName ?? row?.lastName) || '',
                                streetName: (row?.StreetName ?? row?.streetName) || '',
                                postalCode: row?.postalCode || '',
                                email: row?.email || '',
                                cellPhone: (row?.CellPhone ?? row?.cellPhone) || '',
                                homePhone: (row?.homePhone ?? row?.HomePhone) || '',
                                workPhone: (row?.workPhone1 ?? row?.WorkPhone) || '',
                            });
                            // Country/State/City by names if present
                            const eCountryId = this.Country?.find((c: any) => (c?.name || '').toLowerCase() === ((row?.CountryName ?? row?.countryName) || '').toLowerCase())?.code ?? null;
                            if (eCountryId) {
                                this.emergencyContactForm.get('CountryId')?.setValue(eCountryId);
                                await this.onEmergencyCountryChange();
                                const eStateId = this.emergencyStates?.find((s: any) => ((s?.name || s?.stateName || s?.StateName || '').toLowerCase() === ((row?.StateName ?? row?.stateName) || '').toLowerCase()))?.stateId ?? null;
                                if (eStateId) {
                                    this.emergencyContactForm.get('StateId')?.setValue(eStateId);
                                    await this.onEmergencyStateChange();
                                    const eCityId = this.emergencyCities?.find((c: any) => ((c?.name || c?.cityName || c?.CityName || '').toLowerCase() === ((row?.CityName ?? row?.cityName) || '').toLowerCase()))?.cityId ?? null;
                                    if (eCityId) {
                                        this.emergencyContactForm.get('CityId')?.setValue(eCityId);
                                    }
                                }
                            }
                            break;
                        }
                        case 5: { // Next Of Kin
                            const relCode = this.relationships?.find((r: any) => (r?.name || '').toLowerCase() === ((row?.Relationship ?? row?.relationship) || '').toLowerCase())?.code
                                ?? (row?.RelationshipId ?? row?.relationshipId ?? null);
                            this.nextForm.patchValue({
                                relationshipId: relCode,
                                firstName: (row?.FirstName ?? row?.firstName) || '',
                                middleName: (row?.MiddleName ?? row?.middleName) || '',
                                lastName: (row?.LastName ?? row?.lastName) || '',
                                streetName: (row?.StreetName ?? row?.streetName) || '',
                                postalCode: row?.postalCode || '',
                                email: row?.email || '',
                                cellPhone: (row?.CellPhone ?? row?.cellPhone) || '',
                                homePhone: (row?.homePhone ?? row?.HomePhone) || '',
                                workPhone: (row?.workPhone1 ?? row?.WorkPhone) || '',
                            });
                            const nCountryId = this.Country?.find((c: any) => (c?.name || '').toLowerCase() === ((row?.CountryName ?? row?.countryName) || '').toLowerCase())?.code ?? null;
                            if (nCountryId) {
                                this.nextForm.get('CountryId')?.setValue(nCountryId);
                                await this.onNFKCountryChange();
                                const nStateId = this.nextStates?.find((s: any) => ((s?.name || s?.stateName || s?.StateName || '').toLowerCase() === ((row?.StateName ?? row?.stateName) || '').toLowerCase()))?.stateId ?? null;
                                if (nStateId) {
                                    this.nextForm.get('StateId')?.setValue(nStateId);
                                    await this.onNFKStateChange();
                                    const nCityId = this.nextCities?.find((c: any) => ((c?.name || c?.cityName || c?.CityName || '').toLowerCase() === ((row?.CityName ?? row?.cityName) || '').toLowerCase()))?.cityId ?? null;
                                    if (nCityId) {
                                        this.nextForm.get('CityId')?.setValue(nCityId);
                                    }
                                }
                            }
                            break;
                        }
                        case 6: { // Spouse
                            // Prefer numeric GenderId; otherwise map gender name to code
                            let spouseGenderId: any = null;
                            if (row?.GenderId != null && row?.GenderId !== 0) {
                                spouseGenderId = row?.GenderId;
                            } else if (row?.gender != null || row?.Gender != null) {
                                const gname = (row?.Gender ?? row?.gender ?? '').toString().toLowerCase();
                                spouseGenderId = this.genders?.find((g: any) => (g?.name || '').toLowerCase() === gname)?.code ?? null;
                            }
                            this.spouseForm.patchValue({
                                firstName: row?.FirstName || row?.firstName || '',
                                middleName: row?.MiddleName || row?.middleName || '',
                                lastName: row?.LastName || row?.lastName || '',
                                Sex: spouseGenderId ?? null,
                            });
                            break;
                        }
                        case 7: { // Parent
                            this.parentsInfo.patchValue({
                                // Father fields (consider multiple possible shapes)
                                fatherFirstName: (row?.Father_FirstName ?? row?.father_FirstName ?? row?.fatherFirstName ?? row?.FirstName ?? row?.firstName) || '',
                                fatherMiddleName: (row?.Father_MiddleName ?? row?.father_MiddleName ?? row?.fatherMiddleName ?? row?.MiddleName ?? row?.middleName) || '',
                                fatherLastName: (row?.Father_LastName ?? row?.father_LastName ?? row?.fatherLastName ?? row?.LastName ?? row?.lastName) || '',
                                fatherHomePhone: (row?.Father_HomePhone ?? row?.father_HomePhone ?? row?.fatherHomePhone ?? row?.HomePhone ?? row?.homePhone) || '',
                                fatherCellPhone: (row?.Father_CellPhone ?? row?.father_CellPhone ?? row?.fatherCellPhone ?? row?.CellPhone ?? row?.cellPhone) || '',
                                fatherEmail: (row?.Father_Email ?? row?.father_Email ?? row?.fatherEmail ?? row?.Email ?? row?.email) || '',
                                // Mother fields (match the API payload you shared, e.g., mother_FirstName)
                                motherFirstName: (row?.Mother_FirstName ?? row?.mother_FirstName ?? row?.motherFirstName) || '',
                                motherMiddleName: (row?.Mother_MiddleName ?? row?.mother_MiddleName ?? row?.motherMiddleName) || '',
                                motherLastName: (row?.Mother_LastName ?? row?.mother_LastName ?? row?.motherLastName) || '',
                                motherHomePhone: (row?.Mother_HomePhone ?? row?.mother_HomePhone ?? row?.motherHomePhone) || '',
                                motherCellPhone: (row?.Mother_CellPhone ?? row?.mother_CellPhone ?? row?.motherCellPhone) || '',
                                motherEmail: (row?.Mother_Email ?? row?.mother_Email ?? row?.motherEmail) || '',
                            });
                            break;
                        }
                        case 8: { // Assignments (if provided)
                            this.assignmentForm.patchValue({
                                proofOfIncome: row?.proofOfIncome || '',
                                providerId: row?.ProviderId || row?.ProviderId1 || 0,
                                feeScheduleId: row?.FeeScheduleId || 0,
                                financialClassId: row?.FinancialClassId || 0,
                                locationId: row?.LocationId || 0,
                                siteId: row?.SiteId || 0,
                                signedDate: row?.SignedDate ? this.formatToDMY(row?.SignedDate) : '',
                                expiryDate: row?.UnSignedDate ? this.formatToDMY(row?.UnSignedDate) : '',
                                entityTypeId: row?.EntityTypeId || 0,
                                entityNameId: row?.EntityName_Id || 0,
                                referredById: row?.ReferredBy_Id || 0,
                            });
                            break;
                        }
                        case 9: { // Family Members (if provided)
                            this.familyForm.patchValue({
                                mrNo: row?.mrNo || null,
                                accountTypeId: row?.accountTypeId || null,
                                masterMrNo: row?.master_MrNo || null,
                                relationshipId: row?.relationshipId || '',
                            });
                            break;
                        }
                        default:
                            break;
                    }
                }

                this.Loader.hide();
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to load demographic data.',
            });
                this.Loader.hide();
        });
                this.Loader.hide();

}

onSubmit() {
    // Validate all forms before submission
    const validationErrors = this.validateAllForms();
    if (validationErrors.length > 0) {
        // Show a single, professional generic message (no field-by-field list)
        Swal.fire({
            icon: 'error',
            title: 'Validation required',
            text: 'Some required fields are missing or invalid. Please review the form and provide the required information.',
            confirmButtonText: 'OK'
        });
        this.isFormSubmitted = true;
        // Mark all controls as touched to display validation states
        this.demographicForm.markAllAsTouched();
        this.contactForm.markAllAsTouched();
        this.emergencyContactForm.markAllAsTouched();
        this.nextForm.markAllAsTouched();
        this.spouseForm.markAllAsTouched();
        this.parentsInfo.markAllAsTouched();
        this.assignmentForm.markAllAsTouched();
        this.familyForm.markAllAsTouched();
        this.focusFirstInvalidControl();
        return;
    }

    // Mark form as submitted to trigger validation icons
    this.isFormSubmitted = true;

    // Collect main form data and normalize image before building payload
    const formData: any = this.demographicForm?.value || {};
    // Use raw base64 for submission; do not send data URL
    const normalizedPicture: string = (this.byteImage as string) || '';

    // Contact (use RegPatientTabsType: 1 = Contact Residence)
    const Contact: ContactModel = {
        streetName: this.contactForm.get('streetName')?.value || '',
        countryId: this.contactForm.get('CountryId')?.value || 0,
        stateId: this.contactForm.get('StateId')?.value || 0,
        cityId: this.contactForm.get('CityId')?.value || 0,
        postalCode: this.contactForm.get('postalCode')?.value || '',
        cellPhone: this.contactForm.get('cellPhone')?.value || '',
        homePhone: this.contactForm.get('homePhone')?.value || '',
        workPhone: this.contactForm.get('workPhone')?.value || '',
        dwellingNumber: this.contactForm.get('dwellingNumber')?.value || '',
        fax: this.contactForm.get('faxNo')?.value || '',
        email: this.contactForm.get('email')?.value || '',
        tabsTypeId: 1,
    };

    // Emergency Contact (RegPatientTabsType: 4)
    const EmergencyContact: any = {
        relationshipId: this.emergencyContactForm.get('relationshipId')?.value || 0,
        firstName: this.emergencyContactForm.get('firstName')?.value || '',
        middleName: this.emergencyContactForm.get('middleName')?.value || '',
        lastName: this.emergencyContactForm.get('lastName')?.value || '',
        streetName: this.emergencyContactForm.get('streetName')?.value || '',
        email: this.emergencyContactForm.get('email')?.value || '',
        countryId: this.emergencyContactForm.get('CountryId')?.value || 0,
        stateId: this.emergencyContactForm.get('StateId')?.value || 0,
        cityId: this.emergencyContactForm.get('CityId')?.value || 0,
        postalCode: this.emergencyContactForm.get('postalCode')?.value || '',
        cellPhone: this.emergencyContactForm.get('cellPhone')?.value || '',
        homePhone: this.emergencyContactForm.get('homePhone')?.value || '',
        workPhone: this.emergencyContactForm.get('workPhone')?.value || '',
        TabsTypeId: 4,
    };

    // Next Of Kin (RegPatientTabsType: 5)
    const NextOfKin: NextOfKinModel = {
        relationshipId: this.nextForm.get('relationshipId')?.value || 0,
        firstName: this.nextForm.get('firstName')?.value || '',
        middleName: this.nextForm.get('middleName')?.value || '',
        lastName: this.nextForm.get('lastName')?.value || '',
        streetName: this.nextForm.get('streetName')?.value || '',
        email: this.nextForm.get('email')?.value || 0,
        countryId: this.nextForm.get('CountryId')?.value || 0,
        stateId: this.nextForm.get('StateId')?.value || 0,
        cityId: this.nextForm.get('CityId')?.value || 0,
        postalCode: this.nextForm.get('postalCode')?.value || 0,
        cellPhone: this.nextForm.get('cellPhone')?.value || 0,
        homePhone: this.nextForm.get('homePhone')?.value || 0,
        workPhone: this.nextForm.get('workPhone')?.value || 0,
        TabsTypeId: 5,
    };

    // Spouse (RegPatientTabsType: 6)
    const Spouse: any = {
        firstName: this.spouseForm.get('firstName')?.value || '',
        middleName: this.spouseForm.get('middleName')?.value || '',
        lastName: this.spouseForm.get('lastName')?.value || '',
        genderId: this.spouseForm.get('Sex')?.value || 0,
        TabsTypeId: 6,
    };


        // Parent (RegPatientTabsType: 7)
        const Parent: ParentModel = {
            firstName: this.parentsInfo.get('fatherFirstName')?.value || '',
            middleName: this.parentsInfo.get('fatherMiddleName')?.value || '',
            lastName: this.parentsInfo.get('fatherLastName')?.value || '',
            homePhone: this.parentsInfo.get('fatherHomePhone')?.value || 0,
            cellPhone: this.parentsInfo.get('fatherCellPhone')?.value || 0,
            email: this.parentsInfo.get('fatherEmail')?.value || '',
            motherFirstName: this.parentsInfo.get('motherFirstName')?.value || '',
            mothermiddleName: this.parentsInfo.get('motherMiddleName')?.value || '',
            motherLastName: this.parentsInfo.get('motherLastName')?.value || '',
            motherHomePhone: this.parentsInfo.get('motherHomePhone')?.value || 0,
            motherCellPhone: this.parentsInfo.get('motherCellPhone')?.value || 0,
            motherEmail: this.parentsInfo.get('motherEmail')?.value || '',
            TabsTypeId: 7,
        };

        // Assignments (RegPatientTabsType: 8)
        const Assignments: AssignmentsModel = {
            proofOfIncome: this.assignmentForm.get('proofOfIncome')?.value || '',
            providerId: this.assignmentForm.get('providerId')?.value || 0,
            feeScheduleId: this.assignmentForm.get('feeScheduleId')?.value || 0,
            financialClassId: this.assignmentForm.get('financialClassId')?.value || 0,
            locationId: this.assignmentForm.get('locationId')?.value || 0,
            siteId: this.assignmentForm.get('siteId')?.value || 0,
            signedDate: this.assignmentForm.get('signedDate')?.value || null,
            unsignedDate: this.assignmentForm.get('expiryDate')?.value || null,
            entityTypeId: this.assignmentForm.get('entityTypeId')?.value || 0,
            entityNameId: this.assignmentForm.get('entityNameId')?.value || 0,
            referredById: this.assignmentForm.get('referredById')?.value || 0,
            TabsTypeId: 8,
        };

        // Family Members (no corresponding RegPatientTabsType; do not send tabsTypeId)
        const FamilyMembers: FamilyMembersModel = {
            mrNo: this.familyForm.get('mrNo')?.value || 0,
            accountTypeId: this.familyForm.get('accountType')?.value || 0,
            masterMrNo: this.familyForm.get('masterMrNo')?.value || 0,
            relationshipId: this.familyForm.get('relationshipId')?.value || 0,
            TabsTypeId: 9,
        };

        // Determine which tab's data is being sent (use last non-empty detail section)
        const currentTabsTypeId = this.getCurrentTabsTypeId(
            Contact,
            EmergencyContact,
            NextOfKin,
            Spouse,
            Parent,
            Assignments
        );

        // Final payload matching DTO
        const demographic: any = {
            patientId: this.patientId || 0,
            personFirstName: formData.PersonFirstName || '',
            personMiddleName: formData.PersonMiddleName || '',
            personLastName: formData.PersonLastName || '',
            personTitleId: formData.PersonTitleId || 0,
            personSocialSecurityNo: formData.personSocialSecurityNo || '',
            personPassportNo: formData.PersonPassportNo || '',
            personSexId: formData.PersonSexId || 0,
            personMaritalStatus: formData.PersonMaritalStatus || 0,
            vipPatient: !!formData.VIPPatient,
            practice: formData.practice || '',
            personEthnicityTypeId: formData.PersonEthnicityTypeId || 0,
            patientBirthDate: formData.PatientBirthDate || null,
            personDriversLicenseNo: formData.PersonDriversLicenseNo || '',
            patientBloodGroupId: formData.PatientBloodGroupId || 0,
            patientPicture: normalizedPicture,
            genderIdentity: formData.genderIdentity || 0,
            residenceVisaNo: formData.ResidenceVisaNo || '',
            laborCardNo: formData.LaborCardNo || '',
            religion: formData.Religion || 0,
            primaryLanguage: formData.PrimaryLanguage || 0,
            nationality: formData.Nationality || 0,
            empi: '',
            updatedBy: '',
            mediaChannelId: formData.MediaChannelId || 0,
            mediaItemId: formData.MediaItemId || 0,
            emiratesIDN: formData.EmiratesIDN || '',
            personNameArabic: '',
            tabsTypeId: currentTabsTypeId,
            billingNote: formData.BillingNote || '',
            advDirective: !!formData.AdvDirective,
            pregnant: !!formData.Pregnant,
            drugHistConsent: !!formData.DrugHistConsent,
            exemptReporting: !!formData.ExemptReporting,
            dateofDeath: this.demographicForm.get('DeathDate')?.value || null,
            causeofDeath: formData.causeofDeath || '',
            preferredName: formData.preferredName || '',
            primarycarephysicianPcp: formData.primarycarephysicianPcp || '',
            erelationshipId: 0,
            regPatientEmployer: [],
            // emergencyContact: EmergencyContact || [],
            // nextOfKin: NextOfKin || [],
            // spouse: Spouse || [],
            // parent: Parent || [],
            regAccount: [],
        };

        // Conditionally attach only populated sections
        if (this.isSectionPopulated(Contact, ['streetName','postalCode','cellPhone','homePhone','workPhone','email'])) {
            demographic.contact = Contact;
        }
        if (this.isSectionPopulated(EmergencyContact, ['relationshipId','firstName','lastName','cellPhone','homePhone','workPhone'])) {
            demographic.emergencyContact = EmergencyContact;
        }
        if (this.isSectionPopulated(NextOfKin, ['relationshipId','firstName','lastName','cellPhone','homePhone','workPhone'])) {
            demographic.nextOfKin = NextOfKin;
        }
        if (this.isSectionPopulated(Spouse, ['firstName','lastName','genderId'])) {
            demographic.spouse = Spouse;
        }
        if (this.isSectionPopulated(Parent, ['firstName','motherFirstName','email','motherEmail','homePhone','cellPhone','motherHomePhone'])) {
            demographic.parent = Parent;
        }
        if (this.isSectionPopulated(Assignments, ['providerId','feeScheduleId','financialClassId','locationId','siteId','signedDate','unsignedDate','entityTypeId','entityNameId','referredById','proofOfIncome'])) {
            demographic.assignments = Assignments;
        }
        if (this.isSectionPopulated(FamilyMembers, ['mrNo','relationshipId','masterMrNo'])) {
            demographic.familyMembers = FamilyMembers;
        }

        this.DemographicApiServices.submitDemographic(demographic).subscribe({
            next: (res: any) => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Demographic saved successfully!',
                    showConfirmButton: false,
                    timer: 2000,
                });
                this.router.navigate(['/registration/demographics']);
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
 
    async OnCountryChange(countryId: any) {
         this.contactForm.patchValue({ CountryId: countryId });
        await this.DemographicApiServices.getStateByCountry(countryId).then(
            (response) => {
                this.state = response as any[];
            }
        );
    }

    async OnStateChange(State: any) {
        if (State?.value?.stateId) {
          await  this.DemographicApiServices.getCityByState(
                State.value.stateId
            ).then((response) => {
                this.citie = response as any[];
            });
        } else {
            this.citie = [];
        }
    }

    async onNFKCountryChange(id: any = 0) {
        const countryId = this.nextForm.get('CountryId')?.value;
        if (countryId) {
          await  this.registrationApi
                .getStateByCountry(countryId)
                .then((res: any) => {
                    this.nextStates = Array.isArray(res)
                        ? res.map((item: any) => ({
                            stateId: item?.stateId ?? item?.StateId ?? item?.code ?? null,
                            name: item?.name ?? item?.StateName ?? item?.stateName ?? ''
                        }))
                        : [];
                    this.nextForm.get('StateId')?.setValue(null); // Reset State
                    this.nextCities = [];
                    this.nextForm.get('CityId')?.setValue(null); // Reset City
                });
        } else {
            this.nextStates = [];
            this.nextCities = [];
            this.nextForm.get('StateId')?.setValue(null);
            this.nextForm.get('CityId')?.setValue(null);
        }
    }

    async onNFKStateChange(id: any = 0) {
        const stateId = this.nextForm.get('StateId')?.value;
        if (stateId) {
           await this.registrationApi.getCityByState(stateId).then((res: any) => {
                this.nextCities = Array.isArray(res)
                    ? res.map((item: any) => ({
                        cityId: item?.cityId ?? item?.CityId ?? item?.code ?? null,
                        name: item?.name ?? item?.CityName ?? item?.cityName ?? ''
                    }))
                    : [];
                this.nextForm.get('CityId')?.setValue(null); // Reset City
            });
        } else {
            this.nextCities = [];
            this.nextForm.get('CityId')?.setValue(null);
        }
    }

    async onContactCountryChange(id: any = 0) {
        const countryId = this.contactForm.get('CountryId')?.value;
        if (countryId) {
          await  this.registrationApi
                .getStateByCountry(countryId)
                .then((res: any) => {
                    this.contactStates = Array.isArray(res)
                        ? res.map((item: any) => ({
                            stateId: item?.stateId ?? item?.StateId ?? item?.code ?? null,
                            name: item?.name ?? item?.StateName ?? item?.stateName ?? ''
                        }))
                        : [];
                    this.contactForm.get('StateId')?.setValue(null); // Reset State
                    this.contactCities = [];
                    this.contactForm.get('CityId')?.setValue(null); // Reset City
                });
        } else {
            this.contactStates = [];
            this.contactCities = [];
            this.contactForm.get('StateId')?.setValue(null);
            this.contactForm.get('CityId')?.setValue(null);
        }
    }

    async onContactStateChange(id: any = 0) {
        const stateId = this.contactForm.get('StateId')?.value;
        if (stateId) {
           await this.registrationApi.getCityByState(stateId).then((res: any) => {
                this.contactCities = Array.isArray(res)
                    ? res.map((item: any) => ({
                        cityId: item?.cityId ?? item?.CityId ?? item?.code ?? null,
                        name: item?.name ?? item?.CityName ?? item?.cityName ?? ''
                    }))
                    : [];
                this.contactForm.get('CityId')?.setValue(null); // Reset City
            });
        } else {
            this.contactCities = [];
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

    // Helper: pick tabsTypeId based on populated sections (priority: Assignments->Parent->Spouse->NextOfKin->Emergency->Contact)
    private getCurrentTabsTypeId(
        Contact: any,
        EmergencyContact: any,
        NextOfKin: any,
        Spouse: any,
        Parent: any,
        Assignments: any
    ): number {
        if (this.isSectionPopulated(Assignments, ['providerId','feeScheduleId','financialClassId','locationId','siteId','signedDate','unsignedDate','entityTypeId','entityNameId','referredById','proofOfIncome'])) return 8;
        if (this.isSectionPopulated(Parent, ['firstName','motherFirstName','email','motherEmail','homePhone','cellPhone','motherHomePhone'])) return 7;
        if (this.isSectionPopulated(Spouse, ['firstName','lastName','genderId'])) return 6;
        if (this.isSectionPopulated(NextOfKin, ['relationshipId','firstName','lastName','cellPhone','homePhone','workPhone'])) return 5;
        if (this.isSectionPopulated(EmergencyContact, ['relationshipId','firstName','lastName','cellPhone','homePhone','workPhone'])) return 4;
        if (this.isSectionPopulated(Contact, ['streetName','postalCode','cellPhone','homePhone','workPhone','email'])) return 1;
        return 1; // default to Contact Residence
    }

    // Shared helper to decide if a section contains user input
    private isSectionPopulated(obj: any, keys: string[]): boolean {
        return keys.some(k => {
            const v = obj?.[k];
            return v !== null && v !== undefined && v !== '' && v !== 0;
        });
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

        if (form.get('PersonTitleId')?.value === null || form.get('PersonTitleId')?.value === undefined || form.get('PersonTitleId')?.value === '') {
            errors.push('Title is required');
        }
        if (!form.get('PersonFirstName')?.value?.trim()) {
            errors.push('First Name is required');
        }
        if (!form.get('PersonLastName')?.value?.trim()) {
            errors.push('Last Name is required');
        }
        if (form.get('PersonSexId')?.value === null || form.get('PersonSexId')?.value === undefined || form.get('PersonSexId')?.value === '') {
            console.log('Gender validation failed, value:', form.get('PersonSexId')?.value);
            errors.push('Gender is required');
        }
        if (form.get('genderIdentity')?.value === null || form.get('genderIdentity')?.value === undefined || form.get('genderIdentity')?.value === '') {
            errors.push('Gender Identity is required');
        }
        if (form.get('PersonMaritalStatus')?.value === null || form.get('PersonMaritalStatus')?.value === undefined || form.get('PersonMaritalStatus')?.value === '') {
            console.log('Marital Status validation failed, value:', form.get('PersonMaritalStatus')?.value);
            errors.push('Marital Status is required');
        }
        if (form.get('PatientBloodGroupId')?.value === null || form.get('PatientBloodGroupId')?.value === undefined || form.get('PatientBloodGroupId')?.value === '') {
            errors.push('Blood Group is required');
        }
        if (!form.get('PatientBirthDate')?.value) {
            errors.push('Date of Birth is required');
        }
        if (!form.get('personSocialSecurityNo')?.value?.trim()) {
            errors.push('Social Security Number is required');
        }
        if (form.get('Nationality')?.value === null || form.get('Nationality')?.value === undefined || form.get('Nationality')?.value === '') {
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
