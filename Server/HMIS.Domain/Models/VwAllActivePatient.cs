using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    public partial class VwAllActivePatient
    {
        [Required]
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        [Column("EMPI")]
        [StringLength(20)]
        [Unicode(false)]
        public string Empi { get; set; }
        public int IsTempPatient { get; set; }
        [StringLength(60)]
        [Unicode(false)]
        public string PersonFirstName { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string PersonMiddleName { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string PersonLastName { get; set; }
        [Column("VIPPatient")]
        public bool? Vippatient { get; set; }
    }
}
