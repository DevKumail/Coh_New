using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegTitle")]
    public partial class RegTitle
    {
        public RegTitle()
        {
            RegPatientTemps = new HashSet<RegPatientTemp>();
        }

        [Key]
        public byte TitleId { get; set; }
        [StringLength(255)]
        public string Title { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("PersonTitle")]
        public virtual ICollection<RegPatientTemp> RegPatientTemps { get; set; }
    }
}
