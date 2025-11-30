using System.Data;
using Dapper;
using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
using HMIS.Core.Context;
using HMIS.Infrastructure.ORM;

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Overview
{
    public interface IOverviewService
    {
        Task<GetAllOverviewDetailDto> getOverviewAsync(long treatmentCycleId);
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

        public async Task<GetAllOverviewDetailDto> getOverviewAsync(long treatmentCycleId)
        {
            using var connection = _dapper.CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("@IVFDashboardTreatmentCycleId", treatmentCycleId, DbType.Int64);

            var result = await connection.QueryFirstOrDefaultAsync<GetAllOverviewDetailDto>(
                         "IVF_GetOverviewByTreatmentCycle",
                         parameters,
                         commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}
