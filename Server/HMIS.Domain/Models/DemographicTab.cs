using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    public partial class DemographicTab
    {
        public int? TabId { get; set; }
        public string TabName { get; set; }
    }
}
