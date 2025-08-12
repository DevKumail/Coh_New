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
    public class PrescriptionModel
    {
        public long MedicationId { get; set; }
        public long? ProviderId { get; set; }

        public string Mrno { get; set; }
        public long? AppointmentId { get; set; }
  
        public long? DrugId { get; set; }

        public string Rx { get; set; }

        public string Dose { get; set; }
     
        public string Route { get; set; }
  
        public string Frequency { get; set; }
        public int? Duration { get; set; }
  
        public string Dispense { get; set; }
      
        public string Quantity { get; set; }
        public bool IsRefill { get; set; }
    
        public string AdditionalRefills { get; set; }
   
        public string PrescriptionDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? StopDate { get; set; }
      
        public string Samples { get; set; }
        
        public string Instructions { get; set; }
 
        public string Indications { get; set; }
     
        public string Comments { get; set; }
     
        public string UpdateBy { get; set; }

        public DateTime? UpdateDate { get; set; }
   
        public string GcnSeqno { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string Status { get; set; }

        public string StatusReason { get; set; }
        public Guid? SendToLabId { get; set; }
        
        public string Ndc { get; set; }
        public DateTime? ReviewedDate { get; set; }
        
        public DateTime? ReviewedBy { get; set; }
        public long? ParentMedicationId { get; set; }
        public int? OriginalRefillCount { get; set; }
        public string AlertOverrideReason { get; set; }
        public string OutSideClinicProviderName { get; set; }
        public bool? IsSigned { get; set; }
    
        public string OldMrno { get; set; }
        public long? MedicationGivenById { get; set; }
        public DateTime? GivenDate { get; set; }
        public long? MedicationCheckedById { get; set; }
        public DateTime? CheckedDate { get; set; }
        public bool IsSubmitted { get; set; }
        public int? SubmissionBatchId { get; set; }
    
        public string ErxId { get; set; }

        public string DhpoRouteId { get; set; }
        public int? EncounterType { get; set; }
        public bool? IsInternal { get; set; }
        public int? PharmacyEmailId { get; set; }
        public byte PickupTypeId { get; set; }
        public string providerDescription { get; set; }
        public string GivenBy { get; set; }
    }
}
