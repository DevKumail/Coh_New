import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-medical-history-basic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FilledOnValueDirective],
  templateUrl: './medical-history-basic.component.html',
  styleUrls: ['./medical-history-basic.component.scss']
})
export class MedicalHistoryBasicComponent implements OnInit {
  basicForm!: FormGroup;
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  @Input() hrEmployees: Array<{ providerId: number | string; name: string }> = [];
  illnessesOptions: string[] = [
    'Diabetes',
    'Hypertension',
    'Heart disease',
    'Cancer',
    'Thyroid disorder',
    'Other'
  ];
  searchIllness = '';
  factorsOptions: string[] = [
    'Male factor',
    'Ovulation disorder',
    'Tubal factor',
    'Endometriosis',
    'Unexplained'
  ];
  searchFactor = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.basicForm = this.fb.group({
      date: [''],
      attendingClinician: [''],
      weight: [''],
      height: [''],
      bmi: [{value: '', disabled: true}],
      adiposity: [''],
      generallyHealthy: ['Not specified'],
      longTermMedication: [''],
      pregnanciesAchieved: [0],
      chromosomeAnalysis: [''],
      cftrCarrier: [''],
      // Dynamic semen analyses
      analyses: this.fb.array([this.createAnalysisGroup()]),
      // Multi-selects
      fertilityFactors: this.fb.control<string[]>([]),
      previousIllnesses: this.fb.control<string[]>([])
    });
  }

  get fertilityFactors(): FormControl<string[] | null> {
    return this.basicForm.get('fertilityFactors') as FormControl<string[] | null>;
  }

  get previousIllnesses(): FormControl<string[] | null> {
    return this.basicForm.get('previousIllnesses') as FormControl<string[] | null>;
  }

  get analyses(): FormArray {
    return this.basicForm.get('analyses') as FormArray;
  }

  private createAnalysisGroup(): FormGroup {
    return this.fb.group({
      date: [''],
      id: [''],
      motile: [''],
      collectionMethod: [''],
      concentrationNative: [''],
      concentrationAfterPrep: [''],
      overallMotilityNative: [''],
      overallMotilityAfterPrep: [''],
      progressiveMotilityNative: [''],
      progressiveMotilityAfterPrep: [''],
      normalFormsNative: [''],
      normalFormsAfterPrep: ['']
    });
  }

  addAnalysis() {
    this.analyses.push(this.createAnalysisGroup());
  }

  removeAnalysis(index: number) {
    if (this.analyses.length > 1) {
      this.analyses.removeAt(index);
    }
  }



  onSubmit() {
    if (this.basicForm.valid) {
      console.log('Form Data:', this.basicForm.getRawValue());
      // Add your submit logic here
    }
  }

  opts(key: string) {
    return this.dropdowns?.[key] || [];
  }

  onPreviousIllnessesChange(event: Event) {
    const selectEl = event.target as HTMLSelectElement;
    const selected = Array.from(selectEl.selectedOptions).map(o => o.value).filter(v => v !== '');
    this.previousIllnesses.setValue(selected);
  }

  get selectedIllnesses(): string[] {
    return (this.previousIllnesses.value || []) as string[];
  }

  isSelected(value: string): boolean {
    return this.selectedIllnesses.includes(value);
  }

  toggleIllness(value: string) {
    const current = new Set(this.selectedIllnesses);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    this.previousIllnesses.setValue(Array.from(current));
    this.previousIllnesses.markAsDirty();
    this.previousIllnesses.markAsTouched();
  }

  get filteredIllnessesOptions(): string[] {
    const q = this.searchIllness.trim().toLowerCase();
    if (q.length <= 3) return this.illnessesOptions;
    return this.illnessesOptions.filter(o => o.toLowerCase().includes(q));
  }

  // Fertility factors helpers
  get selectedFactors(): string[] {
    return (this.fertilityFactors.value || []) as string[];
  }

  isFactorSelected(value: string): boolean {
    return this.selectedFactors.includes(value);
  }

  toggleFactor(value: string) {
    const current = new Set(this.selectedFactors);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    this.fertilityFactors.setValue(Array.from(current));
    this.fertilityFactors.markAsDirty();
    this.fertilityFactors.markAsTouched();
  }

  get filteredFactorsOptions(): string[] {
    const q = this.searchFactor.trim().toLowerCase();
    if (q.length <= 3) return this.factorsOptions;
    return this.factorsOptions.filter(o => o.toLowerCase().includes(q));
  }
}
