using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegBloodGroup")]
    public partial class RegBloodGroup
    {
        public RegBloodGroup()
        {
            RegPatients = new HashSet<RegPatient>();
        }

        [Key]
        public int BloodGroupId { get; set; }
        [Required]
        [StringLength(255)]
        [Unicode(false)]
        public string BloodGroup { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("PatientBloodGroup")]
        public virtual ICollection<RegPatient> RegPatients { get; set; }
    }
}
