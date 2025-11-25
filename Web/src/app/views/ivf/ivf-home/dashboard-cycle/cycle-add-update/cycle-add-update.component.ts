import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './cycle-tabs/general.component';
import { AdditionalMeasuresComponent } from './cycle-tabs/additional-measures.component';
import { DocumentsComponent } from './cycle-tabs/documents.component';
import { AccountingComponent } from './cycle-tabs/accounting.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cycle-add-update',
  standalone: true,
  imports: [CommonModule, GeneralComponent, AdditionalMeasuresComponent, DocumentsComponent, AccountingComponent],
  templateUrl: './cycle-add-update.component.html',
  styleUrls: ['./cycle-add-update.component.scss']
})
export class CycleAddUpdateComponent {
  isSaving = false;

  
  activeTab: 'general' | 'additional' | 'documents' | 'accounting' = 'general';

  constructor(public activeModal: NgbActiveModal) {}

  setTab(tab: 'general' | 'additional' | 'documents' | 'accounting') {
    this.activeTab = tab;
  }

  onSave(payload: any) {
    // TODO: integrate API when available
    // console.log('Cycle save payload', payload);
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
