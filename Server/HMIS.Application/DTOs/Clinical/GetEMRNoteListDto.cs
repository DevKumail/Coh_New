namespace HMIS.Application.DTOs.Clinical
{
    public class GetEMRNoteListDto
    {
        public int NoteId { get; set; }
        public string VisitAcNo { get; set; }
        public string NotesTitle { get; set; }
        public string NoteText { get; set; }
        public string Description { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public long? SignedBy { get; set; }
        public DateTime? SignedDate { get; set; }
        public bool Signed { get; set; }
        public bool IsEdit { get; set; }
        public string MRNo { get; set; }

        public DateTime? AppDateTime { get; set; }
        public string VisitAccDisplay { get; set; }

        public string CreatedByName { get; set; }
        public string SignedByName { get; set; }
    }

    public class EMRNotePaginatedResponse
    {
        public IEnumerable<GetEMRNoteListDto> Data { get; set; }
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
