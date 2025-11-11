import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-history-family',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-history-family.component.html',
  styleUrls: ['./medical-history-family.component.scss']
})
export class MedicalHistoryFamilyComponent {
  familyData = {
    // Add family history related fields here
  };
}
