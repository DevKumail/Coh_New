using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.SpLocalModel
{
    public class CoverageListModel
    {
        public int? Mrno { get; set; }

    }
    public class CoverageList
    {
        public CoverageListModel? CoverageListReq { get; set; }
        public PaginationInfo? PaginationInfo { get; set; }

    }
}
