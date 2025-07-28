using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("ImmunizationList")]
    public partial class ImmunizationList
    {
        public ImmunizationList()
        {
            PatientImmunizationDrugTypes = new HashSet<PatientImmunization>();
            PatientImmunizationImmTypes = new HashSet<PatientImmunization>();
        }

        [Required]
        [StringLength(50)]
        public string ImmTypeName { get; set; }
        [StringLength(250)]
        public string Description { get; set; }
        public bool Active { get; set; }
        [Key]
        public long ImmTypeId { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("DrugType")]
        public virtual ICollection<PatientImmunization> PatientImmunizationDrugTypes { get; set; }
        [InverseProperty("ImmType")]
        public virtual ICollection<PatientImmunization> PatientImmunizationImmTypes { get; set; }
    }
}
