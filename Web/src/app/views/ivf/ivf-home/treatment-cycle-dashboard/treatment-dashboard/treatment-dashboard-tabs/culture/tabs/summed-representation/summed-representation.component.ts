import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-summed-representation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './summed-representation.component.html',
  styleUrl: './summed-representation.component.scss'
})
export class SummedRepresentationComponent {
  sumsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.sumsForm = this.fb.group({
      // Oocytes
      sumOocTotal: [{ value: 0, disabled: true }],
      sumMII: [{ value: 0, disabled: true }],
      sumMI: [{ value: 0, disabled: true }],
      sumGV: [{ value: 0, disabled: true }],
      sumImmature: [{ value: 0, disabled: true }],
      sumAtr: [{ value: 0, disabled: true }],

      // Treatment
      sumIVF: [{ value: 0, disabled: true }],
      sumICSI: [{ value: 0, disabled: true }],
      sumCryo: [{ value: 0, disabled: true }],
      sumGIFT: [{ value: 0, disabled: true }],
      sumDiscarded: [{ value: 0, disabled: true }],

      // Pronucleus stages
      sum2PN: [{ value: 0, disabled: true }],
      sum1PN: [{ value: 0, disabled: true }],
      sumGe3PN: [{ value: 0, disabled: true }],
      sum0PN: [{ value: 0, disabled: true }],
      sumAtretic: [{ value: 0, disabled: true }],

      // 2 PN selection
      sumForEMBCult: [{ value: 0, disabled: true }],
      sumSelCryo: [{ value: 0, disabled: true }],
      sum2PNTrans: [{ value: 0, disabled: true }],
      sumSelDiscarded: [{ value: 0, disabled: true }],

      // Embryos
      sumEmbryoTransfer: [{ value: 0, disabled: true }],
      sumEmbCryo: [{ value: 0, disabled: true }],
      sumEmb2PNArrest: [{ value: 0, disabled: true }],
      sumEmbArrest: [{ value: 0, disabled: true }],
      sumEmbAtrDiscarded: [{ value: 0, disabled: true }]
    });
  }
}
