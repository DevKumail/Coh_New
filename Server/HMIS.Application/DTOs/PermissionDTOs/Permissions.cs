using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.PermissionDTOs
{
    public class Permissions
    {
        public long RoleId { get; set; }
        public string RoleName { get; set; }
        public long FormPrivilegeId { get; set; }
        public long PrivilegeId { get; set; }
        public string PrivilegeName { get; set; }
        public long FormId { get; set; }
        public string FormName { get; set; }
        public long ModuleId { get; set; }
        public string ModuleName { get; set; }
    }
}
