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

                var query = @"
                        SELECT 
                            RP.MRNo,
                            CONCAT(
                                RP.PersonFirstName, 
                                CASE 
                                    WHEN RP.PersonMiddleName IS NOT NULL AND RP.PersonMiddleName <> '' 
                                    THEN ' ' + RP.PersonMiddleName 
                                    ELSE '' 
                                END, 
                                CASE 
                                    WHEN RP.PersonLastName IS NOT NULL AND RP.PersonLastName <> '' 
                                    THEN ' ' + RP.PersonLastName 
                                    ELSE '' 
                                END
                            ) AS FullName,
                            RP.PatientBirthDate,
                            RP.PatientPicture,
                            RP.PersonSocialSecurityNo,
                            G.Gender,
                            N.NationalityCode,
                            PD.CellPhone,
                            PD.Email
                        FROM RegPatient AS RP
                        LEFT JOIN RegGender AS G 
                            ON RP.PersonSex = G.GenderId
                        LEFT JOIN Nationality AS N 
                            ON RP.Nationality = N.NationalityId
                        LEFT JOIN RegPatientDetails AS PD
                            ON RP.PatientId = PD.PatientId
							Where RP.MRNo = "+ MRNo
                        ;

                var ds = await DapperHelper.GetDataSetByQuery(query, new { MRNo });


                if (ds == null || ds.Tables.Count < 1 || ds.Tables[0].Rows.Count == 0)
                {
                    return new Result<(string, BaseDemographicDTO)>
                    {
                        IsSuccess = false,
                        ErrorMessage = "No patient data found",
                        Data = (null, null)
                    };
                }

                var data = ds.Tables[0].Rows[0];
                var patientAge = GetPatientAge(Convert.ToDateTime(data["PatientBirthDate"]));

                string gender = data.Table.Columns.Contains("Gender") && data["Gender"] != DBNull.Value
                    ? (data["Gender"].ToString() == "Female" ? "Female" : "Male")
                    : "Unknown";

                var patient = new BaseDemographicDTO
                {
                    Name = data["FullName"].ToString(),
                    DateOfBirth = Convert.ToDateTime(data["PatientBirthDate"]),
                    AgeYears = patientAge,
                    MrNo = Convert.ToInt32(data["MRNo"]),
                    Phone = data["CellPhone"].ToString(),
                    Email = data["Email"].ToString(),
                    EID = data["PersonSocialSecurityNo"].ToString(),
                    Nationality = data["NationalityCode"].ToString(),
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
        public static string GetPatientAge(DateTime birthDate)
        {
            var today = DateTime.Today;

            int years = today.Year - birthDate.Year;
            int months = today.Month - birthDate.Month;
            int days = today.Day - birthDate.Day;

            // Adjust if current month/day is before birth month/day
            if (days < 0)
            {
                months--;
                var prevMonth = today.AddMonths(-1);
                days += DateTime.DaysInMonth(prevMonth.Year, prevMonth.Month);
            }

            if (months < 0)
            {
                years--;
                months += 12;
            }

            var parts = new List<string>();

            if (years > 0)
                parts.Add($"{years}y");
            if (months > 0)
                parts.Add($"{months}m");
            if (days > 0)
                parts.Add($"{days}d");

            // In case all are zero (same day)
            if (parts.Count == 0)
                return "0d";

            return string.Join(" ", parts);
        }

    }
}
