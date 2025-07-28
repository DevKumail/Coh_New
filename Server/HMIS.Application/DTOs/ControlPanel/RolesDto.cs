using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.ControlPanel
{
    public class RolesDto
    {
        public int? RoleId { get; set; }
        //public int? FormPrivilegeId { get; set; }

        //public int? RolePrivilegeId { get; set; }

        public string? RoleName { get; set; }


        public List<AssignRoleDto>?  AssignedRoleList { get; set; }
          
    }
}
