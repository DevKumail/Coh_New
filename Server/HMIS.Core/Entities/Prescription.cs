using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Prescription
{
    [Key]
    public long PrescriptionId { get; set; }

    public long? DrugId { get; set; }

    [StringLength(50)]
    public string? DrugCode { get; set; }

    [StringLength(50)]
    public string? DrugForm { get; set; }

    [StringLength(200)]
    public string? ApplicationDomain { get; set; }

    [StringLength(30)]
    public string? Route { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    public int? Duration { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Dosage { get; set; }

    [StringLength(50)]
    public string? Frequency { get; set; }

    [StringLength(100)]
    public string? Time { get; set; }

    public string? Instructions { get; set; }

    [StringLength(200)]
    public string? Indications { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("DrugId")]
    [InverseProperty("Prescription")]
    public virtual TabDrugsName? Drug { get; set; }
}
