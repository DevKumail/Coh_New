using System;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class DashboardReadDTO
    {
        public FemaleDemographicDTO Female { get; set; } // null if absent
        public MaleDemographicDTO Male { get; set; }     // null if absent
    }

    public class FemaleDemographicDTO : BaseDemographicDTO { }
    public class MaleDemographicDTO : BaseDemographicDTO { }

    public class BaseDemographicDTO
    {
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? AgeYears { get; set; }
        public int MrNo { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string EID { get; set; }
        public string Nationality { get; set; }
        public System.Byte[]  Picture { get; set; }
        public string Gender { get; set; }
    }

}
