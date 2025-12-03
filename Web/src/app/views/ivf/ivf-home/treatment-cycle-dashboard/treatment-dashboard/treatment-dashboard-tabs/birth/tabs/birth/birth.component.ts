import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-birth-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './birth.component.html',
  styleUrls: ['./birth.component.scss']
})
export class BirthComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dateOfBirth: [''],
      cdb: [{ value: '', disabled: true }],
      week: [''],
      gender: [''],
      deliveryMethod: [''],
      weight: [''],
      length: [''],
      headCircumference: [''],
      apgar1: [''],
      apgar5: [''],
      condition: [''],
      infantFeeding: [''],
      deathPostPartumOn: [''],
      diedPerinatallyOn: [''],
      identityNumber: [''],
      firstName: [''],
      surname: [''],
      placeOfBirth: [''],
      countryOfBirth: [''],
      note: [''],
      chromAnom: [false],
      icd10Codes: this.fb.array(new Array(5).fill('').map(() => this.fb.control({ value: '', disabled: true }))),
      malfEnable: [false],
      malfType: [''],
      malfCodes: this.fb.array(new Array(5).fill('').map(() => this.fb.control({ value: '', disabled: true }))),
    });
  }

  get icd10CodesFA(): FormArray { return this.form.get('icd10Codes') as FormArray; }
  get malfCodesFA(): FormArray { return this.form.get('malfCodes') as FormArray; }

  save() {
    const payload = this.form.getRawValue();
    console.log('Birth save:', payload);
    // TODO: hook to API
  }
}
