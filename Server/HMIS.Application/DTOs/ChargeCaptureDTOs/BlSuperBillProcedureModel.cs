using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.ChargeCaptureDTOs
{
    public class BlSuperBillProcedureModel
    {
        public long ProcedureId { get; set; }
        public long? VisitAccountNo { get; set; }

        public DateTime? DateOfServiceFrom { get; set; }

        public DateTime? DateOfServiceTo { get; set; }

        public string PlaceOfService { get; set; }

        public string TypeOfService { get; set; }

        public string ProcedureType { get; set; } = null!;

        public string ProcedureCode { get; set; }

        public string Modifier1 { get; set; }

        public string Modifier2 { get; set; }

        public string Modifier3 { get; set; }

        public string Modifier4 { get; set; }

        public string DiagnosisCode { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? Units { get; set; }

        public decimal? Charges { get; set; }

        public string EpsdtfamilyPlan { get; set; }

        public string Emg { get; set; }

        public string Cob { get; set; }

        public string ReservedForLocalUse { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public string LastUpdatedBy { get; set; }

        public string PerformedOnFacility { get; set; }
        public bool? IsLabTest { get; set; }

        public decimal? Discount { get; set; }
        public bool? Confidential { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }


        public string Hl7procedureType { get; set; }

        public string ProcedurePriority { get; set; }

        public string AssociatedDiagnosisCode { get; set; }

        public long? PrimaryAnestheticId { get; set; }

        public string TypeOfAnesthesia { get; set; }

        public DateTime? AnesthesiaStartDateTime { get; set; }

        public DateTime? AnesthesiaEndDateTime { get; set; }

        public bool? IsHl7msgCreated { get; set; }

        public Guid? ItemId { get; set; }

        public string Description { get; set; }
        public long? OrderSetDetailId { get; set; }
        public Guid? DrugAdminId { get; set; }
        public bool? Covered { get; set; }

        public decimal? ProviderDiscount { get; set; }

        public string LotNo { get; set; }
        public long? DrugId { get; set; }

        public string ToothCode { get; set; }
        public bool? ToothCodeRequired { get; set; }

        public decimal? Patientshare { get; set; }

        public string PatientShareCategory { get; set; }

        public decimal? ChargesWithVat { get; set; }

        public decimal? Vatpercentage { get; set; }

        public decimal? Vatamount { get; set; }

        public decimal? PatientshareVat { get; set; }

        public decimal? ChargeswithoutVat { get; set; }

        public string IsIvfbundle { get; set; }
    }
}
