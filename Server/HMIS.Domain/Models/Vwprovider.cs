using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    public partial class Vwprovider
    {
        public int EmployeeId { get; set; }
        [Required]
        [StringLength(1)]
        [Unicode(false)]
        public string FullName { get; set; }
    }
}
