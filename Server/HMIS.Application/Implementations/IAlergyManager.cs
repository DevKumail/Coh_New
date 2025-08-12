using HMIS.Application.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IAlergyManager
    {
        Task<DataSet> GetAlergyDetailsDB(string mrno);

        Task<bool> InsertOrUpdateAlergy(AlergyModel alergyModel);


        Task<bool> DeleteAlergy(long Id);
    }
}
