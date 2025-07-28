using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SeverityType")]
    public partial class SeverityType
    {
        public SeverityType()
        {
            PatientAllergies = new HashSet<PatientAllergy>();
        }

        [Key]
        public long Id { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string SeverityName { get; set; }

        [InverseProperty("SeverityCodeNavigation")]
        public virtual ICollection<PatientAllergy> PatientAllergies { get; set; }
    }
}
