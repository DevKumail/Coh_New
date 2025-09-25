import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-family',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <form [formGroup]="familyForm" class="d-flex justify-content-between">
      <!-- Left Side: Form Inputs -->
      <div class="card col-4 p-3">
        <!-- Mr No -->
        <div class="mb-3">
          <label class="form-label">{{'MR_NO' | translate}}</label>
          <input type="text" class="form-control" formControlName="mrNo" placeholder="{{'MR_NO' | translate}}" />
        </div>

        <!-- Account Type -->
        <div class="mb-3">
          <label class="form-label">{{'ACCOUNT_TYPE' | translate}}</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input type="radio" class="form-check-input" value="1" formControlName="accountType" id="masterRadio" />
              <label class="form-check-label" for="masterRadio">{{'MASTER' | translate}}</label>
            </div>
            <div class="form-check">
              <input type="radio" class="form-check-input" value="2" formControlName="accountType" id="secondaryRadio" />
              <label class="form-check-label" for="secondaryRadio">{{'SECONDARY' | translate}}</label>
            </div>
          </div>
        </div>

        <!-- Master Mr No -->
        <div class="mb-3">
          <label class="form-label">{{'MASTER_MR_NO' | translate}}</label>
          <input type="text" class="form-control" formControlName="masterMrNo" placeholder="{{'SELECT_MASTER_MR_NO' | translate}}" />
        </div>

        <!-- Relationship -->
        <div class="mb-3">
          <label class="form-label">{{'RELATIONSHIP' | translate}}</label>
          <select class="form-select" formControlName="relationshipId">
            <option value="">{{'RELATIONSHIP' | translate}}</option>
            <option *ngFor="let r of relationships" [value]="r.id">{{ r.name }}</option>
          </select>
        </div>
      </div>

      <!-- Right Side: Family Members Table -->
      <div class="card col-7 p-3">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>{{'MR_NO' | translate}}</th>
              <th>{{'NAME' | translate}}</th>
              <th>{{'GENDER' | translate}}</th>
              <th>{{'DOB' | translate}}</th>
              <th>{{'MASTER_MR_NO' | translate}}</th>
              <th>{{'RELATIONSHIP' | translate}}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let member of familyMembers">
              <td>{{ member.mrNo }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.gender }}</td>
              <td>{{ member.birthDate | date: "dd/MM/yyyy h:mm a" }}</td>
              <td>{{ member.masterMrNo }}</td>
              <td>{{ member.relationship }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  `,
})
export class DemographicFamilyComponent {
  @Input() familyForm!: FormGroup;
  @Input() relationships: any[] = [];
  @Input() familyMembers: any[] = [];
}
