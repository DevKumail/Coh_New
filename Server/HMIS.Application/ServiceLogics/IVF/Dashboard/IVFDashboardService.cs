using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Infrastructure.ORM;
using System.Data;
using Dapper;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Data.SqlClient;
using System.Text.Json;

namespace HMIS.Application.ServiceLogics.IVF.Dashboard
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

    public interface IDashboardService
    {
        Task<(bool IsSuccess, DashboardReadDTO Data)> GetCoupleData(string MrNo);
        Task<(bool IsSuccess, IEnumerable<AllExceptSelfPatientsReadDTO> Data, int TotalRecords)> GetOppositeGenderPatients(string gender, PaginationInfo pagination, string? mrno = null, string? phone = null, string? emiratesId = null, string? name = null);
        Task<(bool IsSuccess, int IvfMainId, string Error)> GenerateIVFMain(InsertIvfRelationDTO dto);
        Task<(bool IsSuccess, int RelationId, string Error)> InsertPatientRelation(InsertPatientRelationDTO dto);
        Task<Result<int>> CreateOrUpdateDashboardTreatmentCycleAsync(IVFDashboardTreatmentCycleDto dto);
        Task<(bool IsSuccess, IVFDashboardTreatmentCycleDto? Data)> GetIVFDashboardTreatmentCycle(string ivfDashboardTreatmentCycleId);
        Task<(bool IsSuccess, object? Data)> GetAllIVFDashboardTreatmentCycle(string ivfmainid, PaginationInfo pagination);
        Task<(bool IsSuccess, IVFDashboardFertilityHistoryDto? Data)> GetFertilityHistoryForDashboard(string ivfmainid);
        Task<(bool IsSuccess, object? Data)> DeleteDashboardTreatmentCycleAsync(string ivfDashboardTreatmentEpisodeId);
    }

    internal class IVFDashboardService : IDashboardService
    {
        private readonly DapperContext _dapper;
        private readonly HMISDbContext _db;
        public IVFDashboardService(DapperContext dapper, HMISDbContext db)
        {
            _dapper = dapper;
            _db = db;
        }
        public async Task<(bool IsSuccess, DashboardReadDTO Data)> GetCoupleData(string MrNo)
        {
            if (string.IsNullOrWhiteSpace(MrNo)) return (false, null);

            using var conn = _dapper.CreateConnection();

            var rows = (await conn.QueryAsync<BaseDemographicDTO>(
                "IVF_GetCoupleDetails",
                new { MrNo },
                commandType: CommandType.StoredProcedure
            )).ToList();

            if (!rows.Any()) return (false, null);

            var dto = new DashboardReadDTO();

            foreach (var r in rows)
            {
                BaseDemographicDTO? target = r.Gender switch
                {
                    "Male" => dto.Male = new MaleDemographicDTO(),
                    "Female" => dto.Female = new FemaleDemographicDTO(),
                    _ => null
                };

                if (target == null) continue;

                target.MrNo = r.MrNo;
                target.Name = r.Name;
                target.DateOfBirth = r.DateOfBirth;
                target.AgeYears = r.AgeYears;
                target.Phone = r.Phone;
                target.Email = r.Email;
                target.EID = r.EID;
                target.Nationality = r.Nationality;
                target.Picture = r.Picture;
                target.Gender = r.Gender;
            }
            var IvfMainId = await conn.QueryFirstOrDefaultAsync("IVF_GetMainId", new { MrNo }, commandType: CommandType.StoredProcedure); 
            
            dto.IVFMainId = IvfMainId;
            return (true, dto);
        }

        public async Task<(bool IsSuccess, IEnumerable<AllExceptSelfPatientsReadDTO> Data, int TotalRecords)> GetOppositeGenderPatients(string gender, PaginationInfo pagination, string? mrno = null, string? phone = null, string? emiratesId = null, string? name = null)
        {
            if (string.IsNullOrWhiteSpace(gender)) return (false, Enumerable.Empty<AllExceptSelfPatientsReadDTO>(), 0);

            var normalized = gender.Trim();
            string opposite = normalized.Equals("Male", StringComparison.OrdinalIgnoreCase)
                ? "Female"
                : normalized.Equals("Female", StringComparison.OrdinalIgnoreCase)
                    ? "Male"
                    : string.Empty;

            if (string.IsNullOrEmpty(opposite)) return (false, Enumerable.Empty<AllExceptSelfPatientsReadDTO>(), 0);

            using var conn = _dapper.CreateConnection();

            using var grid = await conn.QueryMultipleAsync(
                "IVF_GetOppositeGenderPatients",
                new
                {
                    Gender = opposite,
                    pagination?.Page,
                    pagination?.RowsPerPage,
                    MrNo = string.IsNullOrWhiteSpace(mrno) ? null : mrno?.Trim(),
                    Phone = string.IsNullOrWhiteSpace(phone) ? null : phone?.Trim(),
                    EmiratesId = string.IsNullOrWhiteSpace(emiratesId) ? null : emiratesId?.Trim(),
                    Name = string.IsNullOrWhiteSpace(name) ? null : name?.Trim()
                },
                commandType: CommandType.StoredProcedure
            );

            var list = (await grid.ReadAsync<AllExceptSelfPatientsReadDTO>()).ToList();
            var total = (await grid.ReadAsync<int>()).FirstOrDefault();

            return (true, list, total);
        }

        public async Task<(bool IsSuccess, int IvfMainId, string Error)> GenerateIVFMain(InsertIvfRelationDTO dto)
        {
            if (dto == null) return (false, 0, "Invalid payload");
            if (string.IsNullOrWhiteSpace(dto.PrimaryMrNo) || string.IsNullOrWhiteSpace(dto.SecondaryMrNo))
                return (false, 0, "Primary and Secondary MRNo are required");

            var primaryMr = dto.PrimaryMrNo.Trim();
            var secondaryMr = dto.SecondaryMrNo.Trim();

            var primary = await _db.RegPatient.FirstOrDefaultAsync(p => p.Mrno == primaryMr);
            if (primary == null) return (false, 0, $"Primary MRNo not found: {primaryMr}");

            var secondary = await _db.RegPatient.FirstOrDefaultAsync(p => p.Mrno == secondaryMr);
            if (secondary == null) return (false, 0, $"Secondary MRNo not found: {secondaryMr}");

            long maleId;
            long femaleId;

          
            if (dto.PrimaryIsMale.Value)
            {
                maleId = primary.PatientId;
                femaleId = secondary.PatientId;
            }
            else
            {
                maleId = secondary.PatientId;
                femaleId = primary.PatientId;
            }

            if (dto.AppId <= 0)
                return (false, 0, "Appointment ID is required");

            var visitExists = await _db.SchAppointment.AnyAsync(v => v.AppId == dto.AppId);
            if (!visitExists) return (false, 0, "Appointment ID not found");

            var entity = new Ivfmain
            {
                MalePatientId = maleId,
                FemalePatientId = femaleId,
                AppId = dto.AppId
            };

            _db.Ivfmain.Add(entity);
            await _db.SaveChangesAsync();

            return (true, entity.IvfmainId, string.Empty);
        }

        public async Task<(bool IsSuccess, int RelationId, string Error)> InsertPatientRelation(InsertPatientRelationDTO dto)
        {
            if (dto == null) return (false, 0, "Invalid payload");
            if (string.IsNullOrWhiteSpace(dto.PrimaryMrNo) || string.IsNullOrWhiteSpace(dto.SecondaryMrNo))
                return (false, 0, "Primary and Secondary MRNo are required");

            var pMr = dto.PrimaryMrNo.Trim();
            var sMr = dto.SecondaryMrNo.Trim();

            var primary = await _db.RegPatient.FirstOrDefaultAsync(p => p.Mrno == pMr);
            if (primary == null) return (false, 0, $"Primary MRNo not found: {pMr}");

            var secondary = await _db.RegPatient.FirstOrDefaultAsync(p => p.Mrno == sMr);
            if (secondary == null) return (false, 0, $"Secondary MRNo not found: {sMr}");

            var relationId = dto.RelationshipId <= 0 ? 4 : dto.RelationshipId; // default spouse=4

            var entity = new RegPatientRelation
            {
                PatientId = primary.PatientId,
                RelatedPatientId = secondary.PatientId,
                RelationshipId = relationId,
            };

            _db.RegPatientRelation.Add(entity);
            try
            {
                await _db.SaveChangesAsync();
                return (true, entity.PatientRelationId, string.Empty);
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && (sqlEx.Number == 2627 || sqlEx.Number == 2601))
            {
                return (false, 0, "Relation already exists.");
            }
            catch (Exception ex)
            {
                return (false, 0, ex.Message);
            }
        }

        public async Task<(bool IsSuccess, IVFDashboardFertilityHistoryDto? Data)> GetFertilityHistoryForDashboard(string ivfmainid)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return (false, null);

            if (!int.TryParse(ivfmainid, out var ivfMainIdInt))
                return (false, null);

            using var conn = _dapper.CreateConnection();
            try
            {
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetFertilityHistoryForDashboard",
                    new { IVFMainId = ivfMainIdInt },
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

                var dto = JsonSerializer.Deserialize<IVFDashboardFertilityHistoryDto>(jsonResult, options);
                if (dto == null)
                    return (false, null);

                return (true, dto);
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> DeleteDashboardTreatmentCycleAsync(string ivfDashboardTreatmentCycleId)
        {
            if (!int.TryParse(ivfDashboardTreatmentCycleId, out var id))
                return (false, "Invalid IVFDashboardTreatmentCycleId");

            await using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                var cycle = await _db.IvfdashboardTreatmentCycle
                    .Include(e => e.IvfdashboardAdditionalMeasures)
                        .ThenInclude(am => am.IvfplannedAdditionalMeasures)
                    .Include(e => e.IvfdashboardAdditionalMeasures)
                        .ThenInclude(am => am.IvfperformedAdditionalMeasures)
                    .Include(e => e.IvfdashboardAdditionalMeasures)
                        .ThenInclude(am => am.IvfpolarBodiesIndications)
                    .Include(e => e.IvfdashboardAdditionalMeasures)
                        .ThenInclude(am => am.IvfembblastIndications)
                    .Include(e => e.IvftreatmentPlannedSpermCollection)
                    .Include(e => e.IvftreatmentEpisodesAttachments)
                    .Include(e => e.IvftreatmentTypes)
                    .Include(e => e.IvftreatmentEpisodeOverviewStage)
                    .FirstOrDefaultAsync(e => e.IvfdashboardTreatmentCycleId == id);

                if (cycle == null || cycle.IsDeleted)
                {
                    await transaction.RollbackAsync();
                    return (false, "Record not found or already deleted");
                }

                cycle.IsDeleted = true;

                var add = cycle.IvfdashboardAdditionalMeasures;
                if (add != null)
                {
                    add.IsDeleted = true;

                    foreach (var pam in add.IvfplannedAdditionalMeasures)
                    {
                        pam.IsDeleted = true;
                    }

                    foreach (var perf in add.IvfperformedAdditionalMeasures)
                    {
                        perf.IsDeleted = true;
                    }

                    foreach (var polar in add.IvfpolarBodiesIndications)
                    {
                        polar.IsDeleted = true;
                    }

                    foreach (var emb in add.IvfembblastIndications)
                    {
                        emb.IsDeleted = true;
                    }
                }

                foreach (var planned in cycle.IvftreatmentPlannedSpermCollection)
                {
                    planned.IsDeleted = true;
                }

                foreach (var att in cycle.IvftreatmentEpisodesAttachments)
                {
                    att.IsDeleted = true;
                }

                foreach (var tt in cycle.IvftreatmentTypes)
                {
                    tt.IsDeleted = true;
                }

                foreach (var ov in cycle.IvftreatmentEpisodeOverviewStage)
                {
                    ov.IsDeleted = true;
                }

                await _db.SaveChangesAsync();
                await transaction.CommitAsync();

                return (true, new { Success = 1, Message = "Record successfully deleted" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, ex.Message);
            }
        }

        public async Task<(bool IsSuccess, object? Data)> GetAllIVFDashboardTreatmentCycle(string ivfmainid, PaginationInfo pagination)
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
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetAllIVFDashboardTreatmentCycle",
                    new { PageNumber = page, PageSize = rows, IVFMainId = ivfMainIdInt },
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

                var dto = JsonSerializer.Deserialize<IVFDashboardTreatmentCycleListDto>(jsonResult, options);
                if (dto == null)
                    return (false, null);

                return (true, dto);
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<(bool IsSuccess, IVFDashboardTreatmentCycleDto? Data)> GetIVFDashboardTreatmentCycle(string ivfDashboardTreatmentCycleId)
        {
            if (string.IsNullOrWhiteSpace(ivfDashboardTreatmentCycleId))
                return (false, null);

            if (!int.TryParse(ivfDashboardTreatmentCycleId, out var treatmentCycleIdInt))
                return (false, null);

            using var conn = _dapper.CreateConnection();
            try
            {
                var jsonResult = await conn.ExecuteScalarAsync<string>(
                    "IVF_GetIVFDashboardTreatmentCycle",
                    new { IVFDashboardTreatmentCycleId = treatmentCycleIdInt },
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

                var dto = JsonSerializer.Deserialize<IVFDashboardTreatmentCycleDto>(jsonResult, options);
                if (dto == null)
                    return (false, null);

                return (true, dto);
            }
            catch
            {
                return (false, null);
            }
        }

        public async Task<Result<int>> CreateOrUpdateDashboardTreatmentCycleAsync(IVFDashboardTreatmentCycleDto dto)
        {
            if (dto == null) return Result<int>.Failure("DTO is required");

            await using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                IvfdashboardTreatmentCycle? cycle;

                if (dto.IVFDashboardTreatmentCycleId.HasValue && dto.IVFDashboardTreatmentCycleId.Value > 0)
                {
                    cycle = await _db.IvfdashboardTreatmentCycle
                        .Include(e => e.IvftreatmentTypes)
                        .Include(e => e.IvftreatmentEpisodesAttachments)
                        .FirstOrDefaultAsync(e => e.IvfdashboardTreatmentCycleId == dto.IVFDashboardTreatmentCycleId.Value);

                    if (cycle == null)
                    {
                        cycle = new IvfdashboardTreatmentCycle();
                        _db.IvfdashboardTreatmentCycle.Add(cycle);
                    }
                }
                else
                {
                    cycle = new IvfdashboardTreatmentCycle();
                    _db.IvfdashboardTreatmentCycle.Add(cycle);
                }

                if (dto.IVFMainId.HasValue) cycle.IvfmainId = dto.IVFMainId.Value;
                if (dto.IVFMaleFHId.HasValue) cycle.IvfmaleFhid = dto.IVFMaleFHId.Value;
                if (dto.IVFFemaleFHId.HasValue) cycle.IvffemaleFhid = dto.IVFFemaleFHId.Value;
                if (dto.TreatmentTypeCategoryId.HasValue) cycle.TreatmentTypeCategoryId = dto.TreatmentTypeCategoryId.Value;
                if (dto.OnlyInternalCycle.HasValue) cycle.OnlyInternalCycle = dto.OnlyInternalCycle.Value;
                if (dto.DateOfLMP.HasValue) cycle.DateofLmp = dto.DateOfLMP.Value;
                if (dto.TherapyStartDate.HasValue) cycle.TherapyStartDate = dto.TherapyStartDate.Value;
                if (dto.CycleFromAmenorrheaCategoryId.HasValue) cycle.CycleFromAmenorrheaCategoryId = dto.CycleFromAmenorrheaCategoryId.Value;
                if (dto.MainIndicationCategoryId.HasValue) cycle.MainIndicationCategoryId = dto.MainIndicationCategoryId.Value;
                if (dto.ProtocolCategoryId.HasValue) cycle.ProtocolCategoryId = dto.ProtocolCategoryId.Value;
                if (dto.StimulationPlannedCategoryId.HasValue) cycle.StimulationPlannedCategoryId = dto.StimulationPlannedCategoryId.Value;
                if (dto.StimulatedExternallyCategoryId.HasValue) cycle.StimulatedExternallyCategoryId = dto.StimulatedExternallyCategoryId.Value;
                if (dto.LongTermMedication != null) cycle.LongTermMedication = dto.LongTermMedication;
                if (dto.PlannedNo.HasValue) cycle.PlannedNo = dto.PlannedNo.Value;
                if (dto.PlannedSpermCollectionCategoryId.HasValue) cycle.PlannedSpermCollectionCategoryId = dto.PlannedSpermCollectionCategoryId.Value;

                if (dto.ProviderId.HasValue) cycle.ProviderId = dto.ProviderId.Value;
                if (dto.RandomizationGroup != null) cycle.RandomizationGroup = dto.RandomizationGroup;
                if (dto.Survey != null) cycle.Survey = dto.Survey;
                if (dto.TakenOverFrom != null) cycle.TakenOverFrom = dto.TakenOverFrom;
                if (dto.TakeOverOn.HasValue) cycle.TakeOverOn = dto.TakeOverOn.Value;

                if (dto.CycleNote != null) cycle.CycleNote = dto.CycleNote;

                await _db.SaveChangesAsync();

                var cycleId = cycle.IvfdashboardTreatmentCycleId;

                if (dto.TreatmentSubTypes != null && dto.TreatmentSubTypes.Any())
                {
                    var existingTypes = await _db.IvftreatmentTypes
                        .Where(t => t.IvfdashboardTreatmentEpisodeId == cycleId && !t.IsDeleted)
                        .ToListAsync();

                    foreach (var t in existingTypes)
                    {
                        t.IsDeleted = true;
                    }

                    foreach (var sub in dto.TreatmentSubTypes.Where(x => x.TreatmentCategoryId.HasValue))
                    {
                        var item = new IvftreatmentTypes
                        {
                            IvfdashboardTreatmentEpisodeId = cycleId,
                            TreatmentCategoryId = sub.TreatmentCategoryId!.Value,
                            IsDeleted = false
                        };
                        _db.IvftreatmentTypes.Add(item);
                    }
                }

                if (dto.PlannedSpermCollectionCategoryIds != null || !dto.PlannedSpermCollectionCategoryIds.Any())
                {
                    var existingPlannedSperm = await _db.IvftreatmentPlannedSpermCollection
                        .Where(p => p.IvfdashboardTreatmentCycleId == cycleId && !p.IsDeleted)
                        .ToListAsync();

                    foreach (var p in existingPlannedSperm)
                    {
                        p.IsDeleted = true;
                    }

                    foreach (var catId in dto.PlannedSpermCollectionCategoryIds)
                    {
                        var planned = new IvftreatmentPlannedSpermCollection
                        {
                            IvfdashboardTreatmentCycleId = cycleId,
                            PlannedSpermCollectionCategoryId = catId,
                            IsDeleted = false
                        };
                        _db.IvftreatmentPlannedSpermCollection.Add(planned);
                    }
                }

                var addDto = dto.AdditionalMeasure;
                IvfdashboardAdditionalMeasures? additionalMeasures = null;

                if (addDto != null)
                {
                    // 1:1 relation: always resolve by treatment cycle, not by IVFAdditionalMeasuresId from DTO
                    additionalMeasures = await _db.IvfdashboardAdditionalMeasures
                        .FirstOrDefaultAsync(a => a.IvfdashboardTreatmentEpisodeId == cycleId);

                    if (additionalMeasures == null &&
                        (!string.IsNullOrWhiteSpace(addDto.GeneralCondition)
                         || (addDto.PlannedAdditionalMeasuresCategoryIds != null && addDto.PlannedAdditionalMeasuresCategoryIds.Any())
                         || (addDto.PerformedAdditionalMeasuresCategoryIds != null && addDto.PerformedAdditionalMeasuresCategoryIds.Any())
                         || (addDto.PolarBodiesIndicationCategoryIds != null && addDto.PolarBodiesIndicationCategoryIds.Any())
                         || (addDto.EMBBlastIndicationCategoryIds != null && addDto.EMBBlastIndicationCategoryIds.Any())))
                    {
                        additionalMeasures = new IvfdashboardAdditionalMeasures
                        {
                            IvfdashboardTreatmentEpisodeId = cycleId
                        };
                        _db.IvfdashboardAdditionalMeasures.Add(additionalMeasures);
                    }
                }

                if (additionalMeasures != null && addDto != null)
                {
                    additionalMeasures.IvfdashboardTreatmentEpisodeId = cycleId;
                    if (addDto.GeneralCondition != null) additionalMeasures.GeneralCondition = addDto.GeneralCondition;

                    await _db.SaveChangesAsync();

                    var addId = additionalMeasures.IvfadditionalMeasuresId;

                    if (addDto.PlannedAdditionalMeasuresCategoryIds != null)
                    {
                        var existingPlanned = await _db.IvfplannedAdditionalMeasures.Where(p => p.IvfadditionalMeasuresId == addId).ToListAsync();
                        if (existingPlanned.Any()) _db.IvfplannedAdditionalMeasures.RemoveRange(existingPlanned);

                        foreach (var mId in addDto.PlannedAdditionalMeasuresCategoryIds)
                        {
                            var planned = new IvfplannedAdditionalMeasures
                            {
                                IvfadditionalMeasuresId = addId,
                                MeasuresCategoryId = mId
                            };
                            _db.IvfplannedAdditionalMeasures.Add(planned);
                        }
                    }

                    if (addDto.PerformedAdditionalMeasuresCategoryIds != null)
                    {
                        var existingPerformed = await _db.IvfperformedAdditionalMeasures
                            .Where(p => p.IvfadditionalMeasuresId == addId && !p.IsDeleted)
                            .ToListAsync();

                        foreach (var perf in existingPerformed)
                        {
                            perf.IsDeleted = true;
                        }

                        foreach (var pId in addDto.PerformedAdditionalMeasuresCategoryIds)
                        {
                            var perf = new IvfperformedAdditionalMeasures
                            {
                                IvfadditionalMeasuresId = addId,
                                PerformedAdditionalMeasuresCategoryId = pId,
                                IsDeleted = false
                            };
                            _db.IvfperformedAdditionalMeasures.Add(perf);
                        }
                    }

                    if (addDto.PolarBodiesIndicationCategoryIds != null)
                    {
                        var existingPolar = await _db.IvfpolarBodiesIndications
                            .Where(p => p.IvfadditionalMeasuresId == addId)
                            .ToListAsync();

                        if (existingPolar.Any())
                        {
                            _db.IvfpolarBodiesIndications.RemoveRange(existingPolar);
                        }

                        foreach (var cId in addDto.PolarBodiesIndicationCategoryIds)
                        {
                            var polar = new IvfpolarBodiesIndications
                            {
                                IvfadditionalMeasuresId = addId,
                                PidpolarBodiesIndicationCategoryId = cId,
                                IsDeleted = false
                            };
                            _db.IvfpolarBodiesIndications.Add(polar);
                        }
                    }

                    if (addDto.EMBBlastIndicationCategoryIds != null)
                    {
                        var existingEmb = await _db.IvfembblastIndications
                            .Where(p => p.IvfadditionalMeasuresId == addId)
                            .ToListAsync();

                        if (existingEmb.Any())
                        {
                            _db.IvfembblastIndications.RemoveRange(existingEmb);
                        }

                        foreach (var eId in addDto.EMBBlastIndicationCategoryIds)
                        {
                            var emb = new IvfembblastIndications
                            {
                                IvfadditionalMeasuresId = addId,
                                PidembblastIndicationCategoryId = eId,
                                IsDeleted = false
                            };
                            _db.IvfembblastIndications.Add(emb);
                        }
                    }
                }

                // Attachments (IVFTreamentsEpisodeAttachments) - replace semantics per save
                if (dto.Attachments != null)
                {
                    var existingAttachments = await _db.IvftreatmentEpisodesAttachments
                        .Where(a => a.IvfdashboardTreatmentEpisodeId == cycleId && !a.IsDeleted)
                        .ToListAsync();

                    foreach (var att in existingAttachments)
                    {
                        att.IsDeleted = true;
                    }

                    foreach (var attDto in dto.Attachments.Where(x => x.HMISFileId.HasValue))
                    {
                        var newAtt = new IvftreatmentEpisodesAttachments
                        {
                            IvfdashboardTreatmentEpisodeId = cycleId,
                            HmisfileId = attDto.HMISFileId.Value,
                            IsDeleted = false
                        };
                        _db.IvftreatmentEpisodesAttachments.Add(newAtt);
                    }
                }

                // Ensure only this cycle is active for the given IVFMainId
                if (cycle.IvfmainId.HasValue)
                {
                    var ivfMainId = cycle.IvfmainId.Value;

                    var relatedCycles = await _db.IvfdashboardTreatmentCycle
                        .Where(c => c.IvfmainId == ivfMainId && !c.IsDeleted)
                        .ToListAsync();

                    foreach (var cycles in relatedCycles)
                    {
                        cycles.CycleStatus = cycles.IvfdashboardTreatmentCycleId == cycleId;
                    }
                }

                await _db.SaveChangesAsync();
                await transaction.CommitAsync();

                return Result<int>.Success(cycleId);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<int>.Failure(ex.Message);
            }
        }
    }
}
