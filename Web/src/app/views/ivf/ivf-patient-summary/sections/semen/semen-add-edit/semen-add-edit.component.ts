import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SemenTabsComponent } from './semen-tabs/semen-tabs.component';
import { SemenDiagnosisApprovalComponent } from './diagnosis-approval/semen-diagnosis-approval.component';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

@Component({
  selector: 'app-semen-add-edit',
  standalone: true,
  imports: [CommonModule,FilledOnValueDirective, ReactiveFormsModule, SemenTabsComponent, SemenDiagnosisApprovalComponent],
  templateUrl: './semen-add-edit.component.html',
  styleUrls: ['./semen-add-edit.component.scss']
})
export class SemenAddEditComponent implements OnChanges {
  form: FormGroup;
  AllDropdownValues:any = [];
  hrEmployees: any = [];
  @Input() model: any = null;
  @Output() back = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();
  // Holds dropdown data keyed by payload keys like 'IVFSemanAnalysis:Appearance'
  dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  cacheItems: string[] = ['Provider'];
  @ViewChild(SemenTabsComponent) tabs?: SemenTabsComponent;
  @ViewChild(SemenDiagnosisApprovalComponent) diag?: SemenDiagnosisApprovalComponent;

  constructor(
    private fb: FormBuilder,
    private ivfservice: IVFApiService,
    private patientBannerService: PatientBannerService,
    private sharedservice: SharedService

  ) {
    this.form = this.fb.group({
      // Header details
      collectionDate: [null],
      collectionTime: [null],
      thawingDate: [null],
      thawingTime: [null],
      sampleId: [''],
      purpose: [''],
      abstinenceDays: [null],
      analysedBy: [''],
      appearance: [''],
      smell: [''],
      viscosity: [''],
      liquefactionTime: [null],
      treatment: [''],
      score: [''],
      startOfAnalysis: [null],
      agglutination: [false],
      dnaFragmented: [null],

      // Collection details
      collectionMethod: [''],
      collectionPlace: [''],
      collectionDifficulties: [''],

      // Native parameters
      volume: [null],
      ph: [null],
      concentration: [null],
      vitality: [null],
      leukocytes: [null],
      roundCells: [null],
      whoA: [null],
      whoB: [null],
      whoC: [null],
      whoD: [null],
      numberOfProgMotile: [null],
      overallMotility: [null],

      // Quantification / counts
      quantPossible: [''],
      totalSpermCountM: [null],
      peroxidasePositive: [null],
      immunobeadPercentAdherent: [null],
      marTestPercent: [null],

      // Morphology
      normalForms: [null],
      headDefects: [null],
      neckDefects: [null],
      tailDefects: [null],
      excessResidualCytoplasm: [null],
      multipleDefects: [null],
      tzi: [null],

      // Diagnosis & approval
      diagnosis: ['Not specified'],
      finding: ['Normal'],
      note: [''],
      approvalStatus: [''],

      // Timing and insemination
      timeBetweenCollectionAndUsage: ['00:00'],
      numberOfInsemMotile: [null],
      inseminatedAmountMl: [null],
      rate24hMotility: [null],
    });
  }


