using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientBill
{
    [Key]
    public long TransactionId { get; set; }

    public long ProcedureId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? PatientAccountNo { get; set; }

    [Column(TypeName = "money")]
    public decimal Payment { get; set; }

    [StringLength(12)]
    [Unicode(false)]
    public string? PaymentBy { get; set; }

    public long? ChVerificationId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? AuthorizationCode { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? Date { get; set; }

    [Column("CCType")]
    [StringLength(20)]
    [Unicode(false)]
    public string? Cctype { get; set; }

    [Column("CCAccountNo")]
    [StringLength(16)]
    [Unicode(false)]
    public string? CcaccountNo { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? ChequeNo { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Comments { get; set; }

    [Column(TypeName = "money")]
    public decimal? Disallow { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Reason { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? ReceiptNo { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? PaymentDate { get; set; }

    [Column("HCPCSReceived")]
    [StringLength(5)]
    [Unicode(false)]
    public string? Hcpcsreceived { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? EnteredBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? EnteredDate { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? UpdatedDate { get; set; }

    [StringLength(1)]
    [Unicode(false)]
    public string? MediaStatus { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Bank { get; set; }

    public bool? IsPaymentPosted { get; set; }

    public Guid? AccountGuid { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? InvoiceReference { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? AccPostedDate { get; set; }

    [Column("POSId")]
    public long? Posid { get; set; }

    public bool IsOraclePosted { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? InvoiceNo { get; set; }

    public bool? IsOraclePostedDelete { get; set; }

    public bool? IsPaymentPostedDelete { get; set; }

    public Guid? PaymentGuid { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("ProcedureId")]
    [InverseProperty("PatientBill")]
    public virtual BlsuperBillProcedure Procedure { get; set; } = null!;
}
