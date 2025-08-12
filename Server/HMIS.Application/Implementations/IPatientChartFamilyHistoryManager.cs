﻿using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IPatientChartFamilyHistoryManager
    {
        //Task<List<PatientChartSocialHistory>> GetAllSocialHistory();

        Task<DataSet> GetAllSocialHistory();
        Task<string> CreateSocialHistory(PatientChartFamilyHistoryModel model);
        Task<bool> DeleteSocialHistoryByShId(long shid);

   //     Task<List<PatientChartFamilyHistory>> GetAllFamilyHistory();
        Task<string> CreateFamilyHistory(PatientChartFamilyHistoryModel model);
        Task<DataSet> GetAllFamilyHistory();
        Task<bool> DeleteFamilyHistoryByFHID(long fhid);
    }
}
