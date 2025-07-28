using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("PatientProcedure_Type")]
    public partial class PatientProcedureType
    {
        public PatientProcedureType()
        {
            PatientProcedures = new HashSet<PatientProcedure>();
        }

        [Key]
        public long Id { get; set; }
        [StringLength(100)]
        public string Name { get; set; }

        [InverseProperty("ProcedureTypeNavigation")]
        public virtual ICollection<PatientProcedure> PatientProcedures { get; set; }
    }
}
