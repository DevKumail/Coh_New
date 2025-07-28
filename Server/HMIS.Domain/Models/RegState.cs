using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class RegState
    {
        public RegState()
        {
            InsuredSubscribers = new HashSet<InsuredSubscriber>();
            RegPatientDetails = new HashSet<RegPatientDetail>();
            RegPatientTempNokstates = new HashSet<RegPatientTemp>();
            RegPatientTempPersonStates = new HashSet<RegPatientTemp>();
        }

        [Key]
        [Column("StateID")]
        public int StateId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Description { get; set; }
        [Column("CountryID")]
        public int CountryId { get; set; }
        [Column("HAADCityCode")]
        [StringLength(5)]
        [Unicode(false)]
        public string HaadcityCode { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("State")]
        public virtual ICollection<InsuredSubscriber> InsuredSubscribers { get; set; }
        [InverseProperty("State")]
        public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; }
        [InverseProperty("Nokstate")]
        public virtual ICollection<RegPatientTemp> RegPatientTempNokstates { get; set; }
        [InverseProperty("PersonState")]
        public virtual ICollection<RegPatientTemp> RegPatientTempPersonStates { get; set; }
    }
}
