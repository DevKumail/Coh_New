using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Demographics
{
    public class Spouse
    {
        public string? firstName { get; set; }

        public string? middleName { get; set; }

        public string? lastName { get; set; }

        public int? genderId { get; set; }

        public int? TabsTypeId { get; set; }
    }
}
