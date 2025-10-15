using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegAccount
{
    [Key]
    public long AccId { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    [StringLength(13)]
    [Unicode(false)]
    public string AccountNo { get; set; } = null!;

    public bool? TypeId { get; set; }

    [Column(TypeName = "money")]
    public decimal? LateCharges { get; set; }

    [Column(TypeName = "money")]
    public decimal? NoShowCharges { get; set; }

    [Column(TypeName = "money")]
    public decimal? OtherCharges { get; set; }

    public byte? StatementOptions { get; set; }

    public byte? AddressStatementTo { get; set; }

    [Column(TypeName = "money")]
    public decimal? CoPayment { get; set; }

    public bool? Inactive { get; set; }

    [StringLength(13)]
    [Unicode(false)]
    public string? MasterAccountNo { get; set; }

    public long? PatientId { get; set; }

    public int? RelationshipId { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("PatientId")]
    [InverseProperty("RegAccount")]
    public virtual RegPatient? Patient { get; set; }

    [ForeignKey("RelationshipId")]
    [InverseProperty("RegAccount")]
    public virtual RegRelationShip? Relationship { get; set; }
}
