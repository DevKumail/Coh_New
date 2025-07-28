using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("HREmployeeType")]
    public partial class HremployeeType
    {
        [Key]
        [Column("TypeID")]
        public int TypeId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string TypeDescription { get; set; }
        public bool IsProvider { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
