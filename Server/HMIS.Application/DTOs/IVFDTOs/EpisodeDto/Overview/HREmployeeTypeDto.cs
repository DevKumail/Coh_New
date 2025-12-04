namespace HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview
{
    public class HREmployeeTypeDto
    {
        public long TypeID { get; set; }
        public string TypeDescription { get; set; }
    }

    public class HREmployeeDto
    {
        public long EmployeeId { get; set; }
        public string FullName { get; set; }
    }
}
