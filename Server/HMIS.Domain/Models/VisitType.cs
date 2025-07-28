using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("VisitType")]
    public partial class VisitType
    {
        public VisitType()
        {
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public int VisitTypeId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string VisitTypeName { get; set; }
        public bool? Active { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("VisitType")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
