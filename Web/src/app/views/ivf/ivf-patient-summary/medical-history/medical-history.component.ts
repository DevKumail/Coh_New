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
import { LoaderService } from '@core/services/loader.service';

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

  // Track current record and section IDs when editing
  private currentFhId: number | null = null;
  private currentIds: {
    generalId?: number | null,
    illnessId?: number | null,
    furtherPlanningId?: number | null,
    performedTreatmentId?: number | null,
    geneticsId?: number | null,
    testiclesId?: number | null,
    infectionsId?: number | null,
  } = {};

  @ViewChild(MedicalHistoryBasicComponent) basicTab?: MedicalHistoryBasicComponent;
  @ViewChild(MedicalHistoryGeneralComponent) generalTab?: MedicalHistoryGeneralComponent;
  @ViewChild(MedicalHistoryGeneticsComponent) geneticsTab?: MedicalHistoryGeneticsComponent;
  @ViewChild(MedicalHistoryTesticlesComponent) testiclesTab?: MedicalHistoryTesticlesComponent;

  constructor(
    private fb: FormBuilder,
    private ivfservice: IVFApiService,
    private patientBannerService: PatientBannerService,
    private sharedservice: SharedService,
    private loderService: LoaderService

  ) {}


  ngOnInit(): void {
    this.getAlldropdown();
    // Load list by default
    this.loadFertilityHistory();
  }

  openEditById(ivfMaleFHId: number) {
    this.isCreateUpdate = true;
    this.showAdd = true;
    this.loderService.show();
    this.ivfservice.getFertilityHistoryById(ivfMaleFHId).subscribe({
      next: (res: any) => {
        const fh = res?.fertilityHistory || res;
        // Wait a tick to ensure child views are created
        setTimeout(() => this.patchFertilityHistory(fh), 0);
        this.loderService.hide();
      },
      error: () => {
        this.loderService.hide();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong',
        });
      }
    });
  }

  private patchFertilityHistory(fh: any) {
    if (!fh) return;
    // capture IDs for update
    this.currentFhId = fh?.ivfMaleFHId ?? null;
    this.currentIds = {
      generalId: fh?.general?.ivfMaleFHGeneralId ?? null,
      illnessId: fh?.general?.illness?.ivfMaleFHIllnessId ?? null,
      furtherPlanningId: fh?.general?.furtherPlanning?.ivfMaleFHFurtherPlanningId ?? null,
      performedTreatmentId: fh?.general?.performedTreatment?.ivfMaleFHPerformedTreatmentId ?? null,
      geneticsId: fh?.genetics?.ivfMaleFHGeneticsId ?? null,
      testiclesId: fh?.testiclesAndSem?.ivfMaleFHTesticlesAndSemId ?? null,
      infectionsId: fh?.testiclesAndSem?.infections?.ivfMaleFHInfectionsId ?? null,
    };
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
    const years = Array.isArray(pt?.treatmentYears) ? pt.treatmentYears : [];
    const getYear = (type: string, num: number) => {
      const it = years.find((y: any) => (y?.treatmentType === type) && (Number(y?.treatmentNumber) === num));
      return it?.year ?? '';
    };
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
      // Performed treatment years (edit)
      antiInflammatory1: getYear('Anti-inflammatory', 1),
      antiInflammatory2: getYear('Anti-inflammatory', 2),
      antiInflammatory3: getYear('Anti-inflammatory', 3),
      hormonalTreatment1: getYear('Hormonal treatment', 1),
      hormonalTreatment2: getYear('Hormonal treatment', 2),
      hormonalTreatment3: getYear('Hormonal treatment', 3),
      surgicalTreatment1: getYear('Surgical treatment', 1),
      surgicalTreatment2: getYear('Surgical treatment', 2),
      surgicalTreatment3: getYear('Surgical treatment', 3),
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
        inheritance: ge?.categoryIdInheritance ?? '',
        editorContent: ge?.medicalOpinion ?? ''
      });
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
            this.historyRows = res?.fertilityHistory?.data|| [];
            this.totalrecord = res?.fertilityHistory?.totalCount || 0;
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
    this.PaginationInfo.Page = event;
    this.loadFertilityHistory(event);
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
    this.loderService.show();
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

    const toNumOrNull = (v: any): number | null => (v === '' || v === undefined || v === null ? null : Number(v));
    const chromosomeAnalysisCategoryId = basic?.chromosomeAnalysis ?? null;
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
      ivfMaleFHGeneralId: this.currentIds.generalId ?? 0,
      ivfMaleFHId: this.currentFhId ?? 0,
      hasChildren: !!general?.hasChildren,
      girls: general?.girls ?? 0,
      boys: general?.boys ?? 0,
      infertileSince: general?.infertileSince || '',
      andrologicalDiagnosisPerformed: !!general?.andrologicalDiagnosisPerformed,
      date: general?.andrologicalDiagnosisDate ? new Date(general.andrologicalDiagnosisDate).toISOString() : null,
      infertilityTypeCategoryId: toNumOrNull(general?.infertilityType),
      furtherPlanning: {
        ivfMaleFHFurtherPlanningId: this.currentIds.furtherPlanningId ?? 0,
        ivfMaleFHGeneralId: this.currentIds.generalId ?? 0,
        semenAnalysis: !!general?.semenAnalysis,
        morphologicalExamination: !!general?.morphologicalExamination,
        serologicalExamination: !!general?.serologicalExamination,
        andrologicalUrologicalConsultation: !!general?.andrologicalUrologicalConsultation,
        dnaFragmentation: !!general?.dnaFragmentation,
        spermFreezing: !!general?.spermFreezing
      },
      illness: {
        ivfMaleFHIllnessId: this.currentIds.illnessId ?? 0,
        ivfMaleFHGeneralId: this.currentIds.generalId ?? 0,
        idiopathic: !!general?.idiopathic,
        mumpsAfterPuberty: !!general?.mumpsAfterPuberty,
        endocrinopathiesCategoryId: toNumOrNull(general?.endocrinopathies),
        previousTumorCategoryId: toNumOrNull(general?.previousTumor),
        hepatitis: !!general?.hepatitis,
        hepatitisDetails: general?.hepatitisDetail || '',
        existingAllergies: !!general?.existingAllergies,
        existingAllergiesDetails: general?.existingAllergiesDetail || '',
        chronicIllnesses: general?.chronicIllnesses || '',
        otherDiseases: general?.otherDiseases || '',
        idiopathicIds: Array.isArray(general?.idiopathicSelections) ? general.idiopathicSelections : []
      },
      performedTreatment: {
        ivfMaleFHPerformedTreatmentId: this.currentIds.performedTreatmentId ?? 0,
        ivfMaleFHGeneralId: this.currentIds.generalId ?? 0,
        alreadyTreated: !!general?.alreadyTreated,
        notes: general?.treatmentNote || '',
        treatmentYears: [] as any[]
      }
    };

    // Build treatmentYears from three groups if fields are present; year comes from the corresponding input value
    const treatmentYears: any[] = [];
    const pushIf = (treatmentType: string, number: number, val: any) => {
      const year = (val ?? '').toString().trim();
      if (year.length > 0) {
        treatmentYears.push({
          ivfMaleFHPerformedTreatmentYearId: 0,
          ivfMaleFHPerformedTreatmentId: this.currentIds.performedTreatmentId ?? 0,
          treatmentType,
          treatmentNumber: number,
          year
        });
      }
    };
    // Anti-inflammatory 1..3
    pushIf('Anti-inflammatory', 1, (general as any)?.antiInflammatory1);
    pushIf('Anti-inflammatory', 2, (general as any)?.antiInflammatory2);
    pushIf('Anti-inflammatory', 3, (general as any)?.antiInflammatory3);
    // Hormonal treatment 1..3
    pushIf('Hormonal treatment', 1, (general as any)?.hormonalTreatment1);
    pushIf('Hormonal treatment', 2, (general as any)?.hormonalTreatment2);
    pushIf('Hormonal treatment', 3, (general as any)?.hormonalTreatment3);
    // Surgical treatment 1..3
    pushIf('Surgical treatment', 1, (general as any)?.surgicalTreatment1);
    pushIf('Surgical treatment', 2, (general as any)?.surgicalTreatment2);
    pushIf('Surgical treatment', 3, (general as any)?.surgicalTreatment3);
    generalSection.performedTreatment.treatmentYears = treatmentYears;

        // Genetics section from reactive form + editor
    const geneticsRaw = this.geneticsTab?.geneticsForm?.getRawValue?.() || {};
    const geneticsSection = {
      ivfMaleFHGeneticsId: this.currentIds.geneticsId ?? null,
      ivfMaleFHId:  this.currentFhId ?? 0,
      genetics: geneticsRaw?.genes || '',
      categoryIdInheritance: Number(geneticsRaw?.inheritance) || null,
      medicalOpinion: geneticsRaw?.editorContent ||  ''
    };
    const hasGeneticsData = (geneticsSection.medicalOpinion || '').trim().length > 0 || geneticsSection.categoryIdInheritance != null || (geneticsSection.genetics || '').trim().length > 0;


    // Determine if General has any meaningful values
    const hasGeneralData = (
      !!generalSection.hasChildren ||
      (generalSection.girls ?? 0) > 0 ||
      (generalSection.boys ?? 0) > 0 ||
      (generalSection.infertileSince || '').trim().length > 0 ||
      !!generalSection.andrologicalDiagnosisPerformed ||
      !!general?.andrologicalDiagnosisDate ||
      (generalSection.infertilityTypeCategoryId ?? 0) > 0 ||
      !!generalSection.furtherPlanning.semenAnalysis ||
      !!generalSection.furtherPlanning.morphologicalExamination ||
      !!generalSection.furtherPlanning.serologicalExamination ||
      !!generalSection.furtherPlanning.andrologicalUrologicalConsultation ||
      !!generalSection.furtherPlanning.dnaFragmentation ||
      !!generalSection.furtherPlanning.spermFreezing ||
      !!generalSection.illness.idiopathic ||
      !!generalSection.illness.mumpsAfterPuberty ||
      (generalSection.illness.endocrinopathiesCategoryId ?? 0) > 0 ||
      (generalSection.illness.previousTumorCategoryId ?? 0) > 0 ||
      !!generalSection.illness.hepatitis ||
      !!generalSection.illness.existingAllergies ||
      (generalSection.illness.chronicIllnesses || '').trim().length > 0 ||
      (generalSection.illness.otherDiseases || '').trim().length > 0 ||
      (generalSection.illness.idiopathicIds || []).length > 0 ||
      !!generalSection.performedTreatment.alreadyTreated ||
      (generalSection.performedTreatment.notes || '').trim().length > 0
    );
    const testiclesSection = {
      ivfMaleFHTesticlesAndSemId: this.currentIds.testiclesId ?? 0,
      ivfMaleFHId: this.currentFhId ?? 0,
      primaryHypogonadotropy: !!testiclesRaw?.primaryHypogonadotropy,
      secondaryHypogonadotropy: !!testiclesRaw?.secondaryHypogonadotropy,
      retractileTestes: !!testiclesRaw?.retractileTestes,
      categoryIdTesticle: toNumOrNull(testiclesRaw?.categoryIdTesticle),
      categoryIdKryptorchidism: toNumOrNull(testiclesRaw?.categoryIdKryptorchidism),
      categoryIdOrchitis: toNumOrNull(testiclesRaw?.categoryIdOrchitis),
      testicleVolumeLeft: testiclesRaw?.testicleVolumeLeft || '',
      testicleVolumeRight: testiclesRaw?.testicleVolumeRight || '',
      varicocele: !!testiclesRaw?.varicocele,
      operatedVaricocele: !!testiclesRaw?.operatedVaricocele,
      categoryIdInstrumentalVaricocele: toNumOrNull(testiclesRaw?.categoryIdInstrumentalVaricocele),
      categoryIdClinicalVaricocele: toNumOrNull(testiclesRaw?.categoryIdClinicalVaricocele),
      obstipationOfSpermaticDuct: !!testiclesRaw?.obstipationOfSpermaticDuct,
      categoryIdProximalSeminalTract: toNumOrNull(testiclesRaw?.categoryIdProximalSeminalTract),
      categoryIdDistalSeminalTract: toNumOrNull(testiclesRaw?.categoryIdDistalSeminalTract),
      categoryIdEtiologicalDiagnosis: toNumOrNull(testiclesRaw?.categoryIdEtiologicalDiagnosis),
      inflammation: !!(testiclesRaw?.infections?.urethritis || testiclesRaw?.infections?.prostatitis || testiclesRaw?.infections?.epididymitis),
      note: testiclesRaw?.note || '',
      infections: {
        ivfMaleFHInfectionsId: this.currentIds.infectionsId ?? 0,
        ivfMaleFHTesticlesAndSemId: this.currentIds.testiclesId ?? 0,
        urethritis: !!testiclesRaw?.infections?.urethritis,
        prostatitis: !!testiclesRaw?.infections?.prostatitis,
        epididymitis: !!testiclesRaw?.infections?.epididymitis,
        categoryIdPrevInfections: toNumOrNull(testiclesRaw?.infections?.categoryIdPrevInfections),
        categoryIdDiagnosisOfInfection: toNumOrNull(testiclesRaw?.infections?.categoryIdDiagnosisOfInfection),
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
      ivfMaleFHId: this.currentFhId ?? 0,
      ivfMainId: MainId || 0,
      date: basic?.date ? new Date(basic.date).toISOString() : null,
      providerId: toNumOrNull(basic?.attendingClinician),
      adiposityCategoryId: toNumOrNull(basic?.adiposity),
      generallyHealthyCategoryId: toNumOrNull(basic?.generallyHealthy),
      longTermMedication: basic?.longTermMedication || '',
      noOfPregnanciesAchieved: basic?.pregnanciesAchieved ?? 0,
      chromosomeAnalysisCategoryId: toNumOrNull(chromosomeAnalysisCategoryId),
      cFTRCarrierCategoryId: toNumOrNull(basic?.cftrCarrier),
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
        this.loderService.hide();
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
        this.loderService.hide();
      }
    });
  }

  onAddClick() {
    this.showForm = true;
    // Optionally reset active tab
    this.activeTabId = 1;
  }


  delete(id: any){
    if (!id) return;
    Swal.fire({
      title: 'Delete this record?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ivfservice.deleteFertilityHistoryMale(Number(id)).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Deleted', text: 'Record deleted successfully' });
            this.loadFertilityHistory(1);
          },
          error: () => {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete record' });
          }
        });
      }
    });
  }
}
