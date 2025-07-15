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
import { DemographicDTO } from '@/app/shared/Models/registration/Demographics/Demographic.model';

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
export class DemographicCreateComponent  {

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
  referred: any[] = [];
  userFilePondConfig: any = {
  allowMultiple: true,
  maxFiles: 3,
  instantUpload: false,
  server: {
    process: {
      url: '/upload',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    },
    revert: '/revert',
    restore: '/restore',
    load: '/load',
    fetch: '/fetch'
  }
};
  fileName: string = '';
  imageSrc: string = '';
  defaultImage: string = 'assets/images/default-avatar.png';

  isPregnant = false;
  isDirective = false;
  isDrugHist = false;
  isExpReporting = false;
  isVIP = false;
  showcheckBox = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
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

  cancel() {
    this.router.navigate(['/registration/demographic-list']);
  }

//   onSubmit() {

//   console.log("Form submitted!");
// }

   onSubmit() {
  if (this.demographicForm.valid) {
    const formData: DemographicDTO = this.demographicForm.getRawValue();
    console.log("Form submitted as DTO!", formData);
  } else {
    console.log("Form is invalid");
  }
}


    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(file);
        }
    }

    uploadedImage: string | ArrayBuffer | null = null;

handleFileUpload(event: any) {
  const file = event.file?.file;
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

}

