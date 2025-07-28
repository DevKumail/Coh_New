using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegGender")]
    public partial class RegGender
    {
        public RegGender()
        {
            RegPatientDetails = new HashSet<RegPatientDetail>();
        }

        [Key]
        public int GenderId { get; set; }
        [StringLength(255)]
        public string Gender { get; set; }
        public bool? IsDeleted { get; set; }
        [StringLength(255)]
        public string GenderCode { get; set; }

        [InverseProperty("Gender")]
        public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; }
    }
}
