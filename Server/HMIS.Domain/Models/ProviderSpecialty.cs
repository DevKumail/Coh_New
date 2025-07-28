using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("ProviderSpecialty")]
    public partial class ProviderSpecialty
    {
        public ProviderSpecialty()
        {
            ProviderSchedules = new HashSet<ProviderSchedule>();
        }

        [Key]
        [Column("SpecialtyID")]
        public int SpecialtyId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string SpecialtyName { get; set; }
        [StringLength(4)]
        [Unicode(false)]
        public string SpecialtyCode { get; set; }
        [Required]
        public bool? Active { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string MappingForReferralOffice { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("Speciality")]
        public virtual ICollection<ProviderSchedule> ProviderSchedules { get; set; }
    }
}
