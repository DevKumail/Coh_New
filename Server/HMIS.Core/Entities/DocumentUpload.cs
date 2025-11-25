using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class DocumentUpload
{
    [Key]
    public long Id { get; set; }

    public long? UploadedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UploadedDate { get; set; }

    public bool? IsDeleted { get; set; }

    public long? DeletedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DeletedDate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string ModuleName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string TableName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string LinkedToColumn { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string? DocumentCategory { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string FileName { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? FileExtension { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? FileType { get; set; }

    public long? FileSize { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string StorageType { get; set; } = null!;

    [StringLength(1000)]
    [Unicode(false)]
    public string StoragePath { get; set; } = null!;

    [StringLength(500)]
    [Unicode(false)]
    public string? RelativePath { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
