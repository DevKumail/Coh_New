import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalHistoryBasicComponent } from './medical-history-basic/medical-history-basic.component';
import { MedicalHistoryGeneralComponent } from './medical-history-general/medical-history-general.component';
import { MedicalHistoryTesticlesComponent } from './medical-history-testicles/medical-history-testicles.component';
import { MedicalHistoryGeneticsComponent } from './medical-history-genetics/medical-history-genetics.component';
import { MedicalHistoryFamilyComponent } from './medical-history-family/medical-history-family.component';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    MedicalHistoryBasicComponent,
    MedicalHistoryGeneralComponent,
    MedicalHistoryTesticlesComponent,
    MedicalHistoryGeneticsComponent,
    MedicalHistoryFamilyComponent
  ],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent {
  activeTabId: number = 1;

  onSave() {
    console.log('Saving medical history data...');
    // Implement save logic
  }

  onCancel() {
    console.log('Cancelling medical history form...');
    // Implement cancel logic
  }
}
