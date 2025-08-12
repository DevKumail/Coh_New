using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.SpLocalModel
{
    public class DemographicListModel
    {

        public string? Name { get; set; }    

        public string? Mrno { get; set; }

        public int? GenderId { get; set; }

        public string? Phone { get; set; }

        public class FilterDemographicList
        {
            public DemographicListModel? DemographicList { get; set; }
            public PaginationInfo? PaginationInfo { get; set; }
        }

    }

}
