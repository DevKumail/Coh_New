using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.SpLocalModel
{
    public class TempDemographicListModel
    {
        public int? Mrno { get; set; }

        public long? TempId { get; set; }

        public string? Name { get; set; }

        public string? DOB { get; set; }

        public string? Gender { get; set; }
        public string? Email { get; set; }

        public int? Country { get; set;}

    }

    public class TempDemographicList
    {
        public TempDemographicListModel? TempListReq { get; set; }

        public PaginationInfo? paginationInfo { get; set; } 
    }

}
