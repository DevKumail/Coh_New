using System.Data;
using Dapper;
using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
using HMIS.Core.Context;
using HMIS.Infrastructure.ORM;

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

        //public async Task<GetAllOverviewDetailDto> getOverviewAsync(long treatmentCycleId)
        //{
        //    using var connection = _dapper.CreateConnection();

        //    var parameters = new DynamicParameters();
        //    parameters.Add("@IVFDashboardTreatmentCycleId", treatmentCycleId, DbType.Int64);

        //    var result = await connection.QueryFirstOrDefaultAsync<GetAllOverviewDetailDto>(
        //                 "IVF_GetOverviewByTreatmentCycle",
        //                 parameters,
        //                 commandType: CommandType.StoredProcedure);

        //    return result;
        //}

        public async Task<GetAllOverviewDetailDto> GetOverviewByTreatmentCycleAsync(long treatmentCycleId)
        {
            using var connection = _dapper.CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("@IVFDashboardTreatmentCycleId", treatmentCycleId, DbType.Int64);

            GetAllOverviewDetailDto overviewResult = null;

            var result = await connection.QueryAsync<GetAllOverviewDetailDto, GetEventDetailDto, GetMasterPrescriptionDetailDto, GetPrescriptionDetailDto, GetAllOverviewDetailDto>(
                "IVF_GetOverviewByTreatmentCycle",
                (overview, eventDetail, masterPrescription, prescription) =>
                {
                    if (overviewResult == null)
                    {
                        overviewResult = overview;
                        overviewResult.Events = new List<GetEventDetailDto>();
                        overviewResult.PrescriptionMaster = new List<GetMasterPrescriptionDetailDto>();
                    }

                    if (eventDetail != null && eventDetail.EventId.HasValue)
                    {
                        if (!overviewResult.Events.Any(e => e.EventId == eventDetail.EventId))
                            overviewResult.Events.Add(eventDetail);
                    }

                    if (masterPrescription != null && masterPrescription.IVFPrescriptionMasterId.HasValue)
                    {
                        var existingMaster = overviewResult.PrescriptionMaster
                            .FirstOrDefault(pm => pm.IVFPrescriptionMasterId == masterPrescription.IVFPrescriptionMasterId);

                        if (existingMaster == null)
                        {
                            masterPrescription.Prescription = new List<GetPrescriptionDetailDto>();
                            overviewResult.PrescriptionMaster.Add(masterPrescription);
                            existingMaster = masterPrescription;
                        }

                        if (prescription != null && prescription.IVFPrescriptionId.HasValue)
                        {
                            if (!existingMaster.Prescription.Any(p => p.IVFPrescriptionId == prescription.IVFPrescriptionId))
                                existingMaster.Prescription.Add(prescription);
                        }
                    }
                    return overviewResult;
                },
                parameters,
                splitOn: "EventId,IVFPrescriptionMasterId,IVFPrescriptionId",
                commandType: CommandType.StoredProcedure
            );

            return overviewResult;
        }

    }
}
