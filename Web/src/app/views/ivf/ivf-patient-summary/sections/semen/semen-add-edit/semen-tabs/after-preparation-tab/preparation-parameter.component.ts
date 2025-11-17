import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, LucideCalculator } from 'lucide-angular';
import { NgbModal, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-preparation-parameter',
  standalone: true,
  imports: [CommonModule,FilledOnValueDirective, ReactiveFormsModule, FormsModule, LucideAngularModule, NgbModalModule, NgbNavModule],
  templateUrl: './preparation-parameter.component.html',
  styles: [
    `
    .form-label { font-weight: 400; margin-bottom: 0.25rem; }
    .card .fw-semibold { font-weight: 600; }
    .card .row.g-1 > [class*='col-'], .card .row.g-2 > [class*='col-'] { margin-bottom: 0.5rem; }

    /* Calculator inline styles */
    .calc-inline { max-width: 100%; flex-wrap: wrap; gap: .35rem; overflow: hidden; }
    .calc-inline small { line-height: 1; }
    .calc-inline .form-control { flex: 0 0 auto; width: 90px; padding: .125rem .25rem; text-align: center; height: 28px; }
    .calc-inline .result { width: 100px; font-weight: 600; background-color: #f8f9fa; }
    .calc-inline .symbol { font-size: 1.1rem; margin: 0 .25rem; }
    .calc-inline .segment { display: flex; flex-direction: column; }
    @media (max-width: 600px){
      .calc-inline .form-control { width: 88px; }
      .calc-inline .result { width: 96px; }
    }
    `
  ]
})
export class PreparationParameterComponent {
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  @Input() labelFor: (key: string) => string = (k) => k;
  form: FormGroup;
   protected readonly calculatorIcon = LucideCalculator;
   // Calculator modal state
   concCount = 0; // Count result
   concDilution = 1; // Dilution (factor)
   concPortion = 1; // Portion (factor)
   // Total items assessed for morphology (used to back-compute counts from percentages)
   private readonly totalMorphCount = 200;
 
   // Morphology modal state (grouped)
   morphologyCalculater: any = {
     normal: null,
     abnormal: null,
     head: null,
     neck: null,
     tail: null,
     excess: null,
     round: true,
   };
 
   // Computed morphology percentages (read-only display in modal)
   morphologyPerc: any = {
     normal: null,
     abnormal: null,
     head: null,
     neck: null,
     tail: null,
     excess: null,
     tzi: null,
   };
 
   constructor(private fb: FormBuilder, private modalService: NgbModal) {
     this.form = this.fb.group({
       volume: [null],
       concentration: [null],
       vitality: [null],
       leukocytes: [null],
       roundCells: [null],
       concLtPointOne: [false],
       // Quantification and counts (from top right of screenshot)
       quantPossible: [''],
       totalSpermCountM: [null],
       peroxidasePositive: [null],
       immunobeadPercentAdherent: [null],
       marAdherentPercent: [null],
       marIgGPercent: [null],
       marIgAPercent: [null],
       whoA: [null],
       whoB: [null],
       whoC: [null],
       whoD: [null],
       numberOfProgMotile: [null],
       overallMotility: [null],
       // Morphology fields
       normalForms: [null],
       headDefects: [null],
       neckDefects: [null],
       tailDefects: [null],
       excessResidualCytoplasm: [null],
       multipleDefects: [null],
       tzi: [null],
     });
   }
 
   get concComputed(): number {
     const num = (Number(this.concCount) || 0) * (Number(this.concDilution) || 1);
     const den = (Number(this.concPortion) || 1);
     if (!den) return 0;
     return +(num / den).toFixed(2); // [10^6/ml]
   }
 
   openConcCalc(tpl: any) {
     // initialize from current value if present
     const current = this.form.get('concentration')?.value;
     if (current != null && current !== '') {
       // back-compute into count with default factors
       this.concCount = Number(current) || 0;
       this.concDilution = 1;
       this.concPortion = 1;
     } else {
       this.concCount = 0;
       this.concDilution = 1;
       this.concPortion = 1;
     }
     this.modalService.open(tpl, { centered: true, size: 'md' });
   }
 
   takeOverConc(modalRef: any) {
     this.form.get('concentration')?.setValue(this.concComputed);
     modalRef.close();
   }
 
   openMorphCalc(tpl: any) {
     // Pull existing outer values (assumed as percentages) and map as counts with total=200
     const getNum = (k: string) => {
       const v = this.form.get(k)?.value;
       return v === null || v === undefined || v === '' ? null : Number(v);
     };
     const pNormal = getNum('normalForms');
     const pHead = getNum('headDefects');
     const pNeck = getNum('neckDefects');
     const pTail = getNum('tailDefects');
     const pExcess = getNum('excessResidualCytoplasm');
 
     const pAbnormal = (() => {
       const a = getNum('abnormalForms'); // in case later added
       if (a !== null) return a;
       if (pNormal !== null) return Math.max(0, 100 - Number(pNormal));
       return null;
     })();
 
     // Convert percentages to counts based on totalMorphCount
     const toCount = (p: number | null) => (p === null ? null : Math.round((Number(p) * this.totalMorphCount) / 100));
     const normal = toCount(pNormal);
     const abnormal = toCount(pAbnormal);
     const head = toCount(pHead);
     const neck = toCount(pNeck);
     const tail = toCount(pTail);
     const excess = toCount(pExcess);
 
     this.morphologyCalculater = {
       normal: normal,
       abnormal: abnormal,
       head: head,
       neck: neck,
       tail: tail,
       excess: excess,
       round: true,
     };
     this.morphologyPerc = { normal: null, abnormal: null, head: null, neck: null, tail: null, excess: null, tzi: null };
     this.modalService.open(tpl, { centered: true, size: 'md' });
     // Auto-compute to fill the lower section immediately
     this.computeMorphology();
   }
 
