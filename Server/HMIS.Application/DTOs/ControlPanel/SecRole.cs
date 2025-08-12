using HMIS.Application.DTOs.CommonDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.ControlPanel
{
    public class SecRole : ServerPaginationModel
    {
        public int? RoleId { get; set; }

        public string? RoleName { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedOn { get; set; }

        public string? CreatedBy { get; set; }


        public DateTime? UpdatedOn { get; set; }

        public string? UpdatedBy { get; set; }

        public List<SecRoleForm>? SecRoleFormList { get; set; }

        public List<SecPrivilegesAssignedRole>? SecPrivilegesAssignedRoleList { get; set; }


    }
}
