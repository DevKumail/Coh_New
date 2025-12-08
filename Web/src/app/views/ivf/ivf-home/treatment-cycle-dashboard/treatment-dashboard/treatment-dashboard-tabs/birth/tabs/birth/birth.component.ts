import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-birth-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FilledOnValueDirective],
  templateUrl: './birth.component.html',
  styleUrls: ['./birth.component.scss']
})
export class BirthComponent {
  @Input() dropdowns: any = {};
  
  form: FormGroup;
  childrenCount: number = 0;
  childrenData: any[] = [];
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      children: this.fb.array([])
    });
  }

  get childrenFA(): FormArray {
    return this.form.get('children') as FormArray;
  }

  setChildrenCount(count: number) {
    console.log('Setting children count:', count);
    this.childrenCount = count;
    this.updateChildrenArray(count);
  }

  updateChildrenArray(count: number) {
    const childrenArray = this.childrenFA;
    const currentCount = childrenArray.length;

    // If increasing count, add new children
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        this.childrenData.push({ index: i + 1, label: `Child ${i + 1}` });
        childrenArray.push(this.createChildFormGroup());
      }
    }
    // If decreasing count, remove extra children
    else if (count < currentCount) {
      const removeCount = currentCount - count;
      for (let i = 0; i < removeCount; i++) {
        childrenArray.removeAt(childrenArray.length - 1);
        this.childrenData.pop();
      }
    }
  }

  createChildFormGroup(): FormGroup {
    return this.fb.group({
      dateOfBirth: [null],
      cdb: [{ value: null, disabled: true }],
      week: [null],
      gender: [null],
      deliveryMethod: [null],
      weight: [null],
      length: [null],
      headCircumference: [null],
      apgar1: [null],
      apgar5: [null],
      condition: [null],
      infantFeeding: [null],
      deathPostPartumOn: [null],
      diedPerinatallyOn: [null],
      identityNumber: [null],
      firstName: [null],
      surname: [null],
      placeOfBirth: [null],
      countryOfBirth: [null],
      note: [null],
      chromAnom: [false],
      icd10Codes: this.fb.array(new Array(5).fill('').map(() => this.fb.control({ value: '', disabled: true }))),
      malfEnable: [false],
      malfType: [null],
      malfCodes: this.fb.array(new Array(5).fill('').map(() => this.fb.control({ value: '', disabled: true }))),
    });
  }

  bindChildrenData(children: any[]) {
    console.log('Binding children data:', children);
    if (!children || children.length === 0) return;

    children.forEach((child, index) => {
      if (index < this.childrenFA.length) {
        const formGroup = this.childrenFA.at(index);
        
        // Format date fields
        const formatDate = (dateStr: string | null) => {
          if (!dateStr) return null;
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        };

        // Map API fields to form fields
        formGroup.patchValue({
          dateOfBirth: formatDate(child.dateOfBirth),
          week: child.week !== null && child.week !== undefined ? child.week : null,
          gender: child.genderId,
          deliveryMethod: child.deliveryMethodCategoryId,
          weight: child.weight,
          length: child.length,
          headCircumference: child.headCircumference,
          apgar1: child.apgar1 !== null && child.apgar1 !== undefined ? child.apgar1 : null,
          apgar5: child.apgar5 !== null && child.apgar5 !== undefined ? child.apgar5 : null,
          condition: child.conditionCategoryId,
          infantFeeding: child.infantFeedingCategoryId,
          deathPostPartumOn: formatDate(child.deathPostPartumOn),
          diedPerinatallyOn: formatDate(child.diedPerinatallyOn),
          identityNumber: child.identityNumber,
          firstName: child.firstName,
          surname: child.surname,
          placeOfBirth: child.placeOfBirth,
          countryOfBirth: child.countryId,
          note: child.note,
          chromAnom: child.chromosomeAnomalyCategoryIds && child.chromosomeAnomalyCategoryIds.length > 0,
          malfEnable: child.congenitalMalformationCategoryIds && child.congenitalMalformationCategoryIds.length > 0
        });

        // Bind ICD-10 codes if available
        if (child.chromosomeAnomalyCategoryIds && Array.isArray(child.chromosomeAnomalyCategoryIds)) {
          const icd10Array = this.getIcd10CodesFA(index);
          child.chromosomeAnomalyCategoryIds.forEach((code: string, i: number) => {
            if (i < icd10Array.length) {
              icd10Array.at(i).setValue(code);
            }
          });
        }

        // Bind malformation codes if available
        if (child.congenitalMalformationCategoryIds && Array.isArray(child.congenitalMalformationCategoryIds)) {
          const malfArray = this.getMalfCodesFA(index);
          child.congenitalMalformationCategoryIds.forEach((code: string, i: number) => {
            if (i < malfArray.length) {
              malfArray.at(i).setValue(code);
            }
          });
        }
      }
    });
  }

  getIcd10CodesFA(childIndex: number): FormArray {
    return this.childrenFA.at(childIndex).get('icd10Codes') as FormArray;
  }

  getMalfCodesFA(childIndex: number): FormArray {
    return this.childrenFA.at(childIndex).get('malfCodes') as FormArray;
  }

  // Helper to read dropdown options by key
  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFBirthEpisode:${key}`]) || [];
  }

  save() {
    const payload = this.form.getRawValue();
    console.log('Birth save:', payload);
    // TODO: hook to API
  }
}
