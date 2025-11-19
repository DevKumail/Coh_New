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
import { NgIconComponent } from '@ng-icons/core';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    NgIconComponent,
    GenericPaginationComponent,
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
  isCreateUpdate: boolean = false;
  showAdd: boolean = false;
  // Fertility history list state
  isLoadingHistory = false;
  historyRows: any[] = [];
  PaginationInfo: any = {
    Page: 1,
    RowsPerPage: 10,
  };
  totalrecord = 0;

  // Toggle between list (default) and form
  showForm = false;

  @ViewChild(MedicalHistoryBasicComponent) basicTab?: MedicalHistoryBasicComponent;
  @ViewChild(MedicalHistoryGeneralComponent) generalTab?: MedicalHistoryGeneralComponent;
  @ViewChild(MedicalHistoryGeneticsComponent) geneticsTab?: MedicalHistoryGeneticsComponent;
  @ViewChild(MedicalHistoryTesticlesComponent) testiclesTab?: MedicalHistoryTesticlesComponent;

  constructor(
    private fb: FormBuilder,
    private ivfservice: IVFApiService,
    private patientBannerService: PatientBannerService,
    private sharedservice: SharedService

  ) {}


  ngOnInit(): void {
    this.getAlldropdown();
    // Load list by default
    this.loadFertilityHistory();
  }

  openEditById(ivfMaleFHId: number) {
    this.isCreateUpdate = true;
    this.showAdd = true;
    this.ivfservice.getFertilityHistoryById(ivfMaleFHId).subscribe({
      next: (res: any) => {
        const fh = res?.fertilityHistory || res;
        // Wait a tick to ensure child views are created
        setTimeout(() => this.patchFertilityHistory(fh), 0);
      }
    });
  }

  private patchFertilityHistory(fh: any) {
    if (!fh) return;
    // Basic tab
    const b = fh;
    const basicPatch: any = {
      date: b?.date ? b.date.substring(0, 10) : '',
      attendingClinician: b?.providerId ?? '',
      adiposity: b?.adiposityCategoryId ?? '',
      generallyHealthy: b?.generallyHealthyCategoryId ?? '',
      longTermMedication: b?.longTermMedication ?? '',
      pregnanciesAchieved: b?.noOfPregnanciesAchieved ?? 0,
      chromosomeAnalysis: b?.chromosomeAnalysisCategoryId ?? '',
      cftrCarrier: b?.cftrCarrierCategoryId ?? ''
    };
    this.basicTab?.basicForm?.patchValue?.(basicPatch);
    // Semen analyses
    const list = Array.isArray(b?.semenAnalyses) ? b.semenAnalyses : [];
    const arr = this.basicTab?.analyses;
    if (arr) {
      while (arr.length > 0) arr.removeAt(0);
      list.forEach((it: any) => {
        arr.push((this.basicTab as any)['createAnalysisGroup']());
      });
      list.forEach((it: any, i: number) => {
        arr.at(i).patchValue({
          date: it?.date ? it.date.substring(0, 10) : '',
          id: it?.id ?? '',
          motile: it?.motileNo ?? '',
          collectionMethod: it?.collectionMethod ?? '',
          concentrationNative: it?.concentrationNative ?? '',
          concentrationAfterPrep: it?.concentrationAfterPrep ?? '',
          overallMotilityNative: it?.overallMotilityNative ?? '',
          overallMotilityAfterPrep: it?.overallMotilityPrep ?? '',
          progressiveMotilityNative: it?.progressiveMotilityNativ ?? '',
          progressiveMotilityAfterPrep: it?.progressiveMotilityPrep ?? '',
          normalFormsNative: it?.normalFormsNative ?? '',
          normalFormsAfterPrep: it?.normalFormsPrep ?? ''
        });
      });
    }

    // General tab
    const g = fh?.general || {};
    const ill = g?.illness || {};
    const fp = g?.furtherPlanning || {};
    const pt = g?.performedTreatment || {};
    const generalPatch: any = {
      hasChildren: !!g?.hasChildren,
      girls: g?.girls ?? 0,
      boys: g?.boys ?? 0,
      andrologicalDiagnosisPerformed: !!g?.andrologicalDiagnosisPerformed,
      andrologicalDiagnosisDate: g?.date ? g.date.substring(0, 10) : '',
      infertileSince: g?.infertileSince ?? '',
      infertilityType: g?.infertilityTypeCategoryId ?? '',
      idiopathic: !!ill?.idiopathic,
      idiopathicSelections: Array.isArray(ill?.idiopathicIds) ? ill.idiopathicIds : [],
      mumpsAfterPuberty: !!ill?.mumpsAfterPuberty,
      endocrinopathies: ill?.endocrinopathiesCategoryId ?? '',
      previousTumor: ill?.previousTumorCategoryId ?? '',
      hepatitis: !!ill?.hepatitis,
      hepatitisDetail: ill?.hepatitisDetails ?? '',
      existingAllergies: !!ill?.existingAllergies,
      existingAllergiesDetail: ill?.existingAllergiesDetails ?? '',
      chronicIllnesses: ill?.chronicIllnesses ?? '',
      otherDiseases: ill?.otherDiseases ?? '',
      semenAnalysis: !!fp?.semenAnalysis,
      morphologicalExamination: !!fp?.morphologicalExamination,
      serologicalExamination: !!fp?.serologicalExamination,
      andrologicalUrologicalConsultation: !!fp?.andrologicalUrologicalConsultation,
      dnaFragmentation: !!fp?.dnaFragmentation,
      spermFreezing: !!fp?.spermFreezing,
      alreadyTreated: !!pt?.alreadyTreated,
      treatmentNote: pt?.notes ?? ''
    };
    this.generalTab?.generalForm?.patchValue?.(generalPatch);

    // Genetics tab
    const ge = fh?.genetics || {};
    if (this.geneticsTab?.geneticsForm) {
      this.geneticsTab.geneticsForm.patchValue({
        genes: ge?.genetics ?? '',
        inheritance: ge?.categoryIdInheritance ?? ''
      });
      this.geneticsTab.editorContent = ge?.medicalOpinion ?? '';
    }

    // Testicles & Seminal tract
    const t = fh?.testiclesAndSem || null;
    if (t && this.testiclesTab?.testiclesForm) {
      this.testiclesTab.testiclesForm.patchValue({
        primaryHypogonadotropy: !!t?.primaryHypogonadotropy,
        secondaryHypogonadotropy: !!t?.secondaryHypogonadotropy,
        retractileTestes: !!t?.retractileTestes,
        categoryIdTesticle: t?.categoryIdTesticle ?? 0,
        categoryIdKryptorchidism: t?.categoryIdKryptorchidism ?? 0,
        categoryIdOrchitis: t?.categoryIdOrchitis ?? 0,
        testicleVolumeLeft: t?.testicleVolumeLeft ?? '',
        testicleVolumeRight: t?.testicleVolumeRight ?? '',
        varicocele: !!t?.varicocele,
        operatedVaricocele: !!t?.operatedVaricocele,
        categoryIdInstrumentalVaricocele: t?.categoryIdInstrumentalVaricocele ?? 0,
        categoryIdClinicalVaricocele: t?.categoryIdClinicalVaricocele ?? 0,
        obstipationOfSpermaticDuct: !!t?.obstipationOfSpermaticDuct,
        categoryIdProximalSeminalTract: t?.categoryIdProximalSeminalTract ?? 0,
        categoryIdDistalSeminalTract: t?.categoryIdDistalSeminalTract ?? 0,
        categoryIdEtiologicalDiagnosis: t?.categoryIdEtiologicalDiagnosis ?? 0,
        note: t?.note ?? '',
        infections: {
          urethritis: !!t?.infections?.urethritis,
          prostatitis: !!t?.infections?.prostatitis,
          epididymitis: !!t?.infections?.epididymitis,
          categoryIdPrevInfections: t?.infections?.categoryIdPrevInfections ?? 0,
          categoryIdDiagnosisOfInfection: t?.infections?.categoryIdDiagnosisOfInfection ?? 0,
        }
      });
    }
  }

  openAdd(){
    this.isCreateUpdate = true;
    this.showAdd = true;
  }

  onCancel(){
    this.isCreateUpdate = false;
    this.showAdd = false;
  }
  loadFertilityHistory(page: number = this.PaginationInfo.Page) {
    this.isLoadingHistory = true;
    this.PaginationInfo.Page = page;
    this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
      const ivfMainId = data?.couple?.ivfMainId?.IVFMainId ?? null;
    if(ivfMainId){
      this.ivfservice.getMaleFertilityHistory(ivfMainId, this.PaginationInfo.Page, this.PaginationInfo.RowsPerPage).subscribe({
          next: (res: any) => {
            this.historyRows = res?.fertilityHistory|| [];
            this.totalrecord = res?.total || res?.count || (Array.isArray(this.historyRows) ? this.historyRows.length : 0);
            this.isLoadingHistory = false;
          },
          error: () => {
            this.historyRows = [];
            this.isLoadingHistory = false;
          }
        });
      }else{
        this.historyRows = [];
        this.isLoadingHistory = false;
      }
    });
  }

  onPageChanged(event: any) {
    this.PaginationInfo.Page = event.page;
    this.loadFertilityHistory();
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
    const testiclesRaw = this.testiclesTab?.getRawValue?.() || {};

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
    // Build General section object
    const generalSection = {
      ivfMaleFHGeneralId: 0,
      ivfMaleFHId: 0,
      hasChildren: !!general?.hasChildren,
      girls: general?.girls ?? 0,
      boys: general?.boys ?? 0,
      infertileSince: general?.infertileSince || '',
      andrologicalDiagnosisPerformed: !!general?.andrologicalDiagnosisPerformed,
      date: general?.andrologicalDiagnosisDate ? new Date(general.andrologicalDiagnosisDate).toISOString() : null,
      infertilityType: Number(general?.infertilityType) || 0,
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
        endocrinopathies: Number(general?.endocrinopathies) || 0,
        previousTumor: Number(general?.previousTumor) || 0,
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
    };

    // Determine if General has any meaningful values
    const hasGeneralData = (
      !!generalSection.hasChildren ||
      (generalSection.girls ?? 0) > 0 ||
      (generalSection.boys ?? 0) > 0 ||
      (generalSection.infertileSince || '').trim().length > 0 ||
      !!generalSection.andrologicalDiagnosisPerformed ||
      !!general?.andrologicalDiagnosisDate ||
      (generalSection.infertilityType ?? 0) > 0 ||
      !!generalSection.furtherPlanning.semenAnalysis ||
      !!generalSection.furtherPlanning.morphologicalExamination ||
      !!generalSection.furtherPlanning.serologicalExamination ||
      !!generalSection.furtherPlanning.andrologicalUrologicalConsultation ||
      !!generalSection.furtherPlanning.dnaFragmentation ||
      !!generalSection.furtherPlanning.spermFreezing ||
      !!generalSection.illness.idiopathic ||
      !!generalSection.illness.mumpsAfterPuberty ||
      (generalSection.illness.endocrinopathies ?? 0) > 0 ||
      (generalSection.illness.previousTumor ?? 0) > 0 ||
      !!generalSection.illness.hepatitis ||
      !!generalSection.illness.existingAllergies ||
      (generalSection.illness.chronicIllnesses || '').trim().length > 0 ||
      (generalSection.illness.otherDiseases || '').trim().length > 0 ||
      (generalSection.illness.idiopathicIds || []).length > 0 ||
      !!generalSection.performedTreatment.alreadyTreated ||
      (generalSection.performedTreatment.notes || '').trim().length > 0
    );

    // Genetics section from reactive form + editor
    const geneticsRaw = this.geneticsTab?.geneticsForm?.getRawValue?.() || {};
    const geneticsSection = {
      ivfMaleFHGeneticsId: null,
      ivfMaleFHId:  0,
      genetics: geneticsRaw?.genes || '',
      categoryIdInheritance: Number(geneticsRaw?.inheritance) || 0,
      medicalOpinion: this.geneticsTab?.editorContent || ''
    };
    const hasGeneticsData = (geneticsSection.medicalOpinion || '').trim().length > 0 || geneticsSection.categoryIdInheritance > 0 || (geneticsSection.genetics || '').trim().length > 0;

    // Testicles & Seminal tract section
    const testiclesSection = {
      ivfMaleFHTesticlesAndSemId: 0,
      ivfMaleFHId: 0,
      primaryHypogonadotropy: !!testiclesRaw?.primaryHypogonadotropy,
      secondaryHypogonadotropy: !!testiclesRaw?.secondaryHypogonadotropy,
      retractileTestes: !!testiclesRaw?.retractileTestes,
      categoryIdTesticle: Number(testiclesRaw?.categoryIdTesticle) || 0,
      categoryIdKryptorchidism: Number(testiclesRaw?.categoryIdKryptorchidism) || 0,
      categoryIdOrchitis: Number(testiclesRaw?.categoryIdOrchitis) || 0,
      testicleVolumeLeft: testiclesRaw?.testicleVolumeLeft || '',
      testicleVolumeRight: testiclesRaw?.testicleVolumeRight || '',
      varicocele: !!testiclesRaw?.varicocele,
      operatedVaricocele: !!testiclesRaw?.operatedVaricocele,
      categoryIdInstrumentalVaricocele: Number(testiclesRaw?.categoryIdInstrumentalVaricocele) || 0,
      categoryIdClinicalVaricocele: Number(testiclesRaw?.categoryIdClinicalVaricocele) || 0,
      obstipationOfSpermaticDuct: !!testiclesRaw?.obstipationOfSpermaticDuct,
      categoryIdProximalSeminalTract: Number(testiclesRaw?.categoryIdProximalSeminalTract) || 0,
      categoryIdDistalSeminalTract: Number(testiclesRaw?.categoryIdDistalSeminalTract) || 0,
      categoryIdEtiologicalDiagnosis: Number(testiclesRaw?.categoryIdEtiologicalDiagnosis) || 0,
      inflammation: !!testiclesRaw?.inflammation,
      note: testiclesRaw?.note || '',
      infections: {
        ivfMaleFHInfectionsId: 0,
        ivfMaleFHTesticlesAndSemId: 0,
        urethritis: !!testiclesRaw?.infections?.urethritis,
        prostatitis: !!testiclesRaw?.infections?.prostatitis,
        epididymitis: !!testiclesRaw?.infections?.epididymitis,
        categoryIdPrevInfections: Number(testiclesRaw?.infections?.categoryIdPrevInfections) || 0,
        categoryIdDiagnosisOfInfection: Number(testiclesRaw?.infections?.categoryIdDiagnosisOfInfection) || 0,
      }
    };
    const hasTesticlesData = (
      !!testiclesSection.primaryHypogonadotropy ||
      !!testiclesSection.secondaryHypogonadotropy ||
      !!testiclesSection.retractileTestes ||
      (testiclesSection.categoryIdTesticle ?? 0) > 0 ||
      (testiclesSection.categoryIdKryptorchidism ?? 0) > 0 ||
      (testiclesSection.categoryIdOrchitis ?? 0) > 0 ||
      (testiclesSection.testicleVolumeLeft || '').trim().length > 0 ||
      (testiclesSection.testicleVolumeRight || '').trim().length > 0 ||
      !!testiclesSection.varicocele ||
      !!testiclesSection.operatedVaricocele ||
      (testiclesSection.categoryIdInstrumentalVaricocele ?? 0) > 0 ||
      (testiclesSection.categoryIdClinicalVaricocele ?? 0) > 0 ||
      !!testiclesSection.obstipationOfSpermaticDuct ||
      (testiclesSection.categoryIdProximalSeminalTract ?? 0) > 0 ||
      (testiclesSection.categoryIdDistalSeminalTract ?? 0) > 0 ||
      (testiclesSection.categoryIdEtiologicalDiagnosis ?? 0) > 0 ||
      !!testiclesSection.inflammation ||
      (testiclesSection.note || '').trim().length > 0 ||
      !!testiclesSection.infections.urethritis ||
      !!testiclesSection.infections.prostatitis ||
      !!testiclesSection.infections.epididymitis ||
      (testiclesSection.infections.categoryIdPrevInfections ?? 0) > 0 ||
      (testiclesSection.infections.categoryIdDiagnosisOfInfection ?? 0) > 0
    );

    const payload: any = {
      ivfMaleFHId: 0,
      ivfMainId: MainId || 0,
      date: basic?.date ? new Date(basic.date).toISOString() : null,
      providerId: basic?.attendingClinician || 0,
      adiposityCategoryId: Number(basic?.adiposity) || 0,
      generallyHealthyCategoryId: Number(basic?.generallyHealthy) || 0,
      longTermMedication: basic?.longTermMedication || '',
      noOfPregnanciesAchieved: basic?.pregnanciesAchieved ?? 0,
      chromosomeAnalysisCategoryId: Number(chromosomeAnalysisCategoryId) || 0,
      cFTRCarrierCategoryId: Number(basic?.cftrCarrier) || 0,
      general: hasGeneralData ? generalSection : {},
      genetics: hasGeneticsData ? geneticsSection : {},
      testiclesAndSem: hasTesticlesData ? testiclesSection : {},
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
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Fertility History saved successfully',
        });
        // Return to list and refresh
        this.isCreateUpdate = false;
        this.showAdd = false;
        this.loadFertilityHistory(1);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to save Fertility History',
        });
      }
    });
  }

  onAddClick() {
    this.showForm = true;
    // Optionally reset active tab
    this.activeTabId = 1;
  }

  edit(row: any) {
 
  }

  delete(id: any){}
}
