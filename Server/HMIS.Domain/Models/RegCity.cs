using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class RegCity
    {
        public RegCity()
        {
            InsuredSubscribers = new HashSet<InsuredSubscriber>();
            RegPatientDetails = new HashSet<RegPatientDetail>();
            RegPatientTempNokcities = new HashSet<RegPatientTemp>();
            RegPatientTempPersonCities = new HashSet<RegPatientTemp>();
        }

        [Key]
        public int CityId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Description { get; set; }
        public int StateId { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("City")]
        public virtual ICollection<InsuredSubscriber> InsuredSubscribers { get; set; }
        [InverseProperty("City")]
        public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; }
        [InverseProperty("Nokcity")]
        public virtual ICollection<RegPatientTemp> RegPatientTempNokcities { get; set; }
        [InverseProperty("PersonCity")]
        public virtual ICollection<RegPatientTemp> RegPatientTempPersonCities { get; set; }
    }
}
