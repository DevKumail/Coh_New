import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-demographic-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, TranslatePipe],
  template: `
    <form [formGroup]="contactForm" class="row g-3">
      <!-- Street Name -->
      <div class="col-md-3">
        <label>{{'STREET_NAME' | translate}} <span class="text-danger">*</span></label>
        <input class="form-control"
               [class.is-invalid]="contactForm.get('streetName')?.invalid && (contactForm.get('streetName')?.touched || isFormSubmitted)"
               formControlName="streetName" type="text" placeholder="{{'ENTER_STREET_NAME' | translate}}" />
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('streetName')?.invalid && (contactForm.get('streetName')?.touched || isFormSubmitted)">
             {{'STREET_NAME_IS_REQUIRED' | translate}}
        </div>
      </div>

      <!-- Dwelling Number -->
      <div class="col-md-3">
        <label>{{'DWELLING_NUMBER' | translate}}</label>
        <input class="form-control" placeholder="{{'ENTER_DWELLING_NUMBER' | translate}}" formControlName="dwellingNumber" type="text" />
      </div>

      <!-- Country -->
      <div class="col-md-3">
        <label>{{'COUNTRY' | translate}} <span class="text-danger">*</span></label>
        <select class="form-select"
                [class.is-invalid]="contactForm.get('CountryId')?.invalid && (contactForm.get('CountryId')?.touched || isFormSubmitted)"
                formControlName="CountryId" (change)="countryChange.emit()">
          <option [ngValue]="null">-- {{'SELECT_COUNTRY' | translate}} --</option>
          <option *ngFor="let c of Country" [ngValue]="c.code">{{ c.name }}</option>
        </select>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('CountryId')?.invalid && (contactForm.get('CountryId')?.touched || isFormSubmitted)">
          {{'COUNTRY_IS_REQUIRED' | translate}}
        </div>
      </div>

      <!-- State -->
      <div class="col-md-3">
        <label>{{'STATE' | translate}} <span class="text-danger">*</span></label>
        <select class="form-select"
                [class.is-invalid]="contactForm.get('StateId')?.invalid && (contactForm.get('StateId')?.touched || isFormSubmitted)"
                formControlName="StateId" (change)="stateChange.emit()">
          <option [ngValue]="null">-- {{'SELECT_STATE' | translate}} --</option>
          <option *ngFor="let s of states" [ngValue]="s.stateId">{{ s.name }}</option>
        </select>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('StateId')?.invalid && (contactForm.get('StateId')?.touched || isFormSubmitted)">
          {{'STATE_IS_REQUIRED' | translate}}
        </div>
      </div>

      <!-- City -->
      <div class="col-md-3">
        <label>{{'CITY' | translate}}<span class="text-danger">*</span></label>
        <select class="form-select"
                [class.is-invalid]="contactForm.get('CityId')?.invalid && (contactForm.get('CityId')?.touched || isFormSubmitted)"
                formControlName="CityId">
          <option [ngValue]="null">-- {{'SELECT_CITY' | translate}} --</option>
          <option *ngFor="let c of city" [ngValue]="c.cityId">{{ c.name }}</option>
        </select>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('CityId')?.invalid && (contactForm.get('CityId')?.touched || isFormSubmitted)">
          {{'CITY_IS_REQUIRED' | translate}}
        </div>
      </div>

      <!-- Fax No -->
      <div class="col-md-3">
        <label>{{'FAX_NO' | translate}}</label>
        <input class="form-control" formControlName="faxNo" type="text" placeholder="{{'ENTER_FAX_NO' | translate}}" />
      </div>

      <!-- Postal Code -->
      <div class="col-md-3">
        <label>{{ 'POSTAL_CODE' | translate }} <span class="text-danger">*</span></label>
        <input class="form-control"
               [class.is-invalid]="contactForm.get('postalCode')?.invalid && (contactForm.get('postalCode')?.touched || isFormSubmitted)"
               formControlName="postalCode" type="text" [mask]="'00000'" placeholder="{{'ENTER_POSTAL_CODE' | translate}}" />
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('postalCode')?.invalid && (contactForm.get('postalCode')?.touched || isFormSubmitted)">
          {{'POSTAL_CODE_IS_REQUIRED' | translate}}
        </div>
      </div>

      <!-- Home Phone -->
      <div class="col-md-3">
        <label>{{'HOME_PHONE' | translate}}</label>
        <input class="form-control" formControlName="homePhone" type="text" placeholder="{{'ENTER_HOME_PHONE' | translate}}" />
      </div>

      <!-- Cell Phone -->
      <div class="col-md-3">
        <label>{{'CELL_PHONE' | translate}} <span class="text-danger">*</span></label>
        <input class="form-control"
               [class.is-invalid]="contactForm.get('cellPhone')?.invalid && (contactForm.get('cellPhone')?.touched || isFormSubmitted)"
               formControlName="cellPhone" type="text" placeholder="{{'ENTER_CELL_PHONE' | translate}}" />
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('cellPhone')?.invalid && (contactForm.get('cellPhone')?.touched || isFormSubmitted)">
          {{'CELL_PHONE_IS_REQUIRED' | translate}}
        </div>
      </div>

      <!-- Work Phone -->
      <div class="col-md-3">
        <label>{{'WORK_PHONE' | translate}}</label>
        <input class="form-control" formControlName="workPhone" type="text" placeholder="{{'ENTER_WORK_PHONE' | translate}}" />
      </div>

      <!-- Email -->
      <div class="col-md-3">
        <label for="userEmail" class="form-label"> {{'EMAIL_ADDRESS' | translate}} <span class="text-danger">*</span> </label>
        <div class="input-group">
          <input type="email" class="form-control"
                 [class.is-invalid]="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || isFormSubmitted)"
                 id="userEmail" placeholder="{{'ENTER_EMAIL_ADDRESS' | translate}}" formControlName="email" />
        </div>
        <div class="invalid-feedback d-block"
             *ngIf="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || isFormSubmitted)">
          {{'VALID_EMAIL_IS_REQUIRED' | translate}}
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
