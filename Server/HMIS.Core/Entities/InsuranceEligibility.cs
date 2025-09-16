using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class InsuranceEligibility
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PatientName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? InsurancePayerName { get; set; }

    [Column("InsuranceMemberID")]
    [StringLength(50)]
    [Unicode(false)]
    public string? InsuranceMemberId { get; set; }

    [Column("PackageID")]
    public int? PackageId { get; set; }

    [StringLength(50)]
    public string? PackageName { get; set; }

    public DateOnly? EffectiveDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PolicyNumber { get; set; }

    public byte[]? Image { get; set; }

    public long? BlPayerId { get; set; }

    public string? CreatedOn { get; set; }

    [StringLength(50)]
    public string? CreatedBy { get; set; }

    public DateOnly? UpdatedOn { get; set; }

    [StringLength(50)]
    public string? UpdatedBy { get; set; }

    public bool? IsDeleted { get; set; }

    public long? AppointmentId { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("InsuranceEligibility")]
    public virtual SchAppointment? Appointment { get; set; }

    [ForeignKey("BlPayerId")]
    [InverseProperty("InsuranceEligibility")]
    public virtual Blpayer? BlPayer { get; set; }
}
