using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("EMRFrequency")]
    public partial class Emrfrequency
    {
        [Key]
        public int FrequencyId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        public bool? Active { get; set; }
    }
}
