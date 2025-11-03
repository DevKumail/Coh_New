import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule, NgIconComponent],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  @Input() selected: string = 'summary';
  @Input() collapsed: boolean = false;
  @Output() select = new EventEmitter<string>();

  mainItems = [
    { id: 'summary', label: 'Summary Sheet', icon: 'tablerLayoutDashboard' },
    { id: 'patient-document', label: 'Patient Document', icon: 'tablerFileText' },
    { id: 'problem-list', label: 'Problem List', icon: 'tablerClipboardList' },
    { id: 'medical-history', label: 'Medical History', icon: 'tablerNotes' },
    { id: 'allergies', label: 'Allergies', icon: 'tablerAlertTriangle' },
    { id: 'vital-sign', label: 'Vital Sign', icon: 'tablerActivity' },
    { id: 'procedures', label: 'Procedures', icon: 'tablerTools' },
    { id: 'medications', label: 'Medications', icon: 'tablerPill' },
    { id: 'immunizations', label: 'Immunizations', icon: 'tablerVaccine' },
  ];

  orderItems = [
    { id: 'prescription', label: 'Prescription', icon: 'tablerClipboardText' },
    { id: 'investigations', label: 'Investigations', icon: 'tablerSearch' },
    { id: 'results', label: 'Results', icon: 'tablerClipboardData' },
    { id: 'referral-order', label: 'Referral Order', icon: 'tablerUsers' },
    { id: 'scheduling-order', label: 'Scheduling Order', icon: 'tablerCalendarEvent' },
  ];

  onSelect(id: string) {
    this.select.emit(id);
  }
}
