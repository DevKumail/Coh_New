using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLProcedureGroupCode")]
    public partial class BlprocedureGroupCode
    {
        [Key]
        public long Id { get; set; }
        public long? ProcedureMasterId { get; set; }
        public long? ProcedureGroupId { get; set; }
        public long? ProcedureTypeId { get; set; }
        [Required]
        [StringLength(2000)]
        public string DescriptionUser { get; set; }
        public bool? IsDeleted { get; set; }
        [Column(TypeName = "money")]
        public decimal? UnitPrice { get; set; }
        [Required]
        [StringLength(2000)]
        public string ProviderDescription { get; set; }
        public long? PayerId { get; set; }

        [ForeignKey("PayerId")]
        [InverseProperty("BlprocedureGroupCodes")]
        public virtual Blpayer Payer { get; set; }
        [ForeignKey("ProcedureGroupId")]
        [InverseProperty("BlprocedureGroupCodes")]
        public virtual BlProceduresGroup ProcedureGroup { get; set; }
        [ForeignKey("ProcedureMasterId")]
        [InverseProperty("BlprocedureGroupCodes")]
        public virtual BlmasterProcedure ProcedureMaster { get; set; }
        [ForeignKey("ProcedureTypeId")]
        [InverseProperty("BlprocedureGroupCodes")]
        public virtual ProcedureType ProcedureType { get; set; }
    }
}
