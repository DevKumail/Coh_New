import { Component, Input, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
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
import { Subscription, of } from 'rxjs';
@Component({
  selector: 'app-cycle-add-update',
  standalone: true,
  imports: [CommonModule, GeneralComponent, AdditionalMeasuresComponent, DocumentsComponent, AccountingComponent],
  templateUrl: './cycle-add-update.component.html',
  styleUrls: ['./cycle-add-update.component.scss']
})
export class CycleAddUpdateComponent implements OnDestroy, AfterViewInit {
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
  @ViewChild(DocumentsComponent) documentsTab?: DocumentsComponent;
  @Input() initialCycle?: any;

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

  ngAfterViewInit(): void {
    setTimeout(() => this.tryApplyInitial(), 0);
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
      this.tryApplyInitial();
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
      this.tryApplyInitial();
    });
  }

  private tryApplyInitial() {
    if (!this.initialCycle || !this.generalTab) return;
    const d = this.initialCycle?.dashboardTreatmentEpisode || this.initialCycle;
    if (!d) return;

    const findName = (key: string, id: number | null | undefined) => {
      if (id === null || id === undefined) return '';
      const arr = this.dropdowns?.[`IVFTreatmentCycle:${key}`] || [];
      const f = arr.find((x: any) => x.valueId === id);
      return f?.name || '';
    };
    const mapIdsToNames = (key: string, ids: number[] | null | undefined) => {
      const arr = this.dropdowns?.[`IVFTreatmentCycle:${key}`] || [];
      const set = new Set(ids || []);
      return arr.filter((x: any) => set.has(x.valueId)).map((x: any) => x.name);
    };

    const g = this.generalTab.generalForm;
    g.patchValue({
      treatment: findName('Types', d.treatmentTypeCategoryId),
      onlyInternalCycle: !!d.onlyInternalCycle,
      dateOfLMP: d.dateOfLMP ? String(d.dateOfLMP).substring(0,10) : null,
      cycleFromAmenorrhea: findName('FromAmenorrhea', d.cycleFromAmenorrheaCategoryId),
      mainIndication: findName('MainIndication', d.mainIndicationCategoryId),
      protocol: findName('Protocol', d.protocolCategoryId),
      stimulationPlanned: findName('StimulationPlanned', d.stimulationPlannedCategoryId),
      stimulatedExternally: findName('StimulatedExternally', d.stimulatedExternallyCategoryId),
      longTermMedication: d.longTermMedication || '',
      plannedNoOfEmbryos: d.plannedNo ?? null,
      plannedSpermCollection: mapIdsToNames('PlannedSpermCollection', d.plannedSpermCollectionCategoryIds || (d.plannedSpermCollectionCategoryId ? [d.plannedSpermCollectionCategoryId] : [])),
      attendingClinician: d.providerId ?? '',
      surveyId: d.survey || '',
      randomizationGroup: d.randomizationGroup || '',
      takenOverFrom: d.takenOverFrom || '',
      takenOverOn: d.takeOverOn ? String(d.takeOverOn).substring(0,10) : null,
      editorContent: d.cycleNote || '',
      femaleMedicalHistoryOf: d.ivfFemaleFHId ?? '',
      maleMedicalHistoryOf: d.ivfMaleFHId ?? ''
    }, { emitEvent: false });

    // Treatment sub types
    const subIds: number[] = Array.isArray(d.treatmentSubTypes) ? d.treatmentSubTypes.map((x: any) => x?.treatmentCategoryId).filter((n: any) => Number.isFinite(n)) : [];
    const subNames = mapIdsToNames('TreatmentSubTypes', subIds).concat(mapIdsToNames('TreatmentFlags', subIds));
    const flags = this.generalTab.treatmentFlags();
    const set = new Set(subNames);
    for (const f of flags) {
      if (set.has(f.name)) {
        this.generalTab.generalForm.get(f.control)?.setValue(true, { emitEvent: false });
      }
    }
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

  documentSave(){
    const files = this.documentsTab?.getFiles() || [];
    if (!files.length) { return of(null); }
    return this.sharedservice.uploadDocumentsWithModule('IVFTreatmentCycle', files);
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

    // More robust: try multiple groups for Treatment Sub Types ID resolution
    const mapIdsAny = (keys: string[], names: string[] | null | undefined) => {
      const nameSet = new Set((names || []).filter(Boolean));
      for (const k of keys) {
        const arr = this.dropdowns?.[`IVFTreatmentCycle:${k}`] || [];
        if (Array.isArray(arr) && arr.length) {
          const ids = arr.filter((x: any) => nameSet.has(x.name)).map((x: any) => x.valueId);
          if (ids.length) return ids;
        }
      }
      return [] as number[];
    };

    // Build treatment subtypes from Treatment flags (checkboxes)
    const flagDefs: Array<{ name: string; control: string }> = this.generalTab?.treatmentFlags?.() || [];
    const selectedFlagNames: string[] = flagDefs
      .filter(def => !!this.generalTab?.generalForm?.get(def.control)?.value)
      .map(def => def.name);
    // Try common possible groups: TreatmentSubTypes (preferred), fallback to TreatmentFlags
    const treatmentSubtypeIds = mapIdsAny(['TreatmentSubTypes', 'Treatment Flags', 'TreatmentFlags', 'SubTypes', 'Subtypes'], selectedFlagNames);

    if (!this.ivfMainId || this.ivfMainId === 0 || this.ivfMainId === null || this.ivfMainId === undefined) {
      Swal.fire('Error', 'IVF Main ID not found', 'error');
      return;
    }

    this.isSaving = true;
    // First upload documents (if any), then save the cycle
    const upload$ = this.documentSave();
    upload$.subscribe({
      next: (uploadRes: any) => {
        const uploadedIds: number[] = Array.isArray(uploadRes) ? uploadRes.map((x: any) => Number(x?.fileId)).filter(Boolean) : [];
        const attachments = uploadedIds.map(id => ({ id: 0, hmisFileId: id }));

        const nullOrNumber = (v: any) => (v === null || v === undefined || v === '' ? null : Number(v));

        const payloadOut = {
          ivfDashboardTreatmentEpisodeId: 0,
          ivfMainId: this.ivfMainId ?? null,
          ivfMaleFHId: nullOrNumber(g.maleMedicalHistoryOf),
          ivfFemaleFHId: nullOrNumber(g.femaleMedicalHistoryOf),
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
          providerId: g.attendingClinician ? Number(g.attendingClinician) : null,
          randomizationGroup: g.randomizationGroup || '',
          survey: g.surveyId || '',
          takenOverFrom: g.takenOverFrom || '',
          takeOverOn: g.takenOverOn || null,
          cycleNote: g.editorContent || '',
          plannedSpermCollectionCategoryIds: Array.from(new Set(mapIds('PlannedSpermCollection', g.plannedSpermCollection))),
          treatmentSubTypes: Array.from(new Set(treatmentSubtypeIds)).map((id: number) => ({ treatmentCategoryId: id })),
          additionalMeasure: {
            ivfAdditionalMeasuresId: 0,
            generalCondition: a.geneticCondition || '',
            plannedAdditionalMeasuresCategoryIds: Array.from(new Set(mapIds('PlannedAdditionalMeasures', a.plannedAdditionalMeasures))),
            performedAdditionalMeasuresCategoryIds: Array.from(new Set(mapIds('PerformedAdditionalMeasures', a.performedAdditionalMeasures))),
            polarBodiesIndicationCategoryIds: Array.from(new Set(mapIds('PolarBodiesIndication', a.pidPolarBodiesIndication))),
            embBlastIndicationCategoryIds: Array.from(new Set(mapIds('EMBBlastIndication', a.pidEmbBlastIndication)))
          },
          attachments,
          createdBy: 0,
          updatedBy: 0
        } as any;

        this.ivfService.CreateUpdateDashboardTreatmentCycle(payloadOut).subscribe({
          next: (res) => {
            this.isSaving = false;
            this.activeModal.close(res);
          },
          error: (err) => {
            this.isSaving = false;
            const msg = this.extractApiMessage(err);
            Swal.fire('Error', msg, 'error');
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        Swal.fire('Error', this.extractApiMessage(err), 'error');
      }
    });
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  private extractApiMessage(err: any): string {
    try {
      if (!err) return 'Unexpected error occurred';
      // Common shapes: { error: { message } }, { message }, string responses, or model state arrays
      if (typeof err === 'string') return err;
      const e = err.error ?? err;
      if (typeof e === 'string') return e;
      if (e?.message) return e.message;
      if (Array.isArray(e)) return e.map((x: any) => (x?.message || JSON.stringify(x))).join('\n');
      if (e?.errors && typeof e.errors === 'object') {
        const lines: string[] = [];
        for (const k of Object.keys(e.errors)) {
          const val = e.errors[k];
          if (Array.isArray(val)) { lines.push(`${k}: ${val.join(', ')}`); }
          else { lines.push(`${k}: ${String(val)}`); }
        }
        if (lines.length) return lines.join('\n');
      }
      return JSON.stringify(e);
    } catch {
      return 'Unexpected error occurred';
    }
  }
}
