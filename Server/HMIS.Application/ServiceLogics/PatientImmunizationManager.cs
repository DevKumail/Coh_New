using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class PatientImmunizationManager : IPatientImmunization
    {
        public IConfiguration Configuration { get; }
        private readonly HmisContext _context;


        public PatientImmunizationManager(HmisContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }


        public async Task<DataSet> GetAllPatientImmunization(string mrno)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", Convert.ToInt16(mrno));
                //param.Add("@UserId", UserId);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetPatientImmunizationList",param);
                if (ds.Tables[0].Rows.Count == 0)
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

            var patient = _context.PatientImmunizations.Find(id);
            return patient != null;
        }
        public async Task<bool> InsertOrUpdatePatientImmunization(PatientImmunizationModel patientImmunization)
        {
            try
            {
                bool exist = Exist(patientImmunization.Id);

                if (!exist)
                { 

                    var newPatient = new PatientImmunization();
                    newPatient.AppointmentId = patientImmunization.AppointmentId;
                    newPatient.LotNumber = patientImmunization.LotNumber;
                    newPatient.Status= patientImmunization.Status;
                    newPatient.StartDate= patientImmunization.StartDate;
                    newPatient.EndDate= patientImmunization.EndDate;
                    if (patientImmunization.ProviderId != null)
                    {
                        newPatient.ProviderId = patientImmunization.ProviderId;
                    }
                    //newPatient.OutsideClinic = patientImmunization.providerDescription;
                 
                    newPatient.ProviderName= patientImmunization.ProviderName;
                    newPatient.Comments= patientImmunization.Comments;
                    newPatient.ManufacturerName = patientImmunization.ManufacturerName;
                    newPatient.ExpiryDate= patientImmunization.ExpiryDate;
                    newPatient.InjectionDate= patientImmunization.InjectionDate;
                    newPatient.NextInjectionDate= patientImmunization.NextInjectionDate;
                    newPatient.SiteInjection = patientImmunization.SiteInjection;
                    newPatient.RouteId= patientImmunization.RouteId;
                    newPatient.DrugName= patientImmunization.DrugName;
                    newPatient.DrugTypeId = patientImmunization.DrugTypeId;
                    newPatient.IsDeleted = false;
                    newPatient.Mrno= patientImmunization.Mrno;   
                    newPatient.OldMrno= patientImmunization.OldMrno;
                    newPatient.Dose= patientImmunization.Dose;
                    newPatient.ErrorReason= patientImmunization.ErrorReason;
                    newPatient.ImmTypeId = patientImmunization.ImmTypeId;
                    // newPatient.ImmTypeGuid= patientImmunization.ImmTypeGuid;
                    newPatient.UpdatedDate = DateTime.Now;
                    newPatient.CreatedBy = patientImmunization.CreatedBy;
                    newPatient.UpdatedBy = null;//patientImmunization.UpdatedBy;
                    newPatient.Visdate= patientImmunization.Visdate;
                  
                    _context.PatientImmunizations.Add(newPatient);
                    await _context.SaveChangesAsync();
                    return true;
                }
                else if (exist)
                {
                    var patient = _context.PatientImmunizations
                        .Where(x => x.Id.Equals(patientImmunization.Id)).FirstOrDefault();


                    if (patient != null)
                    {
                        patient.AppointmentId = patientImmunization.AppointmentId;
                        patient.LotNumber = patientImmunization.LotNumber;
                        patient.Status = patientImmunization.Status;
                        patient.StartDate = patientImmunization.StartDate;
                        patient.EndDate = patientImmunization.EndDate;
                        if (patientImmunization.ProviderId != null)
                        {
                            patient.ProviderId = patientImmunization.ProviderId;
                        }
                        //patient.OutsideClinic = patientImmunization.providerDescription;

                        patient.ProviderName = patientImmunization.ProviderName;
                        patient.Comments = patientImmunization.Comments;
                        patient.ManufacturerName = patientImmunization.ManufacturerName;
                        patient.ExpiryDate = patientImmunization.ExpiryDate;
                        patient.InjectionDate = patientImmunization.InjectionDate;
                        patient.NextInjectionDate = patientImmunization.NextInjectionDate;
                        patient.SiteInjection = patientImmunization.SiteInjection;
                        patient.RouteId = patientImmunization.RouteId;
                        patient.DrugName = patientImmunization.DrugName;
                        patient.DrugTypeId = patientImmunization.DrugTypeId;
                        patient.IsDeleted = false;
                        patient.Mrno = patientImmunization.Mrno;
                        patient.OldMrno = patientImmunization.OldMrno;
                        patient.Dose = patientImmunization.Dose;
                        patient.ErrorReason = patientImmunization.ErrorReason;
                        patient.ImmTypeId = patientImmunization.ImmTypeId;
                      //  patient.ImmTypeGuid = patientImmunization.ImmTypeGuid;
                        //patient.UpdatedDate = DateTime.Now;
                        patient.CreatedBy = patientImmunization.CreatedBy;
                        patient.UpdatedBy = patientImmunization.UpdatedBy;
                        patient.Visdate = patientImmunization.Visdate;
                         
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


            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<bool> DeletePatientImmunization(long Id)
        {
            try
            {
                var data =  _context.PatientImmunizations.Where(x => x.Id == Id).FirstOrDefault();
                if(data != null)
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
