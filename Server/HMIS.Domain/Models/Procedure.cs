using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class Procedure
    {
        [Key]
        public long Id { get; set; }
        [StringLength(11)]
        public string Code { get; set; }
        public long? ProcedureTypeId { get; set; }
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
        public Guid? AccountGuid { get; set; }
        [Column("startDate", TypeName = "datetime")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsUnlisted { get; set; }
        [Column("VATpercentage", TypeName = "decimal(18, 2)")]
        public decimal? Vatpercentage { get; set; }
        public Guid? ItemId { get; set; }
        [StringLength(10)]
        public string ItemName { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? BillSeparate { get; set; }
        public bool? BillOnOrder { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ServiceType { get; set; }
        [Column("InclusionUAEServiceGroup")]
        public short? InclusionUaeserviceGroup { get; set; }
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
        public bool? ToothNumber { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string Chapter { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string CodingSystem { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("ProcedureCreatedByNavigations")]
        public virtual Hremployee CreatedByNavigation { get; set; }
        [ForeignKey("ProcedureTypeId")]
        [InverseProperty("Procedures")]
        public virtual ProcedureType ProcedureType { get; set; }
        [ForeignKey("UpdatedBy")]
        [InverseProperty("ProcedureUpdatedByNavigations")]
        public virtual Hremployee UpdatedByNavigation { get; set; }
    }
}
