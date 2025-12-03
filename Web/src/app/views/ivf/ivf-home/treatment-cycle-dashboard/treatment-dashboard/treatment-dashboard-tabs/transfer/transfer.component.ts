import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { EmbryoTransferComponent } from './forms/embryo-transfer/embryo-transfer.component';
import { FurtherInformationComponent } from './forms/further-information/further-information.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EmbryoTransferComponent, FurtherInformationComponent],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  form: FormGroup;
  embryosList: EmbryoTransferComponent['embryos'] = [
    { number: 1, id: 12673, title: 'Hatching blastocyst', morpho: 'ideal' as 'ideal', score: '5AA', image1: null, image2: null },
    { number: 2, id: 12675, title: 'Hatching blastocyst', morpho: null, score: null, image1: null, image2: null }
  ];

  @ViewChild(EmbryoTransferComponent) embryoCmp?: EmbryoTransferComponent;
  @ViewChild(FurtherInformationComponent) furtherCmp?: FurtherInformationComponent;

  constructor(private fb: FormBuilder, private ivf: IVFApiService) {
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
        scoreCategoryId: 0,
      };
    });

    const furtherInformation = furtherForm ? {
      cultureDays: Number(furtherForm.cultureDuration) || 0,
      catheterCategoryId: Number(furtherForm.catheterCategory) || 0,
      cathererAddition: furtherForm.catheterAdditional ?? 'string',
      mainCompilationCategoryId: Number(furtherForm.mainComplication) || 0,
      furtherComplicationCategoryId: Number(furtherForm.furtherComplication) || 0,
      severalAttempts: !!furtherForm.severalAttempts,
      noOfAttempts: Number(furtherForm.attempts) || 0,
      embryoGlue: !!furtherForm.embryoGlue,
      difficultCathererInsertion: !!furtherForm.difficultCatheterInsertion,
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
      ivfDashboardTreatmentCycleId: 0,
      statusId: 0,
      transfer: {
        id: 0,
        transferId: 0,
        dateOfTransfer: top.dateOfTransfer || new Date().toISOString(),
        timeOfTransfer: top.timeOfTransfer || 'string',
        transferDurationPerMin: Number(top.durationMin) || 0,
        providerId: Number(top.operatingClinician) || 0,
        nurseId: Number(top.nurse) || 0,
        dateOfSecTransfer: top.dateOfSecTransfer || new Date().toISOString(),
        electiveSingleEmbryoTransfer: !!top.electiveSingleEmbryoTransfer,
        embryologistId: Number(top.embryologistId) || 0,
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
