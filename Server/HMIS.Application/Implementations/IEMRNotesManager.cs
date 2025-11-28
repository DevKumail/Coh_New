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

        Task<List<ProvierEMRNotesModel>> EMRNotesGetByEmpId(long EmpId);
        Task<IActionResult> SaveEMRNote(EmrnotesNote noteDto);
        Task<nodeModel> InsertSpeechWithTranscription(ClinicalNoteDto note);
        Task<(IEnumerable<GetEMRNoteListDto> Data, int TotalCount)> GetEMRNotesByMRNo(string mrno, int page, int pageSize);
    }

}
