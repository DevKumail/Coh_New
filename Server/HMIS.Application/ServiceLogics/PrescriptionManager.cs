using Dapper;
using DocumentFormat.OpenXml.Wordprocessing;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
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

namespace HMIS.Application.ServiceLogics
{
    public class PrescriptionManager : IPrescription
    {
        public IConfiguration Configuration { get; }
        private readonly HMISDbContext _context;


        public PrescriptionManager(HMISDbContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }


        public async Task<DataSet> GetAllCurrentPrescriptions(string mrno, int? PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", Convert.ToInt16(mrno));
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetCurrentPrescriptionsList", param);
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

        public async Task<DataSet> GetAllPastPrescriptions(string mrno, int? PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", Convert.ToInt16(mrno));
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetPastPrescriptionsList", param);
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

            var prescription = _context?.Medications?.FirstOrDefault(x=>x.MedicationId == id);
            if(prescription == null)
            {
                return false;
            }
            return true;
        }
        public async Task<bool> InsertOrUpdatePrescription(PrescriptionModel prescriptionModel)
        {
            try
            {
                bool exist = Exist(prescriptionModel.PrescriptionId);

                if (!exist)
                {
                    var newPrescription = new Medications
                    {
                        MedicationId = prescriptionModel.PrescriptionId,
                        ProviderId = prescriptionModel.ProviderId == 0 ? null : prescriptionModel.ProviderId,
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
                        CreatedBy = prescriptionModel.CreatedBy,
                        CreateDate = prescriptionModel.CreateDate,
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
                        IsDeleted = false
                    };

                    _context.Medications.Add(newPrescription);
                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    var prescription = _context.Medications.Find(prescriptionModel.PrescriptionId);

                    if (prescription == null)
                        throw new Exception("Prescription not found for update.");

                    prescription.MedicationId = prescriptionModel.PrescriptionId;
                    prescription.ProviderId = prescriptionModel.ProviderId == 0 ? null : prescriptionModel.ProviderId;
                    prescription.Mrno = prescriptionModel.Mrno;
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
            }
            catch (Exception ex)
            {
                // Log the exception (you can replace this with your logging framework)
                Console.WriteLine($"Error in InsertOrUpdatePrescription: {ex.Message}");
                // Optionally, log stack trace for debugging
                Console.WriteLine(ex.StackTrace);

                return false;
            }
        }


        public async Task<bool> DeletePrescription(long Id)
        {

            try
            {
                var data = _context.Medications.Where(x => x.MedicationId == Id).FirstOrDefault();
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

        public async Task<DataSet> FilterPrescriptions(string? keyword, int? PageNumber, int? PageSize)
        {
            try
            {
             
                DynamicParameters parameter = new DynamicParameters();
                if(keyword== "undefined")
                {
                    keyword = null;
                }
                parameter.Add("@keyword", keyword);
                parameter.Add("@PageNumber", PageNumber);
                parameter.Add("@PageSize", PageSize);

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
