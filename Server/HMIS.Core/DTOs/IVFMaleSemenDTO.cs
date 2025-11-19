namespace HMIS.Core.DTOs
{
    public class IVFMaleSemenSampleDto
    {
        public int SampleId { get; set; }
        public int IVFMainId { get; set; }
        public string SampleCode { get; set; }
        public DateTime CollectionDateTime { get; set; }
        public DateTime? ThawingDateTime { get; set; }
        public long? PurposeId { get; set; }
        public long? CollectionMethodId { get; set; }
        public long? CollectionPlaceId { get; set; }
        public string CollectionDifficulties { get; set; }
        public string AbstinencePeriod { get; set; }
        public TimeOnly? AnalysisStartTime { get; set; }
        public long? AnalyzedById { get; set; }
        public long? AppearanceId { get; set; }
        public long? SmellId { get; set; }
        public long? ViscosityId { get; set; }
        public int? LiquefactionMinutes { get; set; }
        public bool? Agglutination { get; set; }
        public string TreatmentNotes { get; set; }
        public string Score { get; set; }
        public decimal? DNAFragmentedPercent { get; set; }
        public TimeOnly? TimeBetweenCollectionUsage { get; set; }
        public decimal? InseminationMotileSperms { get; set; }
        public decimal? InseminatedAmountML { get; set; }
        public decimal? Motility24hPercent { get; set; }
        public int? CryoStatusId { get; set; }
        public int? StatusId { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public List<IVFMaleSemenObservationDto> Observations { get; set; }
        public List<IVFMaleSemenSampleDiagnosisDto> Diagnoses { get; set; }
        public IVFMaleSemenSampleApprovalStatusDto ApprovalStatus { get; set; }
    }

    public class IVFMaleSemenObservationDto
    {
        public int ObservationId { get; set; }
        public int SampleId { get; set; }
        public string ObservationType { get; set; }
        public decimal? VolumeML { get; set; }
        public decimal? PHValue { get; set; }
        public decimal? ConcentrationPerML { get; set; }
        public bool? ConcLessThanPointOne { get; set; }
        public decimal? VitalityPercent { get; set; }
        public decimal? Leukocytesml { get; set; }
        public decimal? RoundCellsml { get; set; }
        public long? QuantificationPossibleId { get; set; }
        public int? TotalSpermCount { get; set; }
        public decimal? PeroxidasePositive { get; set; }
        public decimal? ImmunobeadAdherentPercent { get; set; }
        public decimal? MARTesPercent { get; set; }
        public decimal? MAR_IgG_Percent { get; set; }
        public decimal? MAR_IgA_Percent { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public IVFMaleSemenMotilityDto Motility { get; set; }
        public IVFMaleSemenMorphologyDto Morphology { get; set; }
        public List<IVFMaleSemenObservationPreparationDto> Preparations { get; set; }
    }

    public class IVFMaleSemenMotilityDto
    {
        public int MotilityId { get; set; }
        public int ObservationId { get; set; }
        public decimal? WHO_AB_Percent { get; set; }
        public decimal? WHO_C_Percent { get; set; }
        public decimal? WHO_D_Percent { get; set; }
        public int? ProgressiveMotile { get; set; }
        public decimal? OverallMotilityPercent { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class IVFMaleSemenMorphologyDto
    {
        public int MorphologyId { get; set; }
        public int ObservationId { get; set; }
        public decimal? MorphologyNormalPercent { get; set; }
        public decimal? HeadDefectsPercent { get; set; }
        public decimal? NeckMidpieceDefectsPercent { get; set; }
        public decimal? TailDefectsPercent { get; set; }
        public decimal? ERCPercent { get; set; }
        public decimal? MultipleDefectsPercent { get; set; }
        public decimal? TeratozoospermiaIndex { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class IVFMaleSemenObservationPreparationDto
    {
        public int PreparationId { get; set; }
        public int ObservationId { get; set; }
        public DateOnly PreparationDate { get; set; }
        public TimeOnly PreparationTime { get; set; }
        public int? PreparedById { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public List<IVFMaleSemenObservationPreparationMethodDto> PreparationMethods { get; set; }
    }

    public class IVFMaleSemenObservationPreparationMethodDto
    {
        public long Id { get; set; }
        public long PreparationId { get; set; }
        public long PreparationMethodId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class IVFMaleSemenSampleDiagnosisDto
    {
        public int DiagnosisId { get; set; }
        public int SampleId { get; set; }
        public string ICDCode { get; set; }
        public string Finding { get; set; }
        public string Notes { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class IVFMaleSemenSampleApprovalStatusDto
    {
        public int ApprovalStatusId { get; set; }
        public int SampleId { get; set; }
        public bool IsApproved { get; set; }
        public bool IsAttention { get; set; }
        public long? AttentionForId { get; set; }
        public string Comment { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class IVFMaleSemenSampleListDto
    {
        public int SampleId { get; set; }
        public string SampleCode { get; set; }
        public DateTime CollectionDateTime { get; set; }
        public DateTime? ThawingDateTime { get; set; }
        public string Purpose { get; set; }
        public string CollectionMethod { get; set; }
        public decimal? VolumeML { get; set; }
        public decimal? ConcentrationPerML { get; set; }
        public int? TotalSpermCount { get; set; }
        public decimal? WHO_AB_Percent { get; set; }
        public decimal? WHO_C_Percent { get; set; }
        public decimal? WHO_D_Percent { get; set; }
        public decimal? MorphologyNormalPercent { get; set; }
        public string CryoStatus { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}