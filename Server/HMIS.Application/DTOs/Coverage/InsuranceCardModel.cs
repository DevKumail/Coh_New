using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Coverage
{
    public class InsuranceCardModel
    {
        public long PayerId { get; set; }
        public IFormFile image { get; set; }
    }
}
