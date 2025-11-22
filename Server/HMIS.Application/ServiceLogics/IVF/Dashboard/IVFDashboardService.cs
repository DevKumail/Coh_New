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

namespace HMIS.Application.ServiceLogics.IVF.Dashboard
{
    public interface IDashboardService
    {
        Task<(bool IsSuccess, DashboardReadDTO Data)> GetCoupleData(string MrNo);
        Task<(bool IsSuccess, IEnumerable<AllExceptSelfPatientsReadDTO> Data, int TotalRecords)> GetOppositeGenderPatients(string gender, PaginationInfo pagination, string? mrno = null, string? phone = null, string? emiratesId = null, string? name = null);
        Task<(bool IsSuccess, int IvfMainId, string Error)> GenerateIVFMain(InsertIvfRelationDTO dto);
        Task<(bool IsSuccess, int RelationId, string Error)> InsertPatientRelation(InsertPatientRelationDTO dto);
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
    }
}
