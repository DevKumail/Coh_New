namespace HMIS.Domain.Entities
{
    public class Action
    {
        public long ActionId { get; set; }
        public string ActionName { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
