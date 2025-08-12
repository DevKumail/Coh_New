using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Infrastructure.Logger
{
    public class LogParameter
    {

        public long? UserLoginHistoryId { get; set; }
        public long? ActionId { get; set; }

        public DateTime ActionTime { get; set; }

        public string UserName { get; set; }


        public string ModuleName { get; set; }

        public string FormName { get; set; }


        public string ActionDetails { get; set; }

        public short TablesReadOrModified { get; set; }


        public string Message { get; set; }



        public string MachineIP { get; set; }


        public string MRNo { get; set; }

    }
}
