using System;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFOrderGridRowDTO
    {
        public long OrderSetId { get; set; }
        public long OrderSetDetailId { get; set; }
        public string OrderNumber { get; set; } // zero-padded OrderSetId
        public string SampleDepDate { get; set; } // dd.MM.yyyy
        public string Time { get; set; } // HH:mm
        public string Clinician { get; set; }
        public string Name { get; set; } // Lab test name
        public string Material { get; set; } // from LabUnit if available
        public string Laboratory { get; set; } // Internal/External
        public string Status { get; set; } // from IsSigned/OrderStatus
        public string Comment { get; set; } // PComments
    }
}
