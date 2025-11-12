using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs
{
    public class EMRNotesQuestionModel
    {
        public long Quest_Id { get; set; }
        public string Quest_Title { get; set; }
        // public int Type { get; set; }
        public string? Type { get; set; }
        //public string Quest_Desription { get; set; }
        //public int? Ans_Size { get; set; }
        //public string Quest_Table { get; set; }
        public long Parent_Id { get; set; }
        public string? Answer { get; set; }
        //public int? Validation_Type { get; set; }
        //public int? Quest_Order { get; set; }
        //public string prefix { get; set; }
        //public string postfix { get; set; }
        //public string negativePrefix { get; set; }
        //public string negativePostfix { get; set; }
        //public bool? Inactive { get; set; }
        //public Guid? ImageId { get; set; }
        //public long? WeqayaId { get; set; }

        //// Path-related properties (likely from EMRNotesPathQuestion)
        //public int? Path_Id { get; set; }

        //public int PathQuestionId { get; set; }
        //public bool Active { get; set; }
        //public bool? HeadingLinked { get; set; }
        //public int QuestOrder_Template { get; set; }

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
        // public int Type { get; set; }
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

}
