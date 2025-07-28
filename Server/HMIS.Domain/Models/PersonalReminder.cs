using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class PersonalReminder
    {
        [Key]
        public int ReminderId { get; set; }
        public int EmployeeId { get; set; }
        [Required]
        [StringLength(300)]
        [Unicode(false)]
        public string ReminderText { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime ReminderDateTime { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedOn { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string UpdatedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
