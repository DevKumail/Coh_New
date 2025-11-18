import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicalHistoryBasicComponent } from './medical-history-basic/medical-history-basic.component';
import { MedicalHistoryGeneralComponent } from './medical-history-general/medical-history-general.component';
import { MedicalHistoryTesticlesComponent } from './medical-history-testicles/medical-history-testicles.component';
import { MedicalHistoryGeneticsComponent } from './medical-history-genetics/medical-history-genetics.component';
import { MedicalHistoryFamilyComponent } from './medical-history-family/medical-history-family.component';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { Page } from '@/app/shared/enum/dropdown.enum';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    MedicalHistoryBasicComponent,
    MedicalHistoryGeneralComponent,
    MedicalHistoryTesticlesComponent,
    MedicalHistoryGeneticsComponent,
    MedicalHistoryFamilyComponent,
    FilledOnValueDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent {
  activeTabId: number = 1;

  AllDropdownValues: any = [];
  dropdowns: any = [];
  cacheItems: string[] = ['Provider'];
  hrEmployees: any = [];

  @ViewChild(MedicalHistoryBasicComponent) basicTab?: MedicalHistoryBasicComponent;
  @ViewChild(MedicalHistoryGeneralComponent) generalTab?: MedicalHistoryGeneralComponent;
  @ViewChild(MedicalHistoryGeneticsComponent) geneticsTab?: MedicalHistoryGeneticsComponent;

  constructor(
    private fb: FormBuilder,
    private ivfservice: IVFApiService,
    private patientBannerService: PatientBannerService,
    private sharedservice: SharedService

  ) {}


  ngOnInit(): void {
    this.getAlldropdown();
  }

  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }

  

  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFFertilityHistory).subscribe((res: any) => {
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
      } catch { }
    }
  }

  onSave() {
    const basic = this.basicTab?.basicForm?.getRawValue?.() || {};
    const general = this.generalTab?.generalForm?.getRawValue?.() || {};

    const getNameById = (key: string, id: number | string | null | undefined): string | null => {
      if (id == null || id === '') return null;
      const list = (this.dropdowns?.[key] || []) as Array<{ valueId: number; name: string }>;
      const found = list.find(x => x.valueId == id);
      return found?.name ?? null;
    };

    const toBoolFromGH = (id: number | string | null | undefined): boolean | null => {
      if (id == null || id === '') return null;
      // 134: Yes, 135: No (based on provided payload)
      return id == 134 ? true : id == 135 ? false : null;
    };

    const chromosomeAnalysisCategoryId = basic?.chromosomeAnalysis || 0;
  var MainId
    this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
      if (data) {
        if (data?.couple?.ivfMainId != null) {
           MainId = data?.couple?.ivfMainId?.IVFMainId ?? 0;
        } 
      }
    });
    const payload: any = {
      ivfMaleFHId: 0 ,
      ivfMainId: MainId || 0,
      date: basic?.date ? new Date(basic.date).toISOString() : null,
      providerId: basic?.attendingClinician || 0,
      adiposity: getNameById('IVFFertilityHistory:Adiposity', basic?.adiposity) || '',
      generallyHealthy: toBoolFromGH(basic?.generallyHealthy),
      longTermMedication: basic?.longTermMedication || '',
      noOfPregnanciesAchieved: basic?.pregnanciesAchieved ?? 0,
      chromosomeAnalysisCategoryId: Number(chromosomeAnalysisCategoryId) || 0,
      cftrCarrier: getNameById('IVFFertilityHistory:CFTRCarrier', basic?.cftrCarrier) || '',
      general: {
        ivfMaleFHGeneralId: 0,
        ivfMaleFHId: 0,
        hasChildren: !!general?.hasChildren,
        girls: general?.girls ?? 0,
        boys: general?.boys ?? 0,
        infertileSince: general?.infertileSince || '',
        andrologicalDiagnosisPerformed: !!general?.andrologicalDiagnosisPerformed,
        date: general?.andrologicalDiagnosisDate ? new Date(general.andrologicalDiagnosisDate).toISOString() : null,
        infertilityType: getNameById('IVFFertilityHistory:InfertilityType', general?.infertilityType) || '',
        furtherPlanning: {
          ivfMaleFHFurtherPlanningId: 0,
          ivfMaleFHGeneralId: 0,
          semenAnalysis: !!general?.semenAnalysis,
          morphologicalExamination: !!general?.morphologicalExamination,
          serologicalExamination: !!general?.serologicalExamination,
          andrologicalUrologicalConsultation: !!general?.andrologicalUrologicalConsultation,
          dnaFragmentation: !!general?.dnaFragmentation,
          spermFreezing: !!general?.spermFreezing
        },
        illness: {
          ivfMaleFHIllnessId: 0,
          ivfMaleFHGeneralId: 0,
          idiopathic: !!general?.idiopathic,
          mumpsAfterPuberty: !!general?.mumpsAfterPuberty,
          endocrinopathies: getNameById('IVFFertilityHistory:Endocrinopathies', general?.endocrinopathies) || '',
          previousTumor: getNameById('IVFFertilityHistory:PreviousTumor', general?.previousTumor) || '',
          hepatitis: !!general?.hepatitis,
          hepatitisDetails: general?.hepatitisDetail || '',
          existingAllergies: !!general?.existingAllergies,
          existingAllergiesDetails: general?.existingAllergiesDetail || '',
          chronicIllnesses: general?.chronicIllnesses || '',
          otherDiseases: general?.otherDiseases || '',
          idiopathicIds: Array.isArray(general?.idiopathicSelections) ? general.idiopathicSelections : []
        },
        performedTreatment: {
          ivfMaleFHPerformedTreatmentId: 0,
          ivfMaleFHGeneralId: 0,
          alreadyTreated: !!general?.alreadyTreated,
          notes: general?.treatmentNote || '',
          treatmentYears: [] as any[]
        }
      },
      genetics: {
        ivfMaleFHGeneticsId: 0,
        ivfMaleFHId: 0,
        genetics: '',
        categoryIdInheritance: 0,
        medicalOpinion: this.geneticsTab?.editorContent || ''
      },
      testiclesAndSem: {},
      impairmentFactors: [],
      prevIllnesses: [],
      semenAnalyses: (this.basicTab?.analyses?.controls || []).map((ctrl: any) => {
        const v = ctrl.getRawValue ? ctrl.getRawValue() : ctrl.value;
        return {
          ivfMaleFHSemenAnalysisId: 0,
          ivfMaleFHId: 0,
          date: v?.date ? new Date(v.date).toISOString() : null,
          id: Number(v?.id) || 0,
          motileNo: v?.motile?.toString?.() || '',
          collectionMethod: v?.collectionMethod || '',
          concentrationNative: v?.concentrationNative?.toString?.() || '',
          concentrationAfterPrep: v?.concentrationAfterPrep?.toString?.() || '',
          overallMotilityNative: v?.overallMotilityNative?.toString?.() || '',
          overallMotilityPrep: v?.overallMotilityAfterPrep?.toString?.() || '',
          progressiveMotilityNativ: v?.progressiveMotilityNative?.toString?.() || '',
          progressiveMotilityPrep: v?.progressiveMotilityAfterPrep?.toString?.() || '',
          normalFormsNative: v?.normalFormsNative?.toString?.() || '',
          normalFormsPrep: v?.normalFormsAfterPrep?.toString?.() || ''
        };
      })
    };

    this.ivfservice.createOrUpdateMaleFertilityHistory(payload).subscribe({
      next: (res) => {
        console.log('Saved successfully', res);
      },
      error: (err) => {
        console.error('Save failed', err);
      }
    });
  }

  onCancel() {
    console.log('Cancelling medical history form...');
    // Implement cancel logic
  }
}
