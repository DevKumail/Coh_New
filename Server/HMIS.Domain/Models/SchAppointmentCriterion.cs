using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class SchAppointmentCriterion
    {
        public SchAppointmentCriterion()
        {
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public int CriteriaId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string CriteriaName { get; set; }
        public int? DisplayOrder { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("AppCriteria")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
