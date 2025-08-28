import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-emergency-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="contactForm" class="row g-3">
      <!-- Relationship -->
      <div class="col-md-3">
        <label>Relationship</label>
        <select class="form-select" formControlName="relationshipId">
          <option value="">Select Relationship</option>
          <option *ngFor="let r of relationships" [value]="r.code">{{ r.name }}</option>
        </select>
      </div>

      <!-- First Name -->
      <div class="col-md-3">
        <label>First Name</label>
        <input class="form-control" formControlName="firstName" type="text" />
      </div>

      <!-- Middle Name -->
      <div class="col-md-3">
        <label>Middle Name</label>
        <input class="form-control" formControlName="middleName" type="text" />
      </div>

      <!-- Last Name -->
      <div class="col-md-3">
        <label>Last Name</label>
        <input class="form-control" formControlName="lastName" type="text" />
      </div>

      <div class="col-md-3">
        <label>Street Name</label>
        <input class="form-control" formControlName="streetName" type="text" />
      </div>

      <!-- Country -->
      <div class="col-md-3">
        <label>Country</label><span class="text-danger">*</span>
        <select class="form-select" formControlName="CountryId" (change)="countryChange.emit()">
          <option value="">-- Select Country --</option>
          <option *ngFor="let c of Country" [value]="c.code">{{ c.name }}</option>
        </select>
      </div>

      <!-- State/ Emirate -->
      <div class="col-md-3">
        <label>State/ Emirate</label><span class="text-danger">*</span>
        <select class="form-select" formControlName="StateId" (change)="stateChange.emit()">
          <option value="">-- Select State --</option>
          <option *ngFor="let s of states" [value]="s.stateId">{{ s.name }}</option>
        </select>
      </div>

      <!-- City/ Location -->
      <div class="col-md-3">
        <label>City/ Location</label><span class="text-danger">*</span>
        <select class="form-select" formControlName="CityId">
          <option value="">-- Select City --</option>
          <option *ngFor="let c of city" [value]="c.code">{{ c.name }}</option>
        </select>
      </div>

      <!-- Postal Code -->
      <div class="col-md-3">
        <label>Postal Code</label>
        <input class="form-control" formControlName="postalCode" type="text" />
      </div>

      <!-- Phone No -->
      <div class="col-md-3">
        <label>Phone No</label>
        <input class="form-control" formControlName="cellPhone" type="text" />
      </div>

      <!-- Home Phone -->
      <div class="col-md-3">
        <label>Home Phone</label>
        <input class="form-control" formControlName="homePhone" type="text" />
      </div>

      <!-- Work Phone -->
      <div class="col-md-3">
        <label>Work Phone</label>
        <input class="form-control" formControlName="workPhone" type="text" />
      </div>

      <!-- Email -->
      <div class="col-md-3">
        <label>Email</label>
        <input class="form-control" formControlName="email" type="email" />
      </div>
    </form>
  `,
})
export class DemographicEmergencyContactComponent {
  @Input() contactForm!: FormGroup;
  @Input() Country: any[] = [];
  @Input() states: any[] = [];
  @Input() city: any[] = [];
  @Input() relationships: any[] = [];

  @Output() countryChange = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<void>();
}
