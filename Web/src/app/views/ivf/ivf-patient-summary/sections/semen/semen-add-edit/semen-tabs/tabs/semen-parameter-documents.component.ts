import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-semen-parameter-documents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './semen-parameter-documents.component.html'
})
export class SemenParameterDocumentsComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      volume: [null],
      ph: [null],
      concentration: [null],
      vitality: [null],
      leukocytes: [null],
      roundCells: [null],
      // Quantification and counts (from top right of screenshot)
      quantPossible: [''],
      totalSpermCountM: [null],
      peroxidasePositive: [null],
      immunobeadPercentAdherent: [null],
      marAdherentPercent: [null],
      marIgGPercent: [null],
      marIgAPercent: [null],
      whoA: [null],
      whoB: [null],
      whoC: [null],
      whoD: [null],
      numberOfProgMotile: [null],
      overallMotility: [null],
      // Morphology fields
      normalForms: [null],
      headDefects: [null],
      neckDefects: [null],
      tailDefects: [null],
      excessResidualCytoplasm: [null],
      multipleDefects: [null],
      tzi: [null],
    });
  }
}
