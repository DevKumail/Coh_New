using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Demographics
{
    public class Employment
    {
        public string? company { get; set; }

        public int? sector_occupationId { get; set; }

        public int? employmentsStatusId { get; set;}

        public int? employmentTypeId { get; set; }

        public int? TabsTypeId { get; set; }
    }
}
