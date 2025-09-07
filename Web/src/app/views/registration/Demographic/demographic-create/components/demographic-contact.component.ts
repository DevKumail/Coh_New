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
        <label>Street Name <span class="text-danger">*</span></label>
        <input class="form-control"
               [class.is-invalid]="contactForm.get('streetName')?.invalid && (contactForm.get('streetName')?.touched || isFormSubmitted)"
               formControlName="streetName" type="text" />
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('streetName')?.invalid && (contactForm.get('streetName')?.touched || isFormSubmitted)">
          Street name is required.
        </div>
      </div>

      <!-- Dwelling Number -->
      <div class="col-md-3">
        <label>Dwelling Number</label>
        <input class="form-control" formControlName="dwellingNumber" type="text" />
      </div>

      <!-- Country -->
      <div class="col-md-3">
        <label>Country <span class="text-danger">*</span></label>
        <select class="form-select"
                [class.is-invalid]="contactForm.get('CountryId')?.invalid && (contactForm.get('CountryId')?.touched || isFormSubmitted)"
                formControlName="CountryId" (change)="countryChange.emit()">
          <option [ngValue]="null">-- Select Country --</option>
          <option *ngFor="let c of Country" [ngValue]="c.code">{{ c.name }}</option>
        </select>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('CountryId')?.invalid && (contactForm.get('CountryId')?.touched || isFormSubmitted)">
          Country is required.
        </div>
      </div>

      <!-- State -->
      <div class="col-md-3">
        <label>State <span class="text-danger">*</span></label>
        <select class="form-select"
                [class.is-invalid]="contactForm.get('StateId')?.invalid && (contactForm.get('StateId')?.touched || isFormSubmitted)"
                formControlName="StateId" (change)="stateChange.emit()">
          <option [ngValue]="null">-- Select State --</option>
          <option *ngFor="let s of states" [ngValue]="s.stateId">{{ s.name }}</option>
        </select>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('StateId')?.invalid && (contactForm.get('StateId')?.touched || isFormSubmitted)">
          State is required.
        </div>
      </div>

      <!-- City -->
      <div class="col-md-3">
        <label>City <span class="text-danger">*</span></label>
        <select class="form-select"
                [class.is-invalid]="contactForm.get('CityId')?.invalid && (contactForm.get('CityId')?.touched || isFormSubmitted)"
                formControlName="CityId">
          <option [ngValue]="null">-- Select City --</option>
          <option *ngFor="let c of city" [ngValue]="c.cityId">{{ c.name }}</option>
        </select>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('CityId')?.invalid && (contactForm.get('CityId')?.touched || isFormSubmitted)">
          City is required.
        </div>
      </div>

      <!-- Fax No -->
      <div class="col-md-3">
        <label>Fax No</label>
        <input class="form-control" formControlName="faxNo" type="text" />
      </div>

      <!-- Postal Code -->
      <div class="col-md-3">
        <label>Postal Code <span class="text-danger">*</span></label>
        <input class="form-control"
               [class.is-invalid]="contactForm.get('postalCode')?.invalid && (contactForm.get('postalCode')?.touched || isFormSubmitted)"
               formControlName="postalCode" type="text" [mask]="'00000'" placeholder="e.g. 75000" />
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('postalCode')?.invalid && (contactForm.get('postalCode')?.touched || isFormSubmitted)">
          Postal code is required.
        </div>
      </div>

      <!-- Home Phone -->
      <div class="col-md-3">
        <label>Home Phone</label>
        <input class="form-control" formControlName="homePhone" type="text" />
      </div>

      <!-- Cell Phone -->
      <div class="col-md-3">
        <label>Cell Phone <span class="text-danger">*</span></label>
        <input class="form-control"
               [class.is-invalid]="contactForm.get('cellPhone')?.invalid && (contactForm.get('cellPhone')?.touched || isFormSubmitted)"
               formControlName="cellPhone" type="text" />
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('cellPhone')?.invalid && (contactForm.get('cellPhone')?.touched || isFormSubmitted)">
          Valid cell phone is required.
        </div>
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
          <input type="email" class="form-control"
                 [class.is-invalid]="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || isFormSubmitted)"
                 id="userEmail" placeholder="you@example.com" formControlName="email" />
        </div>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || isFormSubmitted)">
          A valid email is required.
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
  @Input() isFormSubmitted: boolean = false;

  @Output() countryChange = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<void>();
}
