using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    public partial class VwSiteByproviderId
    {
        [Required]
        [StringLength(35)]
        [Unicode(false)]
        public string SiteName { get; set; }
        public int SiteId { get; set; }
        public long EmployeeId { get; set; }
    }
}
