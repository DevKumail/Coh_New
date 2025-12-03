using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Overview
{
    public interface IPrescriptionMasterService
    {
        Task<(bool isSuccess, string message)> SaveMasterPrescription(CreateMasterPrescriptionDto dto);
        Task<(bool isSuccess, string message)> DeletePrescription(long prescriptionId);
        Task<List<GetDrugDetailsDto>> GetAllDrugs(string? keyword, PaginationInfo dto);
    }
    public class PrescriptionMasterService : IPrescriptionMasterService
    {
        private readonly DapperContext _dapper;
        private readonly HMISDbContext _context;
        public PrescriptionMasterService(DapperContext dapper, HMISDbContext context)
        {
            _dapper = dapper;
            _context = context;
        }

        public async Task<List<GetDrugDetailsDto>> GetAllDrugs(string? keyword, PaginationInfo dto)
        {
            using var connection = _dapper.CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("@Page", dto.Page, DbType.Int32);
            parameters.Add("@RowsPerPage", dto.RowsPerPage, DbType.Int32);
            parameters.Add("@Keyword", keyword);
            

            var result = await connection.QueryAsync<GetDrugDetailsDto>(
                "GetAllDrugs",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }

        public async Task<(bool isSuccess, string message)> SaveMasterPrescription(CreateMasterPrescriptionDto dto)
        {
            if (dto.OverviewId == 0 || dto.DrugId == 0)
                return (false, "Invalid input. Required IDs are missing.");

            try
            {
                var overviewExists = await _context.IvftreatmentEpisodeOverviewStage
                    .AnyAsync(x => x.OverviewId == dto.OverviewId);

                if (!overviewExists)
                    return (false, "Overview does not exist.");

                IvfprescriptionMaster entity;

                if (dto.IVFPrescriptionMasterId > 0)
                {
                    entity = await _context.IvfprescriptionMaster
                        .FirstOrDefaultAsync(x => x.IvfprescriptionMasterId == dto.IVFPrescriptionMasterId);

                    if (entity == null)
                        return (false, "Prescription not found.");

                    entity.OverviewId = dto.OverviewId;
                    //entity.DrugId = dto.DrugId;

                    await _context.SaveChangesAsync();
                    return (true, "Prescription updated successfully.");
                }
                else
                {
                    entity = new IvfprescriptionMaster
                    {
                        OverviewId = dto.OverviewId,
                        //DrugId = dto.DrugId
                    };

                    await _context.IvfprescriptionMaster.AddAsync(entity);
                    await _context.SaveChangesAsync();
                    return (true, "Prescription created successfully.");
                }
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<(bool isSuccess, string message)> DeletePrescription(long prescriptionId)
        {
            try
            {
                var entity = await _context.IvfprescriptionMaster
                    .FirstOrDefaultAsync(x => x.IvfprescriptionMasterId == prescriptionId);

                if (entity == null)
                    return (false, "Prescription not found.");

                entity.IsDeleted = true;

                await _context.SaveChangesAsync();

                return (true, "Prescription deleted successfully.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }

    }
}
