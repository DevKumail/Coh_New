import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-cycle-aspiration',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    QuillModule,    
    FilledOnValueDirective,
  ],
  templateUrl: './cycle-aspiration.component.html',
  styleUrl: './cycle-aspiration.component.scss'
})
export class CycleAspirationComponent {
  form: FormGroup;
  activeTab: 'oocyte' | 'further' = 'oocyte';
  AllDropdownValues: any = [];
  dropdowns: any = [];
  cacheItems: string[] = ['Provider'];
  hrEmployees: any = [];
  quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]
  };

  mucousMembranes = [
    { id: 'intact', name: 'Intact' },
    { id: 'inflamed', name: 'Inflamed' }
  ];

  private cycleId: number = 0;
  private aspirationId: number = 0;
  private oocyteRetrievalId: number = 0;
  private furtherDetailsId: number = 0;

  constructor(
    private sharedservice: SharedService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ivfApi: IVFApiService
  ) {
    this.form = this.fb.group({
      date: [null],
      startTime: [null],
      endTime: [null],

      collectedOocytesCount: [null],
      emptyCumulusCount: [null],
      poorDrugResponse: [null],

      retrievalTechnique: [null],
      anesthesia: [null],

      primaryComplication: [null],
      furtherComplications: [null],
      primaryMeasure: [null],
      furtherMeasures: [null],

      operatingClinician: [''],
      embryologist: [''],
      anesthetist: [''],
      nurse: [''],

      editorContent: [''],

      // Further details
      aspirationSystem: [null],
      folliclesTotal: [],
      folliclesLeft: [],
      folliclesRight: [],
      leadingFollicleSizeMm: [null],
      follicleWashed: [false],
      washedFolliclesCount: [null],
      doseLH: [null],
      doseFSH: [null],
      doseHMG: [null],
      generalCondition: [null],
      mucousMembrane: [null],
      preOpPulse: [null],
      preOpBpSys: [null],
      preOpBpDia: [null],
      preOpTemp: [null],
      anesPulse: [null],
      anesBpSys: [null],
      anesBpDia: [null],
      anesNote: ['']
    });

    this.route.queryParamMap.subscribe((qp) => {
      const idStr = qp.get('cycleId');
      const id = Number(idStr);
      this.cycleId = Number.isFinite(id) && id > 0 ? id : 0;
      if (this.cycleId > 0) {
        this.loadAspiration();
      }
    });
  }

  ngOnInit(): void {
    this.getAlldropdown();
    this.FillCache();
    if (this.cycleId > 0) {
      this.loadAspiration();
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


  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }

  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFAspirationEpisode).subscribe((res: any) => {
      this.AllDropdownValues = res;
      this.getAllDropdown(res);
    })
  }

  // Helper to read dropdown options by key
  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFAspirationEpisode:${key}`]) || [];
  }




  private loadAspiration() {
    this.ivfApi.getEpisodeAspirationByCycleId(this.cycleId).subscribe({
      next: (res: any) => {
        const a = res?.aspiration;
        if (!a) { return; }
        this.aspirationId = Number(a.aspirationId) || 0;
        const o = a.oocyteRetrieval || {};
        const f = a.furtherDetails || {};
        this.oocyteRetrievalId = Number(o.oocyteRetrievalId) || 0;
        this.furtherDetailsId = Number(f.furtherDetailsId) || 0;

        let dateStr: string | null = null;
        if (o.retrievalDate) {
          if (typeof o.retrievalDate === 'string') {
            dateStr = o.retrievalDate.split('T')[0];
          } else {
            const d = new Date(o.retrievalDate);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            dateStr = `${y}-${m}-${dd}`;
          }
        }
        const poor = o.poorResponseToDrugs === true ? 'yes' : (o.poorResponseToDrugs === false ? 'no' : null);

        this.form.patchValue({
          date: dateStr,
          startTime: o.startTime || null,
          endTime: o.endTime || null,
          collectedOocytesCount: o.collectedOocytes ?? null,
          emptyCumulusCount: o.emptyCumuli ?? null,
          poorDrugResponse: poor,

          retrievalTechnique: o.retrievalTechniqueCategoryId || null,
          anesthesia: o.anesthesiaCategoryId || null,
          primaryComplication: o.primaryComplicationsCategoryId || null,
          furtherComplications: o.furtherComplicationsCategoryId || null,
          primaryMeasure: o.primaryMeasureCategoryId || null,
          furtherMeasures: o.furtherMeasureCategoryId || null,

          operatingClinician: o.operatingProviderId || null,
          embryologist: o.embryologistId || null,
          anesthetist: o.anesthetistId || null,
          nurse: o.nurseId || null,

          editorContent: o.note || '',

          aspirationSystem: f.aspirationSystemCategoryId || null,
          leadingFollicleSizeMm: f.leadingFollicleSize ?? null,
          follicleWashed: !!f.folliclesWashed,
          washedFolliclesCount: f.noOfWashedFollicles ?? null,
          folliclesTotal: f.retrievedFolliclesTotal ?? null,
          folliclesLeft: f.retrievedFolliclesLeft ?? null,
          folliclesRight: f.retrievedFolliclesRight ?? null,
          doseLH: f.totalDoseAdministeredLh ?? null,
          doseFSH: f.totalDoseAdministeredFsh ?? null,
          doseHMG: f.totalDoseAdministeredHmg ?? null,
          generalCondition: f.generalConditionCategoryId || null,
          mucousMembrane: f.mucousMembraneCategoryId || null,
          preOpTemp: f.temperature ?? null,
          preOpPulse: f.beforeOocyteRetrievalPulse ?? null,
          preOpBpSys: f.beforeOocyteRetrievalBloodPressureSystolic ?? null,
          preOpBpDia: f.beforeOocyteRetrievalBloodPressureDiastolic ?? null,
          anesPulse: f.anaesthetistPulse ?? null,
          anesBpSys: f.anaesthetistBloodPressureSystolic ?? null,
          anesBpDia: f.anaesthetistBloodPressureDiastolic ?? null,
          anesNote: f.note || ''
        });
      },
      error: () => {}
    });
  }

  submit() {
    const v = this.form.value as any;
    const retrievalDateISO = v.date ? new Date(v.date).toISOString() : new Date().toISOString();
    const poorResponse = v.poorDrugResponse === 'yes' ? true : v.poorDrugResponse === 'no' ? false : false;
    const body: any = {
      aspirationId: this.aspirationId || 0,
      ivfDashboardTreatmentCycleId: this.cycleId || 0,
      statusId: 0,
      oocyteRetrieval: {
        oocyteRetrievalId: this.oocyteRetrievalId || 0,
        aspirationId: this.aspirationId || 0,
        retrievalDate: retrievalDateISO,
        startTime: v.startTime || '',
        endTime: v.endTime || '',
        collectedOocytes: Number(v.collectedOocytesCount) || 0,
        emptyCumuli: Number(v.emptyCumulusCount) || 0,
        poorResponseToDrugs: poorResponse,
        retrievalTechniqueCategoryId: Number(v.retrievalTechnique) || 0,
        anesthesiaCategoryId: Number(v.anesthesia) || 0,
        primaryComplicationsCategoryId: Number(v.primaryComplication) || 0,
        furtherComplicationsCategoryId: Number(v.furtherComplications) || 0,
        primaryMeasureCategoryId: Number(v.primaryMeasure) || 0,
        furtherMeasureCategoryId: Number(v.furtherMeasures) || 0,
        operatingProviderId: Number(v.operatingClinician) || 0,
        embryologistId: Number(v.embryologist) || 0,
        anesthetistId: Number(v.anesthetist) || 0,
        nurseId: Number(v.nurse) || 0,
        note: v.editorContent || ''
      },
      furtherDetails: {
        furtherDetailsId: this.furtherDetailsId || 0,
        aspirationId: this.aspirationId || 0,
        aspirationSystemCategoryId: Number(v.aspirationSystem) || 0,
        leadingFollicleSize: Number(v.leadingFollicleSizeMm) || 0,
        noOfWashedFollicles: Number(v.washedFolliclesCount) || 0,
        folliclesWashed: !!v.follicleWashed,
        retrievedFolliclesTotal: Number(v.folliclesTotal) || 0,
        retrievedFolliclesLeft: Number(v.folliclesLeft) || 0,
        retrievedFolliclesRight: Number(v.folliclesRight) || 0,
        totalDoseAdministeredLh: Number(v.doseLH) || 0,
        totalDoseAdministeredFsh: Number(v.doseFSH) || 0,
        totalDoseAdministeredHmg: Number(v.doseHMG) || 0,
        generalConditionCategoryId: Number(v.generalCondition) || 0,
        mucousMembraneCategoryId: Number(v.mucousMembrane) || 0,
        temperature: Number(v.preOpTemp) || 0,
        beforeOocyteRetrievalPulse: Number(v.preOpPulse) || 0,
        beforeOocyteRetrievalBloodPressureSystolic: Number(v.preOpBpSys) || 0,
        beforeOocyteRetrievalBloodPressureDiastolic: Number(v.preOpBpDia) || 0,
        anaesthetistPulse: Number(v.anesPulse) || 0,
        anaesthetistBloodPressureSystolic: Number(v.anesBpSys) || 0,
        anaesthetistBloodPressureDiastolic: Number(v.anesBpDia) || 0,
        note: v.anesNote || ''
      }
    };

    this.ivfApi.saveEpisodeAspiration(body).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Saved', text: 'Aspiration saved successfully.', timer: 1000, showConfirmButton: false, timerProgressBar: true });
        this.loadAspiration();
      },
      error: (err: any) => {
        if (err && Number(err.status) === 200) {
          Swal.fire({ icon: 'success', title: 'Saved', text: 'Aspiration saved successfully.', timer: 1000, showConfirmButton: false, timerProgressBar: true });
          this.loadAspiration();
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save aspiration. Please try again.' });
      }
    });
  }
}
