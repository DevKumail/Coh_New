using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Org.BouncyCastle.Crypto.Utilities;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class FertilityHistoryDTO
    {
        public BasicAlphabetMapper Basic { get; set; }
    }
    public class BasicDTO
    {
        public DateTime? date { get; set; }
        public string? attendingClinician { get; set; }
    }
}
