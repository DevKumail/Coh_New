using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientChartFamilyHistory
{
    [Key]
    [Column("FHID")]
    public long Fhid { get; set; }

    public long? ChartId { get; set; }

    public int? RelationShipId { get; set; }

    [Column("FHItem")]
    [StringLength(50)]
    public string? Fhitem { get; set; }

    [Column("MRNo")]
    [StringLength(50)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    public long? AppointmentId { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public bool? Active { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [ForeignKey("RelationShipId")]
    [InverseProperty("PatientChartFamilyHistory")]
    public virtual RegRelationShip? RelationShip { get; set; }
}
