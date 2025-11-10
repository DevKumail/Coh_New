using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Infrastructure.ORM;
using System.Data;
using System.Threading.Tasks;
using System;
using Dapper;

namespace HMIS.Application.ServiceLogics.IVF
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }     // true if operation succeeded
        public T Data { get; set; }             // the actual result data
        public string ErrorMessage { get; set; } // error message if any
    }
    // Service interface
    public interface IDashboardService
    {
        Task<(bool IsSuccess, DashboardReadDTO Data)> GetCoupleData(string mrno);
        Task<Result<(string gender, BaseDemographicDTO)>> GetCoverageAndRegPatientDBByMrNo(string MRNo);
    }

    // Service implementation
    public class DashboardService : IDashboardService
    {
        private readonly DapperContext _dapper;

        public DashboardService(DapperContext dapper)
        {
            _dapper = dapper;
        }

        public async Task<(bool IsSuccess, DashboardReadDTO Data)> GetCoupleData(string mrno)
        {
            var result = await GetCoverageAndRegPatientDBByMrNo(mrno);

            if (!result.IsSuccess || result.Data.gender is null)
            {
                return (false, null);
            }


            var (gender, patient) = result.Data;

            var dto = new DashboardReadDTO
            {
                Female = gender == "Female" ? new FemaleDemographicDTO
                {
                    MrNo = patient.MrNo,
                    Name = patient.Name,
                    DateOfBirth = patient.DateOfBirth,
                    AgeYears = patient.AgeYears,
                    Phone = patient.Phone,
                    Email = patient.Email,
                    EID = patient.EID,
                    Nationality = patient.Nationality,
                    Picture = patient.Picture
                } : null,
                Male = gender == "Male" ? new MaleDemographicDTO
                {
                    MrNo = patient.MrNo,
                    Name = patient.Name,
                    DateOfBirth = patient.DateOfBirth,
                    AgeYears = patient.AgeYears,
                    Phone = patient.Phone,
                    Email = patient.Email,
                    EID = patient.EID,
                    Nationality = patient.Nationality,
                    Picture = patient.Picture
                } : null
            };

            return (true, dto);
        }

        public async Task<Result<(string gender, BaseDemographicDTO)>> GetCoverageAndRegPatientDBByMrNo(string MRNo)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(MRNo))
                {
                    return new Result<(string, BaseDemographicDTO)>
                    {
                        IsSuccess = false,
                        ErrorMessage = "MRNo cannot be empty",
                        Data = (null, null)
                    };
                }

                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("Common_CoverageAndRegPatientGet", param);

                if (ds == null || ds.Tables.Count < 2 || ds.Tables[1].Rows.Count == 0)
                {
                    return new Result<(string, BaseDemographicDTO)>
                    {
                        IsSuccess = false,
                        ErrorMessage = "No patient data found",
                        Data = (null, null)
                    };
                }

                var data = ds.Tables[1].Rows[0];

                string gender = data.Table.Columns.Contains("Gender") && data["Gender"] != DBNull.Value
                    ? (data["Gender"].ToString() == "Female" ? "Female" : "Male")
                    : "Unknown";

                var patient = new BaseDemographicDTO
                {
                    Name = data["PersonFirstName"].ToString(),
                    DateOfBirth = Convert.ToDateTime(data["PatientBirthDate"]),
                    AgeYears = data["Age"].ToString(),
                    MrNo = Convert.ToInt32(data["MRNo"]),
                    Phone = data["personCellPhone"].ToString(),
                    Email = data["personEmail"].ToString(),
                    //EID = data[""].ToString(),
                    //Nationality = data[""].ToString(),
                    EID = "",
                    Nationality = "",
                    Picture = (byte[])data["PatientPicture"]
                };

                return new Result<(string, BaseDemographicDTO)>
                {
                    IsSuccess = true,
                    Data = (gender, patient)
                };
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                return new Result<(string, BaseDemographicDTO)>
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    Data = (null, null)
                };
            }
        }
        
    }
}
