import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, QuillEditorComponent, NgbDropdownModule],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {

  generalForm: FormGroup;
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  @Input() hrEmployees: Array<{ providerId: number; name: string }> = [];

  constructor(private fb: FormBuilder) {
    this.generalForm = this.fb.group({ 
      treatment: ['', Validators.required],
      onlyInternalCycle: [false],
      // Checkbox flags under Treatment
      fertilityPreservation: [false],
      socialEggFreezing: [false],
      freezeAll: [false],
      oocyteThawing: [false],
      embryoThawing: [false],
      ivm: [false],
      imsi: [false],
      picsi: [false],

      dateOfLMP: [null],
      cycleFromAmenorrhea: [''],
      mainIndication: [''],
      protocol: [''],
      stimulationPlanned: [''],
      stimulatedExternally: [''],
      longTermMedication: [''],
      plannedNoOfEmbryos: [0],
      plannedSpermCollection: [[]],
      attendingClinician: [''],
      surveyId: [''],
      randomizationGroup: [''],
      takenOverFrom: [''],
      takenOverOn: [''],
      editorContent: [''],

      femaleMedicalHistoryOf: [''],
      femaleHistory: [''],
      maleMedicalHistoryOf: [''],
      maleHistory: [''],
      cycleNote: ['']
    });
  }

  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFTreatmentCycle:${key}`]) || [];
  }

  isChecked(controlName: string, value: string) {
    const arr = (this.generalForm.get(controlName)?.value as string[]) || [];
    return arr.includes(value);
  }

  toggleSelection(controlName: string, value: string) {
    const control = this.generalForm.get(controlName);
    if (!control) { return; }
    const current: string[] = control.value || [];
    const exists = current.includes(value);
    const updated = exists ? current.filter(v => v !== value) : [...current, value];
    control.setValue(updated);
    control.markAsDirty();
    control.updateValueAndValidity({ emitEvent: true });
  }

  selectedSummary(controlName: string, max = 1) {
    const arr: string[] = (this.generalForm.get(controlName)?.value as string[]) || [];
    if (!arr.length) { return ''; }
    if (arr.length <= max) { return arr.join(', '); }
    const shown = arr.slice(0, max).join(', ');
    const remaining = arr.length - max;
    return `${shown} +${remaining} more`;
  }

  selectedTitle(controlName: string) {
    const arr: string[] = (this.generalForm.get(controlName)?.value as string[]) || [];
    return arr.join(', ');
  }

  quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]
  };

}
