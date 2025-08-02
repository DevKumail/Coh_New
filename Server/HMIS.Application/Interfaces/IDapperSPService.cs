using Dapper;
using System.Data;
using System.Threading.Tasks;

namespace HMIS.Application.Interfaces
{
    public interface IDapperSPService
    {
        Task<DataSet> GetDataSetAsync(string spName, DynamicParameters parameters = null);
        Task<bool> ExecuteStoredProcedureAsync(string spName, DynamicParameters parameters);
    }
}
