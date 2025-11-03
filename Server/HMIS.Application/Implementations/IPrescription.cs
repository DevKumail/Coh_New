using HMIS.Application.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IPrescription
    {
        Task<DataSet> GetAllCurrentPrescriptions(string mrno, int? PageNumber, int? PageSize);
        Task<DataSet> GetAllPastPrescriptions(string mrno, int? PageNumber, int? PageSize);


        Task<bool> InsertOrUpdatePrescription(PrescriptionModel prescriptionModel);

        Task<bool> DeletePrescription(long Id);


        Task<DataSet> FilterPrescriptions(string? keyword, int? PageNumber, int? PageSize);


     }
}
