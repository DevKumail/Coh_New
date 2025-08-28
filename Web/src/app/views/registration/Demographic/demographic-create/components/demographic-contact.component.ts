import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-demographic-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  template: `
    <form [formGroup]="contactForm" class="row g-3">
      <!-- Street Name -->
      <div class="col-md-3">
        <label>Street Name</label>
        <input class="form-control" formControlName="streetName" type="text" />
      </div>

      <!-- Dwelling Number -->
      <div class="col-md-3">
        <label>Dwelling Number</label>
        <input class="form-control" formControlName="dwellingNumber" type="text" />
      </div>

      <!-- Country -->
      <div class="col-md-3">
        <label>Country</label><span style="color: red">*</span>
        <select class="form-select" formControlName="CountryId" (change)="countryChange.emit()">
          <option [ngValue]="null">-- Select Country --</option>
          <option *ngFor="let c of Country" [ngValue]="c.code">{{ c.name }}</option>
        </select>
      </div>

      <!-- State -->
      <div class="col-md-3">
        <label>State</label><span style="color: red">*</span>
        <select class="form-select" formControlName="StateId" (change)="stateChange.emit()">
          <option [ngValue]="null">-- Select State --</option>
          <option *ngFor="let s of states" [ngValue]="s.stateId">{{ s.name }}</option>
        </select>
      </div>

      <!-- City -->
      <div class="col-md-3">
        <label>City</label><span class="text-danger">*</span>
        <select class="form-select" formControlName="CityId">
          <option [ngValue]="null">-- Select City --</option>
          <option *ngFor="let c of city" [ngValue]="c.cityId">{{ c.name }}</option>
        </select>
      </div>

      <!-- Fax No -->
      <div class="col-md-3">
        <label>Fax No</label>
        <input class="form-control" formControlName="faxNo" type="text" />
      </div>

      <!-- Postal Code -->
      <div class="col-md-3">
        <label>Postal Code</label>
        <input class="form-control" formControlName="postalCode" type="text" [mask]="'00000'" placeholder="e.g. 75000" />
      </div>

      <!-- Home Phone -->
      <div class="col-md-3">
        <label>Home Phone</label>
        <input class="form-control" formControlName="homePhone" type="text" />
      </div>

      <!-- Cell Phone -->
      <div class="col-md-3">
        <label>Cell Phone *</label>
        <input class="form-control" formControlName="cellPhone" type="text" />
      </div>

      <!-- Work Phone -->
      <div class="col-md-3">
        <label>Work Phone</label>
        <input class="form-control" formControlName="workPhone" type="text" />
      </div>

      <!-- Email -->
      <div class="col-md-3">
        <label for="userEmail" class="form-label"> Email address <span class="text-danger">*</span> </label>
        <div class="input-group">
          <input type="email" class="form-control" id="userEmail" placeholder="you@example.com" formControlName="email" required />
        </div>
      </div>
    </form>
  `,
})
export class DemographicContactComponent {
  @Input() contactForm!: FormGroup;
  @Input() Country: any[] = [];
  @Input() states: any[] = [];
  @Input() city: any[] = [];

  @Output() countryChange = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<void>();
}
