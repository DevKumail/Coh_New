using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class LabResultsObservation
{
    public int LabObservationId { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string ValueType { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string ObservationIdentifierFullName { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? ObservationIdentifierShortName { get; set; }

    [Column(TypeName = "ntext")]
    public string ObservationValue { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? Units { get; set; }

    [StringLength(60)]
    [Unicode(false)]
    public string? ReferenceRangeMin { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ReferenceRangeMax { get; set; }

    [StringLength(5)]
    [Unicode(false)]
    public string? AbnormalFlag { get; set; }

    [StringLength(1)]
    [Unicode(false)]
    public string ResultStatus { get; set; } = null!;

    [StringLength(14)]
    [Unicode(false)]
    public string? ObservationDateTime { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? AnalysisDateTime { get; set; }

    public int? CreatedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string CreatedDate { get; set; } = null!;

    public int? UpdatedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string UpdatedDate { get; set; } = null!;

    [StringLength(2000)]
    public string? Remarks { get; set; }

    public bool? WeqayaScreening { get; set; }

    public int? SequenceNo { get; set; }

    public int? LabResultId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
