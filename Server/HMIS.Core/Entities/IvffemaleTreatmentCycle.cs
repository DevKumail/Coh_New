using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleTreatmentCycle")]
public partial class IvffemaleTreatmentCycle
{
    [Key]
    [Column("IVFFemaleTreatmentCycleId")]
    public int IvffemaleTreatmentCycleId { get; set; }

    public long? TreatmentTypeCategoryId { get; set; }

    public bool? OnlyInternalCycle { get; set; }

    [Column("DateofLMP", TypeName = "datetime")]
    public DateTime? DateofLmp { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? TherapyStartDate { get; set; }

    public long? CycleFromAmenorrheaCategoryId { get; set; }

    public long? MainIndicationCategoryId { get; set; }

    public long? ProtocolCategoryId { get; set; }

    public long? StimulationPlannedCategoryId { get; set; }

    public long? StimulatedExternallyCategoryId { get; set; }

    [StringLength(50)]
    public string? LongTermMedication { get; set; }

    public int? PlannedNo { get; set; }

    public long? PlannedSpermCollectionCategoryId { get; set; }

    [ForeignKey("CycleFromAmenorrheaCategoryId")]
    [InverseProperty("IvffemaleTreatmentCycleCycleFromAmenorrheaCategory")]
    public virtual DropdownConfiguration? CycleFromAmenorrheaCategory { get; set; }

    [ForeignKey("MainIndicationCategoryId")]
    [InverseProperty("IvffemaleTreatmentCycleMainIndicationCategory")]
    public virtual DropdownConfiguration? MainIndicationCategory { get; set; }

    [ForeignKey("PlannedSpermCollectionCategoryId")]
    [InverseProperty("IvffemaleTreatmentCyclePlannedSpermCollectionCategory")]
    public virtual DropdownConfiguration? PlannedSpermCollectionCategory { get; set; }

    [ForeignKey("ProtocolCategoryId")]
    [InverseProperty("IvffemaleTreatmentCycleProtocolCategory")]
    public virtual DropdownConfiguration? ProtocolCategory { get; set; }

    [ForeignKey("StimulatedExternallyCategoryId")]
    [InverseProperty("IvffemaleTreatmentCycleStimulatedExternallyCategory")]
    public virtual DropdownConfiguration? StimulatedExternallyCategory { get; set; }

    [ForeignKey("StimulationPlannedCategoryId")]
    [InverseProperty("IvffemaleTreatmentCycleStimulationPlannedCategory")]
    public virtual DropdownConfiguration? StimulationPlannedCategory { get; set; }

    [ForeignKey("TreatmentTypeCategoryId")]
    [InverseProperty("IvffemaleTreatmentCycleTreatmentTypeCategory")]
    public virtual DropdownConfiguration? TreatmentTypeCategory { get; set; }
}
