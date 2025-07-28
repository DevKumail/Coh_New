using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegEmploymentType")]
    public partial class RegEmploymentType
    {
        public RegEmploymentType()
        {
            RegPatientEmployers = new HashSet<RegPatientEmployer>();
        }

        [Key]
        public int EmpTypeId { get; set; }
        [StringLength(255)]
        public string EmpType { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("EmploymentType")]
        public virtual ICollection<RegPatientEmployer> RegPatientEmployers { get; set; }
    }
}
