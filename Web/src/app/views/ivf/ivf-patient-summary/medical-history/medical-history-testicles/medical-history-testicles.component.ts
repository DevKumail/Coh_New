import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-history-testicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      categoryIdTesticle: [0],
      categoryIdKryptorchidism: [0],
      categoryIdOrchitis: [0],
      testicleVolumeLeft: [''],
      testicleVolumeRight: [''],
      varicocele: [false],
      operatedVaricocele: [false],
      categoryIdInstrumentalVaricocele: [0],
      categoryIdClinicalVaricocele: [0],
      obstipationOfSpermaticDuct: [false],
      categoryIdProximalSeminalTract: [0],
      categoryIdDistalSeminalTract: [0],
      categoryIdEtiologicalDiagnosis: [0],
      inflammation: [false],
      note: [''],
      infections: this.fb.group({
        urethritis: [false],
        prostatitis: [false],
        epididymitis: [false],
        categoryIdPrevInfections: [0],
        categoryIdDiagnosisOfInfection: [0]
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
