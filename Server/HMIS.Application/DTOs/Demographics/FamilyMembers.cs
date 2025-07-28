using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Demographics
{
    public class FamilyMembers
    {   
        public int? mrNo { get; set; }

        public int? accountTypeId { get; set;}

        public int? masterMrNo { get; set;}

        public int? relationshipId { get; set; }

        public int? TabsTypeId { get; set; }
    }
}
