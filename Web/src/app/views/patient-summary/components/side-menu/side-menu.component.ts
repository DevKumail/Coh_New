import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule, NgIconComponent, TranslatePipe],
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
    { id: 'social-history', label: 'Social History', icon: 'tablerUsers' },
    { id: 'family-history', label: 'Family History', icon: 'tablerUsers' },
    { id: 'allergies', label: 'Allergies', icon: 'tablerAlertTriangle' },
    { id: 'vital-sign', label: 'Vital Sign', icon: 'tablerActivity' },
    { id: 'procedures', label: 'Procedures', icon: 'tablerTools' },
    { id: 'medications', label: 'Medications', icon: 'tablerPill' },
    { id: 'immunizations', label: 'Immunizations', icon: 'tablerVaccine' },
    { id: 'chargecapture', label: 'Charge Capture', icon: 'tablerReceipt' },

  ];

  orderItems = [
    { id: 'prescription', label: 'Prescription', icon: 'tablerClipboardText' },
    { id: 'investigations', label: 'Investigations', icon: 'tablerSearch' },
    { id: 'results', label: 'Results', icon: 'tablerClipboardData' },
    { id: 'referral-order', label: 'Referral Order', icon: 'tablerUsers' },
    { id: 'scheduling-order', label: 'Scheduling Order', icon: 'tablerCalendarEvent' },
  ];

  openSection: 'clinical' | 'orders' | null = 'clinical';

  onSelect(id: string) {
    this.select.emit(id);
  }

  toggleSection(section: 'clinical' | 'orders') {
    if (this.openSection === section) {
      this.openSection = null;
    } else {
      this.openSection = section;
    }
  }

  isOpen(section: 'clinical' | 'orders') {
    return this.openSection === section;
  }
}
