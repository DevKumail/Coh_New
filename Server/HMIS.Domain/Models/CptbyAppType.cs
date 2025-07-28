using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("CPTByAppType")]
    public partial class CptbyAppType
    {
        public CptbyAppType()
        {
            CptsInCptbyAppTypes = new HashSet<CptsInCptbyAppType>();
        }

        [Key]
        public long GroupId { get; set; }
        [Required]
        [StringLength(50)]
        public string GroupName { get; set; }
        public int AppTypeId { get; set; }
        public bool Active { get; set; }
        public bool Approve { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedDate { get; set; }
        [Required]
        [StringLength(50)]
        public string CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime UpdatedDate { get; set; }
        [Required]
        [StringLength(50)]
        public string UpdatedBy { get; set; }

        [ForeignKey("AppTypeId")]
        [InverseProperty("CptbyAppTypes")]
        public virtual SchAppointmentType AppType { get; set; }
        [InverseProperty("Group")]
        public virtual ICollection<CptsInCptbyAppType> CptsInCptbyAppTypes { get; set; }
    }
}
