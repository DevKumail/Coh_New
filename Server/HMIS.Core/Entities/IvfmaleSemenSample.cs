using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenSample")]
[Index("CollectionDateTime", Name = "IX_SemenSample_Patient", AllDescending = true)]
public partial class IvfmaleSemenSample
{
    [Key]
    public int SampleId { get; set; }

    [Column("IVFMainId")]
    public int IvfmainId { get; set; }

    [StringLength(64)]
    public string SampleCode { get; set; } = null!;

    public DateTime CollectionDateTime { get; set; }

    public DateTime? ThawingDateTime { get; set; }

    public long? PurposeId { get; set; }

    public long? CollectionMethodId { get; set; }

    public long? CollectionPlaceId { get; set; }

    public string? CollectionDifficulties { get; set; }

    [StringLength(100)]
    public string? AbstinencePeriod { get; set; }

    public TimeOnly? AnalysisStartTime { get; set; }

    public long? AnalyzedById { get; set; }

    public long? AppearanceId { get; set; }

    public long? SmellId { get; set; }

    public long? ViscosityId { get; set; }

    public int? LiquefactionMinutes { get; set; }

    public bool? Agglutination { get; set; }

    public string? TreatmentNotes { get; set; }

    [StringLength(100)]
    public string? Score { get; set; }

    [Column("DNAFragmentedPercent", TypeName = "decimal(5, 2)")]
    public decimal? DnafragmentedPercent { get; set; }

    public TimeOnly? TimeBetweenCollectionUsage { get; set; }

    [Column(TypeName = "decimal(12, 4)")]
    public decimal? InseminationMotileSperms { get; set; }

    [Column("InseminatedAmountML", TypeName = "decimal(6, 3)")]
    public decimal? InseminatedAmountMl { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? Motility24hPercent { get; set; }

    public int? CryoStatusId { get; set; }

    public int? StatusId { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public int? DeletedBy { get; set; }

    [ForeignKey("AppearanceId")]
    [InverseProperty("IvfmaleSemenSampleAppearance")]
    public virtual DropdownConfiguration? Appearance { get; set; }

    [ForeignKey("CollectionMethodId")]
    [InverseProperty("IvfmaleSemenSampleCollectionMethod")]
    public virtual DropdownConfiguration? CollectionMethod { get; set; }

    [ForeignKey("CollectionPlaceId")]
    [InverseProperty("IvfmaleSemenSampleCollectionPlace")]
    public virtual DropdownConfiguration? CollectionPlace { get; set; }

    [InverseProperty("Sample")]
    public virtual ICollection<IvfcryoLevelC> IvfcryoLevelC { get; set; } = new List<IvfcryoLevelC>();

    [ForeignKey("IvfmainId")]
    [InverseProperty("IvfmaleSemenSample")]
    public virtual Ivfmain Ivfmain { get; set; } = null!;

    [InverseProperty("Sample")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservation { get; set; } = new List<IvfmaleCryoPreservation>();

    [InverseProperty("Sample")]
    public virtual ICollection<IvfmaleCryoStraw> IvfmaleCryoStraw { get; set; } = new List<IvfmaleCryoStraw>();

    [InverseProperty("Sample")]
    public virtual ICollection<IvfmaleSemenObservation> IvfmaleSemenObservation { get; set; } = new List<IvfmaleSemenObservation>();

    [InverseProperty("Sample")]
    public virtual ICollection<IvfmaleSemenSampleApprovalStatus> IvfmaleSemenSampleApprovalStatus { get; set; } = new List<IvfmaleSemenSampleApprovalStatus>();

    [InverseProperty("Sample")]
    public virtual ICollection<IvfmaleSemenSampleDiagnosis> IvfmaleSemenSampleDiagnosis { get; set; } = new List<IvfmaleSemenSampleDiagnosis>();

    [ForeignKey("PurposeId")]
    [InverseProperty("IvfmaleSemenSamplePurpose")]
    public virtual DropdownConfiguration? Purpose { get; set; }

    [ForeignKey("SmellId")]
    [InverseProperty("IvfmaleSemenSampleSmell")]
    public virtual DropdownConfiguration? Smell { get; set; }

    [ForeignKey("ViscosityId")]
    [InverseProperty("IvfmaleSemenSampleViscosity")]
    public virtual DropdownConfiguration? Viscosity { get; set; }
}
