namespace HMIS.Domain.Entities
{
    public class AvailableMrno
    {
        public string Mrno { get; set; }
        public string DeletedBy { get; set; }
        public string DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
