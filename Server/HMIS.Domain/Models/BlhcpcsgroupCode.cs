using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLHCPCSGroupCode")]
    public partial class BlhcpcsgroupCode
    {
        [Key]
        public long GroupId { get; set; }
        [Key]
        [Column("HCPCSCode")]
        [StringLength(11)]
        public string Hcpcscode { get; set; }
        [Required]
        [StringLength(2000)]
        public string DescriptionUser { get; set; }
        [Column(TypeName = "money")]
        public decimal? UnitPrice { get; set; }
        [StringLength(2000)]
        public string ProviderDescription { get; set; }
        [Key]
        public long GroupCodeId { get; set; }
        public long PayerId { get; set; }
        public bool? IsDeleted { get; set; }

        [ForeignKey("GroupId")]
        [InverseProperty("BlhcpcsgroupCodes")]
        public virtual Blhcpcsgroup Group { get; set; }
        [ForeignKey("Hcpcscode")]
        [InverseProperty("BlhcpcsgroupCodes")]
        public virtual BlmasterHcpc HcpcscodeNavigation { get; set; }
    }
}
