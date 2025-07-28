using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegOccupation")]
    public partial class RegOccupation
    {
        public RegOccupation()
        {
            RegPatientEmployers = new HashSet<RegPatientEmployer>();
        }

        [Key]
        public byte OccupationId { get; set; }
        [StringLength(255)]
        public string Occupation { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("EmploymentOccupation")]
        public virtual ICollection<RegPatientEmployer> RegPatientEmployers { get; set; }
    }
}
