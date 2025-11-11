import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalHistoryComponent } from '../../medical-history/medical-history.component';

@Component({
  selector: 'app-ivf-ps-medical-history',
  standalone: true,
  imports: [CommonModule, MedicalHistoryComponent],
  template: `<app-medical-history></app-medical-history>`
})
export class IvfPsMedicalHistoryComponent {}