  ngOnInit(): void {
    this.getAlldropdown();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && changes['model'].currentValue) {
      // Apply immediately if children are ready; otherwise defer slightly
      setTimeout(() => this.applyModel(changes['model'].currentValue), 0);
    }
  }

  private applyModel(m: any) {
    if (!m) return;
    const splitDT = (dt: string | null | undefined) => {
      if (!dt) return { d: null as any, t: null as any };
      const s = String(dt);
      const d = s.substring(0, 10);
      const t = s.length >= 16 ? s.substring(11, 16) : null;
      return { d, t };
    };
    const toHHmm = (t: string | null | undefined) => {
      if (!t) return null;
      const s = String(t);
      if (/^\d{2}:\d{2}$/.test(s)) return s;
      if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s.substring(0,5);
      return null;
    };

    const col = splitDT(m.collectionDateTime);
    const thaw = splitDT(m.thawingDateTime);

    this.form.patchValue({
      collectionDate: col.d,
      collectionTime: col.t,
      thawingDate: thaw.d,
      thawingTime: thaw.t,
      sampleId: m.sampleCode ?? '',
      purpose: m.purposeId ?? '',
      abstinenceDays: m.abstinencePeriod ? Number(m.abstinencePeriod) : null,
      analysedBy: m.analyzedById ?? '',
      appearance: m.appearanceId ?? '',
      smell: m.smellId ?? '',
      viscosity: m.viscosityId ?? '',
      liquefactionTime: m.liquefactionMinutes ?? null,
      treatment: m.treatmentNotes ?? '',
      score: m.score ?? '',
      startOfAnalysis: toHHmm(m.analysisStartTime),
      agglutination: !!m.agglutination,
      dnaFragmented: m.dnaFragmentedPercent ?? null,
      collectionMethod: m.collectionMethodId ?? '',
      collectionPlace: m.collectionPlaceId ?? '',
      collectionDifficulties: m.collectionDifficulties ?? '',
      timeBetweenCollectionAndUsage: toHHmm(m.timeBetweenCollectionUsage),
      numberOfInsemMotile: m.inseminationMotileSperms ?? null,
      inseminatedAmountMl: m.inseminatedAmountML ?? null,
      rate24hMotility: m.motility24hPercent ?? null,
    });

    // Patch diagnosis/approval
    const diag = (m.diagnoses && m.diagnoses[0]) || null;
    const appr = m.approvalStatus || null;
    const approvalStatus = appr?.isApproved ? 'Approved' : (appr?.isAttention ? 'Rejected' : 'Pending');
    try {
      this.diag?.form.patchValue({ finding: diag?.finding ?? 'Normal', note: diag?.notes ?? '', approvalStatus });
      const dxCodes = Array.isArray(diag?.icdTypes) ? diag.icdTypes.map((x: any) => x?.icdCode).filter((x: any) => !!x) : [];
      this.diag?.setSelectedDiagnosisCodes?.(dxCodes);
    } catch {}

    // Patch tabs (native, after-prep, preparation)
    const nativeObs = (m.observations || []).find((o: any) => o.observationType === 'Native');
    const afterObs = (m.observations || []).find((o: any) => o.observationType === 'AfterPreparation');
    try { this.tabs?.patchFromModel(nativeObs, afterObs); } catch {}
  }

  getAlldropdown(){
    this.sharedservice.getDropDownValuesByName(Page.IVFMaleSemanAnalysis).subscribe((res:any)=>{
    this.AllDropdownValues = res;
    this.getAllDropdown(res);
    console.log(this.AllDropdownValues);
  })
  this.FillCache();
}
  
    FillCache() {
        this.sharedservice.getCacheItem({ entities: this.cacheItems }).subscribe((response: any) => {
                if (response.cache != null) {
                    this.FillDropDown(response);
                }
            })
    }
    FillDropDown(response: any) {
        let jParse = JSON.parse(JSON.stringify(response)).cache;
        let provider = JSON.parse(jParse).Provider;

        if (provider) {
            provider = provider.map(
                (item: { EmployeeId: any; FullName: any; EmployeeType: any }) => {
                    return {
                        name: item.FullName,
                        providerId: item.EmployeeId,
                        employeeType: item.EmployeeType,
                    };
                },
            );
            this.hrEmployees = provider;
            try {
            } catch {}
        }
    }


  onSave() {
    const h = this.form.value as any;
    const nowIso = new Date().toISOString();

    const collectionDateTime = this.combineDateTime(h.collectionDate, h.collectionTime);
    const thawingDateTime = this.combineDateTime(h.thawingDate, h.thawingTime);

    const observations: any[] = [];
    // Native only if user entered some values
    if (this.tabs?.hasNativeValues?.()) {
      const n = this.tabs?.getNativeObservation();
      if (n) observations.push(n);
    }
    // After-preparation only if user entered some values
    if (this.tabs?.hasAfterValues?.()) {
      const a = this.tabs?.getAfterObservation();
      if (a) {
        if (this.tabs?.hasPreparationValues?.()) {
          const p = this.tabs?.getPreparation();
          if (p) a.preparations = [p];
        } else {
          // Explicitly send empty array when no preparation values
          a.preparations = [];
        }
        observations.push(a);
      }
    }

    const d = this.diag?.getValue?.() || { diagnosis: null, finding: null, note: null, approvalStatus: 'Pending' };
    const approval = String(d.approvalStatus || 'Pending');
  var MainId
    this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
      if (data) {
        if (data?.couple?.ivfMainId != null) {
           MainId = data?.couple?.ivfMainId?.IVFMainId ?? 0;
        } 
      }
    });
    const dxCodes: string[] = (this.diag?.getSelectedDiagnosisCodes?.() || []) as string[];
    const payload = {
      sampleId: this.model?.sampleId ?? 0,
      ivfMainId: this.model?.ivfMainId  || MainId,
      sampleCode: h.sampleId || '',
      collectionDateTime,
      thawingDateTime,
      purposeId: toNum(h.purpose),
      collectionMethodId: toNum(h.collectionMethod),
      collectionPlaceId: toNum(h.collectionPlace),
      collectionDifficulties: h.collectionDifficulties || '',
      abstinencePeriod: h.abstinenceDays != null ? String(h.abstinenceDays) : '',
      analysisStartTime: this.formatTime(h.startOfAnalysis),
      analyzedById: toNum(h.analysedBy),
      appearanceId: toNum(h.appearance),
      smellId: toNum(h.smell),
      viscosityId: toNum(h.viscosity),
      liquefactionMinutes: toNum(h.liquefactionTime),
      agglutination: !!h.agglutination,
      treatmentNotes: h.treatment || '',
      score: h.score || '',
      dnaFragmentedPercent: toNum(h.dnaFragmented),
      timeBetweenCollectionUsage: this.formatTime(h.timeBetweenCollectionAndUsage),
      inseminationMotileSperms: toNum(h.numberOfInsemMotile),
      inseminatedAmountML: toNum(h.inseminatedAmountMl),
      motility24hPercent: toNum(h.rate24hMotility),
      cryoStatusId: 0,
      statusId: 0,
      createdBy: 0,
      updatedBy: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
      observations,
      diagnoses: [
        {
          diagnosisId: 0,
          sampleId: 0,
          finding: d.finding || '',
          notes: d.note || '',
          createdBy: 0,
          updatedBy: 0,
          createdAt: nowIso,
          updatedAt: nowIso,
          icdTypes: Array.isArray(dxCodes)
            ? dxCodes.map(code => ({
                diagnosisICDId: 0,
                diagnosisId: 0,
                icdCode: String(code || ''),
                createdAt: nowIso,
                createdBy: '0',
              }))
            : [],
        },
      ],
      approvalStatus: {
        approvalStatusId: 0,
        sampleId: 0,
        isApproved: approval === 'Approved',
        isAttention: approval === 'Rejected',
        attentionForId: 0,
        comment: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    };

    // If editing, merge existing IDs into payload
    if (this.model?.sampleId) {
      try {
        const existing = this.model;
        // Observations
        for (const obs of payload.observations || []) {
          const match = (existing.observations || []).find((o: any) => o.observationType === obs.observationType);
          if (match) {
            obs.observationId = match.observationId || 0;
            obs.sampleId = existing.sampleId;
            if (obs.motility && match.motility) {
              obs.motility.motilityId = match.motility.motilityId || 0;
              obs.motility.observationId = match.observationId || 0;
            }
            if (obs.morphology && match.morphology) {
              obs.morphology.morphologyId = match.morphology.morphologyId || 0;
              obs.morphology.observationId = match.observationId || 0;
            }
            if (obs.observationType === 'AfterPreparation' && Array.isArray(obs.preparations) && obs.preparations.length) {
              const newPrep = obs.preparations[0];
              const oldPrep = (match.preparations || [])[0];
              if (newPrep) {
                newPrep.preparationId = oldPrep?.preparationId || 0;
                newPrep.observationId = match.observationId || 0;
                // Map preparationMethods ids where possible
                if (Array.isArray(newPrep.preparationMethods)) {
                  for (const pm of newPrep.preparationMethods) {
                    const pmOld = (oldPrep?.preparationMethods || []).find((x: any) => x.preparationMethodId === pm.preparationMethodId);
                    pm.id = pmOld?.id || 0;
                    pm.preparationId = newPrep.preparationId || 0;
                  }
                }
              }
            }
          }
        }

        // Diagnosis
        if (payload.diagnoses && payload.diagnoses[0]) {
          const dOld = (existing.diagnoses || [])[0];
          if (dOld) {
            payload.diagnoses[0].diagnosisId = dOld.diagnosisId || 0;
            payload.diagnoses[0].sampleId = existing.sampleId || 0;
          }
        }

        // Approval status
        if (payload.approvalStatus && existing.approvalStatus) {
          payload.approvalStatus.approvalStatusId = existing.approvalStatus.approvalStatusId || 0;
          payload.approvalStatus.sampleId = existing.sampleId || 0;
        }
      } catch {}
    }

    this.ivfservice.InsertOrUpdateMaleSemenAnalysis(payload).subscribe({
      next: (res) => {
        this.saved.emit(res || payload);
        Swal.fire({ icon: 'success', title: 'Saved', text: 'Semen analysis saved successfully', timer: 1500, showConfirmButton: false });
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Save failed', text: (err?.message || 'Unknown error') });
      }
    });
  }
  onCancel() { /* hook for close/back */ }

  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }

  // Convert payload key like 'IVFSemanAnalysis:CollectionMethod' to 'Collection Method'
  labelFor(key: string): string {
    if (!key) return '';
    const txt = key.includes(':') ? key.split(':')[1] : key;
    return txt.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  }

  private combineDateTime(dateVal: any, timeVal: any): string | null {
    if (!dateVal && !timeVal) return null;
    try {
      const date = typeof dateVal === 'string' ? dateVal : (dateVal?.toString?.() || '');
      const time = typeof timeVal === 'string' ? timeVal : (timeVal?.toString?.() || '');
      if (!date) return null;
      const iso = time ? new Date(`${date}T${time}`).toISOString() : new Date(date).toISOString();
      return iso;
    } catch {
      return null;
    }
  }

  private formatTime(timeVal: any): string | null {
    if (!timeVal) return null;
    try {
      const s = String(timeVal);
      // If already includes seconds, return as-is
      if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
      // If HH:mm, append :00
      if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
      // Try Date and extract time
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        const hh = `${d.getHours()}`.padStart(2, '0');
        const mm = `${d.getMinutes()}`.padStart(2, '0');
        const ss = `${d.getSeconds()}`.padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
      }
      return null;
    } catch {
      return null;
    }
  }

}

function toNum(v: any): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}


