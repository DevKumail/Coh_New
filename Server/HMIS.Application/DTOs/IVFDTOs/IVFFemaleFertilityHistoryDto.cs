using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFFemaleFertilityHistoryDto
    {
        public int? IVFFemaleFHId { get; set; }
        public int? IVFMainId { get; set; }
        public DateTime? Date { get; set; }
        public int? ProviderId { get; set; }
        public string? UnprotectedIntercourseYear { get; set; }
        public string? UnprotectedIntercourseMonth { get; set; }
        public long? AdiposityCategoryId { get; set; }
        public long? GenerallyHealthyCategoryId { get; set; }
        public string? LongTermMedication { get; set; }
        public string? Comment { get; set; }

        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        public List<FemaleImpairmentFactorDto>? ImpairmentFactors { get; set; }
        public List<FemalePrevIllnessDto>? PrevIllnesses { get; set; }
    }

    public class FemaleImpairmentFactorDto
    {
        // ICD9/ICD10 or code value that maps to BlmasterIcd9cm.ImpairmentFactor (string)
        public string? ImpairmentFactor { get; set; }
    }

    public class FemalePrevIllnessDto
    {
        // ICD9/ICD10 or code value that maps to BlmasterIcd9cm.PrevIllness (string)
        public string? PrevIllness { get; set; }
    }
}
