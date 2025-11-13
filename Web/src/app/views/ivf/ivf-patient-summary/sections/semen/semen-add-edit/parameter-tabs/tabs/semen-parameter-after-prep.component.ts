import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-semen-parameter-after-prep',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './semen-parameter-after-prep.component.html'
})
export class SemenParameterAfterPrepComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Top panel (same as Native)
      volume: [null],
      ph: [null],
      concentration: [null],
      concLtPointOne: [false],
      vitality: [null],
      leukocytes: [null],
      roundCells: [null],

      // Quantification and counts
      quantPossible: [''],
      totalSpermCountM: [null],
      peroxidasePositive: [null],
      immunobeadPercentAdherent: [null],
      marAdherentPercent: [null],
      marIgGPercent: [null],
      marIgAPercent: [null],

      // Motility
      whoB: [null],
      whoC: [null],
      whoD: [null],
      numberOfProgMotile: [null],
      overallMotility: [null],

      // Morphology
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
