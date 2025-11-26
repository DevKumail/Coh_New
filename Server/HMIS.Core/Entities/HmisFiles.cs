using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("HMIS_Files")]
public partial class HmisFiles
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("DOCUMENT_TYPE")]
    [StringLength(100)]
    public string? DocumentType { get; set; }

    [Column("DESCRIPTION")]
    [StringLength(500)]
    public string? Description { get; set; }

    [Column("FILE_NAME")]
    [StringLength(255)]
    public string? FileName { get; set; }

    [Column("DOCUMENT_DATE", TypeName = "datetime")]
    public DateTime? DocumentDate { get; set; }

    [StringLength(500)]
    public string? FilePath { get; set; }

    [Column("FILE_SIZE")]
    public long? FileSize { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [InverseProperty("Hmisfile")]
    public virtual ICollection<IvftreatmentEpisodesAttachments> IvftreatmentEpisodesAttachments { get; set; } = new List<IvftreatmentEpisodesAttachments>();
}
