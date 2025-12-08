using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFEpisodeBirthDto
    {
        public long? BirthId { get; set; }
        public int? IVFDashboardTreatmentCycleId { get; set; }
        public int? StatusId { get; set; }
        
        public int? ChildrenCount {get;set;}
        public List<IVFEpisodeBirthChildDto>? Children { get; set; }
    }

    public class IVFEpisodeBirthChildDto
    {
        public long? Id { get; set; }
        public long? BirthId { get; set; }

        public DateTime? DateOfBirth { get; set; }
        public int? Week { get; set; }
        public int? GenderId { get; set; }
        public long? DeliveryMethodCategoryId { get; set; }
        public int? Weight { get; set; }
        public int? Length { get; set; }
        public int? HeadCircumference { get; set; }
        public int? Apgar1 { get; set; }
        public int? Apgar5 { get; set; }
        public DateTime? DeathPostPartumOn { get; set; }
        public DateTime? DiedPerinatallyOn { get; set; }
        public string? FirstName { get; set; }
        public string? Surname { get; set; }
        public string? PlaceOfBirth { get; set; }
        public int? CountryId { get; set; }
        public string? Note { get; set; }

        public List<string>? ChromosomeAnomalyCategoryIds { get; set; }
        public List<string>? CongenitalMalformationCategoryIds { get; set; }
    }

    public class IVFEpisodeBirthListItemDto
    {
        public long Id { get; set; }
        public long BirthId { get; set; }
        public int IVFDashboardTreatmentCycleId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int? GenderId { get; set; }
        public int? Week { get; set; }
        public int? Weight { get; set; }
    }
}
