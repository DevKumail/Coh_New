import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-table-representation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table-representation.component.html',
  styleUrls: ['./table-representation.component.scss']
})
export class TableRepresentationComponent implements OnInit {
  cultureForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.cultureForm = this.fb.group({
      // Oocytes - fol. aspiration
      oocytesTotal: [0],
      oocytesMII: [0],
      oocytesMI: [0],
      oocytesGV: [0],
      oocytesTotalImmature: [0],
      oocytesAtr: [0],

      // Treatment - From fol. aspiration
      treatmentIVF: [0],
      treatmentICSI: [0],
      treatmentCryo: [0],
      treatmentGIFT: [0],
      treatmentDiscarded: [0],

      // Pronucleus stages - From IVF
      pnIvfTwoPN: [0],
      pnIvfThawTwoPN: [0],
      pnIvfOnePN: [0],
      pnIvfGe3PN: [0],
      pnIvfZeroPN: [0],
      pnIvfImmature: [0],
      pnIvfAtretic: [0],
      pnIvfThawAtretic: [0],

      // 2 PN selection - From IVF
      pnSelIvfForCultivat: [0],
      pnSelIvfThawForCultivat: [0],
      pnSelIvfCryo: [0],
      pnSelIvf2PNTrans: [0],
      pnSelIvfThaw2PNTrans: [0],
      pnSelIvfDiscarded: [0],
      pnSelIvfThawDiscarded: [0],

      // Embryos - From IVF
      embryoIvfETIdeal: [0],
      embryoIvfThawETIdeal: [0],
      embryoIvfETNIdeal: [0],
      embryoIvfThawETNIdeal: [0],
      embryoIvfCryo: [0],
      embryoIvf2PNArrest: [0],
      embryoIvfEmbryoArrest: [0],
      embryoIvfAtrDiscarded: [0],
      embryoIvfThawAtrDiscarded: [0],

      // Oocytes - Occ. thawing
      oocytesThawVital: [0],
      oocytesThawMII: [0],
      oocytesThawMI: [0],
      oocytesThawGV: [0],
      oocytesThawTotalImmature: [0],
      oocytesThawAtr: [0],

      // From occ. thawing
      fromOccThawIVF: [0],
      fromOccThawICSI: [0],
      fromOccThawGIFT: [0],
      fromOccThawLost: [0],
      fromOccThawDiscarded: [0],
      fromOccThawDiscardedOn: [''],

      // Pronucleus stages - From ICSI
      pnIcsiTwoPN: [0],
      pnIcsiThawTwoPN: [0],
      pnIcsiOnePN: [0],
      pnIcsiGe3PN: [0],
      pnIcsiZeroPN: [0],
      pnIcsiImmature: [0],
      pnIcsiAtretic: [0],
      pnIcsiThawAtretic: [0],

      // 2 PN selection - From ICSI
      pnSelIcsiForCultivat: [0],
      pnSelIcsiThawForCultivat: [0],
      pnSelIcsiCryo: [0],
      pnSelIcsi2PNTrans: [0],
      pnSelIcsiThaw2PNTrans: [0],
      pnSelIcsiDiscarded: [0],
      pnSelIcsiThawDiscarded: [0],

      // Embryos - From ICSI
      embryoIcsiETIdeal: [0],
      embryoIcsiThawETIdeal: [0],
      embryoIcsiETNIdeal: [0],
      embryoIcsiThawETNIdeal: [0],
      embryoIcsiCryo: [0],
      embryoIcsi2PNArrest: [0],
      embryoIcsiEmbryoArrest: [0],
      embryoIcsiAtrDiscarded: [0],
      embryoIcsiThawAtrDiscarded: [0]
    });

    // Disable read-only fields (kept white via CSS)
    this.cultureForm.get('oocytesTotal')?.disable({ emitEvent: false });
    this.cultureForm.get('oocytesTotalImmature')?.disable({ emitEvent: false });
    this.cultureForm.get('oocytesThawTotalImmature')?.disable({ emitEvent: false });
    this.cultureForm.get('oocytesThawVital')?.disable({ emitEvent: false });
    this.cultureForm.get('oocytesThawAtr')?.disable({ emitEvent: false });
  }

  // Helper method to calculate sum for reactive forms
  getSum(field1: string, field2: string): number {
    const val1 = this.cultureForm.get(field1)?.value || 0;
    const val2 = this.cultureForm.get(field2)?.value || 0;
    return Number(val1) + Number(val2);
  }
}
