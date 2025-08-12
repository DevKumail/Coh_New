﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("PatientBillInvoice")]
public partial class PatientBillInvoice
{
    [Key]
    public long InvoiceId { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? InvoiceGeneratedDate { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? ReceiptNo { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? EnteredBy { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public bool? IsDeleted { get; set; }

    public long? AppointmentId { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("PatientBillInvoices")]
    public virtual SchAppointment? Appointment { get; set; }
}
