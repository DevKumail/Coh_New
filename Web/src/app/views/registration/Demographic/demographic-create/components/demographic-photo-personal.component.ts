import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, LucideCamera, LucideTrash2 } from 'lucide-angular';

@Component({
  selector: 'app-demographic-photo-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
  <div class="row mb-3 gx-2 align-items-start">
    <!-- Patient Photo Section - Left Side -->
    <div class="col-md-2">
      <div class="card photo-card">
        <div class="card-body text-center p-1">
          <h5 class="card-title mb-1 d-flex align-items-center justify-content-center gap-1">
            <lucide-angular [img]="LucideCamera" class="fs-5"></lucide-angular>
            <span>Patient Photo</span>
          </h5>
          <div class="profile-image-container mb-1" [class.has-image]="imageSrc && imageSrc !== defaultImage">
            <img
              class="rounded-circle shadow-sm"
              [src]="imageSrc || defaultImage"
              alt="Patient Picture"
              width="140"
              height="140"
              style="object-fit: cover; border: 1px solid #ddd;"
            />
            <!-- Overlay camera icon button -->
            <button *ngIf="!imageSrc || imageSrc === defaultImage" type="button" class="avatar-camera-btn" (click)="fileUpload.click()" title="Change photo">
              <lucide-angular [img]="LucideCamera" [size]="22"></lucide-angular>
            </button>
            <!-- Overlay remove icon button -->
            <button *ngIf="imageSrc && imageSrc !== defaultImage" type="button" class="avatar-remove-btn" (click)="remove.emit()" title="Remove photo">
              <lucide-angular [img]="LucideTrash2" [size]="22"></lucide-angular>
            </button>
          </div>

          <input
            type="file"
            class="d-none"
            accept="image/*"
            (change)="fileSelected.emit($event)"
            #fileUpload
          />

          
        </div>
      </div>
    </div>

    <!-- Personal & Basic Details merged into a single card -->
    <div class="col-md-10">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3 d-flex align-items-center gap-2">
            <i class="fa fa-user"></i>
            <span>Personal & Basic Details</span>
          </h5>
          <div class="row g-2" [formGroup]="demographicForm">
            <!-- Title -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Title <span class="text-danger">*</span></label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('PersonTitleId')?.invalid && (demographicForm.get('PersonTitleId')?.touched || isFormSubmitted)"
                      formControlName="PersonTitleId">
                <option value="" disabled selected hidden>-- Select Title --</option>
                <option *ngFor="let t of titles" [ngValue]="t.code">{{ t.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('PersonTitleId')?.invalid && (demographicForm.get('PersonTitleId')?.touched || isFormSubmitted)">
                Title is required.
              </div>
            </div>

            <!-- First Name -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">First Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     [class.is-invalid]="demographicForm.get('PersonFirstName')?.invalid && (demographicForm.get('PersonFirstName')?.touched || isFormSubmitted)"
                     formControlName="PersonFirstName" placeholder="Enter first name" />
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('PersonFirstName')?.invalid && (demographicForm.get('PersonFirstName')?.touched || isFormSubmitted)">
                First name is required.
              </div>
            </div>

            <!-- Middle Name -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Middle Name</label>
              <input type="text" class="form-control" formControlName="PersonMiddleName" placeholder="Enter middle name" />
            </div>

            <!-- Last Name -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Last Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     [class.is-invalid]="demographicForm.get('PersonLastName')?.invalid && (demographicForm.get('PersonLastName')?.touched || isFormSubmitted)"
                     formControlName="PersonLastName" placeholder="Enter last name" />
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('PersonLastName')?.invalid && (demographicForm.get('PersonLastName')?.touched || isFormSubmitted)">
                Last name is required.
              </div>
            </div>

            <!-- Divider -->
            <div class="col-12"><hr class="my-2" /></div>

            <!-- Basic Details (merged) -->
            <!-- Gender -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label required">Gender</label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('PersonSexId')?.invalid && (demographicForm.get('PersonSexId')?.touched || isFormSubmitted)"
                      formControlName="PersonSexId">
                <option [ngValue]="null" disabled>-- Select Gender --</option>
                <option *ngFor="let g of gender" [ngValue]="g.code">{{ g.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('PersonSexId')?.invalid && (demographicForm.get('PersonSexId')?.touched || isFormSubmitted)">
                Gender is required.
              </div>
            </div>

            <!-- Preferred Name -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Preferred Name</label>
              <input type="text" class="form-control" formControlName="preferredName" placeholder="Enter preferred name"/>
            </div>

            <!-- Gender Identity -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label required">Gender Identity</label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('genderIdentity')?.invalid && (demographicForm.get('genderIdentity')?.touched || isFormSubmitted)"
                      formControlName="genderIdentity">
                <option [ngValue]="null" disabled>-- Select Gender Identity --</option>
                <option *ngFor="let gi of genderIdentity" [ngValue]="gi.genderId">{{ gi.genderText }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('genderIdentity')?.invalid && (demographicForm.get('genderIdentity')?.touched || isFormSubmitted)">
                Gender Identity is required.
              </div>
            </div>

            <!-- Marital Status -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label required">Marital Status</label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('PersonMaritalStatus')?.invalid && (demographicForm.get('PersonMaritalStatus')?.touched || isFormSubmitted)"
                      formControlName="PersonMaritalStatus">
                <option [ngValue]="null" disabled>-- Select Marital Status --</option>
                <option *ngFor="let m of maritalstatus" [ngValue]="m.code">{{ m.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('PersonMaritalStatus')?.invalid && (demographicForm.get('PersonMaritalStatus')?.touched || isFormSubmitted)">
                Marital Status is required.
              </div>
            </div>

            <!-- Blood Group -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label required">Blood Group</label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('PatientBloodGroupId')?.invalid && (demographicForm.get('PatientBloodGroupId')?.touched || isFormSubmitted)"
                      formControlName="PatientBloodGroupId">
                <option [ngValue]="null" disabled>-- Select Blood Group --</option>
                <option *ngFor="let b of bloodgroup" [ngValue]="b.code">{{ b.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('PatientBloodGroupId')?.invalid && (demographicForm.get('PatientBloodGroupId')?.touched || isFormSubmitted)">
                Blood Group is required.
              </div>
            </div>

            <!-- Date of Birth -->
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label required">Date of Birth</label>
              <input type="text" class="form-control"
                     [class.is-invalid]="demographicForm.get('PatientBirthDate')?.invalid && (demographicForm.get('PatientBirthDate')?.touched || isFormSubmitted)"
                     formControlName="PatientBirthDate" data-provider="flatpickr" id="birthDate" placeholder="Select date" />
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('PatientBirthDate')?.invalid && (demographicForm.get('PatientBirthDate')?.touched || isFormSubmitted)">
                Date of Birth is required.
              </div>
            </div>

            <!-- Age -->
            <div class="col-sm-6 col-md-2 col-lg-2">
              <label class="form-label">Age</label>
              <input type="text" class="form-control" formControlName="Age" placeholder="Age" readonly />
            </div>

            <!-- VIP -->
            <div class="col-sm-6 col-md-2 col-lg-2 d-flex align-items-end">
              <div class="form-check ms-2">
                <input type="checkbox" class="form-check-input" id="vipCheck" formControlName="VIPPatient" />
                <label for="vipCheck" class="form-check-label">VIP</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .profile-image-container { position: relative; width: 140px; height: 140px; margin: 0 auto; }
    .profile-image-container img { display: block; transition: filter 0.2s ease, opacity 0.2s ease; }
    .avatar-camera-btn {
      position: absolute;
      right: 2px;
      bottom: 2px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.12);
      background: rgba(233, 236, 239, 0.6); /* gray 60% */
      color: #0d6efd;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: none;
      outline: none;
    }
    .avatar-camera-btn:hover { background: rgba(233, 236, 239, 0.8); }
    .avatar-camera-btn:active { transform: none; }
    .avatar-camera-btn:focus, .avatar-camera-btn:focus-visible { outline: none; box-shadow: none; }
    .avatar-remove-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.12);
      background: rgba(233, 236, 239, 0.6); /* gray 60% */
      color: #dc3545;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: none;
      outline: none;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease-in-out, background-color 0.15s ease-in-out;
      will-change: opacity, background-color;
    }
    .avatar-remove-btn:hover { background: rgba(233, 236, 239, 0.8); transform: translate(-50%, -50%); }
    .avatar-remove-btn:active { transform: translate(-50%, -50%); }
    .avatar-remove-btn:focus, .avatar-remove-btn:focus-visible { outline: none; box-shadow: none; transform: translate(-50%, -50%); }
    .profile-image-container:hover .avatar-remove-btn {
      opacity: 1;
      pointer-events: auto;
    }
    .profile-image-container.has-image:hover img { filter: blur(2px) brightness(0.9); }
  `]
})
export class DemographicPhotoPersonalComponent {
  @Input() demographicForm!: FormGroup;
  @Input() titles: any[] = [];
  @Input() imageSrc: string = '';
  @Input() defaultImage: string = 'assets/images/patient.jpg';
  @Input() fileName: string = '';
  @Input() isFormSubmitted: boolean = false;
  @Input() gender: any[] = [];
  @Input() genderIdentity: any[] = [];
  @Input() maritalstatus: any[] = [];
  @Input() bloodgroup: any[] = [];

  @Output() fileSelected = new EventEmitter<any>();
  @Output() remove = new EventEmitter<void>();

  protected readonly LucideCamera = LucideCamera;
  protected readonly LucideTrash2 = LucideTrash2;
}
