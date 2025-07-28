using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    public partial class VwSitebySpecialityid
    {
        [Required]
        [StringLength(35)]
        [Unicode(false)]
        public string SiteName { get; set; }
        public int SiteId { get; set; }
        [Column("SpecialtyID")]
        public int SpecialtyId { get; set; }
    }
}
