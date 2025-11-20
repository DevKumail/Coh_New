using Dapper;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;
using HMIS.Core.Entities;
using HMIS.Application.ServiceLogics.IVF.Male;
using System.Data;
using System.Text.Json;

namespace HMIS.Application.ServiceLogics.IVF.Female
{
    public interface IIVFFemaleFertilityHistoryService
    {
        Task<(bool IsSuccess, object? Data)> GetAllFemaleFertilityHistory(string ivfmainid, PaginationInfo pagination);
        Task<(bool IsSuccess, object? Data)> GetFemaleFertilityHistoryById(string IVFFemaleFHId);
        Task<Result<int>> CreateOrUpdateFemaleFertilityHistoryAsync(IVFFemaleFertilityHistoryDto dto);
        Task<(bool IsSuccess, object? Data)> DeleteFemaleFertilityHistoryAsync(string IVFFemaleFHId, string DeletedBy);
    }

    internal class IVFFemaleFertilityHistoryService : IIVFFemaleFertilityHistoryService
    {
        private readonly DapperContext _dapper;
        private readonly HMISDbContext _context;
        public IVFFemaleFertilityHistoryService(DapperContext dapper, HMISDbContext db)
        {
            _dapper = dapper;
            _context = db;
        }

        public async Task<(bool IsSuccess, object? Data)> GetFemaleFertilityHistoryById(string IVFFemaleFHId)
        {
            if (string.IsNullOrWhiteSpace(IVFFemaleFHId))
                return (false, null);

            using var conn = _dapper.CreateConnection();
            try
            {
                // Call stored procedure that returns JSON (FOR JSON PATH)
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetFemaleFertilityHistoryById",
                    new { IVFFemaleFHId },
                    commandType: CommandType.StoredProcedure
                );

                if (string.IsNullOrWhiteSpace(jsonResult))
                    return (false, null);

                // Attempt to deserialize to a known DTO if available, otherwise return raw json
                try
                {
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        PropertyNamingPolicy = null,
                        NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                    };

                    // If a female DTO exists, deserialize to it; otherwise fallback to JsonDocument
                    // Try to deserialize to a generic JsonDocument to be safe
                    var doc = JsonSerializer.Deserialize<JsonElement>(jsonResult, options);
                    return (true, doc);
                }
                catch
                {
                    return (true, jsonResult);
                }
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> GetAllFemaleFertilityHistory(string ivfmainid, PaginationInfo pagination)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return (false, null);
            if (!int.TryParse(ivfmainid, out var ivfMainIdInt))
                return (false, null);

            var page = pagination?.Page ?? 1;
            var rows = pagination?.RowsPerPage ?? 10;

            using var conn = _dapper.CreateConnection();
            try
            {
                var data = (await conn.QueryAsync(
                    "IVF_GetAllFemaleFertilityHistory",
                    new { PageNumber = page, PageSize = rows, IVFMainId = ivfMainIdInt },
                    commandType: CommandType.StoredProcedure)).ToList();

                return (true, data);
            }
            catch
            {
                return (false, null);
            }
        }

