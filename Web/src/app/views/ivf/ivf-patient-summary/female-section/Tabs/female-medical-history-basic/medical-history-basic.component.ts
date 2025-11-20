import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ApiService } from '@/app/core/services/api.service';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-medical-history-basic',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    FilledOnValueDirective,
    QuillModule
  ],
  templateUrl: './medical-history-basic.component.html',
  styleUrls: ['./medical-history-basic.component.scss']
})
export class MedicalHistoryBasicComponent implements OnInit {
  basicForm!: FormGroup;
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  @Input() hrEmployees: Array<{ providerId: number | string; name: string }> = [];
  illnessesOptions: string[] = [];
  searchIllness = '';
  private illnessesLimit = 50;
  private illnessesLoading = false;
  factorsOptions: string[] = [];
  searchFactor = '';
  private factorsLimit = 50;
  private factorsLoading = false;
  yearOptions: number[] = [];
  minMonthYear: string = '';
  maxMonthYear: string = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    // Generate year options (current year to last 25 years)
    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from({ length: 26 }, (_, i) => currentYear - i);
    
    // Set min and max for month input (last 25 years to current month)
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
    this.minMonthYear = `${currentYear - 25}-01`; // 25 years ago, January
    this.maxMonthYear = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`; // Current year and month
  }

  ngOnInit() {
    this.initializeForm();
    // initial load
    this.fetchIllnesses();
    this.fetchFactors();
  }

  // ========== FACTORS (REMOTE SEARCH + INFINITE SCROLL) ==========
  onFactorSearchChange(q: string) {
    this.searchFactor = q || '';
    this.factorsLimit = 50;
    this.fetchFactors();
  }

  onFactorScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && !this.factorsLoading) {
      this.factorsLimit += 50;
      this.fetchFactors(true);
    }
  }

  private fetchFactors(append: boolean = false) {
    this.factorsLoading = true;
    const params: any = { searchKey: this.searchFactor || '', limit: this.factorsLimit };
    this.api.get('Common/GetICDCodesBySearch', params).subscribe({
      next: (res: any) => {
        const items: any[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        const labels = items.map(it => this.icdLabel(it)).filter((s: any) => typeof s === 'string' && s.length > 0);
        this.factorsOptions = append ? Array.from(new Set([...(this.factorsOptions || []), ...labels])) : labels;
        this.factorsLoading = false;
      },
      error: () => {
        this.factorsLoading = false;
      }
    });
  }

  initializeForm() {
    this.basicForm = this.fb.group({
      date: [''],
      attendingClinician: [''],
      weight: [''],
      height: [''],
      bmi: [{value: '', disabled: true}],
      adiposity: [''],
      generallyHealthy: [''],
      longTermMedication: [''],
      chromosomeAnalysis: [''],
      cftrCarrier: [''],

      patencyRight: [''],
      patencyLeft: [''],
      fallopianYear: [''],
      // Dynamic semen analyses
      // analyses: this.fb.array([this.createAnalysisGroup()]),
      // Multi-selects
      sterilityFactors: this.fb.control<string[]>([]),
      previousIllnesses: this.fb.control<string[]>([]),

      unprotectedMonthYear: [''],
      previousOperative: [''],
      ovarianStimulations: [''],
      IVFandICSI: [''],
      alternativePretreatments: [false]
    });
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

  get sterilityFactors(): FormControl<string[] | null> {
    return this.basicForm.get('sterilityFactors') as FormControl<string[] | null>;
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

  onIllnessSearchChange(q: string) {
    this.searchIllness = q || '';
    this.illnessesLimit = 50;
    this.fetchIllnesses();
  }

  onIllnessScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && !this.illnessesLoading) {
      this.illnessesLimit += 50;
      this.fetchIllnesses(true);
    }
  }

  private fetchIllnesses(append: boolean = false) {
    this.illnessesLoading = true;
    const params: any = { searchKey: this.searchIllness || '', limit: this.illnessesLimit };
    this.api.get('Common/GetICDCodesBySearch', params).subscribe({
      next: (res: any) => {
        const items: any[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        const labels = items.map(it => this.icdLabel(it)).filter((s: any) => typeof s === 'string' && s.length > 0);
        this.illnessesOptions = append ? Array.from(new Set([...(this.illnessesOptions || []), ...labels])) : labels;
        this.illnessesLoading = false;
      },
      error: () => {
        this.illnessesLoading = false;
      }
    });
  }

  private icdLabel(it: any): string {
    if (typeof it === 'string') return it;
    const code = it?.icdCode || it?.ICDCode || it?.code || '';
    const descShort = it?.descriptionShort || it?.ICDName || it?.name || it?.description || it?.term || it?.icdName || '';
    const label = [code, descShort].filter(Boolean).join(' | ');
    return label || (descShort || code || '');
  }

  get selectedIllnesses(): string[] {
    return (this.previousIllnesses.value || []) as string[];
  }

  isSelected(value: string): boolean {
    const code = (value || '').split(' | ')[0].trim();
    return !!code && this.selectedIllnesses.includes(code);
  }

  toggleIllness(value: string) {
    const code = (value || '').split(' | ')[0].trim();
    if (!code) return;
    const current = new Set(this.selectedIllnesses);
    if (current.has(code)) current.delete(code); else current.add(code);
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
    return (this.sterilityFactors.value || []) as string[];
  }

  isFactorSelected(value: string): boolean {
    const code = (value || '').split(' | ')[0].trim();
    return !!code && this.selectedFactors.includes(code);
  }

  toggleFactor(value: string) {
    const code = (value || '').split(' | ')[0].trim();
    if (!code) return;
    const current = new Set(this.selectedFactors);
    if (current.has(code)) current.delete(code); else current.add(code);
    this.sterilityFactors.setValue(Array.from(current));
    this.sterilityFactors.markAsDirty();
    this.sterilityFactors.markAsTouched();
  }

  get filteredFactorsOptions(): string[] {
    const q = this.searchFactor.trim().toLowerCase();
    if (q.length <= 3) return this.factorsOptions;
    return this.factorsOptions.filter(o => o.toLowerCase().includes(q));
  }
}
