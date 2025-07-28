using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class AlergyType
    {
        public AlergyType()
        {
            PatientAllergies = new HashSet<PatientAllergy>();
        }

        [Key]
        public long AlergyTypeId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string AlergyName { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Description { get; set; }
        public bool? InActive { get; set; }
        [StringLength(30)]
        [Unicode(false)]
        public string Code { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("Type")]
        public virtual ICollection<PatientAllergy> PatientAllergies { get; set; }
    }
}
