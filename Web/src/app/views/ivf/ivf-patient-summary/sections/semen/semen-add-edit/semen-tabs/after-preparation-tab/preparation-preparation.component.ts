import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-preparation-preparation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilledOnValueDirective],
  templateUrl: './preparation-preparation.component.html',
})
export class PreparationPreparationComponent implements OnChanges {
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  @Input() labelFor: (key: string) => string = (k) => k;
  @Input() hrEmployees: Array<{ name: string; providerId: number }> = [];
  form: FormGroup;
  methodsOptions: Array<{ id: number; name: string }> = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      prepDate: [null],
      prepTime: [null],
      prepBy: [''],
      methods: this.fb.array([])
    });
    this.rebuildMethods();
  }

  get methodsFA(): FormArray<FormControl<boolean>> {
    return this.form.get('methods') as FormArray<FormControl<boolean>>;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dropdowns']) {
      const items = this.dropdowns?.['IVFSemanAnalysis:Preperation'] || [];
      this.methodsOptions = items.map(x => ({ id: x.valueId, name: x.name }));
      this.rebuildMethods();
    }
  }

  private rebuildMethods() {
    const fa = this.fb.array(this.methodsOptions.map(() => new FormControl(false)));
    this.form.setControl('methods', fa);
  }

  onMethodToggle(idx: any) {
    const selected = this.methodsFA.controls.filter(c => !!c.value).length;
    if (selected > 4) {
      // revert the last toggle if over limit
      const ctl = this.methodsFA.at(idx) as FormControl<boolean>;
      ctl.setValue(false, { emitEvent: false });
    }
  }

  // Build preparation payload from form
  buildPreparation(): any {
    const v = this.form.value as any;
    const time = this.formatTime(v.prepTime);
    const selectedIdx: number[] = (this.methodsFA.controls || [])
      .map((ctl, i) => (!!ctl.value ? i : -1))
      .filter(i => i >= 0);
    const selectedMethods = selectedIdx
      .map(i => this.methodsOptions[i])
      .filter(x => !!x)
      .map(x => ({ id: 0, preparationId: 0, preparationMethodId: x.id, createdAt: new Date().toISOString() }));

    return {
      preparationId: 0,
      observationId: 0,
      preparationDate: v.prepDate || null,
      preparationTime: time,
      preparedById: v.prepBy || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preparationMethods: selectedMethods,
    };
  }

  private formatTime(timeVal: any): string | null {
    if (!timeVal) return null;
    try {
      const s = String(timeVal);
      if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
      if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        const hh = `${d.getHours()}`.padStart(2, '0');
        const mm = `${d.getMinutes()}`.padStart(2, '0');
        const ss = `${d.getSeconds()}`.padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Patch from preparation model (first preparation in AfterPreparation observation)
  patchFromPreparation(prep: any) {
    if (!prep) return;
    const p = prep || {};
    const toHHmm = (t: string | null | undefined) => {
      if (!t) return null;
      const s = String(t);
      if (/^\d{2}:\d{2}$/.test(s)) return s;
      if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s.substring(0,5);
      return null;
    };
    this.form.patchValue({
      prepDate: p.preparationDate || null,
      prepTime: toHHmm(p.preparationTime),
      prepBy: p.preparedById || '',
    });
    const selectedMethodIds: number[] = (p.preparationMethods || []).map((m: any) => m.preparationMethodId);
    // Ensure methods controls match current options length
    this.rebuildMethods();
    this.methodsFA.controls.forEach((ctl, idx) => {
      const method = this.methodsOptions[idx];
      ctl.setValue(!!(method && selectedMethodIds.includes(method.id)), { emitEvent: false });
    });
  }
}
