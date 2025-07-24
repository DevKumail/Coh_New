import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { IconsModule } from '@/app/shared/icons.module';
import { DataStorageService } from '@/app/shared/data-storage.service';
import { SharedApiService } from '@/app/shared/shared.api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-header-panel',
  standalone: true,
  templateUrl: './patient-header-panel.component.html',
  styleUrls: ['./patient-header-panel.component.scss'],
  imports: [CommonModule, IconsModule,
    ReactiveFormsModule,
    NgbNavModule,
    FormsModule,
  ],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0', opacity: 0, overflow: 'hidden', padding: '0', margin: '0' })),
      state('visible', style({ height: '*', opacity: 1, overflow: 'visible', padding: '*', margin: '*' })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')])
    ])
  ]
})
export class PatientHeaderPanelComponent {
  @Input() patientData: any;
  @Input() visible: boolean = false;
  closeBanner() {
    this.visible = false;
  }

    get patientInfo() {
      debugger
    return this.patientData?.table2?.[0] || null;
  }

  get insuranceInfo() {
    debugger
    return this.patientData?.table1 || [];
  }
}
