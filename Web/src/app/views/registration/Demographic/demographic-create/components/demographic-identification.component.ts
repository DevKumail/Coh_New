import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';

@Component({
  selector: 'app-demographic-identification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, TranslatePipe],
  template: `
  <div class="row mb-4">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="fa fa-id-badge me-2"></i>
            {{'IDENTIFICATION' | translate}}
          </h5>
          <div class="row g-3" [formGroup]="demographicForm">
            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'SOCIAL_SECURITY_NUMBER' | translate}} <span class="text-danger">*</span></label>
    <input type="text" class="form-control"
      [class.is-invalid]="demographicForm.get('personSocialSecurityNo')?.invalid && (demographicForm.get('personSocialSecurityNo')?.touched || isFormSubmitted)"
      formControlName="personSocialSecurityNo" placeholder="{{'ENTER_SSN' | translate }}" [mask]="'000-00-0000'" />
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('personSocialSecurityNo')?.invalid && (demographicForm.get('personSocialSecurityNo')?.touched || isFormSubmitted)">
                  {{'SSN_IS_REQUIRED' | translate}}
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'LABOR_CARD_NO' | translate}}</label>
              <input type="text" class="form-control" formControlName="LaborCardNo" placeholder="{{'ENTER_LABOR_CARD_NO' | translate}}" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'NATIONALITY' | translate}} <span class="text-danger">*</span></label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('Nationality')?.invalid && (demographicForm.get('Nationality')?.touched || isFormSubmitted)"
                      formControlName="Nationality">
                <option [ngValue]="null" disabled>-- {{'SELECT_NATIONALITY' | translate}} --</option>
                <option *ngFor="let n of nationality" [ngValue]="n.code">{{ n.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('Nationality')?.invalid && (demographicForm.get('Nationality')?.touched || isFormSubmitted)">
                {{'NATIONALITY_IS_REQUIRED' | translate}}
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'RELIGION' | translate}}</label>
              <select class="form-select" formControlName="Religion">
                <option [ngValue]="null" disabled>-- {{'SELECT_RELIGION' | translate}} --</option>
                <option *ngFor="let r of religion" [ngValue]="r.code">{{ r.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'ETHNICITY' | translate}}</label>
              <select class="form-select" formControlName="PersonEthnicityTypeId">
                <option [ngValue]="null" disabled>-- {{'SELECT_ETHNICITY' | translate}} --</option>
                <option *ngFor="let e of ethinic" [ngValue]="e.code">{{ e.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'PASSPORT_NO' | translate}}</label>
              <input type="text" class="form-control" formControlName="PersonPassportNo" placeholder="{{'ENTER_PASSPORT_NO' | translate}}" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'DRIVING_LICENSE_NO' | translate}}</label>
              <input type="text" class="form-control" formControlName="PersonDriversLicenseNo" placeholder="{{'ENTER_DRIVING_LICENSE_NO' | translate}}" [mask]="'SS000000'" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'UNIFIED_NO' | translate}}</label>
              <input type="text" class="form-control" formControlName="ResidenceVisaNo" placeholder="{{'ENTER_UNIFIED_NO' | translate}}" [mask]="'000000000'" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'LANGUAGE' | translate}}</label>
              <select class="form-select" formControlName="PrimaryLanguage">
                <option [ngValue]="null" disabled>-- {{'SELECT_LANGUAGE' | translate}} --</option>
                <option *ngFor="let l of language" [ngValue]="l.code">{{ l.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'EMIRATES_ID_TYPE' | translate}} <span class="text-danger">*</span></label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('EmiratesIDN')?.invalid && (demographicForm.get('EmiratesIDN')?.touched || isFormSubmitted)"
                      formControlName="EmiratesIDN">
                <option [ngValue]="null" disabled>-- {{'SELECT_EMIRATES_ID_TYPE' | translate}} --</option>
                <option *ngFor="let e of Emirates" [ngValue]="e.code">{{ e.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('EmiratesIDN')?.invalid && (demographicForm.get('EmiratesIDN')?.touched || isFormSubmitted)">
                {{'EMIRATES_ID_TYPE_IS_REQUIRED' | translate}}
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'PRIMARY_CARE_PHYSICIAN' | translate}} <span class="text-danger">*</span></label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('primarycarephysicianPcp')?.invalid && (demographicForm.get('primarycarephysicianPcp')?.touched || isFormSubmitted)"
                      formControlName="primarycarephysicianPcp">
                <option [ngValue]="null" disabled>-- {{'SELECT_PCP' | translate}} --</option>
                <option *ngFor="let p of referred" [ngValue]="p.code">{{ p.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('primarycarephysicianPcp')?.invalid && (demographicForm.get('primarycarephysicianPcp')?.touched || isFormSubmitted)">
                {{'PRIMARY_CARE_PHYSICIAN_IS_REQUIRED' | translate}}
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'REFERRED_CHANNEL' | translate}}</label>
              <select class="form-select" formControlName="MediaChannelId">
                <option [ngValue]="null" disabled>-- {{'SELECT_CHANNEL' | translate}} --</option>
                <option *ngFor="let c of MediaChannel" [ngValue]="c.code">{{ c.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'REFERRED_BY' | translate}}</label>
              <select class="form-select" formControlName="MediaItemId">
                <option [ngValue]="null" disabled>-- {{'SELECT_REFERRED_BY' | translate}} --</option>
                <option *ngFor="let m of MediaItem" [ngValue]="m.code">{{ m.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'COD' | translate}}</label>
              <input type="text" class="form-control" formControlName="causeofDeath" placeholder="{{'ENTER_CAUSE_OF_DEATH' | translate}}" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'DOD' | translate }}</label>
              <input type="text" class="form-control date" data-provider="flatpickr" formControlName="DeathDate" id="deathDate" placeholder="{{'SELECT_DATE' | translate}}" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>{{'BILLING_NOTE' | translate}} <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     [class.is-invalid]="demographicForm.get('BillingNote')?.invalid && (demographicForm.get('BillingNote')?.touched || isFormSubmitted)"
                     formControlName="BillingNote" placeholder="{{'ENTER_BILLING_NOTE' | translate}}" />
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('BillingNote')?.invalid && (demographicForm.get('BillingNote')?.touched || isFormSubmitted)">
                {{'BILLING_NOTE_IS_REQUIRED' | translate}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class DemographicIdentificationComponent {
  @Input() demographicForm!: FormGroup;
  @Input() nationality: any[] = [];
  @Input() religion: any[] = [];
  @Input() ethinic: any[] = [];
  @Input() language: any[] = [];
  @Input() Emirates: any[] = [];
  @Input() referred: any[] = [];
  @Input() MediaChannel: any[] = [];
  @Input() MediaItem: any[] = [];
  @Input() isFormSubmitted: boolean = false;
}
