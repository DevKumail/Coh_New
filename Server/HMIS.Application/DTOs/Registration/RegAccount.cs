using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Registration
{
    public class RegAccount
    {
        //public long? PatientId { get; set; }
        //public string MRNo { get; set; }
        // public string? AccountNo { get; set; }
        public bool? TypeId { get; set; }
        public string? MasterAccountNo { get; set; }
        public int? RelationshipId { get; set; }
    }
}
