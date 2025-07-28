using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.ControlPanel
{
    public class AssignRoleDto
    {
        public int? FormId { get; set; }
        public int? PrivilegeId { get; set; }
        public int? RoleId { get; set; }
        public int? ModuleId { get; set; }

        public string? FormName { get; set; }

        public string? ModuleName { get; set; }

        public string? PrivilageName { get; set; }

 
    }
}
