using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFOrderGridParentDTO
    {
        public long OrderSetId { get; set; }
        public string OrderNumber { get; set; }
        public string SampleDepDate { get; set; }
        public string Time { get; set; }
        public string Clinician { get; set; }
        public string Material { get; set; }
        public string Laboratory { get; set; }
        public string Status { get; set; }
        public int StatusId { get; set; }
        public string Comment { get; set; }
        public List<IVFOrderGridRowDTO> Children { get; set; } = new();
    }

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
        public int StatusId { get; set; }
        public string Comment { get; set; } // PComments
    }
}
