import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { EmbryoTransferComponent } from './forms/embryo-transfer/embryo-transfer.component';
import { FurtherInformationComponent } from './forms/further-information/further-information.component';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { ActivatedRoute } from '@angular/router';

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
        // this.loadTreatment();
      }
    });

  }
  cycleId: any;
  AllDropdownValues: any = [];
  dropdowns: any = [];
  cacheItems: string[] = ['Provider'];
  hrEmployees: any = [];

  ngOnInit() {
    this.getAlldropdown();
    this.FillCache();
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
    const top = this.form.getRawValue();
    const embryosForm = this.embryoCmp?.form?.getRawValue?.();
    const furtherForm = this.furtherCmp?.form?.getRawValue?.();

    const embryosInTransfer = (this.embryoCmp?.embryos || []).map((emb, idx) => {
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
      cathererAddition: furtherForm.catheterAddition ?? 'string',
      mainCompilationCategoryId: furtherForm.mainComplication ? Number(furtherForm.mainComplication) : null,
      furtherComplicationCategoryId: furtherForm.furtherComplications ? Number(furtherForm.furtherComplications) : null,
      severalAttempts: !!furtherForm.severalAttempts,
      noOfAttempts: Number(furtherForm.attempts) || 0,
      embryoGlue: !!furtherForm.embryoGlue,
      difficultCathererInsertion: !!furtherForm.difficultCatheter,
      catheterChange: !!furtherForm.catheterChange,
      mucusInCatheter: !!furtherForm.mucusInCatheter,
      bloodInCatheter: !!furtherForm.bloodInCatheter,
      dilation: !!furtherForm.dilation,
      ultrasoundCheck: !!furtherForm.ultrasoundCheck,
      vulsellum: !!furtherForm.vulsellum,
      probe: !!furtherForm.probe,
      note: furtherForm.editorContent ?? furtherForm.note ?? 'string',
    } : {
      cultureDays: 0,
      cathererCategoryId: 0,
      cathererAddition: 'string',
      mainCompilationCategoryId: 0,
      furtherComplicationCategoryId: 0,
      severalAttempts: false,
      noOfAttempts: 0,
      embryoGlue: false,
      difficultCathererInsertion: false,
      catheterChange: false,
      mucusInCatheter: false,
      bloodInCatheter: false,
      dilation: false,
      ultrasoundCheck: false,
      vulsellum: false,
      probe: false,
      note: 'string',
    };

    const payload = {
      transferId: 0,
      ivfDashboardTreatmentCycleId: this.cycleId,
      statusId: 0,
      transfer: {
        id: 0,
        transferId: 0,
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

    console.log('Transfer save payload:', payload);
    this.ivf.saveEpisodeTransfer(payload).subscribe({
      next: (res) => console.log('Transfer saved OK', res),
      error: (err) => console.error('Transfer save failed', err),
    });
  }
}
