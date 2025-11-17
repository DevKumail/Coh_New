namespace HMIS.Application.DTOs.IVFDTOs
{
    public class InsertPatientRelationDTO
    {
        public string PrimaryMrNo { get; set; }
        public string SecondaryMrNo { get; set; }
        public int RelationshipId { get; set; } = 4; // spouse
    }
}
