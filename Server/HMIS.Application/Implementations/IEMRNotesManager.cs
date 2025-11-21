using HMIS.Application.DTOs.Clinical;
using HMIS.Service.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace HMIS.Service.Implementations
{

    public interface IEMRNotesManager
    {
        nodeModel GetNoteQuestionBYNoteId(int pathId, string? voiceText);

        EMRNotesModel GetNoteQuestionBYPathId(int pathId);

        List<ProvierEMRNotesModel> EMRNotesGetByEmpId(long EmpId);
        Task<nodeModel> InsertSpeech(ClinicalNoteObj note);
    }

    //public internal  IEMRNotesManager
    //{
    // Task<DataSet> GetUPPUplodingfileError(FilterUPPErrorList Req);
    //    EMRNotesModel GetNoteQuestionBYPathId(int pathId);
    //}
}
