using HMIS.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IHolidayScheduleManager
    {
        Task<DataSet> GetHolidayScheduleDB();
        Task<DataSet> GetHolidayScheduleByIdDB(long HolidayScheduleId);
        Task<bool> InsertHolidayScheduleDB(HolidaySchedule hs);
        Task<bool> UpdateHolidayScheduleDB(HolidaySchedule hs);
    }
}
