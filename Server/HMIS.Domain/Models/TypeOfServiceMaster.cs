using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("TypeOfServiceMaster")]
    public partial class TypeOfServiceMaster
    {
        public TypeOfServiceMaster()
        {
            BlcptmasterRanges = new HashSet<BlcptmasterRange>();
        }

        [Key]
        public int ServiceTypeId { get; set; }
        [Required]
        [StringLength(200)]
        [Unicode(false)]
        public string Name { get; set; }
        public bool? Active { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("ServiceType")]
        public virtual ICollection<BlcptmasterRange> BlcptmasterRanges { get; set; }
    }
}
