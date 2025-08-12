using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IEncounterManager
    {
        Task<DataSet> GetEncounterByMRNoDB(string MRNo, int? PageNumber, int? PageSize);
    }
}
