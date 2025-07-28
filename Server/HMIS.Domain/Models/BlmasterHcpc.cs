using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLMasterHCPCS")]
    public partial class BlmasterHcpc
    {
        public BlmasterHcpc()
        {
            BlhcpcsgroupCodes = new HashSet<BlhcpcsgroupCode>();
        }

        [Key]
        [Column("HCPCSCode")]
        [StringLength(11)]
        public string Hcpcscode { get; set; }
        [StringLength(35)]
        public string DescriptionShort { get; set; }
        [StringLength(48)]
        public string DescriptionLong { get; set; }
        [Column(TypeName = "ntext")]
        public string DescriptionFull { get; set; }
        [StringLength(1)]
        public string Status { get; set; }
        [Column(TypeName = "date")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? EndDate { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? Price { get; set; }
        public bool? IsUnlisted { get; set; }
        [Column("VATpercentage", TypeName = "decimal(18, 2)")]
        public decimal? Vatpercentage { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("HcpcscodeNavigation")]
        public virtual ICollection<BlhcpcsgroupCode> BlhcpcsgroupCodes { get; set; }
    }
}
