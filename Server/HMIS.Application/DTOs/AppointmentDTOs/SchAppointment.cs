using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.AppointmentDTOs
{
    public class SchAppointmentModel
    {
        public long AppId { get; set; }
        [Required(ErrorMessage = "Select Provider Name.")]
        public long ProviderId { get; set; }
        [Required(ErrorMessage = "Select a Patient for Appointment.")]
        public string? MRNo { get; set; }
        [Required(ErrorMessage = "Appointment Time Required.")]
        public DateTime AppDateTime { get; set; }
        public int Duration { get; set; }
        public string? AppNote { get; set; }
        [Required(ErrorMessage = "Select Site Name.")]
        public int SiteId { get; set; }

        [Required(ErrorMessage = "Select Facility Name.")]
        public int? FacilityId { get; set; }
        public int LocationId { get; set; }
        [Required(ErrorMessage = "Select Appointment Type.")]
        public int? AppTypeId { get; set; }
        [Required(ErrorMessage = "Select Appointment Criteria.")]
        public int? AppCriteriaId { get; set; }
        [Required(ErrorMessage = "Select Appointment Status.")]
        public int AppStatusId { get; set; }
        public int PatientStatusId { get; set; }
        public long? ReferredProviderId { get; set; }
        public bool IsPatientNotified { get; set; }
        public bool IsActive { get; set; }
        public string? EnteredBy { get; set; }
        [Required(ErrorMessage = "Select Visit Type.")]
        public int? VisitTypeId { get; set; }
        public DateTime EntryDateTime { get; set; }
        public DateTime? DateTimeNotYetArrived { get; set; }
        public DateTime? DateTimeCheckIn { get; set; }
        public DateTime? DateTimeReady { get; set; }
        public DateTime? DateTimeSeen { get; set; }
        public DateTime? DateTimeBilled { get; set; }
        public DateTime? DateTimeCheckOut { get; set; }
        public string? UserNotYetArrived { get; set; }
        public string? UserCheckIn { get; set; }
        public string? UserReady { get; set; }
        public string? UserSeen { get; set; }
        public string? UserBilled { get; set; }
        public string? UserCheckOut { get; set; }
        [Required(ErrorMessage = "Purpose of Visit Should be selected.")]
        [RegularExpression(@"^.{1,256}$|^((?:[^,]+,){0,9}[^,]+)?$", ErrorMessage = "Invalid input. Maximum of 10 items or 256 characters allowed.")]
        public string? PurposeOfVisit { get; set; }
        public long? PurposeOfVisitId { get; set; }
        public bool UpdateServerTime { get; set; }
        public int? PatientNotifiedId { get; set; }
        public int? RescheduledID { get; set; }
        public bool? ByProvider { get; set; }
        [Required(ErrorMessage = "Select Specialty Name.")]
        public int? SpecialtyID { get; set; }
        [Required(ErrorMessage = "Select Payer Name.")]
        public long? PayerId { get; set; }

        public bool VisitStatusEnabled { get; set; }
        public long? Anesthesiologist { get; set; }
        public long? CPTGroupId { get; set; }
        public int? AppointmentClassification { get; set; }
        public long? OrderReferralId { get; set; } = -1;
        public string? TelemedicineURL { get; set; }
        public int? VisitStatusId { get; set; }

        public string PatientBalance { get; set; }
        public string PlanBalance { get; set; }
        public string PlanCopay { get; set; }
        public long? EmployeeId { get; set; }
        public long? PlanId { get; set; }
        public long? PatientId { get; set; }
        public string? date { get; set; }
        public string? time { get; set; }
    }
}
