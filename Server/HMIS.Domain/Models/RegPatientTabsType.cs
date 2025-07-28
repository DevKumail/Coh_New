using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegPatientTabsType")]
    public partial class RegPatientTabsType
    {
        public RegPatientTabsType()
        {
            RegPatientDetails = new HashSet<RegPatientDetail>();
            RegPatients = new HashSet<RegPatient>();
        }

        [Key]
        public int Id { get; set; }
        [StringLength(50)]
        public string TypeName { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("TabsType")]
        public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; }
        [InverseProperty("TabsType")]
        public virtual ICollection<RegPatient> RegPatients { get; set; }
    }
}
