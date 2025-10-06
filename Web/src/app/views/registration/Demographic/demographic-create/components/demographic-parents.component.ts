import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-demographic-parents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, FilledOnValueDirective],
  template: `
    <!-- FATHER SECTION -->
    <h5>{{'FATHER' | translate}}</h5>
    <form [formGroup]="parentsInfo" class="row g-3">
      <div class="col-md-3">
        <label>{{'FIRST_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="fatherFirstName" type="text" placeholder="{{'ENTER_FIRST_NAME' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'MIDDLE_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="fatherMiddleName" type="text" placeholder="{{'ENTER_MIDDLE_NAME' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'LAST_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="fatherLastName" type="text" placeholder="{{'ENTER_LAST_NAME' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'HOME_PHONE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="fatherHomePhone" type="text" placeholder="{{'ENTER_HOME_PHONE' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'CELL_PHONE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="fatherCellPhone" type="text" placeholder="{{'ENTER_CELL_PHONE' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'EMAIL' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="fatherEmail" type="email" placeholder="{{'ENTER_EMAIL_ADDRESS' | translate}}" />
      </div>
    </form>

    <hr />

    <!-- MOTHER SECTION -->
    <h5>{{'MOTHER' | translate}}</h5>
    <form [formGroup]="parentsInfo" class="row g-3">
      <div class="col-md-3">
        <label>{{'FIRST_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="motherFirstName" type="text" placeholder="{{'ENTER_FIRST_NAME' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'MIDDLE_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="motherMiddleName" type="text" placeholder="{{'ENTER_MIDDLE_NAME' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'LAST_NAME' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="motherLastName" type="text" placeholder="{{'ENTER_LAST_NAME' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'HOME_PHONE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="motherHomePhone" type="text" placeholder="{{'ENTER_HOME_PHONE' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'CELL_PHONE' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="motherCellPhone" type="text" placeholder="{{'ENTER_CELL_PHONE' | translate}}" />
      </div>
      <div class="col-md-3">
        <label>{{'EMAIL' | translate}}</label>
        <input class="form-control" appFilledOnValue formControlName="motherEmail" type="email" placeholder="{{'ENTER_EMAIL_ADDRESS' | translate}}" />
      </div>
    </form>
  `,
})
export class DemographicParentsComponent {
  @Input() parentsInfo!: FormGroup;
}
