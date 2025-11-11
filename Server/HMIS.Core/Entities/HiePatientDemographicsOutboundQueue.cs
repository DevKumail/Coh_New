using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("HIE_PatientDemographicsOutboundQueue")]
public partial class HiePatientDemographicsOutboundQueue
{
    [Key]
    public long QueueId { get; set; }

    public long PatientId { get; set; }

    [Column("MRNo")]
    [StringLength(50)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string EventType { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public bool Processed { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ProcessedDate { get; set; }
}
