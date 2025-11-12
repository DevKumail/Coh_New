using System.ComponentModel.DataAnnotations;

namespace HMIS.Application.DTOs.CryoDTOs
{
    public class CryoContainerDto
    {
        public long ID { get; set; }

        [Required(ErrorMessage = "Facility ID is required.")]
        public long FacilityID { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Please select container type.")]
        public bool? IsSperm { get; set; } = false;

        public bool? IsOocyteOrEmb { get; set; } = false;

        public string LastAudit { get; set; }
        public int? MaxStrawsInLastLevel { get; set; }

        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;

        // Nested Levels
        public List<CryoLevelADto> LevelA { get; set; } = new List<CryoLevelADto>();
    }


    public class CryoLevelADto
    {
        public long? ID { get; set; }
        [Required(ErrorMessage = "ContainerID is required.")]
        public long ContainerID { get; set; }
        [Required(ErrorMessage = "CanisterCode is required.")]
        public string CanisterCode { get; set; }
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;

        public List<CryoLevelBDto> LevelB { get; set; } = new List<CryoLevelBDto>();
    }

    public class CryoLevelBDto
    {
        public long? ID { get; set; }
        [Required(ErrorMessage = "LevelAID is required.")]
        public long LevelAID { get; set; }
        [Required(ErrorMessage = "CaneCode is required.")]
        public string CaneCode { get; set; }
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;

        public List<CryoLevelCDto> LevelC { get; set; } = new List<CryoLevelCDto>();
    }

    public class CryoLevelCDto
    {
        public long? ID { get; set; }
        [Required(ErrorMessage = "LevelBID is required.")]
        public long LevelBID { get; set; }
        [Required(ErrorMessage = "StrawPosition is required.")]
        public int StrawPosition { get; set; }
        public long? SampleID { get; set; }
        public string Status { get; set; } = "Available";
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    }
}
