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
        public List<GetEventDetailDto> Events { get; set; }
        public List<GetMasterPrescriptionDetailDto> PrescriptionMaster { get; set; }
    }

    public class GetEventDetailDto
    {
        public long? EventId { get; set; }
        public long? EventTypeCategoryId { get; set; }
        public DateTime? EventStartDate { get; set; }
        public DateTime? EventEndDate { get; set; }
    }

    public class GetMasterPrescriptionDetailDto 
    {
        public long? IVFPrescriptionMasterId { get; set; }
        public long? DrugId { get; set; }
        public List<GetPrescriptionDetailDto> Prescription { get; set; }
    }

    public class GetPrescriptionDetailDto
    {
        public long? IVFPrescriptionId { get; set; }
        public DateTime? PrescriptionStartDate { get; set; }
        public DateTime? PrescriptionEndDate { get; set; }
    }
}
