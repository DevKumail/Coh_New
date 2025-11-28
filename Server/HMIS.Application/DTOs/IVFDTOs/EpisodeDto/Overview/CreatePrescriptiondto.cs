using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview
{
    public class CreatePrescriptiondto
    {
        public long IVFPrescriptionMasterId { get; set; }
        public long DrugId { get; set; }
        public long AppointmentId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
