import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-embryo-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './embryo-transfer.component.html',
  styleUrl: './embryo-transfer.component.scss'
})
export class EmbryoTransferComponent {
  @Input() embryos: Array<{
    number: number;
    id: number | string;
    title: string;
    image1?: string | null;
    image2?: string | null;
    morpho?: 'ideal' | 'not_ideal' | null;
    score?: string | null;
  }> = [];

  trackById = (_: number, e: { id: number | string }) => e.id;
}
