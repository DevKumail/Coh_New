import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-spouse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="spouseForm" class="row g-3">
      <!-- First Name -->
      <div class="col-md-3">
        <label>First Name</label>
        <input class="form-control" formControlName="firstName" type="text" />
      </div>

      <!-- Middle Name -->
      <div class="col-md-3">
        <label>Middle Name</label>
        <input class="form-control" formControlName="middleName" type="text" />
      </div>

      <!-- Last Name -->
      <div class="col-md-3">
        <label>Last Name</label>
        <input class="form-control" formControlName="lastName" type="text" />
      </div>

      <div class="col-md-3">
        <label>Gender</label><span class="danger"> *</span>
        <select class="form-select" formControlName="Sex">
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
