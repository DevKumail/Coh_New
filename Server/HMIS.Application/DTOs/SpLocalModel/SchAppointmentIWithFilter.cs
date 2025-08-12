using HMIS.Application.DTOs.SpLocalModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace HMIS.Application.DTOs.AppointmentDTOs.SpLocalModel
{
    public class SchAppointmentIWithFilter
    {
        public int? providerId { get; set; }
        public int? facilityId { get; set; }
        public int? siteId { get; set; }
        public int? locationId { get; set; }
        public int? specialityId { get; set; }
        public int? criteriaId { get; set; }
        public int? visitTypeId { get; set; }
        public int? appointmentId { get; set; }
        public string? fromDate { get; set; }
        public string? toDate { get; set; }
        public class SchAppointmentIWithFilterRequest
        {
            public SchAppointmentIWithFilter? SchAppointmentList { get; set; }
            public PaginationInfo? PaginationInfo { get; set; }
        }
    }
}