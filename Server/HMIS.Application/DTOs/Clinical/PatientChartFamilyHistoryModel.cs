using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Clinical
{
    public class PatientChartFamilyHistoryModel
    {
        
        public long? Id { get; set; }

        public long? fhid { get; set; }
        public long? shid { get; set; }
        public long? chartId { get; set; }
        public string? relationShipId { get; set; }
        public string? fhitem { get; set; }
        public long? shitem { get; set; }
        public string? mrno { get; set; }
        public long? AppointmentId { get; set; }
        public long? createdBy { get; set; }
        public DateTime? createdDate { get; set; }
        public int? updatedBy { get; set; }
        public DateTime? updatedDate { get; set; }

        public bool? active { get; set; }
        public bool? isProblemChecked { get; set; }

        public string? observationCode { get; set; }
        public long? patientId { get; set; }
        public long? providerId { get; set; }
        public string? shname { get; set; }

        public DateTime? endDate { get; set; }
        public DateTime? startDate{ get; set; }

        public string? VisitAccountNo { get; set; }




    }
}
