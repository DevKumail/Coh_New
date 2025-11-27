using HMIS.Application.DTOs.Clinical;
using HMIS.Service.DTOs;

namespace HMIS.Service.Implementations
{

    public interface IEMRNotesManager
    {
        Task<nodeModel> GetNoteQuestionBYNoteId(int pathId, string? voiceText);
        Task<EMRNotesModel> GetNoteQuestionBYPathId(int pathId);

        Task<List<ProvierEMRNotesModel>> EMRNotesGetByEmpId(long EmpId);
        //Task<nodeModel> InsertSpeech(ClinicalNoteObj note);
        Task<nodeModel> InsertSpeechWithTranscription(ClinicalNoteDto note);
    }

}
