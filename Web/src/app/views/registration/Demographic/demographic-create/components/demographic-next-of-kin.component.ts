import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-demographic-next-of-kin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, FilledOnValueDirective],
  template: `
    <form [formGroup]="nextForm" class="row g-3">
      <!-- Relationship -->
      <div class="col-md-3">
        <label>{{'RELATIONSHIP' | translate}}</label>
        <select class="form-select" appFilledOnValue formControlName="relationshipId">
          <option [ngValue]="null">{{'SELECT_RELATIONSHIP' | translate}}</option>
          <option *ngFor="let r of relationships" [ngValue]="r.code">{{ r.name }}</option>
        </select>
      </div>

      <!-- First Name -->
      <div class="col-md-3">
        <label>{{'FIRST_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="firstName" type="text" placeholder="{{'ENTER_FIRST_NAME' | translate}}" />
      </div>

      <!-- Middle Name -->
      <div class="col-md-3">
        <label>{{'MIDDLE_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="middleName" type="text" placeholder="{{'ENTER_MIDDLE_NAME' | translate}}" />
      </div>

      <!-- Last Name -->
      <div class="col-md-3">
        <label>{{'LAST_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="lastName" type="text" placeholder="{{'ENTER_LAST_NAME' | translate}}" />
      </div>

      <div class="col-md-3">
        <label>{{'STREET_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="streetName" type="text" placeholder="{{'ENTER_STREET_NAME' | translate}}" />
      </div>

      <!-- Country -->
      <div class="col-md-3">
        <label>{{'COUNTRY' | translate}}</label><span class="text-danger">*</span>
        <select class="form-select" appFilledOnValue formControlName="CountryId" (change)="countryChange.emit()">
          <option [ngValue]="null">-- {{'SELECT_COUNTRY' | translate}} --</option>
          <option *ngFor="let c of Country" [ngValue]="c.code">{{ c.name }}</option>
        </select>
      </div>

      <!-- State/ Emirate -->
      <!-- <div class="col-md-3">
        <label>{{'STATE' | translate}}</label><span class="text-danger">*</span>
        <select class="form-select" formControlName="StateId" (change)="stateChange.emit()">
          <option value="">-- {{'SELECT_STATE' | translate}} --</option>
          <option *ngFor="let s of states" [value]="s.stateId">{{ s.name }}</option>
        </select>
      </div> -->

      <div class="col-md-3">
        <label>{{'STATE' | translate}}</label><span class="text-danger">*</span>
        <select class="form-select" appFilledOnValue formControlName="StateId" (change)="stateChange.emit()">
          <option [ngValue]="null">-- {{'SELECT_STATE' | translate}} --</option>
          <option *ngFor="let s of states" [ngValue]="s.stateId">{{ s.name }}</option>
        </select>
      </div>

      <!-- City/ Location -->
      <div class="col-md-3">
        <label>{{'CITY' | translate}}</label><span class="text-danger">*</span>
        <select class="form-select" appFilledOnValue formControlName="CityId">
          <option [ngValue]="null">-- {{'SELECT_CITY' | translate}} --</option>
          <option *ngFor="let c of city" [ngValue]="c.cityId">{{ c.name }}</option>
        </select>
      </div>

      <!-- Postal Code -->
      <div class="col-md-3">
        <label>{{'POSTAL_CODE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="postalCode" type="text" placeholder="{{'ENTER_POSTAL_CODE' | translate}}" />
      </div>

      <!-- Phone No -->
      <div class="col-md-3">
        <label>{{'CELL_PHONE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="cellPhone" type="text" placeholder="{{'ENTER_CELL_PHONE' | translate}}" />
      </div>

      <!-- Home Phone -->
      <div class="col-md-3">
        <label>{{'HOME_PHONE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="homePhone" type="text" placeholder="{{'ENTER_HOME_PHONE' | translate}}" />
      </div>

      <!-- Work Phone -->
      <div class="col-md-3">
        <label>{{'WORK_PHONE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="workPhone" type="text" placeholder="{{'ENTER_WORK_PHONE' | translate}}" />
      </div>

      <!-- Email -->
      <div class="col-md-3">
        <label>{{'EMAIL' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="email" type="email" placeholder="{{'ENTER_EMAIL_ADDRESS' | translate}}" />
      </div>
    </form>
  `,
})
export class DemographicNextOfKinComponent {
  @Input() nextForm!: FormGroup;
  @Input() Country: any[] = [];
  @Input() states: any[] = [];
  @Input() city: any[] = [];
  @Input() relationships: any[] = [];

  @Output() countryChange = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<void>();
}
