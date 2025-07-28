using HMIS.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Clinical
{
    public class AlergyModel
    {
        public long AllergyId { get; set; }
        public long? TypeId { get; set; }
       
        public string Reaction { get; set; }
       
        public DateTime? StartDate { get; set; }
      
        public DateTime? EndDate { get; set; }
        public byte Status { get; set; }
        public bool Active { get; set; }
      
        public long? UpdatedBy { get; set; }
     
        public DateTime UpdatedDate { get; set; }
        public long? ProviderId { get; set; }
       
        public string Mrno { get; set; }
     
        public long? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
       
        public long? SeverityCode { get; set; }
        
        public string Allergen { get; set; }
     
        public bool? IsHl7msgCreated { get; set; }
      
        public DateTime? ReviewedDate { get; set; }
       
        public string ReviewedBy { get; set; }
   
        public string ErrorReason { get; set; }
    
        public string OldMrno { get; set; }
        public bool? IsDeleted { get; set; }
        public long? AppointmentId { get; set; }

        public string providerDescription { get; set; }

    }
}
