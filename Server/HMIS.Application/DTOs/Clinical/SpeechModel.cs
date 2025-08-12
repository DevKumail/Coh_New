using HMIS.Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Clinical
{
    public class SpeechModel
    {
        public int Id { get; set; }
        //public long? PatientId { get; set; }
        public string NoteHtmltext { get; set; }
        public string NoteText { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string Mrno { get; set; }
        public string NoteTitle { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public bool? SignedBy { get; set; }
        public DateTime? VisitDate { get; set; }
        public bool? IsDeleted { get; set; }

        public string UpdatedBy { get; set; }
    }

    public class ClinicalNoteDto
    {
        public int Id { get; set; }
        public string NoteTitle { get; set; }
        public string CreatedBy { get; set; }
        public string Description { get; set; }
        public string UpdatedBy { get; set; }
        public string mrNo { get; set; }
        public int AppointmentId { get; set; }
        public bool SignedBy { get; set; }
        public string VoiceFile { get; set; }
    }

    public class ClinicalNoteObj
    {
        public int Id { get; set; }
        //public long? PatientId { get; set; }
        public string NoteHtmltext { get; set; }
        public string NoteText { get; set; }
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
    }

}
