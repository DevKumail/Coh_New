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
  @Input() femaleHistoryOptions: Array<any> = [];
  @Input() maleHistoryOptions: Array<any> = [];

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

  // --- Medical history dynamic helpers ---
  private formatPrevIllness(list: Array<{ illnessCode: string; descriptionFull: string }> | null | undefined) {
    if (!list || !list.length) { return ''; }
    return list.map(x => `${x.illnessCode} - ${x.descriptionFull}`).join('\n');
  }

  formatHistoryLabel(entry: any) {
    const d = entry?.date ? new Date(entry.date).toLocaleDateString() : '-';
    const prev = (entry?.prevIllnessList && entry.prevIllnessList.length)
      ? entry.prevIllnessList.map((i: any) => i.descriptionFull).join(', ')
      : 'Not specified';
    const chrom = entry?.chromosomeAnalysis ?? 'Not performed';
    return `M.hist.: ${d} | Prev. ill.: ${prev} | Chromos.: ${chrom}`;
  }

  onFemaleHistoryChange() {
    const id = this.generalForm.get('femaleMedicalHistoryOf')?.value;
    const sel = this.femaleHistoryOptions?.find(x => x.ivfFemaleFHId === id);
    const text = this.formatPrevIllness(sel?.prevIllnessList);
    const ctrl = this.generalForm.get('femaleHistory');
    ctrl?.setValue(text);
    if (id) { ctrl?.disable({ emitEvent: false }); } else { ctrl?.enable({ emitEvent: false }); }
  }

  onMaleHistoryChange() {
    const id = this.generalForm.get('maleMedicalHistoryOf')?.value;
    const sel = this.maleHistoryOptions?.find(x => x.ivfMaleFHId === id);
    const text = this.formatPrevIllness(sel?.prevIllnessList);
    const ctrl = this.generalForm.get('maleHistory');
    ctrl?.setValue(text);
    if (id) { ctrl?.disable({ emitEvent: false }); } else { ctrl?.enable({ emitEvent: false }); }
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

  // Dynamically build the Treatment flags list from dropdown payload, mapped to existing controls
  treatmentFlags() {
    const mapping: Array<{ name: string; control: string }> = [
      { name: 'Fertility preservation', control: 'fertilityPreservation' },
      { name: 'Social egg freezing', control: 'socialEggFreezing' },
      { name: 'Freeze all', control: 'freezeAll' },
      { name: 'Oocyte thawing', control: 'oocyteThawing' },
      { name: 'Embryo thawing', control: 'embryoThawing' },
      { name: 'IVM', control: 'ivm' },
      { name: 'IMSI', control: 'imsi' },
      { name: 'PICSI', control: 'picsi' },
    ];
    const opts = this.options('TreatmentFlags');
    if (opts && opts.length) {
      const names = new Set(opts.map((o: any) => o.name));
      return mapping.filter(m => names.has(m.name));
    }
    return mapping;
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
