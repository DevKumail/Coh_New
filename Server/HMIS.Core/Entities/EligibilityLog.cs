using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class EligibilityLog
{
    [Key]
    public int Id { get; set; }

    public long? PatientId { get; set; }

    public long? VisitId { get; set; }

    [Unicode(false)]
    public string? Request { get; set; }

    [Unicode(false)]
    public string? Response { get; set; }

    [Column("status")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Status { get; set; }

    public long? PayerId { get; set; }

    public long? PlanId { get; set; }

    public int? Priority { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EligiblityDate { get; set; }

    public int? FacilityId { get; set; }

    public long? RequestedbyId { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [Unicode(false)]
    public string? ResponseDetails { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("FacilityId")]
    [InverseProperty("EligibilityLog")]
    public virtual RegFacility? Facility { get; set; }

    [ForeignKey("PatientId")]
    [InverseProperty("EligibilityLog")]
    public virtual RegPatient? Patient { get; set; }

    [ForeignKey("PayerId")]
    [InverseProperty("EligibilityLog")]
    public virtual Blpayer? Payer { get; set; }

    [ForeignKey("PlanId")]
    [InverseProperty("EligibilityLog")]
    public virtual BlpayerPlan? Plan { get; set; }

    [ForeignKey("RequestedbyId")]
    [InverseProperty("EligibilityLog")]
    public virtual Hremployee? Requestedby { get; set; }

    [ForeignKey("VisitId")]
    [InverseProperty("EligibilityLog")]
    public virtual SchAppointment? Visit { get; set; }
}
