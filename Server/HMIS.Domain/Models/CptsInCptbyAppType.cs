using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("CPTsInCPTByAppType")]
    public partial class CptsInCptbyAppType
    {
        [Key]
        public long Id { get; set; }
        [Column("GroupID")]
        public long GroupId { get; set; }
        [Required]
        [Column("CPTCode")]
        [StringLength(11)]
        public string Cptcode { get; set; }

        [ForeignKey("GroupId")]
        [InverseProperty("CptsInCptbyAppTypes")]
        public virtual CptbyAppType Group { get; set; }
    }
}
