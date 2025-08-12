using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.PermissionDTOs
{
    public class PermissionResponseModel
    {
        public List<Module> Modules { get; set; }

        public List<Roles> Roles { get; set; }

        public int? employeeType { get; set; }
        public List<Facilities> Facility { get; set; }
        public List<string> Permissions { get; set; }
    }
}
