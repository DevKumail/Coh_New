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
    public class Alerts_Model
    {
        public long AlertId { get; set; }
        public long RuleId { get; set; }
   
        public string Mrno { get; set; }

        public string AlertMessage { get; set; }
        public bool Active { get; set; }
       
        public string? RepeatDate { get; set; }
       
        public bool IsFinished { get; set; }
        
        public string EnteredBy { get; set; }
      
        public string EnteredDate { get; set; }
        
        public string UpdatedBy { get; set; }
        public long? AppointmentId { get; set; }
        public int AlertTypeId { get; set; }
        public DateTime? StartDate { get; set; }
        public string Comments { get; set; }
        public bool? HasChild { get; set; }
        
        public string OldMrno { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