    public async Task<Result<int>> CreateOrUpdateFemaleFertilityHistoryAsync(IVFFemaleFertilityHistoryDto dto)
        {
            // Minimal validation
            if (dto == null) return Result<int>.Failure("DTO is required");

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                IvffemaleFertilityHistory? entity;

                if (dto.IVFFemaleFHId.HasValue && dto.IVFFemaleFHId.Value > 0)
                {
                    entity = await _context.IvffemaleFertilityHistory.FirstOrDefaultAsync(x => x.IvffemaleFhid == dto.IVFFemaleFHId.Value);
                    if (entity == null)
                    {
                        // If provided id not found, create new
                        entity = new IvffemaleFertilityHistory();
                        _context.IvffemaleFertilityHistory.Add(entity);
                    }
                }
                else
                {
                    entity = new IvffemaleFertilityHistory();
                    _context.IvffemaleFertilityHistory.Add(entity);
                }

                // Map simple fields (extend to match entity)
                if (dto.IVFMainId.HasValue) entity.IvfmainId = dto.IVFMainId.Value;
                if (dto.Date.HasValue) entity.Date = dto.Date.Value;
                if (dto.ProviderId.HasValue) entity.ProviderId = dto.ProviderId.Value;
                if (dto.UnprotectedIntercourseYear != null) entity.UnprotectedIntercourseYear = dto.UnprotectedIntercourseYear;
                if (dto.UnprotectedIntercourseMonth != null) entity.UnprotectedIntercourseMonth = dto.UnprotectedIntercourseMonth;
                if (dto.AdiposityCategoryId.HasValue) entity.AdiposityCategoryId = dto.AdiposityCategoryId.Value;
                if (dto.GenerallyHealthyCategoryId.HasValue) entity.GenerallyHealthyCategoryId = dto.GenerallyHealthyCategoryId.Value;
                if (dto.LongTermMedication != null) entity.LongTermMedication = dto.LongTermMedication;
                if (dto.ChromosomeAnalysisCategoryId.HasValue) entity.ChromosomeAnalysisCategoryId = dto.ChromosomeAnalysisCategoryId.Value;
                if (dto.CftrcarrierCategoryId.HasValue) entity.CftrcarrierCategoryId = dto.CftrcarrierCategoryId.Value;
                if (dto.PatencyRightCategoryId.HasValue) entity.PatencyRightCategoryId = dto.PatencyRightCategoryId.Value;
                if (dto.PatencyLeftCategoryId.HasValue) entity.PatencyLeftCategoryId = dto.PatencyLeftCategoryId.Value;
                if (dto.FallopianTubeYear != null) entity.FallopianTubeYear = dto.FallopianTubeYear;
                if (dto.PrevOperativeTreatmentsCount.HasValue) entity.PrevOperativeTreatmentsCount = dto.PrevOperativeTreatmentsCount.Value;
                if (dto.OvarianStimulationsCount.HasValue) entity.OvarianStimulationsCount = dto.OvarianStimulationsCount.Value;
                if (dto.IvfIcsiTreatmentsCount.HasValue) entity.IvfIcsiTreatmentsCount = dto.IvfIcsiTreatmentsCount.Value;
                if (dto.HasAlternativePretreatments.HasValue) entity.HasAlternativePretreatments = dto.HasAlternativePretreatments.Value;
                if (dto.Comment != null) entity.Comment = dto.Comment;

                // Set audit fields
                if (dto.CreatedBy.HasValue && entity.IvffemaleFhid == 0)
                {
                    entity.CreatedBy = dto.CreatedBy.Value;
                    entity.CreatedAt = DateTime.UtcNow;
                }
                else
                {
                    entity.UpdatedBy = dto.UpdatedBy;
                    entity.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                var femaleId = entity.IvffemaleFhid;

                // Replace impairment factors if provided
                if (dto.ImpairmentFactors != null)
                {
                    var existing = await _context.IvffemaleFhimpairmentFactor.Where(f => f.IvffemaleFhid == femaleId).ToListAsync();
                    if (existing.Any()) _context.IvffemaleFhimpairmentFactor.RemoveRange(existing);

                    foreach (var i in dto.ImpairmentFactors)
                    {
                        // Expect a code/string for the impairment factor (matches entity property)
                        if (string.IsNullOrWhiteSpace(i.ImpairmentFactor)) continue;
                        var item = new IvffemaleFhimpairmentFactor
                        {
                            IvffemaleFhid = femaleId,
                            ImpairmentFactor = i.ImpairmentFactor
                        };
                        _context.IvffemaleFhimpairmentFactor.Add(item);
                    }
                }

                // Replace previous illnesses if provided
                if (dto.PrevIllnesses != null)
                {
                    var existingPrev = await _context.IvffemaleFhprevIllness.Where(p => p.IvffemaleFhid == femaleId).ToListAsync();
                    if (existingPrev.Any()) _context.IvffemaleFhprevIllness.RemoveRange(existingPrev);

                    foreach (var p in dto.PrevIllnesses)
                    {
                        if (string.IsNullOrWhiteSpace(p.PrevIllness)) continue;
                        var prev = new IvffemaleFhprevIllness
                        {
                            IvffemaleFhid = femaleId,
                            PrevIllness = p.PrevIllness
                        };
                        _context.IvffemaleFhprevIllness.Add(prev);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Result<int>.Success(femaleId);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<int>.Failure(ex.Message);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> DeleteFemaleFertilityHistoryAsync(string IVFFemaleFHId, string DeletedBy)
        {
            // Convert and validate id
            if (!int.TryParse(IVFFemaleFHId, out var id))
                return (false, "Invalid IVFFemaleFHId");

            int? deletedByInt = null;
            if (int.TryParse(DeletedBy, out var db)) deletedByInt = db;

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var main = await _context.IvffemaleFertilityHistory.FirstOrDefaultAsync(x => x.IvffemaleFhid == id);
                if (main == null || main.IsDeleted)
                {
                    await transaction.RollbackAsync();
                    return (false, "Record not found or already deleted");
                }

                main.IsDeleted = true;
                if (deletedByInt.HasValue) main.DeletedBy = deletedByInt.Value;

                // Impairment factors
                var factors = await _context.IvffemaleFhimpairmentFactor.Where(f => f.IvffemaleFhid == id).ToListAsync();
                foreach (var f in factors)
                {
                    f.IsDeleted = true;
                    if (deletedByInt.HasValue) f.DeletedBy = deletedByInt.Value;
                }

                // Previous illnesses
                var prev = await _context.IvffemaleFhprevIllness.Where(p => p.IvffemaleFhid == id).ToListAsync();
                foreach (var p in prev)
                {
                    p.IsDeleted = true;
                    if (deletedByInt.HasValue) p.DeletedBy = deletedByInt.Value;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return (true, new { Success = 1, Message = "Record successfully deleted" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, ex.Message);
            }
        }
    }
}
