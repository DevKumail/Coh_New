import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-medical-history-testicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilledOnValueDirective],
  templateUrl: './medical-history-testicles.component.html',
  styleUrls: ['./medical-history-testicles.component.scss']
})
export class MedicalHistoryTesticlesComponent {
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  testiclesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.testiclesForm = this.fb.group({
      primaryHypogonadotropy: [false],
      secondaryHypogonadotropy: [false],
      retractileTestes: [false],
      categoryIdTesticle: [''],
      categoryIdKryptorchidism: [''],
      categoryIdOrchitis: [''],
      testicleVolumeLeft: [''],
      testicleVolumeRight: [''],
      varicocele: [false],
      operatedVaricocele: [false],
      categoryIdInstrumentalVaricocele: [''],
      categoryIdClinicalVaricocele: [''],
      obstipationOfSpermaticDuct: [false],
      categoryIdProximalSeminalTract: [''],
      categoryIdDistalSeminalTract: [''],
      categoryIdEtiologicalDiagnosis: [''],
      inflammation: [false],
      note: [''],
      infections: this.fb.group({
        urethritis: [false],
        prostatitis: [false],
        epididymitis: [false],
        categoryIdPrevInfections: [''],
        categoryIdDiagnosisOfInfection: ['']
      })
    });
  }

  opts(key: string) {
    return this.dropdowns?.[key] || [];
  }

  getRawValue() {
    return this.testiclesForm.getRawValue();
  }

  get inflammationComputed(): boolean {
    const inf = this.testiclesForm.get('infections')?.value as any;
    return !!(inf?.urethritis || inf?.prostatitis || inf?.epididymitis);
  }
}
