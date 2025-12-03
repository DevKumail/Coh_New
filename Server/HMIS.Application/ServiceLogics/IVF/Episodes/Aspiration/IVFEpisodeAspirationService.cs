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

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Aspiration
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
    
    public interface IIVFEpisodeAspirationService
    {
        Task<Result<long>> CreateOrUpdateEpisodeAspirationAsync(IVFEpisodeAspirationDto dto);
        Task<(bool IsSuccess, IVFEpisodeAspirationDto? Data)> GetEpisodeAspirationByCycleId(int ivfDashboardTreatmentCycleId);
        Task<(bool IsSuccess, IEnumerable<IVFEpisodeAspirationListItemDto> Data, int TotalRecords)> GetAllEpisodeAspirationByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination);
        Task<(bool IsSuccess, object? Data)> DeleteEpisodeAspirationAsync(long aspirationId);
    }

    internal class IVFEpisodeAspirationService : IIVFEpisodeAspirationService
    {
        private readonly HMISDbContext _db;
        private readonly DapperContext _dapper;

        public IVFEpisodeAspirationService(HMISDbContext db, DapperContext dapper)
        {
            _db = db;
            _dapper = dapper;
        }

        public async Task<(bool IsSuccess, IVFEpisodeAspirationDto? Data)> GetEpisodeAspirationByCycleId(int ivfDashboardTreatmentCycleId)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, null);

            using var conn = _dapper.CreateConnection();
            try
            {
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetEpisodeAspirationByCycle",
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

                var dto = JsonSerializer.Deserialize<IVFEpisodeAspirationDto>(jsonResult, options);
                if (dto == null)
                    return (false, null);

                return (true, dto);
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<(bool IsSuccess, IEnumerable<IVFEpisodeAspirationListItemDto> Data, int TotalRecords)> GetAllEpisodeAspirationByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, Enumerable.Empty<IVFEpisodeAspirationListItemDto>(), 0);

            var page = pagination?.Page ?? 1;
            var rows = pagination?.RowsPerPage ?? 10;

            using var conn = _dapper.CreateConnection();
            try
            {
                using var grid = await conn.QueryMultipleAsync(
                    "IVF_GetAllEpisodeAspirationByCycle",
                    new
                    {
                        PageNumber = page,
                        PageSize = rows,
                        IVFDashboardTreatmentCycleId = ivfDashboardTreatmentCycleId
                    },
                    commandType: CommandType.StoredProcedure
                );

                var data = (await grid.ReadAsync<IVFEpisodeAspirationListItemDto>()).ToList();
                var total = await grid.ReadFirstAsync<int>();

                return (true, data, total);
            }
            catch
            {
                return (false, Enumerable.Empty<IVFEpisodeAspirationListItemDto>(), 0);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> DeleteEpisodeAspirationAsync(long aspirationId)
        {
            if (aspirationId <= 0)
                return (false, "Invalid AspirationId");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var stage = await _db.IvftreatmentEpisodeAspirationStage
                    .Include(a => a.Aspiration)
                    .Include(a => a.IvfepisodeAspirationFurtherDetails)
                    .FirstOrDefaultAsync(a => a.AspirationId == aspirationId);

                if (stage == null || stage.IsDeleted)
                {
                    await tx.RollbackAsync();
                    return (false, "Record not found or already deleted");
                }

                stage.IsDeleted = true;

                if (stage.Aspiration != null)
                {
                    stage.Aspiration.IsDeleted = true;
                }

                if (stage.IvfepisodeAspirationFurtherDetails != null)
                {
                    stage.IvfepisodeAspirationFurtherDetails.IsDeleted = true;
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

        public async Task<Result<long>> CreateOrUpdateEpisodeAspirationAsync(IVFEpisodeAspirationDto dto)
        {
            if (dto == null)
                return Result<long>.Failure("DTO is required");

            if (!dto.IVFDashboardTreatmentCycleId.HasValue || dto.IVFDashboardTreatmentCycleId.Value <= 0)
                return Result<long>.Failure("IVFDashboardTreatmentCycleId is required");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                IvftreatmentEpisodeAspirationStage? stage = null;

                if (dto.AspirationId.HasValue && dto.AspirationId.Value > 0)
                {
                    stage = await _db.IvftreatmentEpisodeAspirationStage
                        .Include(a => a.Aspiration)
                        .Include(a => a.IvfepisodeAspirationFurtherDetails)
                        .FirstOrDefaultAsync(a => a.AspirationId == dto.AspirationId.Value);
                }

                if (stage == null)
                {
                    stage = await _db.IvftreatmentEpisodeAspirationStage
                        .Include(a => a.Aspiration)
                        .Include(a => a.IvfepisodeAspirationFurtherDetails)
                        .FirstOrDefaultAsync(a => a.IvfdashboardTreatmentCycleId == dto.IVFDashboardTreatmentCycleId.Value);
                }

                if (stage == null)
                {
                    stage = new IvftreatmentEpisodeAspirationStage
                    {
                        IvfdashboardTreatmentCycleId = dto.IVFDashboardTreatmentCycleId,
                        IsDeleted = false
                    };
                    _db.IvftreatmentEpisodeAspirationStage.Add(stage);
                }

                if (dto.StatusId.HasValue) stage.StatusId = dto.StatusId;

                await _db.SaveChangesAsync();
                var aspirationId = stage.AspirationId;

                if (dto.OocyteRetrieval != null)
                {
                    await UpsertOocyteRetrieval(stage, dto.OocyteRetrieval);
                }

                if (dto.FurtherDetails != null)
                {
                    await UpsertFurtherDetails(stage, dto.FurtherDetails);
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return Result<long>.Success(aspirationId);
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                return Result<long>.Failure(ex.Message);
            }
        }

        private async Task UpsertOocyteRetrieval(IvftreatmentEpisodeAspirationStage stage, IVFEpisodeAspirationOocyteRetrievalDto dto)
        {
            var entity = await _db.IvfepisodeAspirationOocyteRetrieval
                .FirstOrDefaultAsync(x => x.AspirationId == stage.AspirationId);

            if (entity == null)
            {
                entity = new IvfepisodeAspirationOocyteRetrieval
                {
                    AspirationId = stage.AspirationId,
                    IsDeleted = false
                };
                _db.IvfepisodeAspirationOocyteRetrieval.Add(entity);
            }

            entity.RetrievalDate = dto.RetrievalDate;
            entity.StartTime = dto.StartTime.HasValue ? TimeOnly.FromTimeSpan(dto.StartTime.Value) : null;
            entity.EndTime = dto.EndTime.HasValue ? TimeOnly.FromTimeSpan(dto.EndTime.Value) : null;
            entity.CollectedOocytes = dto.CollectedOocytes;
            entity.EmptyCumuli = dto.EmptyCumuli;
            entity.PoorResponseToDrugs = dto.PoorResponseToDrugs;
            entity.RetrievalTechniqueCategoryId = dto.RetrievalTechniqueCategoryId;
            entity.AnesthesiaCategoryId = dto.AnesthesiaCategoryId;
            entity.PrimaryComplicationsCategoryId = dto.PrimaryComplicationsCategoryId;
            entity.FurtherComplicationsCategoryId = dto.FurtherComplicationsCategoryId;
            entity.PrimaryMeasureCategoryId = dto.PrimaryMeasureCategoryId;
            entity.FurtherMeasureCategoryId = dto.FurtherMeasureCategoryId;
            entity.OperatingProviderId = dto.OperatingProviderId;
            entity.EmbryologistId = dto.EmbryologistId;
            entity.AnesthetistId = dto.AnesthetistId;
            entity.NurseId = dto.NurseId;
            entity.Note = dto.Note;
            entity.IsDeleted = false;
        }

        private async Task UpsertFurtherDetails(IvftreatmentEpisodeAspirationStage stage, IVFEpisodeAspirationFurtherDetailsDto dto)
        {
            var entity = await _db.IvfepisodeAspirationFurtherDetails
                .FirstOrDefaultAsync(x => x.AspirationId == stage.AspirationId);

            if (entity == null)
            {
                entity = new IvfepisodeAspirationFurtherDetails
                {
                    AspirationId = stage.AspirationId,
                    IsDeleted = false
                };
                _db.IvfepisodeAspirationFurtherDetails.Add(entity);
            }

            entity.AspirationSystemCategoryId = dto.AspirationSystemCategoryId;
            entity.LeadingFollicleSize = dto.LeadingFollicleSize;
            entity.NoOfWashedFollicles = dto.NoOfWashedFollicles;
            entity.FolliclesWashed = dto.FolliclesWashed;
            entity.RetrievedFolliclesTotal = dto.RetrievedFolliclesTotal;
            entity.RetrievedFolliclesLeft = dto.RetrievedFolliclesLeft;
            entity.RetrievedFolliclesRight = dto.RetrievedFolliclesRight;
            entity.TotalDoseAdministeredLh = dto.TotalDoseAdministeredLh;
            entity.TotalDoseAdministeredFsh = dto.TotalDoseAdministeredFsh;
            entity.TotalDoseAdministeredHmg = dto.TotalDoseAdministeredHmg;
            entity.GeneralConditionCategoryId = dto.GeneralConditionCategoryId;
            entity.MucousMembraneCategoryId = dto.MucousMembraneCategoryId;
            entity.Temperature = dto.Temperature;
            entity.BeforeOocyteRetrievalPulse = dto.BeforeOocyteRetrievalPulse;
            entity.BeforeOocyteRetrievalBloodPressureSystolic = dto.BeforeOocyteRetrievalBloodPressureSystolic;
            entity.BeforeOocyteRetrievalBloodPressureDiastolic = dto.BeforeOocyteRetrievalBloodPressureDiastolic;
            entity.AnaesthetistPulse = dto.AnaesthetistPulse;
            entity.AnaesthetistBloodPressureSystolic = dto.AnaesthetistBloodPressureSystolic;
            entity.AnaesthetistBloodPressureDiastolic = dto.AnaesthetistBloodPressureDiastolic;
            entity.Note = dto.Note;
            entity.IsDeleted = false;
        }

        private static IVFEpisodeAspirationDto MapToDto(IvftreatmentEpisodeAspirationStage stage)
        {
            var dto = new IVFEpisodeAspirationDto
            {
                AspirationId = stage.AspirationId,
                IVFDashboardTreatmentCycleId = stage.IvfdashboardTreatmentCycleId,
                StatusId = stage.StatusId
            };

            if (stage.Aspiration != null)
            {
                var o = stage.Aspiration;
                dto.OocyteRetrieval = new IVFEpisodeAspirationOocyteRetrievalDto
                {
                    OocyteRetrievalId = o.OocyteRetrievalId,
                    AspirationId = o.AspirationId,
                    RetrievalDate = o.RetrievalDate,
                    StartTime = o.StartTime.HasValue ? o.StartTime.Value.ToTimeSpan() : (TimeSpan?)null,
                    EndTime = o.EndTime.HasValue ? o.EndTime.Value.ToTimeSpan() : (TimeSpan?)null,
                    CollectedOocytes = o.CollectedOocytes,
                    EmptyCumuli = o.EmptyCumuli,
                    PoorResponseToDrugs = o.PoorResponseToDrugs,
                    RetrievalTechniqueCategoryId = o.RetrievalTechniqueCategoryId,
                    AnesthesiaCategoryId = o.AnesthesiaCategoryId,
                    PrimaryComplicationsCategoryId = o.PrimaryComplicationsCategoryId,
                    FurtherComplicationsCategoryId = o.FurtherComplicationsCategoryId,
                    PrimaryMeasureCategoryId = o.PrimaryMeasureCategoryId,
                    FurtherMeasureCategoryId = o.FurtherMeasureCategoryId,
                    OperatingProviderId = o.OperatingProviderId,
                    EmbryologistId = o.EmbryologistId,
                    AnesthetistId = o.AnesthetistId,
                    NurseId = o.NurseId,
                    Note = o.Note
                };
            }

            if (stage.IvfepisodeAspirationFurtherDetails != null)
            {
                var f = stage.IvfepisodeAspirationFurtherDetails;
                dto.FurtherDetails = new IVFEpisodeAspirationFurtherDetailsDto
                {
                    FurtherDetailsId = f.FurtherDetailsId,
                    AspirationId = f.AspirationId,
                    AspirationSystemCategoryId = f.AspirationSystemCategoryId,
                    LeadingFollicleSize = f.LeadingFollicleSize,
                    NoOfWashedFollicles = f.NoOfWashedFollicles,
                    FolliclesWashed = f.FolliclesWashed,
                    RetrievedFolliclesTotal = f.RetrievedFolliclesTotal,
                    RetrievedFolliclesLeft = f.RetrievedFolliclesLeft,
                    RetrievedFolliclesRight = f.RetrievedFolliclesRight,
                    TotalDoseAdministeredLh = f.TotalDoseAdministeredLh,
                    TotalDoseAdministeredFsh = f.TotalDoseAdministeredFsh,
                    TotalDoseAdministeredHmg = f.TotalDoseAdministeredHmg,
                    GeneralConditionCategoryId = f.GeneralConditionCategoryId,
                    MucousMembraneCategoryId = f.MucousMembraneCategoryId,
                    Temperature = f.Temperature,
                    BeforeOocyteRetrievalPulse = f.BeforeOocyteRetrievalPulse,
                    BeforeOocyteRetrievalBloodPressureSystolic = f.BeforeOocyteRetrievalBloodPressureSystolic,
                    BeforeOocyteRetrievalBloodPressureDiastolic = f.BeforeOocyteRetrievalBloodPressureDiastolic,
                    AnaesthetistPulse = f.AnaesthetistPulse,
                    AnaesthetistBloodPressureSystolic = f.AnaesthetistBloodPressureSystolic,
                    AnaesthetistBloodPressureDiastolic = f.AnaesthetistBloodPressureDiastolic,
                    Note = f.Note
                };
            }

            return dto;
        }
    }
}
