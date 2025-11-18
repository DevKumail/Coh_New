namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFMaleFertilityHistoryReadDTO
    {
        // Basic
        public int? IVFMaleFHId { get; set; }
        public int? IVFMainId { get; set; }
        public DateTime? Date { get; set; }
        public int? ProviderId { get; set; }

        public long? AdiposityCategoryId { get; set; }
        public string? AdiposityValueName { get; set; }

        public long? GenerallyHealthyCategoryId { get; set; }
        public string? GenerallyHealthyValueName { get; set; }

        public string? LongTermMedication { get; set; }
        public int? NoOfPregnanciesAchieved { get; set; }

        public long? ChromosomeAnalysisCategoryId { get; set; }
        public string? ChromosomeAnalysisValueName { get; set; }

        public long? CFTRCarrierCategoryId { get; set; }
        public string? CFTRCarrierValueName { get; set; }

        // Prev Illness
        public long? PrevIllnessCategoryId { get; set; }
        public string? PrevIllnessValue { get; set; }

        // Impairment Factor
        public long? ImpairmentFactorId { get; set; }
        public string? ImpairmentFactorValue { get; set; }

        // Semen Analysis
        public int? IVFMaleFHSemenAnalysisId { get; set; }
        public DateTime? SemenAnalysisDate { get; set; }
        public int? SemenAnalysisID { get; set; }
        public int? MotileNo { get; set; }
        public string? CollectionMethod { get; set; }
        public decimal? ConcentrationNative { get; set; }
        public decimal? ConcentrationAfterPrep { get; set; }
        public decimal? OverallMotilityNative { get; set; }
        public decimal? OverallMotilityPrep { get; set; }
        public decimal? ProgressiveMotilityNativ { get; set; }
        public decimal? ProgressiveMotilityPrep { get; set; }
        public decimal? NormalFormsNative { get; set; }
        public decimal? NormalFormsPrep { get; set; }

        // General
        public int? IVFMaleFHGeneralId { get; set; }
        public bool? HasChildren { get; set; }
        public int? Girls { get; set; }
        public int? Boys { get; set; }
        public string? InfertileSince { get; set; }
        public bool? AndrologicalDiagnosisPerformed { get; set; }
        public DateTime? GeneralDate { get; set; }

        public long? InfertilityTypeCategoryId { get; set; }
        public string? InfertilityTypeValueName { get; set; }

        // Illness
        public int? IVFMaleFHIllnessId { get; set; }
        public bool? Idiopathic { get; set; }
        public bool? MumpsAfterPuberty { get; set; }

        public long? EndocrinopathiesCategoryId { get; set; }
        public string? EndocrinopathiesValueName { get; set; }

        public long? PreviousTumorCategoryId { get; set; }
        public string? PreviousTumorValueName { get; set; }

        public bool? Hepatitis { get; set; }
        public string? HepatitisDetails { get; set; }
        public bool? ExistingAllergies { get; set; }
        public string? ExistingAllergiesDetails { get; set; }
        public string? ChronicIllnesses { get; set; }
        public string? OtherDiseases { get; set; }

        // Idiopathic value (from junction)
        public string? IdiopathicValue { get; set; }

        // Performed Treatment
        public int? IVFMaleFHPerformedTreatmentId { get; set; }
        public bool? AlreadyTreated { get; set; }
        public string? Notes { get; set; }
        public int? IVFMaleFHPerformedTreatmentYearId { get; set; }
        public string? TreatmentType { get; set; }
        public int? TreatmentNumber { get; set; }
        public string? Year { get; set; }

        // Further Planning
        public int? IVFMaleFHFurtherPlanningId { get; set; }
        public bool? SemenAnalysis { get; set; }
        public bool? MorphologicalExamination { get; set; }
        public bool? SerologicalExamination { get; set; }
        public bool? AndrologicalUrologicalConsultation { get; set; }
        public bool? DNAFragmentation { get; set; }
        public bool? SpermFreezing { get; set; }

        // Testicles and Semen
        public int? IVFMaleFHTesticlesAndSemId { get; set; }
        public bool? PrimaryHypogonadotropy { get; set; }
        public bool? SecondaryHypogonadotropy { get; set; }
        public bool? RetractileTestes { get; set; }
        public string? TesticleVolumeLeft { get; set; }
        public string? TesticleVolumeRight { get; set; }
        public bool? Varicocele { get; set; }
        public bool? OperatedVaricocele { get; set; }
        public bool? Inflammation { get; set; }
        public string? Note { get; set; }

        public long? CategoryIdTesticle { get; set; }
        public string? CategoryTesticleName { get; set; }

        public long? CategoryIdKryptorchidism { get; set; }
        public string? CategoryKryptorchidismName { get; set; }

        public long? CategoryIdOrchitis { get; set; }
        public string? CategoryOrchitisName { get; set; }

        public long? CategoryIdInstrumentalVaricocele { get; set; }
        public string? CategoryInstrumentalVaricoceleName { get; set; }

        public long? CategoryIdClinicalVaricocele { get; set; }
        public string? CategoryClinicalVaricoceleName { get; set; }

        public long? CategoryIdProximalSeminalTract { get; set; }
        public string? CategoryProximalSeminalTractName { get; set; }

        public long? CategoryIdDistalSeminalTract { get; set; }
        public string? CategoryDistalSeminalTractName { get; set; }

        public long? CategoryIdEtiologicalDiagnosis { get; set; }
        public string? CategoryEtiologicalDiagnosisName { get; set; }

        // Infections
        public int? IVFMaleFHInfectionsId { get; set; }
        public bool? Urethritis { get; set; }
        public bool? Prostatitis { get; set; }
        public bool? Epididymitis { get; set; }
        public string? PrevInfectionsName { get; set; }
        public string? DiagnosisOfInfectionName { get; set; }

        // Genetics
        public string? Genetics { get; set; }
        public string? MedicalOpinion { get; set; }
        public long? CategoryIdInheritance { get; set; }
        public string? InheritanceValueName { get; set; }
    }
}
