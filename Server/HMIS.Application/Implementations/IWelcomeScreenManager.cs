using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IWelcomeScreenManager
    {
        Task<DataSet> TaskToDoGetDB(long ReceiverId, long? ReceiverRoleId, string FacilityIds, int pageNumber = 1, int pageSize = 10);
        Task<DataSet> PersonalRemindersGetDB(long employeeId, int pageNumber = 1, int pageSize = 10, string sortColumn = "ReminderDateTime", string sortOrder = "DESC");
        Task<DataSet> SchAppointmentsLoadDB(DateTime fromDate, DateTime toDate, long providerId, int siteId, string facilityId, int pageNumber = 1, int pageSize = 10);
        Task<bool> InsertReminderDB(int employeeId, string reminderText, DateTime reminderDateTime, string createdBy);
        Task<bool> UpdatePersonalReminderDB(int reminderId, int employeeId, string reminderText, DateTime reminderDateTime, string updatedBy);
        Task<bool> DeletePersonalReminderDB(int reminderId);
    }
}
