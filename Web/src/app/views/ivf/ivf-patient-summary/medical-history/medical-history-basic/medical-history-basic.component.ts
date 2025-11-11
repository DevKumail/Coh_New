import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-medical-history-basic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medical-history-basic.component.html',
  styleUrls: ['./medical-history-basic.component.scss']
})
export class MedicalHistoryBasicComponent implements OnInit {
  basicForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.setupBMICalculation();
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
      // Semen Analysis 1
      semenAnalysis1: [''],
      collectionMethod1: [''],
      concentration1Native: [''],
      concentration1AfterPrep: [''],
      overallMotility1Native: [''],
      overallMotility1AfterPrep: [''],
      progressiveMotility1Native: [''],
      progressiveMotility1AfterPrep: [''],
      normalForms1Native: [''],
      normalForms1AfterPrep: [''],
      // Semen Analysis 2
      semenAnalysis2: [''],
      collectionMethod2: [''],
      concentration2Native: [''],
      concentration2AfterPrep: [''],
      overallMotility2Native: [''],
      overallMotility2AfterPrep: [''],
      progressiveMotility2Native: [''],
      progressiveMotility2AfterPrep: [''],
      normalForms2Native: [''],
      normalForms2AfterPrep: [''],
      // Form Arrays
      fertilityFactors: this.fb.array(['', '', '', '']),
      previousIllnesses: this.fb.array(['', '', '', ''])
    });
  }

  get fertilityFactors(): FormArray {
    return this.basicForm.get('fertilityFactors') as FormArray;
  }

  get previousIllnesses(): FormArray {
    return this.basicForm.get('previousIllnesses') as FormArray;
  }

  setupBMICalculation() {
    this.basicForm.get('weight')?.valueChanges.subscribe(() => this.calculateBMI());
    this.basicForm.get('height')?.valueChanges.subscribe(() => this.calculateBMI());
  }

  calculateBMI() {
    const weight = parseFloat(this.basicForm.get('weight')?.value);
    const height = parseFloat(this.basicForm.get('height')?.value) / 100; // Convert cm to m
    
    if (weight > 0 && height > 0) {
      const bmi = (weight / (height * height)).toFixed(2);
      this.basicForm.get('bmi')?.setValue(bmi);
    }
  }

  onSubmit() {
    if (this.basicForm.valid) {
      console.log('Form Data:', this.basicForm.getRawValue());
      // Add your submit logic here
    }
  }
}
