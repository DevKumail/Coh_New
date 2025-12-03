using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using Dapper;
using Task = System.Threading.Tasks.Task;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Transfer
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

    public interface IIVFEpisodeTransferService
    {
        Task<Result<long>> CreateOrUpdateEpisodeTransferAsync(IVFEpisodeTransferDto dto);
        Task<(bool IsSuccess, IVFEpisodeTransferDto? Data)> GetEpisodeTransferById(int ivfDashboardTreatmentCycleId);
        Task<(bool IsSuccess, IEnumerable<IVFEpisodeTransferListItemDto> Data, int TotalRecords)> GetAllEpisodeTransferByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination);
        Task<(bool IsSuccess, object? Data)> DeleteEpisodeTransferAsync(long transferId);
    }

    internal class IVFEpisodeTransferService : IIVFEpisodeTransferService
    {
        private readonly HMISDbContext _db;
        private readonly DapperContext _dapper;

        public IVFEpisodeTransferService(HMISDbContext db, DapperContext dapper)
        {
            _db = db;
            _dapper = dapper;
        }

        public async Task<Result<long>> CreateOrUpdateEpisodeTransferAsync(IVFEpisodeTransferDto dto)
        {
            if (dto == null)
                return Result<long>.Failure("DTO is required");

            if (!dto.IVFDashboardTreatmentCycleId.HasValue || dto.IVFDashboardTreatmentCycleId.Value <= 0)
                return Result<long>.Failure("IVFDashboardTreatmentCycleId is required");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                IvftreatmentEpisodeTransferStage? stage = null;

                if (dto.TransferId.HasValue && dto.TransferId.Value > 0)
                {
                    stage = await _db.IvftreatmentEpisodeTransferStage
                        .Include(x => x.IvfepisodeTransfer)
                        .Include(x => x.IvfepisodeTransferEmbryoInTransfer)
                        .FirstOrDefaultAsync(x => x.TransferId == dto.TransferId.Value && !x.IsDeleted);
                }

                if (stage == null)
                {
                    stage = await _db.IvftreatmentEpisodeTransferStage
                        .Include(x => x.IvfepisodeTransfer)
                        .Include(x => x.IvfepisodeTransferEmbryoInTransfer)
                        .FirstOrDefaultAsync(x => x.IvfdashboardTreatmentCycleId == dto.IVFDashboardTreatmentCycleId.Value && !x.IsDeleted);
                }

                if (stage == null)
                {
                    stage = new IvftreatmentEpisodeTransferStage
                    {
                        IvfdashboardTreatmentCycleId = dto.IVFDashboardTreatmentCycleId,
                        IsDeleted = false
                    };
                    _db.IvftreatmentEpisodeTransferStage.Add(stage);
                }

                if (dto.StatusId.HasValue)
                {
                    stage.StatusId = dto.StatusId;
                }

                await _db.SaveChangesAsync();
                var transferId = stage.TransferId;

                if (dto.Transfer != null || dto.FurtherInformation != null)
                {
                    await UpsertTransfer(stage, dto);
                }

                if (dto.EmbryosInTransfer != null)
                {
                    await UpsertEmbryos(stage, dto.EmbryosInTransfer);
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return Result<long>.Success(transferId);
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                return Result<long>.Failure(ex.Message);
            }
        }

        public async Task<(bool IsSuccess, IVFEpisodeTransferDto? Data)> GetEpisodeTransferById(int ivfDashboardTreatmentCycleId)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, null);

            using var conn = _dapper.CreateConnection();
            try
            {
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetEpisodeTransferByCycle",
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

                var dto = JsonSerializer.Deserialize<IVFEpisodeTransferDto>(jsonResult, options);
                if (dto == null)
                    return (false, null);

                return (true, dto);
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<(bool IsSuccess, IEnumerable<IVFEpisodeTransferListItemDto> Data, int TotalRecords)> GetAllEpisodeTransferByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, Enumerable.Empty<IVFEpisodeTransferListItemDto>(), 0);

            var page = pagination?.Page ?? 1;
            var rows = pagination?.RowsPerPage ?? 10;

            using var conn = _dapper.CreateConnection();
            try
            {
                using var grid = await conn.QueryMultipleAsync(
                    "IVF_GetAllEpisodeTransferByCycle",
                    new
                    {
                        PageNumber = page,
                        PageSize = rows,
                        IVFDashboardTreatmentCycleId = ivfDashboardTreatmentCycleId
                    },
                    commandType: CommandType.StoredProcedure
                );

                var data = (await grid.ReadAsync<IVFEpisodeTransferListItemDto>()).ToList();
                var total = await grid.ReadFirstAsync<int>();

                return (true, data, total);
            }
            catch
            {
                return (false, Enumerable.Empty<IVFEpisodeTransferListItemDto>(), 0);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> DeleteEpisodeTransferAsync(long transferId)
        {
            if (transferId <= 0)
                return (false, "Invalid TransferId");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var stage = await _db.IvftreatmentEpisodeTransferStage
                    .Include(x => x.IvfepisodeTransfer)
                    .Include(x => x.IvfepisodeTransferEmbryoInTransfer)
                    .FirstOrDefaultAsync(x => x.TransferId == transferId);

                if (stage == null || stage.IsDeleted)
                {
                    await tx.RollbackAsync();
                    return (false, "Record not found or already deleted");
                }

                stage.IsDeleted = true;

                if (stage.IvfepisodeTransfer != null)
                {
                    stage.IvfepisodeTransfer.IsDeleted = true;
                }

                foreach (var e in stage.IvfepisodeTransferEmbryoInTransfer)
                {
                    e.IsDeleted = true;
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

        private async Task UpsertTransfer(IvftreatmentEpisodeTransferStage stage, IVFEpisodeTransferDto dto)
        {
            var entity = stage.IvfepisodeTransfer;

            if (entity == null)
            {
                entity = new IvfepisodeTransfer
                {
                    TransferId = stage.TransferId
                };
                _db.IvfepisodeTransfer.Add(entity);
            }

            var t = dto.Transfer;
            var f = dto.FurtherInformation;

            if (t != null)
            {
                entity.DateOfTransfer = t.DateOfTransfer;
                entity.TimeOfTransfer = t.TimeOfTransfer.HasValue ? TimeOnly.FromTimeSpan(t.TimeOfTransfer.Value) : null;
                entity.TransferDurationPerMin = t.TransferDurationPerMin;
                entity.ProviderId = t.ProviderId;
                entity.NurseId = t.NurseId;
                entity.DateOfSecTransfer = t.DateOfSecTransfer;
                entity.ElectiveSingleEmbryoTransfer = t.ElectiveSingleEmbryoTransfer;
                entity.EmbryologistId = t.EmbryologistId;
            }

            if (f != null)
            {
                entity.CultureDays = f.CultureDays;
                entity.CatheterCategoryId = f.CatheterCategoryId;
                entity.CatheterAddition = f.CatheterAddition;
                entity.MainCompilationCategoryId = f.MainCompilationCategoryId;
                entity.FurtherComplicationCategoryId = f.FurtherComplicationCategoryId;
                entity.SeveralAttempts = f.SeveralAttempts;
                entity.NoOfAttempts = f.NoOfAttempts;
                entity.EmbryoGlue = f.EmbryoGlue;
                entity.DifficultCatheterInsertion = f.DifficultCatheterInsertion;
                entity.CatheterChange = f.CatheterChange;
                entity.MucusInCatheter = f.MucusInCatheter;
                entity.BloodInCatheter = f.BloodInCatheter;
                entity.Dilation = f.Dilation;
                entity.UltrasoundCheck = f.UltrasoundCheck;
                entity.Vulsellum = f.Vulsellum;
                entity.Probe = f.Probe;
                entity.Note = f.Note;
            }
        }

        private async Task UpsertEmbryos(IvftreatmentEpisodeTransferStage stage, List<IVFEpisodeTransferEmbryoDto> embryos)
        {
            var existing = await _db.IvfepisodeTransferEmbryoInTransfer
                .Where(x => x.TransferId == stage.TransferId)
                .ToListAsync();

            _db.IvfepisodeTransferEmbryoInTransfer.RemoveRange(existing);

            foreach (var dto in embryos)
            {
                var entity = new IvfepisodeTransferEmbryoInTransfer
                {
                    TransferId = stage.TransferId,
                    SequenceId = dto.SequenceId,
                    EmbryoId = dto.EmbryoId,
                    CellInformation = dto.CellInformation,
                    Ideal = dto.Ideal,
                    ScoreCategoryId = dto.ScoreCategoryId
                };

                _db.IvfepisodeTransferEmbryoInTransfer.Add(entity);
            }
        }

    }
}
