import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SemenTabsComponent } from './semen-tabs/semen-tabs.component';
import { SemenDiagnosisApprovalComponent } from './diagnosis-approval/semen-diagnosis-approval.component';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-semen-add-edit',
  standalone: true,
  imports: [CommonModule,FilledOnValueDirective, ReactiveFormsModule, SemenTabsComponent, SemenDiagnosisApprovalComponent],
  templateUrl: './semen-add-edit.component.html',
  styleUrls: ['./semen-add-edit.component.scss']
})
export class SemenAddEditComponent {
  form: FormGroup;
  AllDropdownValues:any = [];
  hrEmployees: any = [];
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
                (item: { EmployeeId: any; FullName: any }) => {
                    return {
                        name: item.FullName,
                        providerId: item.EmployeeId,
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

    const nativeObs = this.tabs?.getNativeObservation();
    const afterObs = this.tabs?.getAfterObservation();
    const prep = this.tabs?.getPreparation();

    if (afterObs && prep) {
      afterObs.preparations = [prep];
    }

    const observations = [
      ...(nativeObs ? [nativeObs] : []),
      ...(afterObs ? [afterObs] : []),
    ];

    const d = this.diag?.getValue?.() || { diagnosis: null, finding: null, note: null, approvalStatus: 'Pending' };
    const approval = String(d.approvalStatus || 'Pending');

    const payload = {
      sampleId: 0,
      ivfMainId: 0,
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
          icdCodeId: 0,
          finding: d.finding || '',
          notes: d.note || '',
          createdBy: 0,
          updatedBy: 0,
          createdAt: nowIso,
          updatedAt: nowIso,
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
