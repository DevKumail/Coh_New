using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Text.Json;
using Dapper;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics.IVF.Episodes.Birth
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

    public interface IIVFEpisodeBirthService
    {
        Task<Result<long>> CreateOrUpdateEpisodeBirthAsync(IVFEpisodeBirthDto dto);
        Task<(bool IsSuccess, IVFEpisodeBirthDto? Data)> GetEpisodeBirthByCycleId(int ivfDashboardTreatmentCycleId);
        Task<(bool IsSuccess, IEnumerable<IVFEpisodeBirthListItemDto> Data, int TotalRecords)> GetAllEpisodeBirthByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination);
        Task<(bool IsSuccess, object? Data)> DeleteEpisodeBirthAsync(long id);
    }

    internal class IVFEpisodeBirthService : IIVFEpisodeBirthService
    {
        private readonly HMISDbContext _db;
        private readonly DapperContext _dapper;

        public IVFEpisodeBirthService(HMISDbContext db, DapperContext dapper)
        {
            _db = db;
            _dapper = dapper;
        }

        public async Task<Result<long>> CreateOrUpdateEpisodeBirthAsync(IVFEpisodeBirthDto dto)
        {
            if (dto == null)
                return Result<long>.Failure("DTO is required");

            if (!dto.IVFDashboardTreatmentCycleId.HasValue || dto.IVFDashboardTreatmentCycleId.Value <= 0)
                return Result<long>.Failure("IVFDashboardTreatmentCycleId is required");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var stage = await _db.IvftreatmentEpisodeBirthStage
                    .Include(x => x.IvfepisodeBirth)
                    .ThenInclude(b => b.IvfepisodeBirthChromosomeAnomaly)
                    .Include(x => x.IvfepisodeBirth)
                    .ThenInclude(b => b.IvfepisodeBirthCongenitalMalformation)
                    .FirstOrDefaultAsync(x => x.IvfdashboardTreatmentCycleId == dto.IVFDashboardTreatmentCycleId.Value && !x.IsDeleted);

                if (stage == null)
                {
                    stage = new IvftreatmentEpisodeBirthStage
                    {
                        IvfdashboardTreatmentCycleId = dto.IVFDashboardTreatmentCycleId.Value,
                        IsDeleted = false
                    };
                    _db.IvftreatmentEpisodeBirthStage.Add(stage);
                    await _db.SaveChangesAsync();
                }

                if (dto.StatusId.HasValue)
                {
                    stage.StatusId = dto.StatusId;
                }

                // Replace existing children for this stage
                foreach (var child in stage.IvfepisodeBirth)
                {
                    foreach (var ca in child.IvfepisodeBirthChromosomeAnomaly)
                    {
                        ca.IsDeleted = true;
                    }

                    foreach (var cm in child.IvfepisodeBirthCongenitalMalformation)
                    {
                        cm.IsDeleted = true;
                    }

                    child.IsDeleted = true;
                }

                if (dto.Children != null && dto.Children.Any())
                {
                    foreach (var childDto in dto.Children)
                    {
                        var childEntity = new IvfepisodeBirth
                        {
                            BirthId = stage.BirthId,
                            DateOfBirth = childDto.DateOfBirth,
                            Week = childDto.Week,
                            GenderId = childDto.GenderId.HasValue && childDto.GenderId.Value > 0
                                ? childDto.GenderId.Value
                                : null,
                            DeliveryMethodCategoryId = childDto.DeliveryMethodCategoryId.HasValue && childDto.DeliveryMethodCategoryId.Value > 0
                                ? childDto.DeliveryMethodCategoryId.Value
                                : null,
                            Weight = childDto.Weight,
                            Length = childDto.Length,
                            HeadCircumference = childDto.HeadCircumference,
                            Apgar1 = childDto.Apgar1,
                            Apgar5 = childDto.Apgar5,
                            DeathPostPartumOn = childDto.DeathPostPartumOn,
                            DiedPerinatallyOn = childDto.DiedPerinatallyOn,
                            FirstName = childDto.FirstName,
                            Surname = childDto.Surname,
                            PlaceOfBirth = childDto.PlaceOfBirth,
                            CountryId = childDto.CountryId.HasValue && childDto.CountryId.Value > 0
                                ? childDto.CountryId.Value
                                : null,
                            Note = childDto.Note,
                            IsDeleted = false
                        };

                        _db.IvfepisodeBirth.Add(childEntity);
                        await _db.SaveChangesAsync();

                        if (childDto.ChromosomeAnomalyCategoryIds != null)
                        {
                            foreach (var catId in childDto.ChromosomeAnomalyCategoryIds)
                            {
                                if (string.IsNullOrWhiteSpace(catId))
                                    continue;

                                var anomaly = new IvfepisodeBirthChromosomeAnomaly
                                {
                                    BirthId = childEntity.Id,
                                    ChromosomeAnomalyCategoryId = catId,
                                    IsDeleted = false
                                };
                                _db.IvfepisodeBirthChromosomeAnomaly.Add(anomaly);
                            }
                        }

                        if (childDto.CongenitalMalformationCategoryIds != null)
                        {
                            foreach (var catId in childDto.CongenitalMalformationCategoryIds)
                            {
                                if (string.IsNullOrWhiteSpace(catId))
                                    continue;

                                var malformation = new IvfepisodeBirthCongenitalMalformation
                                {
                                    BirthId = childEntity.Id,
                                    CongenitalMalformationCategoryId = catId,
                                    IsDeleted = false
                                };

                                _db.IvfepisodeBirthCongenitalMalformation.Add(malformation);
                            }
                        }
                    }
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return Result<long>.Success(stage.BirthId);
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                var detailedMessage = ex.InnerException != null
                    ? $"{ex.Message} | InnerException: {ex.InnerException.Message}"
                    : ex.Message;
                return Result<long>.Failure(detailedMessage);
            }
        }

        public async Task<(bool IsSuccess, IVFEpisodeBirthDto? Data)> GetEpisodeBirthByCycleId(int ivfDashboardTreatmentCycleId)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, null);

            using var conn = _dapper.CreateConnection();
            try
            {
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetEpisodeBirthByCycle",
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

                var dto = JsonSerializer.Deserialize<IVFEpisodeBirthDto>(jsonResult, options);
                if (dto == null)
                    return (false, null);

                return (true, dto);
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<(bool IsSuccess, IEnumerable<IVFEpisodeBirthListItemDto> Data, int TotalRecords)> GetAllEpisodeBirthByCycleId(int ivfDashboardTreatmentCycleId, PaginationInfo pagination)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return (false, Enumerable.Empty<IVFEpisodeBirthListItemDto>(), 0);

            var page = pagination?.Page ?? 1;
            var rows = pagination?.RowsPerPage ?? 10;

            using var conn = _dapper.CreateConnection();
            try
            {
                using var grid = await conn.QueryMultipleAsync(
                    "IVF_GetAllEpisodeBirthByCycle",
                    new
                    {
                        PageNumber = page,
                        PageSize = rows,
                        IVFDashboardTreatmentCycleId = ivfDashboardTreatmentCycleId
                    },
                    commandType: CommandType.StoredProcedure
                );

                var data = (await grid.ReadAsync<IVFEpisodeBirthListItemDto>()).ToList();
                var total = await grid.ReadFirstAsync<int>();

                return (true, data, total);
            }
            catch
            {
                return (false, Enumerable.Empty<IVFEpisodeBirthListItemDto>(), 0);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> DeleteEpisodeBirthAsync(long id)
        {
            if (id <= 0)
                return (false, "Invalid Id");

            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var entity = await _db.IvfepisodeBirth
                    .Include(b => b.IvfepisodeBirthChromosomeAnomaly)
                    .Include(b => b.IvfepisodeBirthCongenitalMalformation)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (entity == null || entity.IsDeleted)
                {
                    await tx.RollbackAsync();
                    return (false, "Record not found or already deleted");
                }

                entity.IsDeleted = true;

                foreach (var ca in entity.IvfepisodeBirthChromosomeAnomaly)
                {
                    ca.IsDeleted = true;
                }

                foreach (var cm in entity.IvfepisodeBirthCongenitalMalformation)
                {
                    cm.IsDeleted = true;
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return (true, new { Success = 1, Message = "Record successfully deleted" });
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                var detailedMessage = ex.InnerException != null
                    ? $"{ex.Message} | InnerException: {ex.InnerException.Message}"
                    : ex.Message;
                return (false, detailedMessage);
            }
        }
    }
}
