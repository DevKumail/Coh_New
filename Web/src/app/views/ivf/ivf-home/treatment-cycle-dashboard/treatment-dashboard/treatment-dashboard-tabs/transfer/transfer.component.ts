import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmbryoTransferComponent } from './forms/embryo-transfer/embryo-transfer.component';
import { FurtherInformationComponent } from './forms/further-information/further-information.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, EmbryoTransferComponent, FurtherInformationComponent],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  embryosList: EmbryoTransferComponent['embryos'] = [
    { number: 3, id: 12673, title: 'Hatching blastocyst', morpho: 'ideal' as 'ideal', score: '5AA', image1: null, image2: null },
    { number: 5, id: 12675, title: 'Hatching blastocyst', morpho: null, score: null, image1: null, image2: null }
  ];
}
