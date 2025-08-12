using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HMIS.Application.DTOs.PermissionDTOs;

namespace HMIS.Application.DTOs
{
    public class Module
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public List<Form> Forms { get; set; }

        public List<Roles> Roles { get; set; }
    }
}
