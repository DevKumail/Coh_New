import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-history-testicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-history-testicles.component.html',
  styleUrls: ['./medical-history-testicles.component.scss']
})
export class MedicalHistoryTesticlesComponent {
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  testiclesData = {
    // Add testicles and seminal tract related fields here
  };

  opts(key: string) {
    return this.dropdowns?.[key] || [];
  }
}
