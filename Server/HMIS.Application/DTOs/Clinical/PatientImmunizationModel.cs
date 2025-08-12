using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Clinical
{
    public class PatientImmunizationModel
    {
        public long Id { get; set; }
        public long? AppointmentId { get; set; }
        public long? DrugTypeId { get; set; }
        public long? ProviderId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string Comments { get; set; }
        public byte? Status { get; set; }
        public bool Active { get; set; }

        public string ManufacturerName { get; set; }

        public string LotNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? InjectionDate { get; set; }
   
        public DateTime? NextInjectionDate { get; set; }

        public string SiteInjection { get; set; }
        public long UpdatedBy { get; set; }
        public long CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }

        public string Mrno { get; set; }

        public string DrugName { get; set; }
        public long? RouteId { get; set; }

        public DateTime? Visdate { get; set; }


        public string ProviderName { get; set; }
        public long? ImmTypeId { get; set; }

        public string ErrorReason { get; set; }

        public string Dose { get; set; }

        public string providerDescription { get; set; }
        public string OldMrno { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
