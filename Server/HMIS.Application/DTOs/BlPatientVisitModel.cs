using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs
{
    public class BlPatientVisitModel
    {
        public string? Mrno { get; set; }
        public string? Date { get; set; }
        public string? user { get; set; }
        public int? AppId { get; set; }
    }
}
