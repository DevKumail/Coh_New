using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.DTOs;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Dynamic.Core;

namespace HMIS.Application.ServiceLogics
{
    public class SummarySheetManager : ISummarySheetManager
    {
        private readonly HmisContext _context;

        public SummarySheetManager(HmisContext context)
        {
            this._context = context;
        }

        #region Vital Signs
        public async Task<bool> VitalSignsInsert(VitalSign vs)
        {
            try
            {
                Core.Entities.VitalSign vital = new Core.Entities.VitalSign()
                {
                    EntryDate = vs.EntryDate,
                    Bpdiastolic = vs.Bpdiastolic,
                    Pain = vs.Pain,
                    PulseRate = vs.PulseRate,
                    RespirationRate = vs.RespirationRate,
                    Temperature = vs.Temperature,
                    Height = vs.Height,
                    Weight = vs.Weight,
                    UpdateBy = vs.UpdateBy,
                    UpdateDate = vs.UpdateDate,
                    //VisitAccountNo = vs.VisitAccountNo,
                    Mrno = vs.Mrno,
                    Bpsystolic = vs.Bpsystolic,

                };
                await _context.VitalSigns.AddAsync(vital);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<DataSet> GetAllVitalSigns(long MRNo, long VisitAccountNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo);
                param.Add("@VisitAccountNo", VisitAccountNo);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetAllVitalSign", param);
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
        public async Task<DataSet>  GetVitalSigns(long Id, long AppointmentId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ID", Id);
                param.Add("@AppointmentId", AppointmentId);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetVitalSign", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }

        public async Task<bool> VSInsert(VitalSigns vitalSigns)
        {
            try
            {
                Core.Entities.VitalSign vital = new Core.Entities.VitalSign();

                vital.AppointmentId = vitalSigns.AppointmentId;
                vital.EntryDate = vitalSigns.EntryDate;
                vital.Bpsystolic = vitalSigns.BPSystolic;
                vital.Bpdiastolic = vitalSigns.BPDiastolic;
                vital.PulseRate = vitalSigns.PulseRate;
                vital.RespirationRate = vitalSigns.RespirationRate;
                vital.Temperature = vitalSigns.Temperature;
                vital.Pain = 0;
                vital.Weight = vitalSigns.Weight;
                vital.Height = vitalSigns.Height;
                vital.UpdateBy = vitalSigns.UpdateBy;
                vital.UpdateDate = vitalSigns.UpdateDate;
                vital.Mrno = vitalSigns.MRNo;
                vital.Comment = vitalSigns.Comment;
                vital.AgeInMonths = vitalSigns.AgeInMonths;
                vital.HeadCircumference = 0.0;
                vital.Glucose = vitalSigns.Glucose;
                vital.Hr = vitalSigns.HeartRate;
                vital.Spo2 = vitalSigns.SPO2;
                vital.Bmi = vitalSigns.BMI;
                vital.Ppain = null;
                vital.PpainLocation = null;
                vital.Pquality = null;
                vital.PpainEffect = null;
                vital.PpainBetter = null;
                vital.PpainWorse = null;
                vital.PpainMild = null;
                vital.PpainSevere = null;
                vital.PsleepDisturbance = null;
                vital.PadldifficultyPain = null;
                vital.OswestryScore = null;
                vital.Vaspback = null;
                vital.VasprightLeg = null;
                vital.VaspleftLeg = null;
                vital.Vaspneck = null;
                vital.VasprightArm = null;
                vital.VaspleftArm = null;
                vital.OldMrno = null;
                vital.Vaspdone = null;
                vital.AbdCircumference = null;
                vital.HipCircumference = null;
                vital.UmbilicusCircumference = null;
                vital.Bparm = vitalSigns.BPArm;
                
                await _context.VitalSigns.AddAsync(vital);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<bool> VSUpdate(VitalSigns vitalSigns)
        {
            try
            {
                var vsData = _context.VitalSigns.Where(x => x.Id == vitalSigns.ID && x.AppointmentId == vitalSigns.AppointmentId && x.Mrno == vitalSigns.MRNo).FirstOrDefault();
                if (vsData != null)
                {
                    vsData.AppointmentId = vitalSigns.AppointmentId;
                    vsData.EntryDate = vitalSigns.EntryDate;
                    vsData.Bpsystolic = vitalSigns.BPSystolic;
                    vsData.Bpdiastolic = vitalSigns.BPDiastolic;
                    vsData.PulseRate = vitalSigns.PulseRate;
                    vsData.RespirationRate = vitalSigns.RespirationRate;
                    vsData.Temperature = vitalSigns.Temperature;
                    vsData.Pain = 0;
                    vsData.Weight = vitalSigns.Weight;
                    vsData.Height = vitalSigns.Height;
                    vsData.UpdateBy = vitalSigns.UpdateBy;
                    vsData.UpdateDate = vitalSigns.UpdateDate;
                    vsData.Mrno = vitalSigns.MRNo;
                    vsData.Comment = vitalSigns.Comment;
                    vsData.AgeInMonths = vitalSigns.AgeInMonths;
                    vsData.HeadCircumference = 0.0;
                    vsData.Glucose = vitalSigns.Glucose;
                    vsData.Hr = vitalSigns.HeartRate;
                    vsData.Spo2 = vitalSigns.SPO2;
                    vsData.Bmi = vitalSigns.BMI;
                    vsData.Ppain = null;
                    vsData.PpainLocation = null;
                    vsData.Pquality = null;
                    vsData.PpainEffect = null;
                    vsData.PpainBetter = null;
                    vsData.PpainWorse = null;
                    vsData.PpainMild = null;
                    vsData.PpainSevere = null;
                    vsData.PsleepDisturbance = null;
                    vsData.PadldifficultyPain = null;
                    vsData.OswestryScore = null;
                    vsData.Vaspback = null;
                    vsData.VasprightLeg = null;
                    vsData.VaspleftLeg = null;
                    vsData.Vaspneck = null;
                    vsData.VasprightArm = null;
                    vsData.VaspleftArm = null;
                    vsData.OldMrno = null;
                    vsData.Vaspdone = null;
                    vsData.AbdCircumference = null;
                    vsData.HipCircumference = null;
                    vsData.UmbilicusCircumference = null;
                    vsData.Bparm = vitalSigns.BPArm;
                }
                _context.VitalSigns.Update(vsData);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        public async Task<DataSet> SS_GetMedicationsList(long MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
              
                param.Add("@MRNo", MRNo);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SS_GetMedication", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }


        public async Task<DataSet> SS_GetPatientAllergies(long MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SS_GetPatientAllergies", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }

        public async Task<DataSet> SS_GetMedicalHistory(long MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SS_GetMedicalHistory", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }
        public async Task<DataSet> SS_GetPatientProblem(long MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SS_GetPatientProblems", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }


        public async Task<DataSet> SS_GetPatientProcedure(long MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SS_GetPatientProcedures", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }
        public async Task<DataSet> SS_GetPatientImmunization(long MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SS_GetPatientImmunization", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }


        #endregion

    }
}
