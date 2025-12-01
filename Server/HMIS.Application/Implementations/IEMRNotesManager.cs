using HMIS.Application.DTOs.Clinical;
using HMIS.Core.Entities;
using HMIS.Service.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Service.Implementations
{

    public interface IEMRNotesManager
    {
        Task<nodeModel> GetNoteQuestionBYNoteId(int pathId, string? voiceText);
        Task<EMRNotesModel> GetNoteQuestionBYPathId(int pathId);
        //Task<ClinicalNoteResponse> InsertSpeechWithTranscription(ClinicalNoteDto note);
        //Task<ClinicalNoteResponse> InsertStructureNotes(ClinicalNoteDto note);
        Task<List<ProvierEMRNotesModel>> EMRNotesGetByEmpId(long EmpId);
        //Task<EmrnotesNote> SaveEMRNote(EmrnotesNote noteDto);
        Task<ClinicalNoteResponse> SaveClinicalNote(ClinicalNoteDto note);
        //Task<nodeModel> InsertSpeechWithTranscription(ClinicalNoteDto note);
        Task<(IEnumerable<GetEMRNoteListDto> Data, int TotalCount)> GetEMRNotesByMRNo(string mrno, int page, int pageSize);
        Task<EMRNoteDetailDto?> GetEMRNoteByNoteId(long noteId);

    }

}
