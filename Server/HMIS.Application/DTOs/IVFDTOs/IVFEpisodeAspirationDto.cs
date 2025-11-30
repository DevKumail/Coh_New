using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFEpisodeAspirationDto
    {
        public long? AspirationId { get; set; }
        public int? IVFDashboardTreatmentCycleId { get; set; }
        public int? StatusId { get; set; }

        public IVFEpisodeAspirationOocyteRetrievalDto? OocyteRetrieval { get; set; }
        public IVFEpisodeAspirationFurtherDetailsDto? FurtherDetails { get; set; }
    }

    public class IVFEpisodeAspirationOocyteRetrievalDto
    {
        public long? OocyteRetrievalId { get; set; }
        public long? AspirationId { get; set; }

        public DateTime? RetrievalDate { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }

        public int? CollectedOocytes { get; set; }
        public int? EmptyCumuli { get; set; }
        public bool? PoorResponseToDrugs { get; set; }

        public long? RetrievalTechniqueCategoryId { get; set; }
        public long? AnesthesiaCategoryId { get; set; }
        public long? PrimaryComplicationsCategoryId { get; set; }
        public long? FurtherComplicationsCategoryId { get; set; }
        public long? PrimaryMeasureCategoryId { get; set; }
        public long? FurtherMeasureCategoryId { get; set; }

        public long? OperatingProviderId { get; set; }
        public long? EmbryologistId { get; set; }
        public long? AnesthetistId { get; set; }
        public long? NurseId { get; set; }

        public string? Note { get; set; }
    }

    public class IVFEpisodeAspirationFurtherDetailsDto
    {
        public long? FurtherDetailsId { get; set; }
        public long? AspirationId { get; set; }

        public long? AspirationSystemCategoryId { get; set; }
        public int? LeadingFollicleSize { get; set; }
        public int? NoOfWashedFollicles { get; set; }
        public bool? FolliclesWashed { get; set; }

        public int? RetrievedFolliclesTotal { get; set; }
        public int? RetrievedFolliclesLeft { get; set; }
        public int? RetrievedFolliclesRight { get; set; }

        public int? TotalDoseAdministeredLh { get; set; }
        public int? TotalDoseAdministeredFsh { get; set; }
        public int? TotalDoseAdministeredHmg { get; set; }

        public long? GeneralConditionCategoryId { get; set; }
        public long? MucousMembraneCategoryId { get; set; }

        public decimal? Temperature { get; set; }

        public decimal? BeforeOocyteRetrievalPulse { get; set; }
        public decimal? BeforeOocyteRetrievalBloodPressureSystolic { get; set; }
        public decimal? BeforeOocyteRetrievalBloodPressureDiastolic { get; set; }

        public decimal? AnaesthetistPulse { get; set; }
        public decimal? AnaesthetistBloodPressureSystolic { get; set; }
        public decimal? AnaesthetistBloodPressureDiastolic { get; set; }

        public string? Note { get; set; }
    }

    public class IVFEpisodeAspirationListItemDto
    {
        public long AspirationId { get; set; }
        public int IVFDashboardTreatmentCycleId { get; set; }
        public DateTime? RetrievalDate { get; set; }
        public int? CollectedOocytes { get; set; }
        public int? EmptyCumuli { get; set; }
        public bool? PoorResponseToDrugs { get; set; }
    }
}
