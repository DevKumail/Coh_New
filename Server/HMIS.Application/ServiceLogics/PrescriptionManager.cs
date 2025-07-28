using Dapper;
using HMIS.Common.ORM;
using HMIS.Data.Models;
using HMIS.Service.DTOs.Clinical;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.SqlServer.Management.Sdk.Differencing.SPI;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.PerformanceData;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace HMIS.Service.ServiceLogics
{
    public class PrescriptionManager : IPrescription
    {
        public IConfiguration Configuration { get; }
        private readonly HIMSDBContext _context;


        public PrescriptionManager(HIMSDBContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }


        public async Task<DataSet> GetAllPrescriptions(string mrno)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", Convert.ToInt16(mrno));
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetPrescriptionsList", param);
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

            var prescription = _context?.Prescriptions?.FirstOrDefault(x=>x.MedicationId == id);
            if(prescription == null)
            {
                return false;
            }
            return true;
        }
        public async Task<bool> InsertOrUpdatePrescription(PrescriptionModel prescriptionModel)
        {

            bool exist = Exist(prescriptionModel.MedicationId);

            if (!exist)
            {
                var newPrescription = new Prescription
                {
                    MedicationId = prescriptionModel.MedicationId,
                    ProviderId = prescriptionModel.ProviderId ?? null,
                    Mrno = prescriptionModel.Mrno,
                    AppointmentId = prescriptionModel.AppointmentId,
                    DrugId = prescriptionModel.DrugId,
                    Rx = prescriptionModel.Rx,
                    Dose = prescriptionModel.Dose,
                    Route = prescriptionModel.Route,
                    Frequency = prescriptionModel.Frequency,
                    Duration = prescriptionModel.Duration,
                    Dispense = prescriptionModel.Dispense,
                    Quantity = prescriptionModel.Quantity,
                    IsRefill = prescriptionModel.IsRefill,
                    AdditionalRefills = prescriptionModel.AdditionalRefills,
                    PrescriptionDate = prescriptionModel.PrescriptionDate,
                    StartDate = prescriptionModel.StartDate,
                    StopDate = prescriptionModel.StopDate,
                    Samples = prescriptionModel.Samples,
                    Instructions = prescriptionModel.Instructions,
                    Indications = prescriptionModel.Indications,
                    Comments = prescriptionModel.Comments,
                    UpdateBy = prescriptionModel.UpdateBy,
                    UpdateDate = prescriptionModel.UpdateDate,
                    GcnSeqno = prescriptionModel.GcnSeqno,
                    IsActive = prescriptionModel.IsActive,
                    Status = prescriptionModel.Status,
                    StatusReason = prescriptionModel.StatusReason,
                    SendToLabId = prescriptionModel.SendToLabId,
                    Ndc = prescriptionModel.Ndc,
                    ReviewedDate = prescriptionModel.ReviewedDate,
                    ReviewedBy = prescriptionModel.ReviewedBy,
                    ParentMedicationId = prescriptionModel.ParentMedicationId,
                    OriginalRefillCount = prescriptionModel.OriginalRefillCount,
                    AlertOverrideReason = prescriptionModel.AlertOverrideReason,
                    OutSideClinicProviderName = prescriptionModel.OutSideClinicProviderName,
                    IsSigned = prescriptionModel.IsSigned,
                    OldMrno = prescriptionModel.OldMrno,
                    MedicationGivenById = prescriptionModel.MedicationGivenById,
                    GivenDate = prescriptionModel.GivenDate,
                    MedicationCheckedById = prescriptionModel.MedicationCheckedById,
                    CheckedDate = prescriptionModel.CheckedDate,
                    IsSubmitted = prescriptionModel.IsSubmitted,
                    SubmissionBatchId = prescriptionModel.SubmissionBatchId,
                    ErxId = prescriptionModel.ErxId,
                    DhpoRouteId = prescriptionModel.DhpoRouteId,
                    EncounterType = prescriptionModel.EncounterType,
                    IsInternal = prescriptionModel.IsInternal,
                    PharmacyEmailId = prescriptionModel.PharmacyEmailId,
                    PickupTypeId = prescriptionModel.PickupTypeId,
                    IsDeleted = false,
                   // OutsideClinic=prescriptionModel.providerDescription
                };

                 _context.Prescriptions.Add(newPrescription);
                await _context.SaveChangesAsync();
                return true;

        }
            else if(exist)
            {
                var prescription = _context.Prescriptions.Find(prescriptionModel.MedicationId);

                prescription.MedicationId = prescriptionModel.MedicationId;
                if (prescriptionModel.ProviderId != null)
                {
                    prescription.ProviderId = prescriptionModel.ProviderId;

                }
                prescription.Mrno = prescriptionModel.Mrno;
                //prescription.OutsideClinic = prescriptionModel.providerDescription;
                prescription.AppointmentId = prescriptionModel.AppointmentId;
                prescription.DrugId = prescriptionModel.DrugId;
                prescription.Rx = prescriptionModel.Rx;
                prescription.Dose = prescriptionModel.Dose;
                prescription.Route = prescriptionModel.Route;
                prescription.Frequency = prescriptionModel.Frequency;
                prescription.Duration = prescriptionModel.Duration;
                prescription.Dispense = prescriptionModel.Dispense;
                prescription.Quantity = prescriptionModel.Quantity;
                prescription.IsRefill = prescriptionModel.IsRefill;
                prescription.AdditionalRefills = prescriptionModel.AdditionalRefills;
                prescription.PrescriptionDate = prescriptionModel.PrescriptionDate;
                prescription.StartDate = prescriptionModel.StartDate;
                prescription.StopDate = prescriptionModel.StopDate;
                prescription.Samples = prescriptionModel.Samples;
                prescription.Instructions = prescriptionModel.Instructions;
                prescription.Indications = prescriptionModel.Indications;
                prescription.Comments = prescriptionModel.Comments;
                prescription.UpdateBy = prescriptionModel.UpdateBy;
                prescription.UpdateDate = prescriptionModel.UpdateDate;
                prescription.GcnSeqno = prescriptionModel.GcnSeqno;
                prescription.IsActive = prescriptionModel.IsActive;
                prescription.Status = prescriptionModel.Status;
                prescription.StatusReason = prescriptionModel.StatusReason;
                prescription.SendToLabId = prescriptionModel.SendToLabId;
                prescription.Ndc = prescriptionModel.Ndc;
                prescription.ReviewedDate = prescriptionModel.ReviewedDate;
                prescription.ReviewedBy = prescriptionModel.ReviewedBy;
                prescription.ParentMedicationId = prescriptionModel.ParentMedicationId;
                prescription.OriginalRefillCount = prescriptionModel.OriginalRefillCount;
                prescription.AlertOverrideReason = prescriptionModel.AlertOverrideReason;
                prescription.OutSideClinicProviderName = prescriptionModel.OutSideClinicProviderName;
                prescription.IsSigned = prescriptionModel.IsSigned;
                prescription.OldMrno = prescriptionModel.OldMrno;
                prescription.MedicationGivenById = prescriptionModel.MedicationGivenById;
                prescription.GivenDate = prescriptionModel.GivenDate;
                prescription.CheckedDate = prescriptionModel.CheckedDate;
                prescription.IsSubmitted = prescriptionModel.IsSubmitted;
                prescription.ErxId = prescriptionModel.ErxId;
                prescription.DhpoRouteId = prescriptionModel.DhpoRouteId;
                prescription.EncounterType = prescriptionModel.EncounterType;
                prescription.IsInternal = prescriptionModel.IsInternal;
                prescription.PharmacyEmailId = prescriptionModel.PharmacyEmailId;
                prescription.PickupTypeId = prescriptionModel.PickupTypeId;
                prescription.IsDeleted = false;
        
                await _context.SaveChangesAsync();
                return true;

            }

            return false;


        }

        public async Task<bool> DeletePrescription(long Id)
        {

            try
            {
                var data = _context.Prescriptions.Where(x => x.MedicationId == Id).FirstOrDefault();
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

        public async Task<DataSet> FilterPrescriptions(string keyword)
        {
            try
            {
             
                DynamicParameters parameter = new DynamicParameters();
                if(keyword== "undefined")
                {
                    keyword = null;
                }
                parameter.Add("@keyword", keyword);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SearchPrescriptionsByParams", parameter);
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


    }
}
