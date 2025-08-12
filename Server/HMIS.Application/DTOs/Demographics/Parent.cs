using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Demographics
{
    public class Parent
    {
        public string? firstName { get; set; }

        public string? middleName { get; set; }

        public string? lastName { get; set; }

        public int? homePhone { get; set; }

        public int? cellPhone { get; set; }

        public string? email { get; set; }

        public string? motherFirstName { get; set; }

        public string? mothermiddleName { get; set; }

        public string? motherLastName { get; set;}

        public int? motherHomePhone { get; set; }

        public int? motherCellPhone { get;}

        public int? motherEmail { get; set;}

        public int? TabsTypeId { get; set; }

    }
}
