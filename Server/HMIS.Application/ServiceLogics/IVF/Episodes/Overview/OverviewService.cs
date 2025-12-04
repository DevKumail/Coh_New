using Dapper;
using DocumentFormat.OpenXml.Office2010.Excel;
using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
using HMIS.Core.Context;
using HMIS.Infrastructure.ORM;
using System.Data;

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Overview
{
    public interface IOverviewService
    {
        Task<GetAllOverviewDetailDto> GetOverviewByTreatmentCycleAsync(long treatmentCycleId);
    }
    public class OverviewService : IOverviewService
    {
        private readonly DapperContext _dapper;
        private readonly HMISDbContext _context;
        public OverviewService(DapperContext dapper, HMISDbContext context)
        {
            _dapper = dapper;
            _context = context;
        }

        public async Task<GetAllOverviewDetailDto> GetOverviewByTreatmentCycleAsync(long treatmentCycleId)
        {
            using var connection = _dapper.CreateConnection();

            var lookup = new Dictionary<long, GetAllOverviewDetailDto>();

            var result = await connection.QueryAsync<
                GetAllOverviewDetailDto,
                GetEventDetailDto,
                GetMedicationDto,
                string,
                TimeSpan?,
                GetAllOverviewDetailDto
            >(
                "[dbo].[IVF_GetOverviewByTreatmentCycle]", // Stored Procedure Name
                (overview, evt, med, appDomain, time) =>
                {
                    if (!lookup.TryGetValue(overview.OverviewId, out var o))
                    {
                        o = overview;
                        o.Calender = new List<GetCalenderDto>
                        {
                    new GetCalenderDto
                    {
                        Events = new List<GetEventDetailDto>(),
                        Medications = new List<GetMedicationDto>()
                    }
                        };
                        lookup.Add(o.OverviewId, o);
                    }

                    var calendar = o.Calender[0];

                    // Event Grouping
                    if (evt?.EventId != null && !calendar.Events.Any(e => e.EventId == evt.EventId))
                        calendar.Events.Add(evt);

                    // Medication Grouping
                    if (med != null)
                    {
                        var existingMed = calendar.Medications
                            .FirstOrDefault(x => x.MedicationId == med.MedicationId);

                        if (existingMed == null)
                        {
                            existingMed = med;
                            calendar.Medications.Add(existingMed);
                        }

                        if (!string.IsNullOrEmpty(appDomain) &&
                            !existingMed.ApplicationDomainName.Contains(appDomain))
                        {
                            existingMed.ApplicationDomainName.Add(appDomain);
                        }

                        if (time.HasValue)
                            existingMed.Time.Add(time.Value);
                    }

                    return o;
                },
                new { IVFDashboardTreatmentCycleId = treatmentCycleId },
                splitOn: "EventId,MedicationId,ApplicationDomainName,Time",
                commandType: CommandType.StoredProcedure
            );

            return lookup.Values.FirstOrDefault();
        }

    }
}
