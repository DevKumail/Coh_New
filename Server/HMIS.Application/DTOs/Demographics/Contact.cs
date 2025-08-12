using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Demographics
{
    public class Contact
    {
        public string? StreetName { get; set; }
        public string? DwellingNumber { get; set; }
    
        public int? CountryId { get; set; }
    
        public int? StateId { get; set; }
       
        public int? CityId { get; set; }
        public string PostalCode { get; set; }

        public string CellPhone { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public int? TabsTypeId { get; set; }

    }
}
