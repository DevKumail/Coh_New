using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.PermissionDTOs
{
    public class Form
    {

        public long Id { get; set; }

        public string FormName { get; set; }

        public List<FormPrivilege> FormPrivileges { get; set; }
    }
}
