import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-additional-measures',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './additional-measures.component.html',
  styleUrls: ['./additional-measures.component.scss']
})
export class AdditionalMeasuresComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      plannedAdditionalMeasures: [''],
      performedAdditionalMeasures: [''],
      pidPolarBodiesIndication: [''],
      pidEmbBlastIndication: [''],
      geneticCondition: ['']
    });
  }
}
