import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-photo-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="row mb-4">
    <!-- Patient Photo Section - Left Side -->
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body text-center">
          <h5 class="card-title mb-3">
            <i class="fa fa-camera me-2"></i>Patient Photo
          </h5>
          <div class="profile-image-container mb-3">
            <img
              class="rounded-circle shadow-sm"
              [src]="imageSrc || defaultImage"
              alt="Patient Picture"
              width="120"
              height="120"
              style="object-fit: cover; border: 2px solid #ddd;"
            />
          </div>

          <input
            type="file"
            class="d-none"
            accept="image/*"
            (change)="fileSelected.emit($event)"
            #fileUpload
          />

          <div class="d-grid gap-2">
            <button type="button" class="btn btn-outline-primary" (click)="fileUpload.click()">
              <i class="fa fa-upload me-1"></i>
              Choose Photo
            </button>

            <button *ngIf="imageSrc && imageSrc !== defaultImage" type="button" class="btn btn-outline-danger" (click)="remove.emit()">
              <i class="fa fa-trash me-1"></i>
              Remove
            </button>
          </div>

          <div class="mt-2">
            <small class="text-muted d-block">{{ fileName || 'No file selected' }}</small>
            <small class="text-muted">
              <i class="fa fa-info-circle me-1"></i>
              JPEG, PNG, GIF (Max 5MB)
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Information Section - Right Side -->
    <div class="col-md-8">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="fa fa-user me-2"></i>Personal Information
          </h5>
          <div class="row g-3" [formGroup]="demographicForm">
            <!-- Title -->
            <div class="col-md-6">
              <label class="form-label">Title <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="PersonTitleId">
                <option value="" disabled selected hidden>-- Select Title --</option>
                <option *ngFor="let t of titles" [ngValue]="t.code">{{ t.name }}</option>
              </select>
            </div>

            <!-- First Name -->
            <div class="col-md-6">
              <label class="form-label">First Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" formControlName="PersonFirstName" placeholder="Enter first name" />
            </div>

            <!-- Middle Name -->
            <div class="col-md-6">
              <label class="form-label">Middle Name</label>
              <input type="text" class="form-control" formControlName="PersonMiddleName" placeholder="Enter middle name" />
            </div>

            <!-- Last Name -->
            <div class="col-md-6">
              <label class="form-label">Last Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" formControlName="PersonLastName" placeholder="Enter last name" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class DemographicPhotoPersonalComponent {
  @Input() demographicForm!: FormGroup;
  @Input() titles: any[] = [];
  @Input() imageSrc: string = '';
  @Input() defaultImage: string = '';
  @Input() fileName: string = '';

  @Output() fileSelected = new EventEmitter<any>();
  @Output() remove = new EventEmitter<void>();
}
