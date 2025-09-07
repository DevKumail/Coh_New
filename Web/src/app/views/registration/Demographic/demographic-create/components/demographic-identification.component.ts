import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-demographic-identification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  template: `
  <div class="row mb-4">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="fa fa-id-badge me-2"></i>Identification
          </h5>
          <div class="row g-3" [formGroup]="demographicForm">
            <div class="col-md-3 col-sm-4 col-12">
              <label>Social Security Number (SSN) <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     [class.is-invalid]="demographicForm.get('personSocialSecurityNo')?.invalid && (demographicForm.get('personSocialSecurityNo')?.touched || isFormSubmitted)"
                     formControlName="personSocialSecurityNo" placeholder="999-99-9999" [mask]="'000-00-0000'" />
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('personSocialSecurityNo')?.invalid && (demographicForm.get('personSocialSecurityNo')?.touched || isFormSubmitted)">
                SSN is required.
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Labor Card No</label>
              <input type="text" class="form-control" formControlName="LaborCardNo" placeholder="Labor Card No" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Nationality <span class="text-danger">*</span></label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('Nationality')?.invalid && (demographicForm.get('Nationality')?.touched || isFormSubmitted)"
                      formControlName="Nationality">
                <option [ngValue]="null" disabled>-- Select Nationality --</option>
                <option *ngFor="let n of nationality" [ngValue]="n.code">{{ n.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('Nationality')?.invalid && (demographicForm.get('Nationality')?.touched || isFormSubmitted)">
                Nationality is required.
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Religion</label>
              <select class="form-select" formControlName="Religion">
                <option [ngValue]="null" disabled>-- Select Religion --</option>
                <option *ngFor="let r of religion" [ngValue]="r.code">{{ r.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Ethnicity</label>
              <select class="form-select" formControlName="PersonEthnicityTypeId">
                <option [ngValue]="null" disabled>-- Select Ethnicity --</option>
                <option *ngFor="let e of ethinic" [ngValue]="e.code">{{ e.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Passport No</label>
              <input type="text" class="form-control" formControlName="PersonPassportNo" placeholder="Passport No" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Driving License No</label>
              <input type="text" class="form-control" formControlName="PersonDriversLicenseNo" placeholder="Driving License No" [mask]="'SS000000'" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Unified No</label>
              <input type="text" class="form-control" formControlName="ResidenceVisaNo" placeholder="Unified No" [mask]="'000000000'" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Language</label>
              <select class="form-select" formControlName="PrimaryLanguage">
                <option [ngValue]="null" disabled>-- Select Language --</option>
                <option *ngFor="let l of language" [ngValue]="l.code">{{ l.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Emirates ID Type <span class="text-danger">*</span></label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('EmiratesIDN')?.invalid && (demographicForm.get('EmiratesIDN')?.touched || isFormSubmitted)"
                      formControlName="EmiratesIDN">
                <option [ngValue]="null" disabled>-- Select Emirates ID Type --</option>
                <option *ngFor="let e of Emirates" [ngValue]="e.code">{{ e.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('EmiratesIDN')?.invalid && (demographicForm.get('EmiratesIDN')?.touched || isFormSubmitted)">
                Emirates ID Type is required.
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Primary Care Physician (PCP) <span class="text-danger">*</span></label>
              <select class="form-select"
                      [class.is-invalid]="demographicForm.get('primarycarephysicianPcp')?.invalid && (demographicForm.get('primarycarephysicianPcp')?.touched || isFormSubmitted)"
                      formControlName="primarycarephysicianPcp">
                <option [ngValue]="null" disabled>-- Select PCP --</option>
                <option *ngFor="let p of referred" [ngValue]="p.code">{{ p.name }}</option>
              </select>
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('primarycarephysicianPcp')?.invalid && (demographicForm.get('primarycarephysicianPcp')?.touched || isFormSubmitted)">
                Primary Care Physician is required.
              </div>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Referred Channel</label>
              <select class="form-select" formControlName="MediaChannelId">
                <option [ngValue]="null" disabled>-- Select Channel --</option>
                <option *ngFor="let c of MediaChannel" [ngValue]="c.code">{{ c.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Referred By</label>
              <select class="form-select" formControlName="MediaItemId">
                <option [ngValue]="null" disabled>-- Select Referred By --</option>
                <option *ngFor="let m of MediaItem" [ngValue]="m.code">{{ m.name }}</option>
              </select>
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Cause of Death</label>
              <input type="text" class="form-control" formControlName="causeofDeath" placeholder="Cause of Death" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Date of Death</label>
              <input type="text" class="form-control date" data-provider="flatpickr" formControlName="DeathDate" id="deathDate" placeholder="Select date" />
            </div>

            <div class="col-md-3 col-sm-4 col-12">
              <label>Billing Note <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     [class.is-invalid]="demographicForm.get('BillingNote')?.invalid && (demographicForm.get('BillingNote')?.touched || isFormSubmitted)"
                     formControlName="BillingNote" placeholder="Billing Note" />
              <div class="invalid-feedback d-block"
                   *ngIf="demographicForm.get('BillingNote')?.invalid && (demographicForm.get('BillingNote')?.touched || isFormSubmitted)">
                Billing Note is required.
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
