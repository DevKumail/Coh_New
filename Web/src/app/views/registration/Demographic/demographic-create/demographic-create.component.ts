import { EmailItemType } from '@/app/views/apps/email/types';
import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgIcon} from '@ng-icons/core';
import { NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FilePondModule } from 'ngx-filepond';
import { OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { DemographicDTO } from '@/app/shared/Models/registration/Demographics/Demographic.type.model';
//import { NgxDaterangepickerMd } from 'ngx-daterangepicker-bootstrap';

@Component({
  selector: 'app-demographic-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,NgIconComponent,FilePondModule,

  ],
  templateUrl: './demographic-create.component.html',
  styleUrl: './demographic-create.component.scss'
})

export class DemographicCreateComponent implements OnInit {
  demographicForm!: FormGroup;

  
  titles: any[] = [];
  gender: any[] = [];
  genderIdentity: any[] = [];
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
  EntityTypes: any[] = [];
  referred: any[] = [];
  state: any[] = [];
  citie: any[] = [];

  uploadedImage: string | ArrayBuffer | null = null;
  byteImage: string = '';
  imageSrc: string = '';
  fileName: string = '';
  defaultImage: string = 'assets/images/default-avatar.png';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private DemographicApiServices: DemographicApiServices,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fillDropdown();
    this.getDemographicsByMRNo('1001');
  }

  initializeForm() {
    this.demographicForm = this.fb.group({
      PatientPicture: [null],
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
      PatientBirthDate: [null, Validators.required],
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
      primarycarephysicianPcp: [null, Validators.required],
      causeofDeath: [''],
      DeathDate: [null],
      BillingNote: ['', Validators.required],
      isVIP: [false],
      isPregnant: [false],
      isDirective: [false],
      isDrugHist: [false],
      isExpReporting: [false],
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
        this.demographicForm.patchValue({ PatientPicture: this.imageSrc });
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
        this.DemographicApiServices.add({
          severity: 'error',
          summary: 'Gender Identity Error',
          detail: err.message,
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
    this.DemographicApiServices
      .getCacheItem({ entities: ['RegBloodGroup','Provider','PromotionalMediaChannel','RegEthnicityTypes','Language', 'RegGender','Emirates', 'RegMaritalStatus', 'Nationality', 'Religion','PromotionalMediaItem', 'RegTitle'] })
      .then((response: any) => {
        if (response.cache) {
          this.FillDropDown(JSON.parse(JSON.stringify(response)).cache);
        }
      })
      .catch((error: { message: string }) =>
        this.DemographicApiServices.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        })
      );
  }

  FillDropDown(jParse: any) {
    const json = JSON.parse(jParse);

    this.bloodgroup = this.mapToDropdown(json.RegBloodGroup, 'BloodGroupId', 'BloodGroup');
    this.gender = this.mapToDropdown(json.RegGender, 'GenderId', 'Gender');
    this.maritalstatus = this.mapToDropdown(json.RegMaritalStatus, 'MaritalStatusId', 'MaritalStatus');
    this.nationality = this.mapToDropdown(json.Nationality, 'NationalityId', 'NationalityName');
    this.religion = this.mapToDropdown(json.Religion, 'ReligionId', 'ReligionName');
    this.language = this.mapToDropdown(json.Language, 'LanguageId', 'LanguageName');
    this.titles = this.mapToDropdown(json.RegTitle, 'TitleId', 'Title');
    this.MediaChannel = this.mapToDropdown(json.PromotionalMediaChannel, 'MediaChannelId', 'Name');
    this.MediaItem = this.mapToDropdown(json.PromotionalMediaItem, 'MediaItemId', 'Name');
    this.ethinic = this.mapToDropdown(json.RegEthnicityTypes, 'TypeId', 'Name');
    this.referred = this.mapToDropdown(json.Provider, 'EmployeeId', 'FullName');
    this.Emirates = this.mapToDropdown(json.Emirates, 'Emirate', 'Name');
    //this.Referred = this.mapToDropdown(json.MediaItem, 'Referred By','Referred');
   
  }

  mapToDropdown(source: any[], valueField: string, labelField: string): any[] {
    if (!Array.isArray(source)) return [];
    return source.map((item) => ({
      code: item[valueField],
      name: item[labelField],
    }));
  }

  getDemographicsByMRNo(MrNo: string = '1001') {
    this.DemographicApiServices
      .getDemographicsByMRNo(MrNo)
      .then((demographics: any) => {
        if (demographics?.table1?.length > 0) {
          const data: DemographicDTO = demographics.table1[0];
          this.demographicForm.patchValue(data);
          this.imageSrc = data.PatientPicture ?? '';
        }
      })
      .catch((error) =>
        this.DemographicApiServices.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        })
      );
  }

