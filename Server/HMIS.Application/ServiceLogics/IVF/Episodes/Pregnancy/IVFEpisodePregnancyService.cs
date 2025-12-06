using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Dapper;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;

using Task = System.Threading.Tasks.Task;

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Pregnancy
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Data { get; set; }
        public string? ErrorMessage { get; set; }

        public static Result<T> Success(T data)
        {
            return new Result<T>
            {
                IsSuccess = true,
                Data = data
            };
        }

        public static Result<T> Failure(string errorMessage)
        {
            return new Result<T>
            {
                IsSuccess = false,
                ErrorMessage = errorMessage
            };
        }
    }

    public interface IIVFEpisodePregnancyService
    {
        Task<Result<long>> CreateOrUpdateEpisodePregnancyAsync(IVFEpisodePregnancyDto dto);
        Task<(bool IsSuccess, IVFEpisodePregnancyDto? Data)> GetEpisodePregnancyByCycleId(int ivfDashboardTreatmentCycleId);
        Task<(bool IsSuccess, IEnumerable<IVFEpisodePregnancyListItemDto> Data, int TotalRecords)> GetAllEpisodePregnancyByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination);
        Task<(bool IsSuccess, object? Data)> DeleteEpisodePregnancyAsync(long pregnancyId);
    }

    internal class IVFEpisodePregnancyService : IIVFEpisodePregnancyService
    {
        private readonly HMISDbContext _db;
        private readonly DapperContext _dapper;

        public IVFEpisodePregnancyService(HMISDbContext db, DapperContext dapper)
        {
            _db = db;
            _dapper = dapper;
        }

        public async Task<Result<long>> CreateOrUpdateEpisodePregnancyAsync(IVFEpisodePregnancyDto dto)
        {
            if (dto == null)
                return Result<long>.Failure("DTO is required");

            if (!dto.IVFDashboardTreatmentCycleId.HasValue || dto.IVFDashboardTreatmentCycleId.Value <= 0)
                return Result<long>.Failure("IVFDashboardTreatmentCycleId is required");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                IvftreatmentEpisodePregnancyStage? stage = null;

                if (dto.PregnancyId.HasValue && dto.PregnancyId.Value > 0)
                {
                    stage = await _db.IvftreatmentEpisodePregnancyStage
                        .Include(x => x.IvfepisodePregnancy) 
                            .ThenInclude(p => p.IvfepisodePregnancyEmbryo)
                        .Include(x => x.IvfepisodePregnancy) 
                            .ThenInclude(p => p.IvfpregnancyComplicationUntil20th)
                        .Include(x => x.IvfpregnancyComplicationAfter20th)
                        .FirstOrDefaultAsync(x => x.PregnancyId == dto.PregnancyId.Value && !x.IsDeleted);
                }

                if (stage == null)
                {
                    stage = await _db.IvftreatmentEpisodePregnancyStage
                        .Include(x => x.IvfepisodePregnancy) 
                            .ThenInclude(p => p.IvfepisodePregnancyEmbryo)
                        .Include(x => x.IvfepisodePregnancy) 
                            .ThenInclude(p => p.IvfpregnancyComplicationUntil20th)
                        .Include(x => x.IvfpregnancyComplicationAfter20th)
                        .FirstOrDefaultAsync(x => x.IvfdashboardTreatmentCycleId == dto.IVFDashboardTreatmentCycleId.Value && !x.IsDeleted);
                }

                if (stage == null)
                {
                    stage = new IvftreatmentEpisodePregnancyStage
                    {
                        IvfdashboardTreatmentCycleId = dto.IVFDashboardTreatmentCycleId.Value,
                        IsDeleted = false
                    };
                    _db.IvftreatmentEpisodePregnancyStage.Add(stage);
                }

                if (dto.StatusId.HasValue)
                {
                    stage.StatusId = dto.StatusId;
                }

                await _db.SaveChangesAsync();
                var pregnancyId = stage.PregnancyId;

                if (dto.Progress != null)
                {
                    await UpsertPregnancy(stage, dto);
                }

                var progressPregnancy = dto.Progress?.Pregnancy;

                if (progressPregnancy?.Embryos != null)
                {
                    await UpsertEmbryos(stage, progressPregnancy.Embryos);
                }

                if (progressPregnancy?.ComplicationsUntil20th != null)
                {
                    await UpsertComplicationsUntil20th(stage, progressPregnancy.ComplicationsUntil20th);
                }

                if (progressPregnancy?.ComplicationsAfter20th != null)
                {
                    await UpsertComplicationsAfter20th(stage, progressPregnancy.ComplicationsAfter20th);
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return Result<long>.Success(pregnancyId);
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                return Result<long>.Failure(ex.Message);
            }
        }

        public async Task<(bool IsSuccess, IVFEpisodePregnancyDto? Data)> GetEpisodePregnancyByCycleId(int ivfDashboardTreatmentCycleId)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, null);

            using var conn = _dapper.CreateConnection();
            try
            {
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetEpisodePregnancyByCycle",
                    new { IVFDashboardTreatmentCycleId = ivfDashboardTreatmentCycleId },
                    commandType: CommandType.StoredProcedure
                );

                if (string.IsNullOrWhiteSpace(jsonResult))
                    return (false, null);

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = null,
                    NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                };

                var dto = JsonSerializer.Deserialize<IVFEpisodePregnancyDto>(jsonResult, options);
                if (dto == null)
                    return (false, null);

                return (true, dto);
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<(bool IsSuccess, IEnumerable<IVFEpisodePregnancyListItemDto> Data, int TotalRecords)> GetAllEpisodePregnancyByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, Enumerable.Empty<IVFEpisodePregnancyListItemDto>(), 0);

            var page = pagination?.Page ?? 1;
            var rows = pagination?.RowsPerPage ?? 10;

            using var conn = _dapper.CreateConnection();
            try
            {
                using var grid = await conn.QueryMultipleAsync(
                    "IVF_GetAllEpisodePregnancyByCycle",
                    new
                    {
                        PageNumber = page,
                        PageSize = rows,
                        IVFDashboardTreatmentCycleId = ivfDashboardTreatmentCycleId
                    },
                    commandType: CommandType.StoredProcedure
                );

                var data = (await grid.ReadAsync<IVFEpisodePregnancyListItemDto>()).ToList();
                var total = await grid.ReadFirstAsync<int>();

                return (true, data, total);
            }
            catch
            {
                return (false, Enumerable.Empty<IVFEpisodePregnancyListItemDto>(), 0);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> DeleteEpisodePregnancyAsync(long pregnancyId)
        {
            if (pregnancyId <= 0)
                return (false, "Invalid PregnancyId");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var stage = await _db.IvftreatmentEpisodePregnancyStage
                    .Include(x => x.IvfepisodePregnancy) 
                        .ThenInclude(p => p.IvfepisodePregnancyEmbryo)
                    .Include(x => x.IvfepisodePregnancy) 
                        .ThenInclude(p => p.IvfpregnancyComplicationUntil20th)
                    .Include(x => x.IvfpregnancyComplicationAfter20th)
                    .FirstOrDefaultAsync(x => x.PregnancyId == pregnancyId);

                if (stage == null || stage.IsDeleted)
                {
                    await tx.RollbackAsync();
                    return (false, "Record not found or already deleted");
                }

                stage.IsDeleted = true;

                if (stage.IvfepisodePregnancy != null)
                {
                    stage.IvfepisodePregnancy.IsDeleted = true;

                    foreach (var e in stage.IvfepisodePregnancy.IvfepisodePregnancyEmbryo)
                    {
                        e.IsDeleted = true;
                    }

                    foreach (var c in stage.IvfepisodePregnancy.IvfpregnancyComplicationUntil20th)
                    {
                        c.IsDeleted = true;
                    }
                }

                foreach (var cAfter in stage.IvfpregnancyComplicationAfter20th)
                {
                    cAfter.IsDeleted = true;
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return (true, new { Success = 1, Message = "Record successfully deleted" });
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                return (false, ex.Message);
            }
        }

        private async Task UpsertPregnancy(IvftreatmentEpisodePregnancyStage stage, IVFEpisodePregnancyDto dto)
        {
            var entity = stage.IvfepisodePregnancy;

            if (entity == null)
            {
                entity = new IvfepisodePregnancy
                {
                    PregnancyId = stage.PregnancyId,
                    IsDeleted = false
                };
                _db.IvfepisodePregnancy.Add(entity);
            }

            var p = dto.Progress;

            if (p != null)
            {
                entity.CycleOutcomeCategoryId = p.CycleOutcomeCategoryId;
                entity.PositivePgtestCategoryId = p.PositivePgtestCategoryId;
                entity.LastbhCgdate = p.LastbhCGDate;

                if (p.Pregnancy != null)
                {
                    entity.PregnancyDeterminedOnDate = p.Pregnancy.PregnancyDeterminedOnDate;
                    entity.IntrauterineCategoryId = p.Pregnancy.IntrauterineCategoryId;
                    entity.ExtrauterineCategoryId = p.Pregnancy.ExtrauterineCategoryId;
                    entity.Notes = p.Pregnancy.Notes;
                    entity.FetalPathologyComplicationCategoryId = p.Pregnancy.FetalPathologyComplicationCategoryId;
                }
            }

            if (p?.Ultrasound != null)
            {
                entity.UltrasoundId = p.Ultrasound.UltrasoundId;
            }
        }

        private async Task UpsertEmbryos(IvftreatmentEpisodePregnancyStage stage, List<IVFEpisodePregnancyEmbryoDto> embryos)
        {
            var existing = await _db.IvfepisodePregnancyEmbryo
                .Where(x => x.PregnancyId == stage.PregnancyId)
                .ToListAsync();

            _db.IvfepisodePregnancyEmbryo.RemoveRange(existing);

            foreach (var dto in embryos)
            {
                var entity = new IvfepisodePregnancyEmbryo
                {
                    PregnancyId = stage.PregnancyId,
                    PgprogressUntil4thWeekCategoryId = dto.PGProgressUntil4thWeekCategoryId,
                    Note = dto.Note,
                    ImageId = dto.ImageId,
                    IsDeleted = false
                };

                _db.IvfepisodePregnancyEmbryo.Add(entity);
            }
        }

        private async Task UpsertComplicationsUntil20th(IvftreatmentEpisodePregnancyStage stage, List<IVFEpisodePregnancyComplicationUntil20thDto> complications)
        {
            var existing = await _db.IvfpregnancyComplicationUntil20th
                .Where(x => x.PregnancyId == stage.PregnancyId)
                .ToListAsync();

            _db.IvfpregnancyComplicationUntil20th.RemoveRange(existing);

            foreach (var dto in complications)
            {
                var entity = new IvfpregnancyComplicationUntil20th
                {
                    PregnancyId = stage.PregnancyId,
                    ComplicationUntil20thWeekCategoryId = dto.ComplicationUntil20thWeekCategoryId,
                    IsDeleted = false
                };

                _db.IvfpregnancyComplicationUntil20th.Add(entity);
            }
        }

        private async Task UpsertComplicationsAfter20th(IvftreatmentEpisodePregnancyStage stage, List<IVFEpisodePregnancyComplicationAfter20thDto> complications)
        {
            var existing = await _db.IvfpregnancyComplicationAfter20th
                .Where(x => x.PregnancyId == stage.PregnancyId)
                .ToListAsync();

            _db.IvfpregnancyComplicationAfter20th.RemoveRange(existing);

            foreach (var dto in complications)
            {
                var entity = new IvfpregnancyComplicationAfter20th
                {
                    PregnancyId = stage.PregnancyId,
                    ComplicationAfter20thWeekCategoryId = dto.ComplicationAfter20thWeekCategoryId,
                    IsDeleted = false
                };

                _db.IvfpregnancyComplicationAfter20th.Add(entity);
            }
        }
    }
}
