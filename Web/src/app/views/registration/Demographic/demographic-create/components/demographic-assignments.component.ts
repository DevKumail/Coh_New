import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-assignments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <form [formGroup]="assignmentForm" class="d-flex justify-content-md-evenly">
      <!-- First Card -->
      <div class="card col-4 p-3">
        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" formControlName="proofOfIncomeCheck" id="proofOfIncomeCheck" />
          <label for="proofOfIncomeCheck" class="form-check-label ms-2">{{'PROOF_OF_INCOME' | translate}}</label>
        </div>

        <div class="mb-3">
          <input type="text" class="form-control" placeholder="{{'ENTER_PROOF_OF_INCOME' | translate}}" formControlName="proofOfIncome" />
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <select class="form-select" formControlName="providerId">
              <option value="">{{'PROVIDER' | translate}}</option>
              <option *ngFor="let p of referred" [value]="p.id">{{ p.name }}</option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <select class="form-select" formControlName="feeScheduleId">
              <option value="">{{'FEE_SCHEDULE' | translate}}</option>
              <option *ngFor="let f of FeeSchedule" [value]="f.id">{{ f.name }}</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <select class="form-select" formControlName="financialClassId">
              <option value="">{{'FINANCIAL_CLASS' | translate}}</option>
              <option *ngFor="let fc of FinancialClass" [value]="fc.id">{{ fc.name }}</option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <select class="form-select" formControlName="locationId">
              <option value="">{{'LOCATION' | translate}}</option>
              <option *ngFor="let l of location" [value]="l.id">{{ l.name }}</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <select class="form-select" formControlName="siteId">
            <option value="">{{'SITE' | translate}}</option>
            <option *ngFor="let s of Site" [value]="s.id">{{ s.name }}</option>
          </select>
        </div>
      </div>

      <!-- Second Card -->
      <div class="card col-3 p-3">
        <label class="fw-bold mb-2">{{'CONSENT_FORM' | translate}}</label>

        <div class="d-flex mb-3">
          <div class="form-check me-3">
            <input type="radio" class="form-check-input" value="Signed" formControlName="consentStatus" id="signedRadio" />
            <label class="form-check-label ms-1" for="signedRadio">{{'SIGNED' | translate}}</label>
          </div>
          <div class="form-check">
            <input type="radio" class="form-check-input" value="Unsigned" formControlName="consentStatus" id="unsignedRadio" />
            <label class="form-check-label ms-1" for="unsignedRadio">{{'UNSIGNED' | translate}}</label>
          </div>
        </div>

        <div class="mb-3">
          <label>{{'SIGNED' | translate}}</label>
          <input type="date" class="form-control" formControlName="signedDate" />
        </div>

        <div class="mb-3">
          <label>{{'UNSIGNED' | translate}}</label>
          <input type="date" class="form-control" formControlName="expiryDate" />
        </div>
      </div>

      <!-- Third Card -->
      <div class="card col-3 p-3">
        <label class="fw-bold mb-2">{{'CONSENT_FORM' | translate}}</label>

        <div class="mb-3">
          <select class="form-select" formControlName="entityTypeId">
            <option value="">{{'ENTITY_TYPE' | translate}}</option>
            <option *ngFor="let e of EntityTypes" [value]="e.id">{{ e.name }}</option>
          </select>
        </div>

        <div class="mb-3">
          <select class="form-select" formControlName="entityNameId">
            <option value="">{{'ENTITY_NAME' | translate}}</option>
            <option *ngFor="let e of Emirates" [value]="e.id">{{ e.name }}</option>
          </select>
        </div>

        <div class="mb-3">
          <select class="form-select" formControlName="providerReferredId">
            <option value="">{{'REFERRED_BY' | translate}}</option>
            <option *ngFor="let r of referred" [value]="r.id">{{ r.name }}</option>
          </select>
        </div>
      </div>
    </form>
  `,
})
export class DemographicAssignmentsComponent {
  @Input() assignmentForm!: FormGroup;
  @Input() referred: any[] = [];
  @Input() FeeSchedule: any[] = [];
  @Input() FinancialClass: any[] = [];
  @Input() location: any[] = [];
  @Input() Site: any[] = [];
  @Input() EntityTypes: any[] = [];
  @Input() Emirates: any[] = [];
}
