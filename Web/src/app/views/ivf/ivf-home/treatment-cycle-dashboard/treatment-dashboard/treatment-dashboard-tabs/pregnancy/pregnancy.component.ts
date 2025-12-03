import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UltrasoundComponent } from './tabs/ultrasound/ultrasound.component';
import { ProgressComponent } from './tabs/progress/progress.component';


@Component({  
  selector: 'app-pregnancy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProgressComponent, UltrasoundComponent],
  templateUrl: './pregnancy.component.html',
  styleUrl: './pregnancy.component.scss'
})
export class PregnancyComponent {
  form: FormGroup;
  @ViewChild(ProgressComponent) progress?: ProgressComponent;
  @ViewChild(UltrasoundComponent) ultrasound?: UltrasoundComponent;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      outcomeUnknown: [false],
      outcomeClinical: [true],
      outcomeNoPreg: [false],
      positivePgTest: ['Yes'],
      lastHcg: [{ value: '', disabled: true }],
    });
  }

  onSave() {
    const top = this.form.getRawValue();
    const progress = this.progress ? this.progress.form.getRawValue() : null;
    const ultrasound = this.ultrasound ? { images: (this.ultrasound as any).images } : null;
    const payload = { top, progress, ultrasound };
    console.log('Pregnancy save:', payload);
    // TODO: send payload to API
  }
}
