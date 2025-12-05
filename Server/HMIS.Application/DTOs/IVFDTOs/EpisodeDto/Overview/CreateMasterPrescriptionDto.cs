using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Org.BouncyCastle.Asn1.Cms;

namespace HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview
{
    public class CreateMasterPrescriptionDto
    {
        public long IVFPrescriptionMasterId { get; set; }
        public long MedicationId { get; set; }
        public long OverviewId { get; set; }
        public long DrugId { get; set; }
        public long AppId { get; set; }
        public List<long> ApplicationDomainCategoryId { get; set; }    
        public DateTime StartDate { get; set; }
        public int? XDays { get; set; }
        public List<TimeSpan> Time { get; set; }
        public string DosageFrequency { get; set; }
        public string DailyDosage { get; set; }
        public string RouteCategoryId { get; set; }
        public string Quantity { get; set; }
        public string AdditionalRefills { get; set; }
        public string Samples { get; set; }
        public string Instructions { get; set; }
        public string Indications { get; set; }
        public string Substitution { get; set; }
        public bool InternalOrder { get; set; }
    }

}
