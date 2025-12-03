using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeTransfer")]
[Index("TransferId", Name = "IX_IVFEpisodeTransfer", IsUnique = true)]
public partial class IvfepisodeTransfer
{
    [Key]
    public long Id { get; set; }

    public long TransferId { get; set; }

    public DateTime? DateOfTransfer { get; set; }

    public TimeOnly? TimeOfTransfer { get; set; }

    public int? TransferDurationPerMin { get; set; }

    public long? ProviderId { get; set; }

    public long? NurseId { get; set; }

    public DateTime? DateOfSecTransfer { get; set; }

    public bool? ElectiveSingleEmbryoTransfer { get; set; }

    public long? EmbryologistId { get; set; }

    public int? CultureDays { get; set; }

    public long? CatheterCategoryId { get; set; }

    [StringLength(50)]
    public string? CatheterAddition { get; set; }

    public long? MainCompilationCategoryId { get; set; }

    public long? FurtherComplicationCategoryId { get; set; }

    public bool? SeveralAttempts { get; set; }

    public int? NoOfAttempts { get; set; }

    public bool? EmbryoGlue { get; set; }

    public bool? DifficultCatheterInsertion { get; set; }

    public bool? CatheterChange { get; set; }

    public bool? MucusInCatheter { get; set; }

    public bool? BloodInCatheter { get; set; }

    public bool? Dilation { get; set; }

    public bool? UltrasoundCheck { get; set; }

    public bool? Vulsellum { get; set; }

    public bool? Probe { get; set; }

    public string? Note { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("CatheterCategoryId")]
    [InverseProperty("IvfepisodeTransferCatheterCategory")]
    public virtual DropdownConfiguration? CatheterCategory { get; set; }

    [ForeignKey("EmbryologistId")]
    [InverseProperty("IvfepisodeTransferEmbryologist")]
    public virtual Hremployee? Embryologist { get; set; }

    [ForeignKey("FurtherComplicationCategoryId")]
    [InverseProperty("IvfepisodeTransferFurtherComplicationCategory")]
    public virtual DropdownConfiguration? FurtherComplicationCategory { get; set; }

    [ForeignKey("MainCompilationCategoryId")]
    [InverseProperty("IvfepisodeTransferMainCompilationCategory")]
    public virtual DropdownConfiguration? MainCompilationCategory { get; set; }

    [ForeignKey("NurseId")]
    [InverseProperty("IvfepisodeTransferNurse")]
    public virtual Hremployee? Nurse { get; set; }

    [ForeignKey("ProviderId")]
    [InverseProperty("IvfepisodeTransferProvider")]
    public virtual Hremployee? Provider { get; set; }

    [ForeignKey("TransferId")]
    [InverseProperty("IvfepisodeTransfer")]
    public virtual IvftreatmentEpisodeTransferStage Transfer { get; set; } = null!;
}
