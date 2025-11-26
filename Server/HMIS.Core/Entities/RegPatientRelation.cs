using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Index("CanonicalKey", Name = "UQ_CanonicalKey", IsUnique = true)]
public partial class RegPatientRelation
{
    [Key]
    public int PatientRelationId { get; set; }

    public long PatientId { get; set; }

    public long RelatedPatientId { get; set; }

    public int RelationshipId { get; set; }

    [StringLength(49)]
    [Unicode(false)]
    public string CanonicalKey { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("PatientId")]
    [InverseProperty("RegPatientRelationPatient")]
    public virtual RegPatient Patient { get; set; } = null!;

    [ForeignKey("RelatedPatientId")]
    [InverseProperty("RegPatientRelationRelatedPatient")]
    public virtual RegPatient RelatedPatient { get; set; } = null!;

    [ForeignKey("RelationshipId")]
    [InverseProperty("RegPatientRelation")]
    public virtual RegRelationShip Relationship { get; set; } = null!;
}
