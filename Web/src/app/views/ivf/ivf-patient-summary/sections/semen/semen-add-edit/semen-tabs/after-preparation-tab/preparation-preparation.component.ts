import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-preparation-preparation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilledOnValueDirective],
  templateUrl: './preparation-preparation.component.html',
})
export class PreparationPreparationComponent {
  form: FormGroup;
  methodsOptions: string[] = [
    'None',
    'Density gradient',
    'Swim-up',
    'Wash / centrifugation',
    'Incubation',
    'Glass wool filtration',
    'Migration / sedimentation',
    'Concentration',
    'Unknown',
    'Other',
    'Mechanical',
    'Enzymatical',
    'Density gradient plus swim-up',
    'Pellet resuspended',
    'MACS',
    'Fertile Chip',
    'Cryo sperm without further preparation',
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      prepDate: [null],
      prepTime: [null],
      prepBy: [''],
      methods: this.fb.array(this.methodsOptions.map(() => new FormControl(false)))
    });
  }

  get methodsFA(): FormArray<FormControl<boolean>> {
    return this.form.get('methods') as FormArray<FormControl<boolean>>;
  }

  onMethodToggle(idx: number) {
    const selected = this.methodsFA.controls.filter(c => !!c.value).length;
    if (selected > 4) {
      // revert the last toggle if over limit
      const ctl = this.methodsFA.at(idx) as FormControl<boolean>;
      ctl.setValue(false, { emitEvent: false });
    }
  }
}
