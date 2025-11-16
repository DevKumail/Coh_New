namespace HMIS.Application.DTOs.IVFDTOs
{
    public class AllExceptSelfPatientsReadDTO
    {
        public int MrNo { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Phone {get;set;}
        public string EID {get;set;}
        public DateTime DateOfBirth { get; set; }
    }
}
