import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { EmbryoTransferComponent } from './forms/embryo-transfer/embryo-transfer.component';
import { FurtherInformationComponent } from './forms/further-information/further-information.component';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EmbryoTransferComponent, FurtherInformationComponent],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent implements OnInit {
  form: FormGroup;
  embryosList: EmbryoTransferComponent['embryos'] = [
    { number: 1, id: 12673, title: 'Hatching blastocyst', morpho: 'ideal' as 'ideal', score: '5AA', image1: null, image2: null },
    { number: 2, id: 12675, title: 'Hatching blastocyst', morpho: null, score: null, image1: null, image2: null }
  ];

  @ViewChild(EmbryoTransferComponent) embryoCmp?: EmbryoTransferComponent;
  @ViewChild(FurtherInformationComponent) furtherCmp?: FurtherInformationComponent;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ivf: IVFApiService,
    private sharedservice: SharedService,
  ) {
    this.form = this.fb.group({
      dateOfTransfer: [''],
      timeOfTransfer: [''],
      durationMin: [0],
      operatingClinician: [0],
      nurse: [0],
      dateOfSecTransfer: [''],
      electiveSingleEmbryoTransfer: [false],
      embryologistId: [0],
    });

        this.route.queryParamMap.subscribe((qp) => {
      const idStr = qp.get('cycleId');
      const id = Number(idStr);
      this.cycleId = Number.isFinite(id) && id > 0 ? id : 0;
      if (this.cycleId > 0) {
        this.loadEpisodeTransfer(this.cycleId);
      }
    });

  }
  cycleId: any;
  AllDropdownValues: any = [];
  dropdowns: any = [];
  cacheItems: string[] = ['Provider'];
  hrEmployees: any = [];
  // hold ids for update
  currentTransferId: number | null = null;
  currentTransferInnerId: number | null = null;
  currentEmbryosIds: Array<{ index: number; embryoInTransferId: number; transferId: number }> = [];
  isLoading = false;
  isSaving = false;
  get actionLabel() { return this.currentTransferId ? 'Update' : 'Save'; }

  ngOnInit() {
    this.getAlldropdown();
    this.FillCache();
  }

  private loadEpisodeTransfer(cycleId: number) {
    this.isLoading = true;
    this.ivf.getEpisodeTransferByCycleId(cycleId).pipe(finalize(() => { this.isLoading = false; })).subscribe((res: any) => {
      // Expecting shape { transfer: { ...same as sample... } }
      const data = (res && res.transfer) ? res.transfer : res;
      if (!data) return;

      // store ids for update
      this.currentTransferId = data.transferId ?? null;
      this.currentTransferInnerId = data.transfer?.id ?? null;

      // top form
      const t = data.transfer || {};
      this.form.patchValue({
        dateOfTransfer: t.dateOfTransfer ? t.dateOfTransfer.substring(0, 10) : '',
        timeOfTransfer: t.timeOfTransfer || '',
        durationMin: t.transferDurationPerMin ?? 0,
        operatingClinician: t.providerId ?? null,
        nurse: t.nurseId ?? null,
        dateOfSecTransfer: t.dateOfSecTransfer ? t.dateOfSecTransfer.substring(0, 10) : '',
        electiveSingleEmbryoTransfer: !!t.electiveSingleEmbryoTransfer,
        embryologistId: t.embryologistId ?? null,
      });

      // embryos
      const embryos = Array.isArray(data.embryosInTransfer) ? data.embryosInTransfer : [];
      this.currentEmbryosIds = embryos.map((e: any, i: number) => ({ index: i, embryoInTransferId: e.embryoInTransferId, transferId: e.transferId }));
      this.embryosList = embryos.map((e: any, i: number) => ({
        number: i + 1,
        id: e.embryoId,
        title: e.cellInformation,
        morpho: e.ideal ? 'ideal' : 'not_ideal',
        score: e.scoreCategoryId ?? null,
        image1: null,
        image2: null,
      }));
      // EmbryoTransferComponent will rebuild its form via ngOnChanges when embryosList changes

      // further information
      const fi = data.furtherInformation || {};
      if (this.furtherCmp?.form) {
        this.furtherCmp.form.patchValue({
          cultureDuration: fi.cultureDays ?? 0,
          catheterUsed: fi.catheterCategoryId ?? '',
          catheterAddition: fi.catheterAddition ?? '',
          mainComplication: fi.mainCompilationCategoryId ?? '',
          furtherComplications: fi.furtherComplicationCategoryId ?? '',
          severalAttempts: !!fi.severalAttempts,
          attempts: fi.noOfAttempts ?? 0,
          embryoGlue: !!fi.embryoGlue,
          difficultCatheter: !!fi.difficultCatheterInsertion,
          catheterChange: !!fi.catheterChange,
          mucusInCatheter: !!fi.mucusInCatheter,
          bloodInCatheter: !!fi.bloodInCatheter,
          dilation: !!fi.dilation,
          ultrasoundCheck: !!fi.ultrasoundCheck,
          vulsellum: !!fi.vulsellum,
          probe: !!fi.probe,
          editorContent: fi.note ?? '',
        });
      }
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
    } catch { }
  }

  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }

  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFTransferEpisode).subscribe((res: any) => {
      this.AllDropdownValues = res;
      this.getAllDropdown(res);
    })
  }

  // Helper to read dropdown options by key
  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFTransferEpisode:${key}`]) || [];
  }


  onSave() {
    if (!this.cycleId || this.cycleId === 0 || this.cycleId === null || this.cycleId === undefined) {
      Swal.fire('Treatment cycle id is required please go to dashboard and selact cycle', '', 'error');
      return;
    }

    this.isSaving = true;
    const top = this.form.getRawValue();
    const embryosForm = this.embryoCmp?.form?.getRawValue?.();
    const furtherForm = this.furtherCmp?.form?.getRawValue?.();

    const embryosInTransfer =
      (this.embryoCmp?.embryos || []).map((emb, idx) => {
        const rowFg = this.embryoCmp?.embryosFA?.at(idx);
        const row = rowFg?.getRawValue ? rowFg.getRawValue() : {} as any;
        return {
          embryoInTransferId: 0,
          transferId: 0,
          sequenceId: idx + 1,
          embryoId: emb.id ?? 0,
          cellInformation: emb.title ?? 'string',
          ideal: (row?.morpho ?? emb.morpho) === 'ideal',
          scoreCategoryId: row?.score ? Number(row.score) : null,
        };
      });

    const furtherInformation = furtherForm ? {
      cultureDays: Number(furtherForm.cultureDuration) || 0,
      catheterCategoryId: furtherForm.catheterUsed ? Number(furtherForm.catheterUsed) : null,
      catheterAddition: furtherForm.catheterAddition ?? null,
      mainCompilationCategoryId: furtherForm.mainComplication ? Number(furtherForm.mainComplication) : null,
      furtherComplicationCategoryId: furtherForm.furtherComplications ? Number(furtherForm.furtherComplications) : null,
      severalAttempts: !!furtherForm.severalAttempts,
      noOfAttempts: Number(furtherForm.attempts) || 0,
      embryoGlue: !!furtherForm.embryoGlue,
      difficultCatheterInsertion: !!furtherForm.difficultCatheter ? true : null,
      catheterChange: !!furtherForm.catheterChange,
      mucusInCatheter: !!furtherForm.mucusInCatheter,
      bloodInCatheter: !!furtherForm.bloodInCatheter,
      dilation: !!furtherForm.dilation,
      ultrasoundCheck: !!furtherForm.ultrasoundCheck,
      vulsellum: !!furtherForm.vulsellum,
      probe: !!furtherForm.probe,
      note: furtherForm.editorContent ?? null,
    } : {
      cultureDays: 0,
      catheterCategoryId: 0,
      catheterAddition: null,
      mainCompilationCategoryId: 0,
      furtherComplicationCategoryId: 0,
      severalAttempts: false,
      noOfAttempts: 0,
      embryoGlue: false,
      difficultCatheterInsertion: null,
      catheterChange: false,
      mucusInCatheter: false,
      bloodInCatheter: false,
      dilation: false,
      ultrasoundCheck: false,
      vulsellum: false,
      probe: false,
      note: null,
    };


    const payload = {
      transferId: this.currentTransferId ?? 0,
      ivfDashboardTreatmentCycleId: this.cycleId,
      statusId: 0,
      transfer: {
        id: this.currentTransferInnerId ?? 0,
        transferId: this.currentTransferId ?? 0,
        dateOfTransfer: top.dateOfTransfer || new Date().toISOString(),
        timeOfTransfer: top.timeOfTransfer || 'string',
        transferDurationPerMin: Number(top.durationMin) || 0,
        providerId: top.operatingClinician ? Number(top.operatingClinician) : null,
        nurseId: top.nurse ? Number(top.nurse) : null,
        dateOfSecTransfer: top.dateOfSecTransfer || null,
        electiveSingleEmbryoTransfer: !!top.electiveSingleEmbryoTransfer,
        embryologistId: top.embryologistId ? Number(top.embryologistId) : null,
      },
      embryosInTransfer,
      furtherInformation,
    };

    this.ivf.saveEpisodeTransfer(payload).pipe(finalize(() => { this.isSaving = false; })).subscribe({
      next: () => {
        const msg = this.currentTransferId ? 'Transfer updated successfully' : 'Transfer saved successfully';
        Swal.fire(msg, '', 'success');
        if (!this.currentTransferId && this.cycleId) {
          this.loadEpisodeTransfer(this.cycleId);
        }
      },
      error: () => {
        const msg = this.currentTransferId ? 'Transfer update failed' : 'Transfer save failed';
        Swal.fire(msg, '', 'error');
      },
    });
  }
}