   // Compute percentages and TZI from entered counts
   computeMorphology() {
     const m = this.morphologyCalculater;
     const toNum = (v: any) => (v === null || v === undefined || v === '' ? 0 : Number(v));
     const normal = toNum(m.normal);
     const abnormal = toNum(m.abnormal);
     const head = toNum(m.head);
     const neck = toNum(m.neck);
     const tail = toNum(m.tail);
     const excess = toNum(m.excess);
 
     const total = normal + abnormal;
     if (total <= 0) {
       this.morphologyPerc = { normal: 0, abnormal: 0, head: 0, neck: 0, tail: 0, excess: 0, tzi: 0 };
       return;
     }
 
     const r = (x: number) => (m.round ? +x.toFixed(0) : +x.toFixed(2));
     // Percentages relative to total counted
     const pNormal = r((normal / total) * 100);
     const pAbnormal = r((abnormal / total) * 100);
     const pHead = r((head / total) * 100);
     const pNeck = r((neck / total) * 100);
     const pTail = r((tail / total) * 100);
     const pExcess = r((excess / total) * 100);
 
     // Teratozoospermia Index (assumption): average number of defects per abnormal sperm
     const denom = abnormal > 0 ? abnormal : 1; // avoid divide by zero
     const tziRaw = (head + neck + tail + excess) / denom;
     const pTzi = m.round ? +tziRaw.toFixed(0) : +tziRaw.toFixed(2);
 
     this.morphologyPerc = {
       normal: pNormal,
       abnormal: pAbnormal,
       head: pHead,
       neck: pNeck,
       tail: pTail,
       excess: pExcess,
       tzi: pTzi,
     };
   }
 
   takeOverMorph(modalRef: any) {
     // Ensure we have computed percentages
     if (this.morphologyPerc.normal === null) {
       this.computeMorphology();
     }
     const round = !!this.morphologyCalculater.round;
     const r = (x: any) => {
       const n = Number(x ?? 0);
       return round ? +n.toFixed(0) : +n.toFixed(2);
     };
 
     // Apply to outer form controls
     this.form.get('normalForms')?.setValue(r(this.morphologyPerc.normal));
     this.form.get('headDefects')?.setValue(r(this.morphologyPerc.head));
     this.form.get('neckDefects')?.setValue(r(this.morphologyPerc.neck));
     this.form.get('tailDefects')?.setValue(r(this.morphologyPerc.tail));
     this.form.get('excessResidualCytoplasm')?.setValue(r(this.morphologyPerc.excess));
     this.form.get('tzi')?.setValue(r(this.morphologyPerc.tzi));
     modalRef.close();
   }

  // Build observation payload for AfterPreparation using this tab's values
  buildObservation(): any {
    const v = this.form.value as any;
    return {
      observationId: 0,
      sampleId: 0,
      observationType: 'AfterPreparation',
      volumeML: v.volume ?? 0,
      phValue: null, // not present in after-prep form
      concentrationPerML: v.concentration ?? 0,
      concLessThanPointOne: !!v.concLtPointOne,
      vitalityPercent: v.vitality ?? 0,
      leukocytesml: v.leukocytes ?? 0,
      roundCellsml: v.roundCells ?? 0,
      quantificationPossibleId: v.quantPossible ?? 0,
      totalSpermCount: v.totalSpermCountM ?? 0,
      peroxidasePositive: v.peroxidasePositive ?? 0,
      immunobeadAdherentPercent: v.immunobeadPercentAdherent ?? 0,
      marTesPercent: v.marAdherentPercent ?? 0,
      maR_IgG_Percent: v.marIgGPercent ?? 0,
      maR_IgA_Percent: v.marIgAPercent ?? 0,
      createdBy: 0,
      updatedBy: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      motility: {
        motilityId: 0,
        observationId: 0,
        whO_AB_Percent: v.whoB ?? 0,
        whO_C_Percent: v.whoC ?? 0,
        whO_D_Percent: v.whoD ?? 0,
        progressiveMotile: v.numberOfProgMotile ?? 0,
        overallMotilityPercent: v.overallMotility ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      morphology: {
        morphologyId: 0,
        observationId: 0,
        morphologyNormalPercent: v.normalForms ?? 0,
        headDefectsPercent: v.headDefects ?? 0,
        neckMidpieceDefectsPercent: v.neckDefects ?? 0,
        tailDefectsPercent: v.tailDefects ?? 0,
        ercPercent: v.excessResidualCytoplasm ?? 0,
        multipleDefectsPercent: v.multipleDefects ?? 0,
        teratozoospermiaIndex: v.tzi ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
