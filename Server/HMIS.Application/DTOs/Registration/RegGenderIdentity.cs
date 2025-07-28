using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Registration
{
    public class RegGenderIdentity
    {
        public long GenderIdentityId { get; set; }
        public string GenderText { get; set; }
        public bool? Active { get; set; }
    }
}
