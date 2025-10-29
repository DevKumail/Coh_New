import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  @Input() selected: string = 'summary';
  @Output() select = new EventEmitter<string>();

  mainItems = [
    { id: 'summary', label: 'Summary Sheet' },
    { id: 'patient-document', label: 'Patient Document' },
    { id: 'problem-list', label: 'Problem List' },
    { id: 'medical-history', label: 'Medical History' },
    { id: 'allergies', label: 'Allergies' },
    { id: 'vital-sign', label: 'Vital Sign' },
    { id: 'procedures', label: 'Procedures' },
    { id: 'medications', label: 'Medications' },
    { id: 'immunizations', label: 'Immunizations' },
    
  ];

  orderItems = [
    { id: 'prescription', label: 'Prescription' },
    { id: 'investigations', label: 'Investigations' },
    { id: 'results', label: 'Results' },
    { id: 'referral-order', label: 'Referral Order' },
    { id: 'scheduling-order', label: 'Scheduling Order' },
  ];

  onSelect(id: string) {
    this.select.emit(id);
  }
}
