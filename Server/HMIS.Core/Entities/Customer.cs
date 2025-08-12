using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Customer")]
[Index("Email", Name = "UQ__Customer__A9D10534C5FBDE9F", IsUnique = true)]
[Index("Cnic", Name = "UQ__Customer__AA570FD43B109747", IsUnique = true)]
public partial class Customer
{
    [Key]
    [Column("CustomerID")]
    public int CustomerId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string CustomerName { get; set; } = null!;

    [Column("CNIC")]
    [StringLength(15)]
    [Unicode(false)]
    public string Cnic { get; set; } = null!;

    [StringLength(12)]
    [Unicode(false)]
    public string Phone { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string? Address { get; set; }

    [Column("CityID")]
    public int? CityId { get; set; }

    [Column("CountryID")]
    public int? CountryId { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [Column("MaritalStatusID")]
    public int? MaritalStatusId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }
}
