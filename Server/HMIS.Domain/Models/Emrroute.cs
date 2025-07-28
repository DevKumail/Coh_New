﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("EMRRoute")]
    public partial class Emrroute
    {
        public Emrroute()
        {
            PatientImmunizations = new HashSet<PatientImmunization>();
        }

        [Key]
        public long RouteId { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string Name { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Description { get; set; }
        public bool? Active { get; set; }
        public int? SortOrder { get; set; }
        [Column("DhpoRouteID")]
        [StringLength(10)]
        [Unicode(false)]
        public string DhpoRouteId { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string MalaffiRoute { get; set; }

        [InverseProperty("Route")]
        public virtual ICollection<PatientImmunization> PatientImmunizations { get; set; }
    }
}
