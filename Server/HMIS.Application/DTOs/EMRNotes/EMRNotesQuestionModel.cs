namespace HMIS.Service.DTOs
{
    public class EMRNotesQuestionModel
    {
        public long Quest_Id { get; set; }
        public string Quest_Title { get; set; }
        public string? Type { get; set; }
        public long Parent_Id { get; set; }
        public string? Answer { get; set; }
        public List<EMRNotesQuestionModel> Children { get; set; } = new List<EMRNotesQuestionModel>();
    }

    public class EMRNotesModel
    {
        public string NoteTitle { get; set; }

        public List<NoteModel> Questions { get; set; }
    }

    public class NoteModel
    {
        public long Quest_Id { get; set; }
        public string Quest_Title { get; set; }
        public string? Type { get; set; }
        public string? Answer { get; set; }

        public List<NoteModel> Children { get; set; } = new List<NoteModel>();
    }

    public class ProvierEMRNotesModel
    {
        public int PathId { get; set; }

        public string? PathName { get; set; }
        public string? PathDescription { get; set; }

        public string? TemplateType { get; set; }

        public string? TemplateText { get; set; }
        public string? Category { get; set; }
        public string? TemplateHTML { get; set; }
        public string? NewFormatting { get; set; }
    }

    public class nodeModel
    {
        public EMRNotesModel node { get; set; }
        public string? conversation { get; set; }
    }
    public class EMRNotesQuestionDto
    {
        public long Quest_Id { get; set; }
        public string Quest_Title { get; set; }
        public int Quest_Type { get; set; }
        public long Parent_Id { get; set; }
        public string NoteName { get; set; }
    }

    public class SpeechToTextResponse
    {
        public string ApiResponse { get; set; }
    }
}