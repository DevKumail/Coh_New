using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreamentsEpisodeAttachments")]
public partial class IvftreamentsEpisodeAttachments
{
    [Key]
    public int Id { get; set; }

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int IvffemaleFhadditionalMeasuresId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    [InverseProperty("IvftreamentsEpisodeAttachments")]
    public virtual IvfdashboardTreatmentEpisode IvffemaleFhadditionalMeasures { get; set; } = null!;
}
