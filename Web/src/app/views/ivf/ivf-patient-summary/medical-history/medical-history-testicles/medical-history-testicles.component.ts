import { Component } from '@angular/core';
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
  testiclesData = {
    // Add testicles and seminal tract related fields here
  };
}
