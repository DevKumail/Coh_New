import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-additional-measures',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './additional-measures.component.html',
  styleUrls: ['./additional-measures.component.scss']
})
export class AdditionalMeasuresComponent {
  form: FormGroup;
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      plannedAdditionalMeasures: [[]],
      performedAdditionalMeasures: [[]],
      pidPolarBodiesIndication: [[]],
      pidEmbBlastIndication: [[]],
      geneticCondition: ['']
    });
  }

  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFTreatmentCycle:${key}`]) || [];
  }

  isChecked(controlName: string, value: string) {
    const arr = (this.form.get(controlName)?.value as string[]) || [];
    return arr.includes(value);
  }

  toggleSelection(controlName: string, value: string) {
    const control = this.form.get(controlName);
    if (!control) { return; }
    const current: string[] = control.value || [];
    const exists = current.includes(value);
    const updated = exists ? current.filter(v => v !== value) : [...current, value];
    control.setValue(updated);
    control.markAsDirty();
    control.updateValueAndValidity({ emitEvent: true });
  }

  selectedSummary(controlName: string, max = 3) {
    const arr: string[] = (this.form.get(controlName)?.value as string[]) || [];
    if (!arr.length) { return ''; }
    if (arr.length <= max) { return arr.join(', '); }
    const shown = arr.slice(0, max).join(', ');
    const remaining = arr.length - max;
    return `${shown} +${remaining} more`;
  }

  selectedTitle(controlName: string) {
    const arr: string[] = (this.form.get(controlName)?.value as string[]) || [];
    return arr.join(', ');
  }
}
