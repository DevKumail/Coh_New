using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class LabSampleTypes
{
    [Key]
    public int SampleTypeId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string SampleName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string? ContainerType { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ColorCode { get; set; }

    [Column("VolumeRequiredML", TypeName = "decimal(5, 2)")]
    public decimal? VolumeRequiredMl { get; set; }

    public bool? FastingRequired { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? StorageTemperature { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? TransportCondition { get; set; }

    public bool? IsActive { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public bool? IsDeleted { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DeletedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DeletedDate { get; set; }

    [InverseProperty("SampleType")]
    public virtual ICollection<LabOrderSetDetail> LabOrderSetDetail { get; set; } = new List<LabOrderSetDetail>();

    [InverseProperty("SampleType")]
    public virtual ICollection<LabTests> LabTests { get; set; } = new List<LabTests>();
}
