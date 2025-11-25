using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class LabTestTreeNodeDTO
    {
        public long Id { get; set; }
        public long? ParentId { get; set; }
        public string Label { get; set; }
        public string CptCode { get; set; }
        public bool IsProfile { get; set; }
        public bool IsCategory { get; set; }
        public bool Selectable { get; set; }
        public int? SampleTypeId { get; set; }
        public string SampleTypeName { get; set; }
        public List<LabTestTreeNodeDTO> Children { get; set; } = new List<LabTestTreeNodeDTO>();
    }

    public class LabTestTreeResponseDTO
    {
        public bool Disabled { get; set; }
        public List<LabTestTreeNodeDTO> Data { get; set; } = new List<LabTestTreeNodeDTO>();
    }
}
