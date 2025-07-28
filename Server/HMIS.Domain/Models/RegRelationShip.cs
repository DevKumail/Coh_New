using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegRelationShip")]
    public partial class RegRelationShip
    {
        public RegRelationShip()
        {
            PatientChartFamilyHistories = new HashSet<PatientChartFamilyHistory>();
            RegAccounts = new HashSet<RegAccount>();
            RegPatientDetails = new HashSet<RegPatientDetail>();
        }

        [Key]
        public int RelationshipId { get; set; }
        [StringLength(255)]
        public string Relationship { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("RelationShip")]
        public virtual ICollection<PatientChartFamilyHistory> PatientChartFamilyHistories { get; set; }
        [InverseProperty("Relationship")]
        public virtual ICollection<RegAccount> RegAccounts { get; set; }
        [InverseProperty("Relationship")]
        public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; }
    }
}
