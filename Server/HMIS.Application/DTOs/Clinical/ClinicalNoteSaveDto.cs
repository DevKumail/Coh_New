using System.ComponentModel.DataAnnotations;

namespace HMIS.Application.DTOs.Clinical
{// ClinicalNoteSaveDto.cs
    public class ClinicalNoteSaveDto
    {
        // Make sure ALL these are long? to match your entity
        public long? VisitAcNo { get; set; }
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }
        public long? SignedBy { get; set; }
        public long? CosignedBy { get; set; }
        public long? MrcosignedBy { get; set; }
        public long? NoteCosignProvId { get; set; }
        public long? ReviewedBy { get; set; }
        public long? ReceiverEmpId { get; set; }
        public long? LabOrderSetDetailId { get; set; }
        public long? OldNoteId { get; set; }

        // Only ReceiverRoleId should be int? (based on your entity)
        public int? ReceiverRoleId { get; set; }

        // Other properties remain the same
        [Required]
        [StringLength(50)]
        public string NotesTitle { get; set; } = null!;
        public string? NoteText { get; set; }
        public string? NoteHtmltext { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        [Required]
        public string CreatedOn { get; set; } = null!;
        public string? UpdatedDate { get; set; }
        public bool Signed { get; set; } = false;
        public bool IsEdit { get; set; } = false;
        public bool? Review { get; set; }

        [StringLength(20)]
        public string? NoteType { get; set; }

        public bool Active { get; set; } = true;
        public string? SignedDate { get; set; }
        public string? CosignedDate { get; set; }
        public string? MrcosignedDate { get; set; }
        public string? ReviewedDate { get; set; }

        [StringLength(20)]
        public string? NoteStatus { get; set; }

        [StringLength(10)]
        public string? Mrno { get; set; }

        public byte[]? Documents { get; set; }
        public Guid? CaseId { get; set; }
        public bool? IsNursingNote { get; set; }
        public Guid? ReferredSiteId { get; set; }

        [StringLength(20)]
        public string? OldMrno { get; set; }

        public bool? IsMbrcompleted { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class ClinicalNoteResponseDto
    {
        public long NoteId { get; set; }
        public string NotesTitle { get; set; } = null!;
        public string? Description { get; set; }
        public string CreatedOn { get; set; } = null!;
        public string? Mrno { get; set; }
        public string? NoteStatus { get; set; }
        public bool Signed { get; set; }
    }
}
