namespace HMIS.Application.DTOs.IVFDTOs
{
    public class InsertIvfRelationDTO
    {
        public string PrimaryMrNo { get; set; }
        public string SecondaryMrNo { get; set; }
        public long VisitAccountNo { get; set; }
        public bool? PrimaryIsMale { get; set; }
    }
}
