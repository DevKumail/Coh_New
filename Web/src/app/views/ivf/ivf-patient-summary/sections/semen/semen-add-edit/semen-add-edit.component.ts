import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SemenTabsComponent } from './semen-tabs/semen-tabs.component';
import { SemenDiagnosisApprovalComponent } from './diagnosis-approval/semen-diagnosis-approval.component';

@Component({
  selector: 'app-semen-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SemenTabsComponent, SemenDiagnosisApprovalComponent],
  templateUrl: './semen-add-edit.component.html',
  styleUrls: ['./semen-add-edit.component.scss']
})
export class SemenAddEditComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Header details
      collectionDate: [null],
      collectionTime: [null],
      thawingDate: [null],
      thawingTime: [null],
      sampleId: [''],
      purpose: [''],
      abstinenceDays: [null],
      analysedBy: [''],
      appearance: [''],
      smell: [''],
      viscosity: [''],
      liquefactionTime: [null],
      treatment: [''],
      score: [''],
      startOfAnalysis: [null],
      agglutination: [false],
      dnaFragmented: [null],

      // Collection details
      collectionMethod: [''],
      collectionPlace: [''],
      collectionDifficulties: [''],

      // Native parameters
      volume: [null],
      ph: [null],
      concentration: [null],
      vitality: [null],
      leukocytes: [null],
      roundCells: [null],
      whoA: [null],
      whoB: [null],
      whoC: [null],
      whoD: [null],
      numberOfProgMotile: [null],
      overallMotility: [null],

      // Quantification / counts
      quantPossible: [''],
      totalSpermCountM: [null],
      peroxidasePositive: [null],
      immunobeadPercentAdherent: [null],
      marTestPercent: [null],

      // Morphology
      normalForms: [null],
      headDefects: [null],
      neckDefects: [null],
      tailDefects: [null],
      excessResidualCytoplasm: [null],
      multipleDefects: [null],
      tzi: [null],

      // Diagnosis & approval
      diagnosis: ['Not specified'],
      finding: ['Normal'],
      note: [''],
      approvalStatus: [''],

      // Timing and insemination
      timeBetweenCollectionAndUsage: ['00:00'],
      numberOfInsemMotile: [null],
      inseminatedAmountMl: [null],
      rate24hMotility: [null],
    });
  }

  onSave() { /* hook for API save */ }
  onCancel() { /* hook for close/back */ }
}
