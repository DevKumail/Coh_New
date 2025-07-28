using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BL_ProceduresGroup")]
    public partial class BlProceduresGroup
    {
        public BlProceduresGroup()
        {
            BlprocedureGroupCodes = new HashSet<BlprocedureGroupCode>();
        }

        [Key]
        public long GroupId { get; set; }
        [Required]
        [StringLength(250)]
        [Unicode(false)]
        public string GroupName { get; set; }
        public long ProviderId { get; set; }
        public long? ProcedureTypeId { get; set; }
        public bool? Isdeleted { get; set; }

        [ForeignKey("ProcedureTypeId")]
        [InverseProperty("BlProceduresGroups")]
        public virtual ProcedureType ProcedureType { get; set; }
        [InverseProperty("ProcedureGroup")]
        public virtual ICollection<BlprocedureGroupCode> BlprocedureGroupCodes { get; set; }
    }
}
