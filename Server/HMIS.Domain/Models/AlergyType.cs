namespace HMIS.Domain.Entities
{
    public class AlergyType
    {
        public long AlergyTypeId { get; set; }
        public string AlergyName { get; set; }
        public string Description { get; set; }
        public bool? InActive { get; set; }
        public string Code { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
