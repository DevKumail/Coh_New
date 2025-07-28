using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegEmploymentStatus")]
    public partial class RegEmploymentStatus
    {
        [Key]
        public int EmpStatusId { get; set; }
        [StringLength(255)]
        public string EmpStatus { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
