using Dapper;
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
            var medicationLookup = new Dictionary<long, GetMedicationDto>();

            var result = await connection.QueryAsync<GetAllOverviewDetailDto, GetEventDetailDto, GetMedicationDto, GetApplicationDomainDto, GetTimeDetailsDto, GetAllOverviewDetailDto>(
                "IVF_GetOverviewByTreatmentCycle",
                (overview, ev, med, domain, time) =>
                {
                    // Get or create overview
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

                    var calender = ov.Calender.First();
                    var resource = ov.Resources.First();

                    if (ev?.EventId != null && !calender.Events.Any(x => x.EventId == ev.EventId))
                    {
                        calender.Events.Add(ev);
                    }

                    if (med != null && med.MedicationId > 0)
                    {
                        GetMedicationDto existingMed;

                        if (!medicationLookup.TryGetValue(med.MedicationId, out existingMed))
                        {
                            med.ApplicationDomainName = new List<GetApplicationDomainDto>();
                            med.TimeDetails = new List<GetTimeDetailsDto>();

                            calender.Medications.Add(med);
                            medicationLookup.Add(med.MedicationId, med);
                            existingMed = med;

                            if (!resource.AllMedications.Any(x => x.DrugId == med.DrugId))
                            {
                                resource.AllMedications.Add(new GetSidebarMedicationDto
                                {
                                    DrugId = med.DrugId,
                                    DrugName = med.DrugName
                                });
                            }
                        }

                        if (domain != null && domain.ApplicationDomainId > 0)
                        {
                            if (!existingMed.ApplicationDomainName.Any(x => x.ApplicationDomainId == domain.ApplicationDomainId))
                            {
                                existingMed.ApplicationDomainName.Add(domain);
                            }
                        }

                        if (time != null && time.TimeId > 0)
                        {
                            if (!existingMed.TimeDetails.Any(x => x.TimeId == time.TimeId))
                            {
                                existingMed.TimeDetails.Add(time);
                            }
                        }
                    }

                    return ov;
                },
                new { IVFDashboardTreatmentCycleId = treatmentCycleId },
                splitOn: "EventId,MedicationId,domainId,timeId",
                commandType: CommandType.StoredProcedure
            );

            return lookup.Values.FirstOrDefault();
        }
    }
}
