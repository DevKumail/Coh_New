using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    public partial class VwProviderbySiteid
    {
        [StringLength(50)]
        [Unicode(false)]
        public string FullName { get; set; }
        public long EmployeeId { get; set; }
        public int TypeId { get; set; }
    }
}
