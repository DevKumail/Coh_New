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

            var parameters = new DynamicParameters();
            parameters.Add("@IVFDashboardTreatmentCycleId", treatmentCycleId, DbType.Int64);

            var lookup = new Dictionary<long, GetAllOverviewDetailDto>();

            var result = await connection.QueryAsync<GetAllOverviewDetailDto, GetEventDetailDto, GetMedicationDto, GetAllOverviewDetailDto>(
                "IVF_GetOverviewByTreatmentCycle",
                (overview, ev, med) =>
                {
                    if (!lookup.TryGetValue(overview.OverviewId, out var ov))
                    {
                        ov = overview;
                        ov.Calender = new List<GetCalenderDto>
                                    {
                                       new GetCalenderDto
                                       {
                                           Events = new List<GetEventDetailDto>(),
                                           Medications = new List<GetMedicationDto>()
                                       }
                                    };
                        ov.Resources = new List<GetResourcesDetailDto>
                        {
                            new GetResourcesDetailDto
                            {
                                AllMedications = new List<GetSidebarMedicationDto>()
                            }
                        };
                        lookup.Add(ov.OverviewId, ov);
                    }

                    var cal = ov.Calender.First();

                    if (ev?.EventId != null)
                    {
                        if (!cal.Events.Any(x => x.EventId == ev.EventId))
                            cal.Events.Add(ev);
                    }

                    if (med?.MedicationId > 0)
                    {
                        var existingMed = cal.Medications.FirstOrDefault(x => x.DrugId == med.DrugId);
                        if (existingMed == null)
                        {
                            cal.Medications.Add(med);

                            var res = ov.Resources.First();
                            if (!res.AllMedications.Any(x => x.DrugId == med.DrugId))
                                res.AllMedications.Add(new GetSidebarMedicationDto
                                {
                                    DrugId = med.DrugId,
                                    DrugName = med.DrugName
                                });

                            existingMed = med;
                        }

                        if (!string.IsNullOrEmpty(med.ApplicationDomainName?.FirstOrDefault()))
                            existingMed.ApplicationDomainName.AddRange(med.ApplicationDomainName);

                        if (med.Time?.Any() == true)
                            existingMed.Time.AddRange(med.Time);
                    }

                    return ov;
                },
                new { IVFDashboardTreatmentCycleId = treatmentCycleId },
                splitOn: "EventId,MedicationId",
                commandType: CommandType.StoredProcedure
            );

            return lookup.Values.FirstOrDefault();
        }

    }
}