//   onSubmit() {
//     if (this.demographicForm.valid) {
//       const formData: DemographicDTO = this.demographicForm.getRawValue();
//       console.log('Form Submitted as DTO:', formData);
//     } else {
//       this.DemographicApiServices.add({
//         severity: 'warn',
//         summary: 'Validation',
//         detail: 'Please fill required fields',
//       });
//     }
//   }
onSubmit() {
  if (this.demographicForm.invalid) {
    this.DemographicApiServices.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Please fill all required fields',
    });
    return;
  }

  const formData: DemographicDTO = this.demographicForm.getRawValue();

  // ✅ Safe Date Conversion
  const DOD = formData.DeathDate ? new Date(formData.DeathDate) : null;
  const DOB = formData.PatientBirthDate ? new Date(formData.PatientBirthDate) : null;

  if (DOD && DOB && DOD > DOB) {
    this.DemographicApiServices.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Death Date cannot be after Date of Birth.',
    });
    return;
  }

  // ✅ Safe Image fallback (set to undefined instead of null)
  if (!formData.PatientPicture || formData.PatientPicture === this.defaultImage) {
    formData.PatientPicture = undefined;
  }

  // ✅ Final DTO for API
  const demographic: DemographicDTO = {
    ...formData,
    PatientPicture: formData.PatientPicture,
    isVIP: this.demographicForm.get('isVIP')?.value,
    isPregnant: this.demographicForm.get('isPregnant')?.value,
    isDirective: this.demographicForm.get('isDirective')?.value,
    isDrugHist: this.demographicForm.get('isDrugHist')?.value,
    isExpReporting: this.demographicForm.get('isExpReporting')?.value,
  };

  // ✅ Submit to API
  this.DemographicApiServices.submitDemographic(demographic)
    .then((res) => {
      this.DemographicApiServices.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Demographic saved successfully!',
      });
      this.router.navigate(['/registration/demographic-list']);
    })
    .catch((err) => {
      this.DemographicApiServices.add({
        severity: 'error',
        summary: 'Error',
        detail: err?.message || 'Failed to save demographic.',
      });
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
    this.demographicForm.patchValue({ CountryId: countryId });
    this.DemographicApiServices.getStateByCountry(countryId).then((response) => {
      this.state = response as any[];
    });
  }

  OnStateChange(State: any) {
    if (State?.value?.stateId) {
      this.DemographicApiServices.getCityByState(State.value.stateId).then((response) => {
        this.citie = response as any[];
      });
    } else {
      this.citie = [];
    }
  }

  addNewRow() {
    this.currentMaxId++;
    const newRow = {
      Id: this.currentMaxId,
      EmploymentCompanyName: '',
      EmploymentOccupationId: null,
      EmploymentStatusId: null,
      EmploymentTypeId: null,
    };
    this.MyEmployment.push(newRow);
  }

  onRowSelect(event: Event, rowData: any) {
    const checkbox = event.target as HTMLInputElement;
    const id = rowData.Id;
    checkbox.checked ? this.selectedRowIds.add(id) : this.selectedRowIds.delete(id);
  }

  isAllSelected(): boolean {
    return this.MyEmployment.length > 0 &&
      this.selectedRowIds.size === this.MyEmployment.length;
  }

  selectAllRows(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.MyEmployment.forEach((row) => this.selectedRowIds.add(row.Id));
    } else {
      this.selectedRowIds.clear();
    }
  }

  deleteSelectedRows() {
    this.MyEmployment = this.MyEmployment.filter(
      (row) => !this.selectedRowIds.has(row.Id)
    );
    this.selectedRowIds.clear();
  }

  togglePregnantCheckbox() {
    const sex = this.demographicForm.get('PersonSexId')?.value;
    this.showcheckBox = sex?.name === 'Female';
  }
}

