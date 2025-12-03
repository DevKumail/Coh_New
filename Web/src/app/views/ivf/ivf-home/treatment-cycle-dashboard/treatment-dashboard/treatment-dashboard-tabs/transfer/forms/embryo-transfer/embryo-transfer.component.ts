import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-embryo-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './embryo-transfer.component.html',
  styleUrls: ['./embryo-transfer.component.scss']
})
export class EmbryoTransferComponent implements OnChanges {
  @Input() embryos: Array<{
    number: number;
    id: number | string;
    title: string;
    image1?: string | null;
    image2?: string | null;
    morpho?: 'ideal' | 'not_ideal' | null;
    score?: string | null;
  }> = [];

  @Input() scoreOptions: Array<{ valueId: number; name: string }> = [];

  trackById = (_: number, e: { id: number | string }) => e.id;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      embryos: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['embryos']) {
      const arr = this.fb.array(
        this.embryos.map(e =>
          this.fb.group({
            morpho: [e.morpho ?? null],
            score: [e.score ?? null],
          })
        )
      );
      this.form.setControl('embryos', arr);
    }
  }

  get embryosFA(): FormArray<FormGroup> {
    return this.form.get('embryos') as FormArray<FormGroup>;
  }
}

