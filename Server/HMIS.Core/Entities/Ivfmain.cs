using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMain")]
public partial class Ivfmain
{
    [Key]
    [Column("IVFMainId")]
    public int IvfmainId { get; set; }

    public long MalePatientId { get; set; }

    public long FemalePatientId { get; set; }

    public long? AppId { get; set; }

    [ForeignKey("AppId")]
    [InverseProperty("Ivfmain")]
    public virtual SchAppointment? App { get; set; }

    [ForeignKey("FemalePatientId")]
    [InverseProperty("IvfmainFemalePatient")]
    public virtual RegPatient FemalePatient { get; set; } = null!;

    [InverseProperty("Ivfmain")]
    public virtual ICollection<IvfdashboardTreatmentCycle> IvfdashboardTreatmentCycle { get; set; } = new List<IvfdashboardTreatmentCycle>();

    [InverseProperty("Ivfmain")]
    public virtual ICollection<IvffemaleFertilityHistory> IvffemaleFertilityHistory { get; set; } = new List<IvffemaleFertilityHistory>();

    [InverseProperty("Ivfmain")]
    public virtual ICollection<IvfmaleFertilityHistory> IvfmaleFertilityHistory { get; set; } = new List<IvfmaleFertilityHistory>();

    [InverseProperty("Ivfmain")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSample { get; set; } = new List<IvfmaleSemenSample>();

    [ForeignKey("MalePatientId")]
    [InverseProperty("IvfmainMalePatient")]
    public virtual RegPatient MalePatient { get; set; } = null!;
}
