using Dapper;
using DocumentFormat.OpenXml.Wordprocessing;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class AlergyManager : IAlergyManager
    {
        public IConfiguration Configuration { get; }
        private readonly HMISDbContext _context;

        public AlergyManager(HMISDbContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }

        public async Task<DataSet> GetAlergyDetailsDB(string mrno, int? PageNumber, int? PageSize )
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", mrno);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetAllergies",param);
                if (ds == null)
                {

                    return new DataSet();
                    //throw new Exception("No data found");
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }

        private bool Exist(long id)
        {
            var patient = _context.PatientAllergy.Find(id);
            return patient != null;
        }
         
        public async Task<bool> InsertOrUpdateAlergy(AlergyModel alergyModel)
        {
            try
            {
                bool exist = Exist(alergyModel.AllergyId);

                if (!exist)
                {
                    var newPatientAlergy = new PatientAllergy();

        
                    newPatientAlergy.TypeId = alergyModel.TypeId;
                    newPatientAlergy.Reaction = alergyModel.Reaction;
                    newPatientAlergy.StartDate = alergyModel.StartDate;
                    newPatientAlergy.EndDate = alergyModel.EndDate;
                    newPatientAlergy.Status = alergyModel.Status;
                    newPatientAlergy.Active = alergyModel.Active;
                    newPatientAlergy.UpdatedBy = alergyModel.UpdatedBy;
                    newPatientAlergy.UpdatedDate = DateTime.Now;
                    if (alergyModel.ProviderId != null)
                    {
                        newPatientAlergy.ProviderId = alergyModel.ProviderId;

                    }
                    newPatientAlergy.Mrno = alergyModel.Mrno;
                    newPatientAlergy.CreatedBy = alergyModel.CreatedBy;
                    newPatientAlergy.CreatedDate = DateTime.Now;
                    newPatientAlergy.SeverityCode = alergyModel.SeverityCode;
                    newPatientAlergy.Allergen = alergyModel.Allergen;
                    newPatientAlergy.IsHl7msgCreated = alergyModel.IsHl7msgCreated;
                    newPatientAlergy.ReviewedDate = alergyModel.ReviewedDate;
                    newPatientAlergy.ReviewedBy = alergyModel.ReviewedBy;
                    newPatientAlergy.ErrorReason = alergyModel.ErrorReason;
                    newPatientAlergy.OldMrno = alergyModel.OldMrno;
                    newPatientAlergy.IsDeleted = false;
                    newPatientAlergy.AppointmentId = alergyModel.AppointmentId;
                    //newPatientAlergy.OutsideClinic = alergyModel.providerDescription;

                    _context.PatientAllergy.Add(newPatientAlergy);
                    await _context.SaveChangesAsync();
                    return true;

                }
                else if (exist)
                {
                    var patient = _context.PatientAllergy
                        .Where(x => x.AllergyId.Equals(alergyModel.AllergyId)).FirstOrDefault();

                    if (patient != null)
                    {
                        patient.AllergyId = alergyModel.AllergyId;
                        patient.TypeId = alergyModel.TypeId;
                        patient.Reaction = alergyModel.Reaction;
                        patient.StartDate = alergyModel.StartDate;
                        patient.EndDate = alergyModel.EndDate;
                        patient.Status = alergyModel.Status;
                        patient.Active = alergyModel.Active;
                        patient.UpdatedBy = alergyModel.UpdatedBy;
                        patient.UpdatedDate = DateTime.Now;
                        if (alergyModel.ProviderId != null)
                        {
                            patient.ProviderId = alergyModel.ProviderId;
                        }
                        patient.Mrno = alergyModel.Mrno;
                       // patient.OutsideClinic = alergyModel.providerDescription;
                        patient.CreatedBy = alergyModel.CreatedBy;
                        patient.CreatedDate = DateTime.Now;
                        patient.SeverityCode = alergyModel.SeverityCode;
                        patient.Allergen = alergyModel.Allergen;
                        patient.IsHl7msgCreated = alergyModel.IsHl7msgCreated;
                        patient.ReviewedDate = alergyModel.ReviewedDate;
                        patient.ReviewedBy = alergyModel.ReviewedBy;
                        patient.ErrorReason = alergyModel.ErrorReason;
                        patient.OldMrno = alergyModel.OldMrno;
                        patient.IsDeleted = false;
                        patient.AppointmentId = alergyModel.AppointmentId;

                        await _context.SaveChangesAsync();
                        return true;

                    }
                    else
                    {   
                        return false;
                    }

                }
                return false;  
            }

            catch(Exception ex)
            {

                throw ex;
            }
        }


        public async Task<bool> DeleteAlergy(long Id)
        {
            try
            {
                var data = _context.PatientAllergy.Where(x => x.AllergyId == Id).FirstOrDefault();
                if (data != null)
                {
                    data.IsDeleted = true;
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

    }
}
