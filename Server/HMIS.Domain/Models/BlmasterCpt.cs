using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLMasterCPT")]
    public partial class BlmasterCpt
    {
        [Key]
        [Column("CPTCode")]
        [StringLength(11)]
        public string Cptcode { get; set; }
        [StringLength(35)]
        public string DescriptionShort { get; set; }
        [StringLength(48)]
        public string DescriptionLong { get; set; }
        [Column(TypeName = "ntext")]
        public string DescriptionFull { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? Price { get; set; }
        [Column("NFTotalRVU")]
        [StringLength(8)]
        public string NftotalRvu { get; set; }
        [Column("FACTotalRVU")]
        [StringLength(8)]
        public string FactotalRvu { get; set; }
        [StringLength(1)]
        public string Status { get; set; }
        [Column(TypeName = "date")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? Enddate { get; set; }
        public Guid? AccountGuid { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ServiceType { get; set; }
        [Column("ItemID")]
        public Guid? ItemId { get; set; }
        [Column("InclusionUAEServiceGroup")]
        public short? InclusionUaeserviceGroup { get; set; }
        public bool? IsUnlisted { get; set; }
        public bool? BillSeparate { get; set; }
        public bool? BillOnOrder { get; set; }
        [Column("VATpercentage", TypeName = "decimal(18, 2)")]
        public decimal? Vatpercentage { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? CashPrice { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? OldCashPrice { get; set; }
        [StringLength(150)]
        [Unicode(false)]
        public string ServiceCategory { get; set; }
        [StringLength(150)]
        [Unicode(false)]
        public string ServiceSubCategory { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
