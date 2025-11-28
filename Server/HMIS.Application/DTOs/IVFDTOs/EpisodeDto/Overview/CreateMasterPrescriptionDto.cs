using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview
{
    public class CreateMasterPrescriptionDto
    {
        public long IVFPrescriptionMasterId { get; set; }
        public long OverviewId { get; set; }
        public long DrugId { get; set; }
    }
}
