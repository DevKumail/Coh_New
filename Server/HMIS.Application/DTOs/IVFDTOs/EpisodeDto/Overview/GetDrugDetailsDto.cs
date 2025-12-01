using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview
{
    public class GetDrugDetailsDto
    {
        public int DrugId { get; set; }
        public string DrugName { get; set; }
        public string Dose { get; set; }
        public string PackageSize { get; set; }
        public string PackageName { get; set; }
        public string GreenRainCode { get; set; }
        public string Color { get; set; }
        public string Form { get;set;}
        public string GenericName { get; set; }
    }
}
