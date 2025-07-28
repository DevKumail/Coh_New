using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("FinancialClass")]
    public partial class FinancialClass
    {
        [Key]
        public byte Id { get; set; }
        public string Name { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
