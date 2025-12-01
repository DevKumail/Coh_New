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
        Task<(bool isSuccess, string message)> SavePrescription(CreatePrescriptiondto dto);
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

        public async Task<(bool isSuccess, string message)> SavePrescription(CreatePrescriptiondto dto)
        {
            if (dto.DrugId == 0 || dto.AppointmentId == 0)
                return (false, "Invalid input. Required IDs are missing.");

            try
            {
                Ivfprescription entity;

                if (dto.IvfprescriptionId > 0)
                {
                    entity = await _context.Ivfprescription
                        .FirstOrDefaultAsync(x => x.IvfprescriptionMasterId == dto.IVFPrescriptionMasterId);

                    if (entity == null)
                        return (false, "Prescription not found.");

                    entity.AppointmentId = dto.AppointmentId;
                    entity.IvfprescriptionMasterId = dto.IVFPrescriptionMasterId;
                    entity.StartDate = dto.StartDate;
                    entity.EndDate = dto.EndDate;

                    await _context.SaveChangesAsync();
                    return (true, "Prescription updated successfully.");
                }

                entity = new Ivfprescription
                {
                    IvfprescriptionMasterId = dto.IVFPrescriptionMasterId,
                    AppointmentId = dto.AppointmentId,
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
