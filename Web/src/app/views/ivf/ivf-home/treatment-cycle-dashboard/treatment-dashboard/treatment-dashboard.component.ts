import { CommonModule } from '@angular/common';
import { Component, Optional } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleAspirationComponent } from './treatment-dashboard-tabs/aspiration/cycle-aspiration.component';
import { CultureComponent } from './treatment-dashboard-tabs/culture/culture.component';
import { LutealPhaseComponent } from './treatment-dashboard-tabs/luteal-phase/luteal-phase.component';
import { PregnancyComponent } from './treatment-dashboard-tabs/pregnancy/pregnancy.component';
import { TransferComponent } from './treatment-dashboard-tabs/transfer/transfer.component';
import { BirthComponent } from './treatment-dashboard-tabs/birth/birth.component';
import { CycleOverviewComponent } from './treatment-dashboard-tabs/cycle-overview/cycle-overview.component';

@Component({
  selector: 'app-treatment-dashboard',
  standalone: true,
  imports: [CommonModule, CycleOverviewComponent, CycleAspirationComponent, CultureComponent, TransferComponent, LutealPhaseComponent, PregnancyComponent, BirthComponent ],
  templateUrl: './treatment-dashboard.component.html',
  styleUrl: './treatment-dashboard.component.scss'
})
export class TreatmentDashboardComponent {
  
   isSaving = false;
 
   
   activeTab: 'Overview' | 'Aspiration' | 'Culture' | 'Transfer' | 'Luteal phase' | 'Pregnancy' | 'Birth' | 'Summaries' = 'Overview';
 
  //  constructor(@Optional() public activeModal?: NgbActiveModal) {}
 
   setTab(tab: 'Overview' | 'Aspiration' | 'Culture' | 'Transfer' | 'Luteal phase' | 'Pregnancy' | 'Birth' | 'Summaries') {
     this.activeTab = tab;
   }
 
   onSave(payload: any) {
     // TODO: integrate API when available
     // console.log('Cycle save payload', payload);
   }
 
} 
