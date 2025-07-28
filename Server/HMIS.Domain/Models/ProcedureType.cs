using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("Procedure_Type")]
    public partial class ProcedureType
    {
        public ProcedureType()
        {
            BlProceduresGroups = new HashSet<BlProceduresGroup>();
            BlmasterProcedures = new HashSet<BlmasterProcedure>();
            BlprocedureGroupCodes = new HashSet<BlprocedureGroupCode>();
        }

        [Key]
        public long Id { get; set; }
        [StringLength(250)]
        public string Type { get; set; }

        [InverseProperty("ProcedureType")]
        public virtual ICollection<BlProceduresGroup> BlProceduresGroups { get; set; }
        [InverseProperty("ProcedureType")]
        public virtual ICollection<BlmasterProcedure> BlmasterProcedures { get; set; }
        [InverseProperty("ProcedureType")]
        public virtual ICollection<BlprocedureGroupCode> BlprocedureGroupCodes { get; set; }
    }
}
