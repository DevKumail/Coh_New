import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
 

@Component({
  selector: 'app-ivf-home',
  templateUrl: './ivf-home.component.html',
  styleUrls: ['./ivf-home.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon]
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

  viewSummary(side: 'female' | 'male') {
    // placeholder: wire to summary view when available
    console.log('View summary clicked for', side, 'ID:', side === 'female' ? this.form.value.femaleId : this.form.value.maleId);
  }
}
