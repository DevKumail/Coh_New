using HMIS.Service.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.Implementations
{
    public interface IPrescription
    {
        Task<DataSet> GetAllPrescriptions(string mrno);

        Task<bool> InsertOrUpdatePrescription(PrescriptionModel prescriptionModel);

        Task<bool> DeletePrescription(long Id);


        Task<DataSet> FilterPrescriptions(string keyword);


     }
}
