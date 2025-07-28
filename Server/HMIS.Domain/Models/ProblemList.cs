using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("ProblemList")]
    public partial class ProblemList
    {
        public ProblemList()
        {
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public long ProblemId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string ProblemName { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string ProblemDesc { get; set; }
        public bool? InActive { get; set; }
        [Column("facilityId")]
        public int? FacilityId { get; set; }
        public bool? HideToProvider { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("PurposeOfVisitNavigation")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
