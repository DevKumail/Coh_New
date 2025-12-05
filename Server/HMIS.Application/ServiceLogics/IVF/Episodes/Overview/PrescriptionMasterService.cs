using System.Data;
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
        Task<(bool isSuccess, string message)> DeleteMasterPrescription(DeleteMasterPrescriptionDto dto);
        Task<List<HREmployeeDto>> GetHREmployeeByIdAsync(long employeeId);
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
                return (false, "Invalid input. Missing OverviewId or DrugId.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var overviewExists = await _context.IvftreatmentEpisodeOverviewStage
                    .AnyAsync(x => x.OverviewId == dto.OverviewId);

                if (!overviewExists)
                    return (false, "Overview not found.");

                int xdays = dto.XDays ?? 0;

                if (dto.MedicationId > 0)
                {
                    var medication = await _context.IvfprescriptionMaster
                        .Select(x=>x.Medication)
                        .FirstOrDefaultAsync(x => x.MedicationId == dto.MedicationId);

                    if (medication == null)
                        return (false, "Medication record missing.");

                    medication.StartDate = dto.StartDate;
                    medication.StopDate = dto.StartDate.AddDays(xdays);
                    medication.Dose = dto.DailyDosage;
                    medication.Frequency = dto.DosageFrequency;
                    medication.DrugId = dto.DrugId;
                    medication.Route = dto.RouteCategoryId;
                    medication.AdditionalRefills = dto.AdditionalRefills;
                    medication.IsRefill = !string.IsNullOrWhiteSpace(dto.AdditionalRefills);
                    medication.Quantity = dto.Quantity;
                    medication.Samples = dto.Samples;
                    medication.Comments = dto.Substitution;
                    medication.Indications = dto.Indications;
                    medication.Instructions = dto.Instructions;
                    medication.IsInternal = dto.InternalOrder;
                    medication.AppointmentId = dto.AppId;
                    medication.Mrno = dto.MrNo;

                    var oldDomain = _context.IvfoverviewMedicationApplicationDomain
                        .Where(x => x.MedicationId == medication.MedicationId);
                    _context.IvfoverviewMedicationApplicationDomain.RemoveRange(oldDomain);

                    var domainList = dto.ApplicationDomainCategoryId
                        .Select(catId => new IvfoverviewMedicationApplicationDomain
                        {
                            MedicationId = medication.MedicationId,
                            CategoryId = catId
                        }).ToList();

                    await _context.IvfoverviewMedicationApplicationDomain.AddRangeAsync(domainList);

                    var oldTimes = _context.IvfoverviewMedicationTime
                        .Where(x => x.MedicationId == medication.MedicationId);
                    _context.IvfoverviewMedicationTime.RemoveRange(oldTimes);

                    var newTimes = dto.Time
                        .Select(t => new IvfoverviewMedicationTime
                        {
                            MedicationId = medication.MedicationId,
                            Time = TimeOnly.FromTimeSpan(t)
                        }).ToList();

                    await _context.IvfoverviewMedicationTime.AddRangeAsync(newTimes);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return (true, "Prescription updated successfully.");
                }

                var endDate = dto.StartDate.AddDays(xdays);

                var medicationEntity = new Medications
                {
                    DrugId = dto.DrugId,
                    StartDate = dto.StartDate,
                    StopDate = endDate,
                    Dose = dto.DailyDosage,
                    Frequency = dto.DosageFrequency,
                    Route = dto.RouteCategoryId,
                    AdditionalRefills = dto.AdditionalRefills,
                    IsRefill = !string.IsNullOrWhiteSpace(dto.AdditionalRefills),
                    Quantity = dto.Quantity,
                    Samples = dto.Samples,
                    Comments = dto.Substitution,
                    Indications = dto.Indications,
                    Instructions = dto.Instructions,
                    IsInternal = dto.InternalOrder,
                    AppointmentId = dto.AppId,
                    Mrno = dto.MrNo
                };

                await _context.Medications.AddAsync(medicationEntity);
                await _context.SaveChangesAsync();

                var masterEntity = new IvfprescriptionMaster
                {
                    OverviewId = dto.OverviewId,
                    MedicationId = medicationEntity.MedicationId
                };

                await _context.IvfprescriptionMaster.AddAsync(masterEntity);

                var ivfMedicationTime = dto.Time.Select(t => new IvfoverviewMedicationTime
                {
                    MedicationId = medicationEntity.MedicationId,
                    Time = TimeOnly.FromTimeSpan(t)
                }).ToList();

                await _context.IvfoverviewMedicationTime.AddRangeAsync(ivfMedicationTime);

                // Insert Domain rows
                var domainEntities = dto.ApplicationDomainCategoryId
                    .Select(catId => new IvfoverviewMedicationApplicationDomain
                    {
                        MedicationId = medicationEntity.MedicationId,
                        CategoryId = catId
                    }).ToList();

                await _context.IvfoverviewMedicationApplicationDomain.AddRangeAsync(domainEntities);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return (true, "Prescription created successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"Error: {ex.Message}");
            }
        }

        public async Task<(bool isSuccess, string message)> DeletePrescription(long medicationId)
        {
            try
            {
                var entity = await _context.Medications
                    .FirstOrDefaultAsync(x => x.MedicationId == medicationId);

                if (entity == null)
                    return (false, "Medication not found.");

                entity.IsDeleted = true;

                await _context.SaveChangesAsync();

                return (true, "Medication deleted successfully.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }


        public async Task<(bool isSuccess, string message)> DeleteMasterPrescription(DeleteMasterPrescriptionDto dto)
        {
            var masterPrescriptions = await _context.IvfprescriptionMaster
                .Where(pm => pm.Overview.IvfdashboardTreatmentCycleId == dto.ivfTreatmentCycleId)
                .Include(pm => pm.Medication)
                .ToListAsync();

            if (!masterPrescriptions.Any())
                return (false, "Overview not found for the given Treatment Cycle");

            foreach (var pm in masterPrescriptions)
            {
                if (pm.Medication.DrugId == dto.DrugId)
                {
                    pm.IsDeleted = true;
                    pm.Medication.IsDeleted = true;
                }
            }

            await _context.SaveChangesAsync();
            return (true, "Master prescription deleted successfully.");
        }

        public async Task<List<HREmployeeDto>> GetHREmployeeByIdAsync(long employeeId) 
        {
           using var connection = _dapper.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EmployeeID", employeeId, DbType.Int64);
            var result = await connection.QueryAsync<HREmployeeDto>(
                "select EmployeeId, FullName from HREmployee where EmployeeType = @EmployeeID",
                parameters,
                commandType: CommandType.Text
            );
            return result.ToList();
        }
    }
}
