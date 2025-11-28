using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Overview
{
    public interface IPrescriptionMasterService
    {
        Task<(bool isSuccess, string message)> CreatePrescription(CreateMasterPrescriptionDto dto);
        Task<(bool isSuccess, string message)> UpdatePrescription(CreateMasterPrescriptionDto dto);
        Task<(bool isSuccess, string message)> DeletePrescription(long prescriptionId);
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

        public async Task<(bool isSuccess, string message)> CreatePrescription(CreateMasterPrescriptionDto dto) 
        {
            if (dto.OverviewId == 0 || dto.DrugId == 0)
                return (false, "Invalid input. Required IDs are missing.");

            try
            {
                var overviewExists = await _context.IvftreatmentEpisodeOverviewStage
                    .AnyAsync(x => x.OverviewId == dto.OverviewId);

                if (!overviewExists)
                    return (false, "Overview does not exist.");

                var entity = new IvfprescriptionMaster
                {
                    OverviewId = dto.OverviewId,
                    DrugId = dto.DrugId,
                };

                await _context.IvfprescriptionMaster.AddAsync(entity);
                await _context.SaveChangesAsync();

                return (true, "Prescription created successfully.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<(bool isSuccess, string message)> UpdatePrescription(CreateMasterPrescriptionDto dto)
        {
            if (dto.IVFPrescriptionMasterId == 0 || dto.OverviewId == 0 || dto.DrugId == 0)
                return (false, "Invalid input. Required IDs are missing.");

            try
            {
                var entity = await _context.IvfprescriptionMaster
                    .FirstOrDefaultAsync(x => x.IvfprescriptionMasterId == dto.IVFPrescriptionMasterId);

                if (entity == null)
                    return (false, "Prescription not found.");

                var overviewExists = await _context.IvftreatmentEpisodeOverviewStage
                    .AnyAsync(x => x.OverviewId == dto.OverviewId);

                if (!overviewExists)
                    return (false, "Overview does not exist.");

                entity.OverviewId = dto.OverviewId;
                entity.DrugId = dto.DrugId;

                await _context.SaveChangesAsync();

                return (true, "Prescription updated successfully.");
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
