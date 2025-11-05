import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ivf-home',
  templateUrl: './ivf-home.component.html',
  styleUrls: ['./ivf-home.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class IVFHomeComponent {
  form: FormGroup;
  selectedTab: 'messages' | 'lab' | 'consents' | 'application' = 'messages';
  overview: Array<{
    woman: string;
    no: string | number;
    start: string;
    eggTreatment: string;
    partner: string;
    sperm: string;
    stimulation: string;
    stimProt: string;
    stimMed: string;
    triggering: string;
    trigMed: string;
    cycle: string;
  }> = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      femaleId: [''],
      maleId: ['']
    });
  }
}
