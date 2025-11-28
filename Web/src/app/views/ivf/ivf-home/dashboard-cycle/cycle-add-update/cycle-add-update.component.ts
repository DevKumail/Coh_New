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
import { Subscription, of, forkJoin } from 'rxjs';
import { LoaderService } from '@core/services/loader.service';
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
  private dropdownIndex: { [group: string]: Map<string, number> } = {};
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
    private loader: LoaderService,
    private patientBannerService: PatientBannerService) { }

  ngOnInit(): void {
    this.loader.show();
    this.getAlldropdown();
    this.FillCache();
    this.getAllFh();
    this.loader.hide();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.tryApplyInitial(), 0);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Helper: map names (from form flags) to IDs across multiple dropdown groups, case-insensitive with normalization
  private mapNamesToIdsUnion(keys: string[], names: string[] | null | undefined): number[] {
    const norm = (s: any) => String(s ?? '').toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '');
    const wantedList = (names || []).map(norm).filter(Boolean);
    const out = new Set<number>();
    // First: exact matches via index for speed
    for (const k of keys) {
      const idx = this.dropdownIndex[`IVFTreatmentCycle:${k}`];
      if (!idx) continue;
      for (const w of wantedList) {
        const id = idx.get(w);
        if (typeof id === 'number') out.add(id);
      }
    }
    // Second: fuzzy contains fallback to keep behavior identical
    for (const k of keys) {
      const arr = this.dropdowns?.[`IVFTreatmentCycle:${k}`] || [];
      for (const it of arr) {
        const optName = norm(it?.name);
        const match = wantedList.some(w => w === optName || optName.includes(w) || w.includes(optName));
        if (match && Number.isFinite(it?.valueId)) out.add(Number(it.valueId));
      }
    }
    return Array.from(out);
  }

  // Store payload from service for dynamic labels/options and build fast lookup index
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    const norm = (s: any) => String(s ?? '').toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '');
    this.dropdowns = payload || {};
    this.dropdownIndex = {};
    for (const key of Object.keys(this.dropdowns)) {
      const arr = Array.isArray(this.dropdowns[key]) ? this.dropdowns[key] : [];
      const map = new Map<string, number>();
      for (const it of arr) {
        const nm = norm(it?.name);
        const id = Number(it?.valueId);
        if (nm && Number.isFinite(id) && !map.has(nm)) map.set(nm, id);
      }
      this.dropdownIndex[key] = map;
    }
  }



  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFTreatmentCycle).subscribe((res: any) => {
      this.AllDropdownValues = res;
      this.getAllDropdown(res);
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
    const mapNamesToIdsUnion = (keys: string[], names: string[] | null | undefined) => {
      const wanted = new Set((names || []).map(s => String(s).trim().toLowerCase()).filter(Boolean));
      const out = new Set<number>();
      for (const k of keys) {
        const arr = this.dropdowns?.[`IVFTreatmentCycle:${k}`] || [];
        for (const it of arr) {
          const nm = String(it?.name || '').trim().toLowerCase();
          if (wanted.has(nm) && Number.isFinite(it?.valueId)) {
            out.add(Number(it.valueId));
          }
        }
      }
      return Array.from(out);
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
    const subNames = [
      ...mapIdsToNames('TreatmentSubTypes', subIds),
      ...mapIdsToNames('TreatmentSubtype', subIds),
      ...mapIdsToNames('TreatmentFlags', subIds),
      ...mapIdsToNames('Treatment Flags', subIds),
      ...mapIdsToNames('SubTypes', subIds),
      ...mapIdsToNames('Subtypes', subIds)
    ];
    const flags = this.generalTab.treatmentFlags();
    const set = new Set(subNames);
    for (const f of flags) {
      if (set.has(f.name)) {
        this.generalTab.generalForm.get(f.control)?.setValue(true, { emitEvent: false });
      }
    }

    // Ensure textareas get populated/disabled from selected history IDs
    this.generalTab.onFemaleHistoryChange();
    this.generalTab.onMaleHistoryChange();

    // Bind Additional Measures tab from payload (IDs -> names)
    if (this.additionalTab && d.additionalMeasure) {
      const am = d.additionalMeasure || {};
      const planned = mapIdsToNames('PlannedAdditionalMeasures', am.plannedAdditionalMeasuresCategoryIds);
      const performed = mapIdsToNames('PerformedAdditionalMeasures', am.performedAdditionalMeasuresCategoryIds);
      const polar = mapIdsToNames('PolarBodiesIndication', am.polarBodiesIndicationCategoryIds);
      const emb = mapIdsToNames('EMBBlastIndication', am.embBlastIndicationCategoryIds);
      this.additionalTab.form.patchValue({
        plannedAdditionalMeasures: planned || [],
        performedAdditionalMeasures: performed || [],
        pidPolarBodiesIndication: polar || [],
        pidEmbBlastIndication: emb || [],
        geneticCondition: am.generalCondition || ''
      }, { emitEvent: false });
    }

    // Bind existing attachments into Documents tab (if any)
    if (this.documentsTab && Array.isArray(d.attachments) && d.attachments.length) {
      const ids: number[] = d.attachments
        .map((a: any) => Number(a?.hmisFileId))
        .filter((n: any) => Number.isFinite(n));
      if (ids.length) {
        const calls = ids.map(id => this.sharedservice.getDocumentInfo(id));
        forkJoin(calls).subscribe({
          next: (infos: any[]) => {
            const mapped = (infos || []).map((info: any, idx: number) => {
              // try common shapes
              const fileId = ids[idx];
              const name = info?.fileName || info?.name || `File_${fileId}`;
              const size = info?.fileSize || info?.size || 0;
              return { fileId, fileName: name, fileSize: size };
            });
            this.documentsTab?.setExisting(mapped);
          },
          error: () => {}
        });
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
      // Return union across all provided keys (not just first hit)
      return this.mapNamesToIdsUnion(keys, names);
    };

    // Build treatment subtypes from Treatment flags (checkboxes)
    const flagDefs: Array<{ name: string; control: string }> = this.generalTab?.treatmentFlags?.() || [];
    const selectedFlagNames: string[] = flagDefs
      .filter(def => !!this.generalTab?.generalForm?.get(def.control)?.value)
      .map(def => def.name);
    // Try common possible groups: TreatmentSubTypes (preferred), fallback to TreatmentFlags
    const treatmentSubtypeIds = mapIdsAny(
      ['TreatmentSubTypes', 'TreatmentSubtype', 'Treatment Flags', 'TreatmentFlags', 'SubTypes', 'Subtypes'],
      selectedFlagNames
    );

    if (!this.ivfMainId || this.ivfMainId === 0 || this.ivfMainId === null || this.ivfMainId === undefined) {
      Swal.fire({ title: 'Error', text: 'IVF Main ID not found', icon: 'error', timer: 1000, showConfirmButton: false, timerProgressBar: true });
      return;
    }

    this.isSaving = true;
    // First upload documents (if any), then save the cycle
    const upload$ = this.documentSave();
    upload$.subscribe({
      next: (uploadRes: any) => {
        const uploadedIds: number[] = Array.isArray(uploadRes) ? uploadRes.map((x: any) => Number(x?.fileId)).filter(Boolean) : [];
        const existingIds: number[] = this.documentsTab?.getExistingIds?.() ? this.documentsTab!.getExistingIds() : [];
        const allIds = Array.from(new Set([...(existingIds || []), ...(uploadedIds || [])])).filter((n: any) => Number.isFinite(n));
        const attachments = allIds.map(id => ({ id: 0, hmisFileId: id }));

        const nullOrNumber = (v: any) => (v === null || v === undefined || v === '' ? null : Number(v));

        // Use existing episode id when editing; 0 indicates create
        const existingCycleId = this.initialCycle?.ivfDashboardTreatmentCycleId
          ?? this.initialCycle?.dashboardTreatmentEpisode?.ivfDashboardTreatmentCycleId
          ?? this.initialCycle?.dashboardTreatmentEpisode?.id
          ?? 0;

        const payloadOut = {
          ivfDashboardTreatmentCycleId: existingCycleId,
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
          treatmentSubTypes: Array.from(new Set<number>(treatmentSubtypeIds)).map((id: number) => ({ treatmentCategoryId: id })),
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
            Swal.fire({ title: 'Success', text: 'Cycle saved successfully', icon: 'success', timer: 1000, showConfirmButton: false, timerProgressBar: true });
            this.activeModal.close(res);
          },
          error: (err) => {
            this.isSaving = false;
            const msg = this.extractApiMessage(err);
            Swal.fire({ title: 'Error', text: msg, icon: 'error', timer: 1000, showConfirmButton: false, timerProgressBar: true });
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        Swal.fire({ title: 'Error', text: this.extractApiMessage(err), icon: 'error', timer: 1000, showConfirmButton: false, timerProgressBar: true });
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
