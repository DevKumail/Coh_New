import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-parents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- FATHER SECTION -->
    <h5>Father</h5>
    <form [formGroup]="parentsInfo" class="row g-3">
      <div class="col-md-3">
        <label>First Name</label>
        <input class="form-control" formControlName="fatherFirstName" type="text" />
      </div>
      <div class="col-md-3">
        <label>Middle Name</label>
        <input class="form-control" formControlName="fatherMiddleName" type="text" />
      </div>
      <div class="col-md-3">
        <label>Last Name</label>
        <input class="form-control" formControlName="fatherLastName" type="text" />
      </div>
      <div class="col-md-3">
        <label>Home Phone</label>
        <input class="form-control" formControlName="fatherHomePhone" type="text" />
      </div>
      <div class="col-md-3">
        <label>Cell Phone</label>
        <input class="form-control" formControlName="fatherCellPhone" type="text" />
      </div>
      <div class="col-md-3">
        <label>Email</label>
        <input class="form-control" formControlName="fatherEmail" type="email" />
      </div>
    </form>

    <hr />

    <!-- MOTHER SECTION -->
    <h5>Mother</h5>
    <form [formGroup]="parentsInfo" class="row g-3">
      <div class="col-md-3">
        <label>First Name</label>
        <input class="form-control" formControlName="motherFirstName" type="text" />
      </div>
      <div class="col-md-3">
        <label>Middle Name</label>
        <input class="form-control" formControlName="motherMiddleName" type="text" />
      </div>
      <div class="col-md-3">
        <label>Last Name</label>
        <input class="form-control" formControlName="motherLastName" type="text" />
      </div>
      <div class="col-md-3">
        <label>Home Phone</label>
        <input class="form-control" formControlName="motherHomePhone" type="text" />
      </div>
      <div class="col-md-3">
        <label>Cell Phone</label>
        <input class="form-control" formControlName="motherCellPhone" type="text" />
      </div>
      <div class="col-md-3">
        <label>Email</label>
        <input class="form-control" formControlName="motherEmail" type="email" />
      </div>
    </form>
  `,
})
export class DemographicParentsComponent {
  @Input() parentsInfo!: FormGroup;
}
