import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-history-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medical-history-general.component.html',
  styleUrls: ['./medical-history-general.component.scss']
})
export class MedicalHistoryGeneralComponent implements OnInit {
  generalForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    // Clear details when corresponding checkboxes are unchecked
    this.generalForm.get('hepatitis')?.valueChanges.subscribe((checked: boolean) => {
      if (!checked) {
        this.generalForm.get('hepatitisDetail')?.setValue('');
      }
    });
    this.generalForm.get('existingAllergies')?.valueChanges.subscribe((checked: boolean) => {
      if (!checked) {
        this.generalForm.get('existingAllergiesDetail')?.setValue('');
      }
    });
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
}
