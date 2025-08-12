using HMIS.Application.DTOs.PermissionDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HMIS.Application.DTOs.ControlPanel;

namespace HMIS.Application.DTOs.AuthenticateDTOs
{
    public class AuthenticateUserResponse
    {
        public Hremployee User { get; set; }
        public List<Permissions> permissions { get; set; }
    }
}
