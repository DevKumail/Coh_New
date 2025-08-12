using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Clinical
{
    public class VitalSigns
    {
        public long ID { get;set; }
        public string MRNo { get; set; }
        public long VisitAccountNo { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public int? AgeInMonths { get; set; }
        public string UpdateBy { get; set; }
        public int? BPSystolic { get; set; }
        public int? BPDiastolic { get; set; }
        public int? BPArm { get; set; }
        public int? PulseRate { get; set; }
        public int? HeartRate { get; set; }
        public int? RespirationRate { get; set; }
        public float? Temperature { get; set; }
        public float? Weight { get; set; }
        public float? Height { get; set; }
        public int? BMI { get; set; }
        public int? SPO2 { get; set; }
        public float? Glucose { get; set; }
        public string? Comment { get; set; }
        public long? AppointmentId { get; set; }
    }
}
