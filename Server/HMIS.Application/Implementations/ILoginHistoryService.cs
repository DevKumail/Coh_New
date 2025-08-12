using HMIS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface ILoginHistoryService
    {
        public void LogHistory(LoginUserHistory userlogin);
    }
}
