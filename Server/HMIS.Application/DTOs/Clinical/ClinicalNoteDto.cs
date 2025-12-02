namespace HMIS.Application.DTOs.Clinical
{
    public class ClinicalNoteDto
    {
        // Common fields
        public int Id { get; set; }
        public string? NoteTitle { get; set; }
        public string? NoteText { get; set; }
        public string? NoteType { get; set; }
        public string? CreatedBy { get; set; }
        public string? Description { get; set; }
        public string? UpdatedBy { get; set; }
        public string? MrNo { get; set; }
        public int AppointmentId { get; set; }
        public long SignedBy { get; set; }
        public string? VoiceFile { get; set; }
        public int PathId { get; set; }
        public long? FileId { get; set; }
        public string? HtmlContent { get; set; }
        public StructuredNote? StructuredNote { get; set; }

        // Additional fields from emrPayload
        public int? VisitAcNo { get; set; }
        public string? NoteHtmltext { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool? Signed { get; set; }
        public bool? IsEdit { get; set; }
        public bool? Review { get; set; }
        public bool? Active { get; set; }
        public DateTime? SignedDate { get; set; }
        public long? CosignedBy { get; set; }
        public DateTime? CosignedDate { get; set; }
        public long? MrcosignedBy { get; set; }
        public DateTime? MrcosignedDate { get; set; }
        public long? ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; }
        public string? NoteStatus { get; set; }
        public string? Documents { get; set; }
        public Guid? CaseId { get; set; }
        public bool? IsNursingNote { get; set; }
        public long? ReceiverRoleId { get; set; }
        public long? ReceiverEmpId { get; set; }
        public Guid? ReferredSiteId { get; set; }
        public long? LabOrderSetDetailId { get; set; }
        public string? OldMrno { get; set; }
        public bool? IsMbrcompleted { get; set; }
        public long? OldNoteId { get; set; }

        // Additional fields from payload
        public long? ProviderId { get; set; }
        public long? UserId { get; set; }
        public string? CurrentUser { get; set; }
    }

    public class StructuredNote
    {
        public Node? Node { get; set; }
    }

    public class Node
    {
        public string? NoteTitle { get; set; }
        public List<Question>? Questions { get; set; }
    }
    public class Question
    {
        public int Quest_Id { get; set; }
        public string? QuestTitle { get; set; }
        public string? Type { get; set; }
        public string? Answer { get; set; }
        public List<Question>? Children { get; set; }
    }

    public class ClinicalNoteResponse
    {
        public bool Success { get; set; }
        public long NoteId { get; set; }
        public string Message { get; set; }
    }

    public class AnswerItem
    {
        public long NoteId { get; set; }
        public long Quest_Id { get; set; }
        public string Answer { get; set; }
        public string MrNo { get; set; }
        public long VisitAcNo { get; set; }
        public string CreatedBy { get; set; }
    }

    public class ClinicalNoteObj
    {
        public int Id { get; set; }
        //public long? PatientId { get; set; }
        public string NoteHtmltext { get; set; }
        public string? NoteText { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string Mrno { get; set; }
        public int AppointmentId { get; set; }

        public string NoteTitle { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public bool? SignedBy { get; set; }
        public string? NotePath { get; set; }
        public DateTime? VisitDate { get; set; }
        public bool? IsDeleted { get; set; }
        public string UpdatedBy { get; set; }
        public int pathId { get; set; }
        public long? File_Id { get; set; }

    }
    public class TranscriptionResult
    {
        public string Transcript { get; set; }
        public string FilePath { get; set; }
    }


}
