using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeAspirationOocyteRetrieval")]
[Index("AspirationId", Name = "IX_IVFEpisodeApirationOocyteRetrieval", IsUnique = true)]
public partial class IvfepisodeAspirationOocyteRetrieval
{
    [Key]
    public long OocyteRetrievalId { get; set; }

    public long AspirationId { get; set; }

    public DateTime? RetrievalDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public int? CollectedOocytes { get; set; }

    public int? EmptyCumuli { get; set; }

    public bool? PoorResponseToDrugs { get; set; }

    public long? RetrievalTechniqueCategoryId { get; set; }

    public long? AnesthesiaCategoryId { get; set; }

    public long? PrimaryComplicationsCategoryId { get; set; }

    public long? FurtherComplicationsCategoryId { get; set; }

    public long? PrimaryMeasureCategoryId { get; set; }

    public long? FurtherMeasureCategoryId { get; set; }

    public long? OperatingProviderId { get; set; }

    public long? EmbryologistId { get; set; }

    public long? AnesthetistId { get; set; }

    public long? NurseId { get; set; }

    public string? Note { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AnesthesiaCategoryId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalAnesthesiaCategory")]
    public virtual DropdownConfiguration? AnesthesiaCategory { get; set; }

    [ForeignKey("AnesthetistId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalAnesthetist")]
    public virtual Hremployee? Anesthetist { get; set; }

    [ForeignKey("AspirationId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrieval")]
    public virtual IvftreatmentEpisodeAspirationStage Aspiration { get; set; } = null!;

    [ForeignKey("EmbryologistId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalEmbryologist")]
    public virtual Hremployee? Embryologist { get; set; }

    [ForeignKey("FurtherComplicationsCategoryId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalFurtherComplicationsCategory")]
    public virtual DropdownConfiguration? FurtherComplicationsCategory { get; set; }

    [ForeignKey("FurtherMeasureCategoryId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalFurtherMeasureCategory")]
    public virtual DropdownConfiguration? FurtherMeasureCategory { get; set; }

    [ForeignKey("NurseId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalNurse")]
    public virtual Hremployee? Nurse { get; set; }

    [ForeignKey("OperatingProviderId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalOperatingProvider")]
    public virtual Hremployee? OperatingProvider { get; set; }

    [ForeignKey("PrimaryComplicationsCategoryId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalPrimaryComplicationsCategory")]
    public virtual DropdownConfiguration? PrimaryComplicationsCategory { get; set; }

    [ForeignKey("PrimaryMeasureCategoryId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalPrimaryMeasureCategory")]
    public virtual DropdownConfiguration? PrimaryMeasureCategory { get; set; }

    [ForeignKey("RetrievalTechniqueCategoryId")]
    [InverseProperty("IvfepisodeAspirationOocyteRetrievalRetrievalTechniqueCategory")]
    public virtual DropdownConfiguration? RetrievalTechniqueCategory { get; set; }
}
