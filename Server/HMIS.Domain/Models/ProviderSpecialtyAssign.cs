using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("ProviderSpecialtyAssign")]
    public partial class ProviderSpecialtyAssign
    {
        [Key]
        public long ProviderId { get; set; }
        [Key]
        [Column("SpecialtyID")]
        public int SpecialtyId { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
