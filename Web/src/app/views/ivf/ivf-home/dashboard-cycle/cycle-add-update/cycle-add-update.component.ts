import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './cycle-tabs/general.component';
import { AdditionalMeasuresComponent } from './cycle-tabs/additional-measures.component';
import { DocumentsComponent } from './cycle-tabs/documents.component';
import { AccountingComponent } from './cycle-tabs/accounting.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { Page } from '@/app/shared/enum/dropdown.enum';
@Component({
  selector: 'app-cycle-add-update',
  standalone: true,
  imports: [CommonModule, GeneralComponent, AdditionalMeasuresComponent, DocumentsComponent, AccountingComponent],
  templateUrl: './cycle-add-update.component.html',
  styleUrls: ['./cycle-add-update.component.scss']
})
export class CycleAddUpdateComponent {
  isSaving = false;
  dropdowns: any = [];
  AllDropdownValues: any = [];
  hrEmployees: Array<{ providerId: number; name: string }> = [];
  cacheItems: string[] = ['Provider'];


  activeTab: 'general' | 'additional' | 'documents' | 'accounting' = 'general';

  constructor(
    public activeModal: NgbActiveModal,
    private sharedservice: SharedService) { }

  ngOnInit(): void {
    this.getAlldropdown();
    this.FillCache();
  }

  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }



  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFTreatmentCycle).subscribe((res: any) => {
      this.AllDropdownValues = res;
      this.getAllDropdown(res);
      console.log(this.AllDropdownValues);
    })
  }

  FillCache() {
    this.sharedservice.getCacheItem({ entities: this.cacheItems }).subscribe((response: any) => {
      if (response?.cache) {
        this.FillDropDown(response);
      }
    });
  }
  FillDropDown(response: any) {
    try {
      const jParse = JSON.parse(JSON.stringify(response)).cache;
      const parsed = JSON.parse(jParse);
      const provider = parsed?.Provider as Array<{ EmployeeId: any; FullName: any }> | undefined;
      if (provider && Array.isArray(provider)) {
        this.hrEmployees = provider.map((item) => ({
          name: item.FullName,
          providerId: item.EmployeeId,
        }));
      }
    } catch {}
  }

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
