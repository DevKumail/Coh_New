using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class Vwprovider
{
    public int EmployeeId { get; set; }

    [StringLength(1)]
    [Unicode(false)]
    public string FullName { get; set; } = null!;
}
