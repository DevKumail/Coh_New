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
    public interface IPrescriptionService
    {
        Task<(bool isSuccess, string message)> CreatePrescription(CreatePrescriptiondto dto);
        Task<(bool isSuccess, string message)> UpdatePrescription(CreatePrescriptiondto dto);
        Task<(bool isSuccess, string message)> DeletePrescription(long prescriptionId);
    }
    public class PrescriptionService : IPrescriptionService
    {
        private readonly DapperContext _dapper;
        private readonly HMISDbContext _context;
        public PrescriptionService(DapperContext dapper, HMISDbContext context)
        {
            _dapper = dapper;
            _context = context;
        }

        public async Task<(bool isSuccess, string message)> CreatePrescription(CreatePrescriptiondto dto)
        {
            if (dto.DrugId == 0 || dto.AppointmentId == 0)
                return (false, "Invalid input. DrugId and OverviewId are required.");

            try
            {
                var entity = new Ivfprescription
                {
                    AppointmentId = dto.AppointmentId,
                    DrugId = dto.DrugId,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate
                };

                await _context.Ivfprescription.AddAsync(entity);
                await _context.SaveChangesAsync();

                return (true, "Prescription created successfully.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }


        public async Task<(bool isSuccess, string message)> UpdatePrescription(CreatePrescriptiondto dto)
        {
            if (dto.IVFPrescriptionMasterId == 0 || dto.DrugId == 0 || dto.AppointmentId == 0)
                return (false, "Invalid input. Missing key fields.");

            try
            {
                var entity = await _context.Ivfprescription
                    .FirstOrDefaultAsync(x => x.IvfprescriptionMasterId == dto.IVFPrescriptionMasterId);

                if (entity == null)
                    return (false, "Prescription not found.");

                entity.AppointmentId = dto.AppointmentId;
                entity.DrugId = dto.DrugId;
                entity.StartDate = dto.StartDate;
                entity.EndDate = dto.EndDate;

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
                var entity = await _context.Ivfprescription
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
