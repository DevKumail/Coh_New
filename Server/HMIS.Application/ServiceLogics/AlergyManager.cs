using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using HMIS.Infrastructure.ORM;

namespace HMIS.Application.ServiceLogics
{
    public class AlergyManager : IAlergyManager
    {
        public IConfiguration Configuration { get; }
        private readonly HmisContext _context;

        public AlergyManager(HmisContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }

        public async Task<DataSet> GetAlergyDetailsDB(string mrno)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", mrno);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetAllergies",param);
                if (ds.Tables[1].Rows.Count == 0)
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
            var patient = _context.PatientAllergies.Find(id);
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

                    _context.PatientAllergies.Add(newPatientAlergy);
                    await _context.SaveChangesAsync();
                    return true;

                }
                else if (exist)
                {
                    var patient = _context.PatientAllergies
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
                var data = _context.PatientAllergies.Where(x => x.AllergyId == Id).FirstOrDefault();
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
