using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class RegCountry
    {
        public RegCountry()
        {
            InsuredSubscribers = new HashSet<InsuredSubscriber>();
            RegPatientTempNokcountries = new HashSet<RegPatientTemp>();
            RegPatientTempPersonCountries = new HashSet<RegPatientTemp>();
        }

        [Key]
        public int CountryId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Description { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string MalaffiCode { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("Country")]
        public virtual ICollection<InsuredSubscriber> InsuredSubscribers { get; set; }
        [InverseProperty("Nokcountry")]
        public virtual ICollection<RegPatientTemp> RegPatientTempNokcountries { get; set; }
        [InverseProperty("PersonCountry")]
        public virtual ICollection<RegPatientTemp> RegPatientTempPersonCountries { get; set; }
    }
}
