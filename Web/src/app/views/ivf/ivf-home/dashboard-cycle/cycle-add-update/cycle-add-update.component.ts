import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './cycle-tabs/general.component';
import { AdditionalMeasuresComponent } from './cycle-tabs/additional-measures.component';
import { DocumentsComponent } from './cycle-tabs/documents.component';
import { AccountingComponent } from './cycle-tabs/accounting.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cycle-add-update',
  standalone: true,
  imports: [CommonModule, GeneralComponent, AdditionalMeasuresComponent, DocumentsComponent, AccountingComponent],
  templateUrl: './cycle-add-update.component.html',
  styleUrls: ['./cycle-add-update.component.scss']
})
export class CycleAddUpdateComponent implements OnDestroy {
  isSaving = false;
  dropdowns: any = [];
  AllDropdownValues: any = [];
  hrEmployees: Array<{ providerId: number; name: string }> = [];
  cacheItems: string[] = ['Provider'];


  activeTab: 'general' | 'additional' | 'documents' | 'accounting' = 'general';
  private sub?: Subscription;
  private ivfMainId?: number;
  FemalemedicalHistory: any[] = [];
  MalemedicalHistory: any[] = [];

  @ViewChild(GeneralComponent) generalTab?: GeneralComponent;
  @ViewChild(AdditionalMeasuresComponent) additionalTab?: AdditionalMeasuresComponent;

  constructor(
    public activeModal: NgbActiveModal,
    private ivfService: IVFApiService,
    private sharedservice: SharedService,
    private patientBannerService: PatientBannerService) { }

  ngOnInit(): void {
    this.getAlldropdown();
    this.FillCache();
    this.getAllFh();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
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

  getAllFh() {
    let MainId: any;
    this.sub = this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
      if (data?.couple?.ivfMainId != null) {
        MainId = data?.couple?.ivfMainId?.IVFMainId ?? 0;
      }
    });

    if (!MainId) {
      Swal.fire('Error', 'IVF Main ID not found', 'error');
      return;
    }

    this.ivfMainId = Number(MainId) || 0;
    this.ivfService.GetFertilityHistoryForDashboard(MainId).subscribe((res: any) => {
      const male = res?.maleFertilityHistory ?? res?.fertilityHistory?.maleFertilityHistory ?? [];
      const female = res?.femaleFertilityHistory ?? res?.fertilityHistory?.femaleFertilityHistory ?? [];
      this.MalemedicalHistory = Array.isArray(male) ? male : [];
      this.FemalemedicalHistory = Array.isArray(female) ? female : [];
    });
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
    const g = this.generalTab?.generalForm?.value || {};
    const a = this.additionalTab?.form?.value || {};

    const mapIdOrNull = (key: string, name: string | number | null | undefined) => {
      if (name === null || name === undefined || name === '') return null;
      const arr = this.dropdowns?.[`IVFTreatmentCycle:${key}`] || [];
      // Allow passing through if already an ID
      if (typeof name === 'number') {
        return arr.some((x: any) => x.valueId === name) ? name : null;
      }
      const found = arr.find((x: any) => x.name === name);
      return found?.valueId ?? null;
    };
    const mapIds = (key: string, names: string[] | null | undefined) => {
      const arr = this.dropdowns?.[`IVFTreatmentCycle:${key}`] || [];
      const nameSet = new Set((names || []).filter(Boolean));
      return arr.filter((x: any) => nameSet.has(x.name)).map((x: any) => x.valueId);
    };

    // Build treatment subtypes from Treatment flags (checkboxes)
    const flagDefs: Array<{ name: string; control: string }> = this.generalTab?.treatmentFlags?.() || [];
    const selectedFlagNames: string[] = flagDefs
      .filter(def => !!this.generalTab?.generalForm?.get(def.control)?.value)
      .map(def => def.name);
    const treatmentSubtypeIds = mapIds('TreatmentFlags', selectedFlagNames);

    const payloadOut = {
      ivfDashboardTreatmentEpisodeId: 0,
      ivfMainId: this.ivfMainId || 0,
      treatmentTypeCategoryId: mapIdOrNull('Types', g.treatment),
      onlyInternalCycle: !!g.onlyInternalCycle,
      dateOfLMP: g.dateOfLMP || null,
      therapyStartDate: null,
      cycleFromAmenorrheaCategoryId: mapIdOrNull('FromAmenorrhea', g.cycleFromAmenorrhea),
      mainIndicationCategoryId: mapIdOrNull('MainIndication', g.mainIndication),
      protocolCategoryId: mapIdOrNull('Protocol', g.protocol),
      stimulationPlannedCategoryId: mapIdOrNull('StimulationPlanned', g.stimulationPlanned),
      stimulatedExternallyCategoryId: mapIdOrNull('StimulatedExternally', g.stimulatedExternally),
      longTermMedication: g.longTermMedication || '',
      plannedNo: g.plannedNoOfEmbryos !== undefined && g.plannedNoOfEmbryos !== null && g.plannedNoOfEmbryos !== ''
        ? Number(g.plannedNoOfEmbryos) : null,
      plannedSpermCollectionCategoryId: (() => {
        const ids = mapIds('PlannedSpermCollection', g.plannedSpermCollection);
        return ids.length ? ids[0] : null;
      })(),
      cycleNote: g.editorContent || '',
      plannedSpermCollectionCategoryIds: mapIds('PlannedSpermCollection', g.plannedSpermCollection),
      treatmentSubTypes: treatmentSubtypeIds.map((id: number) => ({ treatmentCategoryId: id })),
      additionalMeasure: {
        ivfAdditionalMeasuresId: 0,
        generalCondition: a.geneticCondition || '',
        plannedAdditionalMeasuresCategoryIds: mapIds('PlannedAdditionalMeasures', a.plannedAdditionalMeasures),
        performedAdditionalMeasuresCategoryIds: mapIds('PerformedAdditionalMeasures', a.performedAdditionalMeasures),
        polarBodiesIndicationCategoryIds: mapIds('PolarBodiesIndication', a.pidPolarBodiesIndication),
        embBlastIndicationCategoryIds: mapIds('EMBBlastIndication', a.pidEmbBlastIndication)
      },
      createdBy: 0,
      updatedBy: 0
    };

    this.isSaving = true;
    this.ivfService.CreateUpdateDashboardTreatmentCycle(payloadOut).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.activeModal.close(res);
      },
      error: (err) => {
        this.isSaving = false;
      }
    });
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
