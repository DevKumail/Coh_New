import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-demographic-spouse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, FilledOnValueDirective],
  template: `
    <form [formGroup]="spouseForm" class="row g-3">
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
        <label>{{'GENDER' | translate}}</label><span class="danger"> *</span>
        <select class="form-select" appFilledOnValue formControlName="Sex">
          <option *ngFor="let g of genders" [value]="g.code">{{ g.name }}</option>
        </select>
      </div>
    </form>
  `,  
})
export class DemographicSpouseComponent {
  @Input() spouseForm!: FormGroup;
  @Input() genders: any[] = [];
}
