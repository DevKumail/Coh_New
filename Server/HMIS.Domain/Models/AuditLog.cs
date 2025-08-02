namespace HMIS.Domain.Entities
{
    public class AuditLog
    {
        public long AuditLogId { get; set; }
        public DateTime? ActionTime { get; set; }
        public string UserName { get; set; }
        public long? UserLoginHistoryId { get; set; }
        public string ModuleName { get; set; }
        public string FormName { get; set; }
        public long? ActionId { get; set; }
        public string ActionDetails { get; set; }
        public bool? TablesReadOrModified { get; set; }
        public string Mrno { get; set; }
        public string MachineIp { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
