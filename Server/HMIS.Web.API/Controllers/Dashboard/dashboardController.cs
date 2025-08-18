using HMIS.Infrastructure.Helpers;
using HMIS.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data;
using HMIS.Application.Implementations;
using HMIS.Application.DTOs.CommonDTOs;
using HMIS.Application.DTOs.DashBoardDTOs.CommonDTOs;
using Microsoft.AspNetCore.Authorization;
using HMIS.Application.ServiceLogics;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Web.Controllers.Dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class dashboardController: BaseApiController
    {
        private readonly HmisContext _context;

        public dashboardController(HmisContext context)
        {
            _context = context;
        }

        [HttpGet("todays-appointments")]
        public IActionResult GetTodaysAppointments(int facilityId)
        {
            try
            {
                var todaysAppointments = _context.SchAppointments
                    .Include(a => a.Patient)
                    .Include(a => a.Site)
                    .Include(a => a.Employee)
                    .Include(a => a.Facility)
                    .Where(a => EF.Functions.DateDiffDay(a.AppDateTime, DateTime.Now) == 0 && a.FacilityId == facilityId)
                    .Select(a => new TodaysAppointmentDTO
                    {
                        MRNo = a.Mrno,
                        PatientName = a.Patient.PersonFirstName +" "+ a.Patient.PersonMiddleName +" "+  a.Patient.PersonLastName,
                        ProviderName = a.Employee.FullName,
                        FacilityId = a.FacilityId,
                        FacilityName = a.Facility.Name,
                        SiteId = a.SiteId,
                        SiteName = a.Site.Name,
                        AppDateTime = a.AppDateTime,
                    })
                    .ToList();

                int totalAppointmentsCount = todaysAppointments.Count;

                return Ok(new { TodaysAppointments = todaysAppointments, TotalAppointmentsCount = totalAppointmentsCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("todays-checkIn")]
        public IActionResult GetTodaysCheckIns(int facilityId)
        {
            try
            {
                var todaysCheckIns = _context.SchAppointments
                    .Include(a => a.Patient)
                    .Include(a => a.Facility)
                    .Include(a => a.Site)
                    .Include(a => a.Employee)
                    .Where(a => EF.Functions.DateDiffDay(a.AppDateTime, DateTime.Now) == 0 && a.PatientStatusId == 2 && a.FacilityId == facilityId)
                    .Select(a => new TodaysCheckInDTO
                    {
                        MRNo = a.Mrno,
                        FacilityId = a.FacilityId,
                        FacilityName = a.Facility.Name,
                        SiteId = a.SiteId,
                        SiteName = a.Site.Name,
                        AppDateTime = a.AppDateTime,
                        ProviderId = a.ProviderId,
                        ProviderName = a.Employee.FullName,
                        PatientName = a.Patient.PersonFirstName + " " + a.Patient.PersonMiddleName + " " + a.Patient.PersonLastName
                    })
                    .ToList();

                int totalCheckInsCount = todaysCheckIns.Count;

                return Ok(new { TodaysCheckIns = todaysCheckIns, TotalCheckInsCount = totalCheckInsCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("doctor-availability")]
        public IActionResult GetDoctorAvailability(int facilityId)
        {
            try
            {
                int currentDayOfWeek = (int)DateTime.Now.DayOfWeek;

                if (currentDayOfWeek == 0)
                {
                    currentDayOfWeek = 6;
                }
                else
                {
                    currentDayOfWeek--;
                }

                DateTime startDate = DateTime.Now.Date.AddDays(-currentDayOfWeek);

                DateTime endDate = startDate.AddDays(6);
                List<DoctorAvailabilityDTO> doctorAvailability = _context.ProviderSchedules
                    .Where(ps =>
                                (ps.Monday == true && currentDayOfWeek == 0) ||
                                (ps.Tuesday == true && currentDayOfWeek == 1) ||
                                (ps.Wednesday == true && currentDayOfWeek == 2) ||
                                (ps.Thursday == true && currentDayOfWeek == 3) ||
                                (ps.Friday == true && currentDayOfWeek == 4) ||
                                (ps.Saturday == true && currentDayOfWeek == 5) ||
                                (ps.Sunday == true && currentDayOfWeek == 6) &&
                                (ps.FacilityId == facilityId)
                            )

                    .Select(ps => new DoctorAvailabilityDTO
                    {
                        StartTime = ps.StartTime,
                        EndTime = ps.EndTime,
                        FacilityId = ps.FacilityId,
                        ProviderId= ps.ProviderId,
                        AvailableDays = (
                                (ps.Monday == true ? "Monday," : "") +
                                (ps.Tuesday == true ? "Tuesday," : "") +
                                (ps.Wednesday == true ? "Wednesday," : "") +
                                (ps.Thursday == true ? "Thursday," : "") +
                                (ps.Friday == true ? "Friday," : "") +
                                (ps.Saturday == true ? "Saturday," : "") +
                                (ps.Sunday == true ? "Sunday," : "")
                            ).TrimEnd(',')
                    })
                    .ToList();

                foreach (var Availability in doctorAvailability)
                {

                   var Avb= _context.Hremployees.ToList();
                    Availability.ProviderName = Avb.Where(x => x.EmployeeId == Availability.ProviderId).Select(x=>x.FullName).FirstOrDefault();
                    var fac = _context.RegFacilities.ToList();
                    Availability.FacilityName = fac.Where(x => x.Id == Availability.FacilityId).Select(x => x.Name).FirstOrDefault();


                }
                int totalProvider = doctorAvailability.Count();
                return Ok(new { DoctorsAvailability = doctorAvailability, TotalProvider = totalProvider });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


    }
}
