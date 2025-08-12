using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Demographics
{
    public class NextOfKin
    {
        public int? relationshipId { get; set; }

        public string? firstName { get; set; }

        public string? middleName { get; set; }

        public string? lastName { get; set; }

        public string? streetName { get; set; }

        public int?  NokdwellingNumber { get; set; }

        public int? countryId { get; set; }

        public int? stateId { get; set; }

        public int? cityId { get; set; }

        public int? postalCode { get; set; }

        public int? cellPhone { get; set; }

        public int? homePhone { get; set; }

        public int?  workPhone { get; set; }

        public int? TabsTypeId { get; set; }

    }
}
