// DTOs for IVF Male Fertility History

public class IVFMaleFertilityHistoryDto
{
    public int? IVFMaleFHId { get; set; }
    public int IVFMainId { get; set; }
    public DateTime Date { get; set; }
    public long ProviderId { get; set; }
    public string? Adiposity { get; set; }
    public bool? GenerallyHealthy { get; set; }
    public string? LongTermMedication { get; set; }
    public int? NoOfPregnanciesAchieved { get; set; }
    public long? ChromosomeAnalysisCategoryId { get; set; }
    public string? CFTRCarrier { get; set; }

    // Navigation Properties
    public IVFMaleFHGeneralDto? General { get; set; }
    public IVFMaleFHGeneticsDto? Genetics { get; set; }
    public IVFMaleFHTesticlesAndSemDto? TesticlesAndSem { get; set; }
    public List<IVFMaleFHImpairmentFactorDto>? ImpairmentFactors { get; set; }
    public List<IVFMaleFHPrevIllnessDto>? PrevIllnesses { get; set; }
    public List<IVFMaleFHSemenAnalysisDto>? SemenAnalyses { get; set; }
}

public class IVFMaleFHGeneralDto
{
    public int? IVFMaleFHGeneralId { get; set; }
    public int IVFMaleFHId { get; set; }
    public bool? HasChildren { get; set; }
    public int? Girls { get; set; }
    public int? Boys { get; set; }
    public string? InfertileSince { get; set; }
    public bool? AndrologicalDiagnosisPerformed { get; set; }
    public DateTime? Date { get; set; }
    public string? InfertilityType { get; set; }

    // Navigation Properties
    public IVFMaleFHFurtherPlanningDto? FurtherPlanning { get; set; }
    public IVFMaleFHIllnessDto? Illness { get; set; }
    public IVFMaleFHPerformedTreatmentDto? PerformedTreatment { get; set; }
}

public class IVFMaleFHFurtherPlanningDto
{
    public int? IVFMaleFHFurtherPlanningId { get; set; }
    public int IVFMaleFHGeneralId { get; set; }
    public bool SemenAnalysis { get; set; }
    public bool MorphologicalExamination { get; set; }
    public bool SerologicalExamination { get; set; }
    public bool AndrologicalUrologicalConsultation { get; set; }
    public bool DNAFragmentation { get; set; }
    public bool SpermFreezing { get; set; }
}

public class IVFMaleFHGeneticsDto
{
    public int? IVFMaleFHGeneticsId { get; set; }
    public int? IVFMaleFHId { get; set; }
    public string? Genetics { get; set; }
    public long? CategoryIdInheritance { get; set; }
    public string? MedicalOpinion { get; set; }
}

public class IVFMaleFHTesticlesAndSemDto
{
    public int? IVFMaleFHTesticlesAndSemId { get; set; }
    public int? IVFMaleFHId { get; set; }
    public bool? PrimaryHypogonadotropy { get; set; }
    public bool? SecondaryHypogonadotropy { get; set; }
    public bool? RetractileTestes { get; set; }
    public long? CategoryIdTesticle { get; set; }
    public long? CategoryIdKryptorchidism { get; set; }
    public long? CategoryIdOrchitis { get; set; }
    public string? TesticleVolumeLeft { get; set; }
    public string? TesticleVolumeRight { get; set; }
    public bool? Varicocele { get; set; }
    public bool? OperatedVaricocele { get; set; }
    public long? CategoryIdInstrumentalVaricocele { get; set; }
    public long? CategoryIdClinicalVaricocele { get; set; }
    public bool? ObstipationOfSpermaticDuct { get; set; }
    public long? CategoryIdProximalSeminalTract { get; set; }
    public long? CategoryIdDistalSeminalTract { get; set; }
    public long? CategoryIdEtiologicalDiagnosis { get; set; }
    public bool? Inflammation { get; set; }
    public string? Note { get; set; }

    // Navigation Properties
    public IVFMaleFHInfectionsDto? Infections { get; set; }
}

public class IVFMaleFHInfectionsDto
{
    public int? IVFMaleFHInfectionsId { get; set; }
    public int IVFMaleFHTesticlesAndSemId { get; set; }
    public bool? Urethritis { get; set; }
    public bool? Prostatitis { get; set; }
    public bool? Epididymitis { get; set; }
    public long CategoryIdPrevInfections { get; set; }
    public long CategoryIdDiagnosisOfInfection { get; set; }
}

public class IVFMaleFHIllnessDto
{
    public int? IVFMaleFHIllnessId { get; set; }
    public int? IVFMaleFHGeneralId { get; set; }
    public bool? Idiopathic { get; set; }
    public bool? MumpsAfterPuberty { get; set; }
    public string? Endocrinopathies { get; set; }
    public string? PreviousTumor { get; set; }
    public bool? Hepatitis { get; set; }
    public string? HepatitisDetails { get; set; }
    public bool? ExistingAllergies { get; set; }
    public string? ExistingAllergiesDetails { get; set; }
    public string? ChronicIllnesses { get; set; }
    public string? OtherDiseases { get; set; }

    // Navigation Properties
    public List<int>? IdiopathicIds { get; set; }
}

public class IVFMaleFHPerformedTreatmentDto
{
    public int? IVFMaleFHPerformedTreatmentId { get; set; }
    public int IVFMaleFHGeneralId { get; set; }
    public bool? AlreadyTreated { get; set; }
    public string? Notes { get; set; }

    // Navigation Properties
    public List<IVFMaleFHPerformedTreatmentYearDto>? TreatmentYears { get; set; }
}

public class IVFMaleFHPerformedTreatmentYearDto
{
    public int? IVFMaleFHPerformedTreatmentYearId { get; set; }
    public int IVFMaleFHPerformedTreatmentId { get; set; }
    public string? TreatmentType { get; set; }
    public int? TreatmentNumber { get; set; }
    public string? Year { get; set; }
}

public class IVFMaleFHImpairmentFactorDto
{
    public int? IVFMaleFHImpairmentFactorId { get; set; }
    public int IVFMaleFHId { get; set; }
    public string? ImpairmentFactor { get; set; }
}

public class IVFMaleFHPrevIllnessDto
{
    public int? IVFMaleFHPrevIllnessId { get; set; }
    public int IVFMaleFHId { get; set; }
    public string ICDCode { get; set; }
}

public class IVFMaleFHSemenAnalysisDto
{
    public int? IVFMaleFHSemenAnalysisId { get; set; }
    public int IVFMaleFHId { get; set; }
    public DateTime? Date { get; set; }
    public int? ID { get; set; }
    public string? MotileNo { get; set; }
    public string? CollectionMethod { get; set; }
    public string? ConcentrationNative { get; set; }
    public string? ConcentrationAfterPrep { get; set; }
    public string? OverallMotilityNative { get; set; }
    public string? OverallMotilityPrep { get; set; }
    public string? ProgressiveMotilityNativ { get; set; }
    public string? ProgressiveMotilityPrep { get; set; }
    public string? NormalFormsNative { get; set; }
    public string? NormalFormsPrep { get; set; }
}