using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class VitalSigns
{
    [Key]
    public long Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EntryDate { get; set; }

    [Column("BPSystolic")]
    public int? Bpsystolic { get; set; }

    [Column("BPDiastolic")]
    public int? Bpdiastolic { get; set; }

    public int? PulseRate { get; set; }

    public int? RespirationRate { get; set; }

    public double? Temperature { get; set; }

    public int? Pain { get; set; }

    public double? Weight { get; set; }

    public double? Height { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string UpdateBy { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime UpdateDate { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Comment { get; set; }

    public int? AgeInMonths { get; set; }

    public double? HeadCircumference { get; set; }

    public double? Glucose { get; set; }

    [Column("HR")]
    public double? Hr { get; set; }

    [Column("SPO2")]
    public int? Spo2 { get; set; }

    [Column("BMI")]
    public int? Bmi { get; set; }

    [Column("PPain")]
    public byte? Ppain { get; set; }

    [Column("PPainLocation")]
    [StringLength(20)]
    [Unicode(false)]
    public string? PpainLocation { get; set; }

    [Column("PQuality")]
    [StringLength(20)]
    [Unicode(false)]
    public string? Pquality { get; set; }

    [Column("PIntensity")]
    public int? Pintensity { get; set; }

    [Column("PPainEffect")]
    [StringLength(50)]
    [Unicode(false)]
    public string? PpainEffect { get; set; }

    [Column("PPainBetter")]
    [StringLength(20)]
    [Unicode(false)]
    public string? PpainBetter { get; set; }

    [Column("PPainWorse")]
    [StringLength(20)]
    [Unicode(false)]
    public string? PpainWorse { get; set; }

    [Column("PPainMild")]
    [StringLength(225)]
    [Unicode(false)]
    public string? PpainMild { get; set; }

    [Column("PPainSevere")]
    [StringLength(225)]
    [Unicode(false)]
    public string? PpainSevere { get; set; }

    [Column("PSleepDisturbance")]
    public bool? PsleepDisturbance { get; set; }

    [Column("PADLDifficultyPainText")]
    [StringLength(50)]
    [Unicode(false)]
    public string? PadldifficultyPainText { get; set; }

    [Column("PADLDifficultyPain")]
    public bool? PadldifficultyPain { get; set; }

    public byte? OswestryScore { get; set; }

    [Column("VASPBack")]
    public int? Vaspback { get; set; }

    [Column("VASPRightLeg")]
    public int? VasprightLeg { get; set; }

    [Column("VASPLeftLeg")]
    public int? VaspleftLeg { get; set; }

    [Column("VASPNeck")]
    public int? Vaspneck { get; set; }

    [Column("VASPRightArm")]
    public int? VasprightArm { get; set; }

    [Column("VASPLeftArm")]
    public int? VaspleftArm { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    [Column("VASPDone")]
    public bool? Vaspdone { get; set; }

    public double? AbdCircumference { get; set; }

    public double? HipCircumference { get; set; }

    public double? UmbilicusCircumference { get; set; }

    [Column("BPArm")]
    public int? Bparm { get; set; }

    public long? AppointmentId { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("VitalSigns")]
    public virtual SchAppointment? Appointment { get; set; }
}
