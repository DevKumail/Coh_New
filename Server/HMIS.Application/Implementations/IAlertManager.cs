using HMIS.Application.DTOs.Clinical;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HMIS.Application.DTOs.Clinical;

namespace HMIS.Application.Implementations
{
    public interface IAlertManager
    {
        Task<DataSet> GetAlertDeatilsDB(string mrno, int? PageNumber, int? PageSize);

        Task<bool> InsertOrUpdateAlert(Alerts_Model Alert);
        
    }
}
