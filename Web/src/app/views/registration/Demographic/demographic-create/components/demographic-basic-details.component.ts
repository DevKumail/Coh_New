import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-basic-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="row mb-4">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="fa fa-id-card me-2"></i>Basic Details
          </h5>
          <div class="row g-3" [formGroup]="demographicForm">
            <!-- Gender -->
            <div class="col-md-3">
              <label class="form-label">Gender <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="PersonSexId">
                <option [ngValue]="null" disabled>-- Select Gender --</option>
                <option *ngFor="let g of gender" [ngValue]="g.code">{{ g.name }}</option>
              </select>
            </div>

            <!-- Preferred Name -->
            <div class="col-md-3">
              <label class="form-label">Preferred Name</label>
              <input type="text" class="form-control" formControlName="preferredName" placeholder="Enter preferred name" />
            </div>

            <!-- Gender Identity -->
            <div class="col-md-3">
              <label class="form-label">Gender Identity <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="genderIdentity">
                <option [ngValue]="null" disabled>-- Select Gender Identity --</option>
                <option *ngFor="let g of genderIdentity" [ngValue]="g.genderId">{{ g.genderText }}</option>
              </select>
            </div>

            <!-- Marital Status -->
            <div class="col-md-3">
              <label class="form-label">Marital Status <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="PersonMaritalStatus">
                <option [ngValue]="null" disabled>-- Select Marital Status --</option>
                <option *ngFor="let m of maritalstatus" [ngValue]="m.code">{{ m.name }}</option>
              </select>
            </div>

            <!-- Blood Group -->
            <div class="col-md-3">
              <label class="form-label">Blood Group <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="PatientBloodGroupId">
                <option [ngValue]="null" disabled>-- Select Blood Group --</option>
                <option *ngFor="let b of bloodgroup" [ngValue]="b.code">{{ b.name }}</option>
              </select>
            </div>

            <!-- Date of Birth -->
            <div class="col-md-3">
              <label class="form-label">Date of Birth <span class="text-danger">*</span></label>
              <input type="text" class="form-control" formControlName="PatientBirthDate" data-provider="flatpickr" id="birthDate" placeholder="Select date" (change)="onDobChange()" />
            </div>

            <!-- Age -->
            <div class="col-md-2">
              <label class="form-label">Age</label>
              <input type="text" class="form-control" formControlName="Age" placeholder="Age" readonly />
            </div>

            <!-- VIP Checkbox -->
            <div class="col-md-1 d-flex align-items-end">
              <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" formControlName="VIPPatient" id="vipCheck" />
                <label class="form-check-label" for="vipCheck">VIP</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class DemographicBasicDetailsComponent {
  @Input() demographicForm!: FormGroup;
  @Input() gender: any[] = [];
  @Input() genderIdentity: any[] = [];
  @Input() maritalstatus: any[] = [];
  @Input() bloodgroup: any[] = [];

  onDobChange() {
    // NO-OP: parent initializes flatpickr and listens, but keep handler to mirror original
  }
}
