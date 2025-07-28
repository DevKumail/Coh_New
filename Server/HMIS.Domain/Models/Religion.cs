using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("Religion")]
    public partial class Religion
    {
        [Key]
        public int ReligionId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ReligionName { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string ReligionCode { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
