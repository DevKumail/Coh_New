import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-medical-history-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilledOnValueDirective],
  templateUrl: './medical-history-general.component.html',
  styleUrls: ['./medical-history-general.component.scss']
})
export class MedicalHistoryGeneralComponent implements OnInit, OnDestroy {
  generalForm!: FormGroup;
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};

  constructor(private fb: FormBuilder) {}
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.initializeForm();
    this.generalForm.get('hepatitis')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((checked: boolean) => {
      if (!checked) {
        this.generalForm.get('hepatitisDetail')?.setValue('');
      }
    });
    this.generalForm.get('existingAllergies')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((checked: boolean) => {
      if (!checked) {
        this.generalForm.get('existingAllergiesDetail')?.setValue('');
      }
    });

    const applyChildrenState = (on: boolean) => {
      const girls = this.generalForm.get('girls');
      const boys = this.generalForm.get('boys');
      if (on) {
        girls?.enable({ emitEvent: false });
        boys?.enable({ emitEvent: false });
      } else {
        girls?.disable({ emitEvent: false });
        boys?.disable({ emitEvent: false });
        girls?.setValue(0, { emitEvent: false });
        boys?.setValue(0, { emitEvent: false });
      }
    };
    applyChildrenState(!!this.generalForm.get('hasChildren')?.value);
    this.generalForm.get('hasChildren')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v: boolean) => applyChildrenState(!!v));

    const applyAndroDiagState = (on: boolean) => {
      const dateCtrl = this.generalForm.get('andrologicalDiagnosisDate');
      if (on) {
        dateCtrl?.enable({ emitEvent: false });
      } else {
        dateCtrl?.disable({ emitEvent: false });
        dateCtrl?.setValue('', { emitEvent: false });
      }
    };
    applyAndroDiagState(!!this.generalForm.get('andrologicalDiagnosisPerformed')?.value);
    this.generalForm.get('andrologicalDiagnosisPerformed')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v: boolean) => applyAndroDiagState(!!v));

    const illnessKeys = [
      'asthenozoospermia',
      'teratospermia',
      'aspermia',
      'oligospermia',
      'azoospermia',
      'necrospermia'
    ];
    const applyIdiopathicState = (on: boolean) => {
      illnessKeys.forEach(k => {
        const c = this.generalForm.get(k);
        if (on) {
          c?.enable({ emitEvent: false });
        } else {
          c?.disable({ emitEvent: false });
          c?.setValue(false, { emitEvent: false });
        }
      });
      if (!on) {
        this.generalForm.get('idiopathicSelections')?.setValue([], { emitEvent: false });
      }
    };
    applyIdiopathicState(!!this.generalForm.get('idiopathic')?.value);
    this.generalForm.get('idiopathic')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v: boolean) => applyIdiopathicState(!!v));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isIdiopathicSelected(id: number): boolean {
    const arr: number[] = this.generalForm.get('idiopathicSelections')?.value || [];
    return Array.isArray(arr) && arr.includes(id);
  }

  toggleIdiopathic(id: number) {
    const ctrl = this.generalForm.get('idiopathicSelections');
    const current: number[] = (ctrl?.value || []).slice();
    const idx = current.indexOf(id);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(id);
    }
    ctrl?.setValue(current);
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();
  }

  initializeForm() {
    this.generalForm = this.fb.group({
      // Top section
      hasChildren: [false],
      girls: [0],
      boys: [0],
      andrologicalDiagnosisPerformed: [false],
      andrologicalDiagnosisDate: [''],
      infertileSince: [''],
      infertilityType: [''],
      vaccinations: [''],
      
      // Illnesses - Left side
      idiopathic: [false],
      idiopathicSelections: [[]],
      asthenozoospermia: [false],
      teratospermia: [false],
      aspermia: [false],
      oligospermia: [false],
      azoospermia: [false],
      necrospermia: [false],
      mumpsAfterPuberty: [false],
      endocrinopathies: [''],
      previousTumor: [''],
      hepatitis: [false],
      hepatitisDetail: [''],
      existingAllergies: [false],
      existingAllergiesDetail: [''],
      chronicIllnesses: [''],
      otherDiseases: [''],
      
      // Harmful influences - Right side
      smoking: [false],
      alcoholism: [false],
      currentSmokingHabits: [''],
      currentSmokingNumber: [0],
      prevSmokingHabits: [''],
      wineAndBeer: [''],
      liquors: [''],
      currentDrugHabits: [''],
      prevDrugHabits: [''],
      harmfulWorkingEnvironment: [''],
      enhancedRiskFactors: [''],
      
      // Performed treatment
      alreadyTreated: [false],
      antiInflammatory1: [''],
      antiInflammatory2: [''],
      antiInflammatory3: [''],
      hormonalTreatment1: [''],
      hormonalTreatment2: [''],
      hormonalTreatment3: [''],
      surgicalTreatment1: [''],
      surgicalTreatment2: [''],
      surgicalTreatment3: [''],
      treatmentNote: [''],
      
      // Further planning - Right side
      semenAnalysis: [false],
      morphologicalExamination: [false],
      serologicalExamination: [false],
      andrologicalUrologicalConsultation: [false],
      dnaFragmentation: [false],
      spermFreezing: [false],
      
      // ICD-10
      icd10: ['']
    });
  }

  onSubmit() {
    if (this.generalForm.valid) {
      console.log('General Form Data:', this.generalForm.value);
    }
  }

  opts(key: string) {
    return this.dropdowns?.[key] || [];
  }
}
