using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview
{
    public class GetAllOverviewDetailDto
    {
        public long OverviewId { get; set; }
        public DateTime DateOfLmp { get; set; }
        public List<GetCalenderDto> Calender { get; set; }
        public List<GetResourcesDetailDto> Resources { get; set; }
    }

    public class GetResourcesDetailDto
    {
        public List<GetSidebarMedicationDto> AllMedications { get; set; }
    }

    public class GetSidebarMedicationDto
    {
        public long DrugId { get; set; }
        public string DrugName { get; set; }
    }

    public class GetCalenderDto
    {
        public List<GetEventDetailDto> Events { get; set; }
        public List<GetMedicationDto> Medications { get; set; }
        public List<GetUltraSound> UltraSound { get; set; }
    }

    public class GetEventDetailDto
    {
        public long? EventId { get; set; }
        public string? EventType { get; set; }
        public DateTime? EventStartDate { get; set; }
        public DateTime? EventEndDate { get; set; }
    }

    public class GetMedicationDto
    {
        public long MedicationId { get; set; }
        public long DrugId { get; set; }
        public string DrugName { get; set; }
        public string Code { get; set; }
        public string Color { get; set; }
        public List<GetApplicationDomainDto> ApplicationDomainName { get; set; } = new();
        public DateTime? StartDate { get; set; }
        public DateTime? StopDate { get; set; }
        public List<GetTimeDetailsDto> TimeDetails { get; set; } = new();
        public string Frequency { get; set; }
        public string Dose { get; set; }
        public string RouteId { get; set; }
        public string RouteName { get; set; }
        public string Quantity { get; set; }
        public string AdditionalRefills { get; set; }
        public string Samples { get; set; }
        public string Substitution { get; set; }
        public string Instructions { get; set; }
        public string IndicationsId { get; set; }
        public string Indications { get; set; }
    }

    public class GetTimeDetailsDto
    {
        public long TimeId { get; set; }
        public TimeSpan Time { get; set; }
    }

    public class GetApplicationDomainDto
    {
        public long ApplicationDomainId { get; set; }
        public string ApplicationDomainName { get; set; }
    }

    public class GetUltraSound
    {
        public long IVFLabOrderSetId { get; set; }
        public long OrderSetId { get; set; }
        public string CreatedDate { get; set; }
        public long LabResultId { get; set; }

    }
}
