using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IIVFLabOrderService
    {
        Task<LabOrderSetReadDTO?> GetOrderSetAsync(long orderSetId);
        Task<IEnumerable<LabOrderSetHeaderDTO>> GetOrderSetsByMrnoAsync(long mrno);
        Task<IEnumerable<IVFOrderGridRowDTO>> GetOrderGridByMrnoAsync(long mrno);
        Task<long> CreateOrderSetAsync(CreateUpdateLabOrderSetDTO payload);
        Task<bool> UpdateOrderSetAsync(long orderSetId, CreateUpdateLabOrderSetDTO payload);
        Task<bool> DeleteOrderSetAsync(long orderSetId, bool hardDelete = false);
        Task<IEnumerable<OptionDTO>> GetRefPhysiciansAsync(int? employeeTypeId);
        Task<IEnumerable<OptionDTO>> GetNotifyRolesAsync();
        Task<IEnumerable<OptionDTO>> GetReceiversByEmployeeTypeAsync(int? employeeTypeId);
        Task<bool> CollectSampleAsync(long OrderSetId, CollectSampleDTO payload);
        Task<int> CompleteOrderAsync(long orderSetDetailId, CompleteLabOrderDTO payload);
        Task<IEnumerable<OrderCollectionDetailsDTO>> GetOrderCollectionDetailsAsync(long orderSetId);
    }

    public class IVFLabOrderService : IIVFLabOrderService
    {
        private readonly HMISDbContext _db;
        public IVFLabOrderService(HMISDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<OrderCollectionDetailsDTO>> GetOrderCollectionDetailsAsync(long orderSetId)
        {
            var q = from d in _db.LabOrderSetDetail
                    where d.OrderSetId == orderSetId && !(d.IsDeleted ?? false)
                    join t in _db.LabTests on d.LabTestId equals t.LabTestId into tleft
                    from t in tleft.DefaultIfEmpty()
                    join st in _db.LabSampleTypes on t.SampleTypeId equals st.SampleTypeId into sleft
                    from st in sleft.DefaultIfEmpty()
                    select new OrderCollectionDetailsDTO
                    {
                        TestName = t != null ? t.LabName : string.Empty,
                        Material = st != null ? st.SampleName : string.Empty,
                        Status = (
                            from h in _db.LabOrderSet
                            where h.LabOrderSetId == d.OrderSetId
                            select (h.IsSigned ?? false) ? "✔" : (h.OrderStatus ?? "—")
                        ).FirstOrDefault()
                    };

            return await q.ToListAsync();
        }

        public async Task<bool> CollectSampleAsync(long OrderSetId, CollectSampleDTO payload)
        {
            try
            {
                var detail = await _db.LabOrderSetDetail.FirstOrDefaultAsync(d => d.OrderSetId == OrderSetId);
                if (detail == null) return false;

                detail.CollectDate = payload.CollectDate;
                // Update header status to SAMPLE_COLLECTED via enum mapping
                var header = await _db.LabOrderSet.FirstOrDefaultAsync(h => h.LabOrderSetId == detail.OrderSetId);
                if (header != null)
                {
                    var resolved = ResolveStatus(LabOrderStatus.SampleCollected, header.OrderStatus, header.IsSigned);
                    header.OrderStatus = resolved.status;
                    header.IsSigned = resolved.isSigned;
                    // Reflect collected date/time on header for display compatibility
                    header.OrderDate = FormatDate(payload.CollectDate);
                    header.UpdatedBy = payload.UserId.ToString();
                    header.UpdatedDate = FormatDate(DateTime.UtcNow);
                }
                await _db.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> CompleteOrderAsync(long orderSetDetailId, CompleteLabOrderDTO payload)
        {
            // Load detail + header + test
            var detail = await _db.LabOrderSetDetail.FirstOrDefaultAsync(d => d.OrderSetId == orderSetDetailId);
            if (detail == null) return 0;
            var header = await _db.LabOrderSet.FirstOrDefaultAsync(h => h.LabOrderSetId == detail.OrderSetId);
            if (header == null) return 0;

            var test = await _db.LabTests.FirstOrDefaultAsync(t => t.LabTestId == detail.LabTestId);

            // Create main result record
            var main = new LabResultsMain
            {
                OrderSetDetailId = detail.OrderSetDetailId,
                Mrno = (header.Mrno ?? 0).ToString(),
                ProviderId = header.ProviderId,
                TestName = test?.LabName ?? string.Empty,
                TestNameAbbreviation = test?.LabAbreviation ?? (test?.LabName ?? string.Empty),
                Cptcode = detail.Cptcode,
                PerformDate = FormatY14(payload.PerformDate),
                EntryDate = FormatY14(payload.EntryDate),
                CreatedBy = payload.UserId.ToString(),
                CreatedDate = FormatY14(DateTime.UtcNow),
                UpdatedBy = payload.UserId.ToString(),
                UpdatedDate = FormatY14(DateTime.UtcNow),
                ReviewedBy = payload.ReviewedBy,
                ReviewedDate = payload.ReviewedDate,
                AccessionNumber = payload.AccessionNumber,
                IsDefault = payload.IsDefault,
                PrincipalResultInterpreter = payload.PrincipalResultInterpreter,
                Action = payload.Action,
                OldMrno = header.OldMrno,
                SequenceNo = null,
                PerformAtLabId = payload.PerformAtLabId
            };
            _db.Add(main);
            await _db.SaveChangesAsync();

            var labResultId = main.LabResultId;

            // Insert observations using raw SQL because entity is keyless
            if (payload.Observations != null && payload.Observations.Count > 0)
            {
                foreach (var obs in payload.Observations)
                {
                    await _db.Database.ExecuteSqlRawAsync(
                        "INSERT INTO LabResultsObservation (ValueType, ObservationIdentifierFullName, ObservationIdentifierShortName, ObservationValue, Units, ReferenceRangeMin, ReferenceRangeMax, AbnormalFlag, ResultStatus, ObservationDateTime, AnalysisDateTime, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, Remarks, WeqayaScreening, SequenceNo, LabResultId) VALUES ({0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18})",
                        obs.ValueType,
                        obs.ObservationIdentifierFullName,
                        obs.ObservationIdentifierShortName,
                        obs.ObservationValue,
                        obs.Units,
                        obs.ReferenceRangeMin,
                        obs.ReferenceRangeMax,
                        obs.AbnormalFlag,
                        obs.ResultStatus,
                        obs.ObservationDateTime.HasValue ? obs.ObservationDateTime.Value.ToString("yyyyMMddHHmmss") : null,
                        obs.AnalysisDateTime.HasValue ? obs.AnalysisDateTime.Value.ToString("yyyyMMddHHmmss") : null,
                        payload.UserId.ToString(),
                        DateTime.UtcNow.ToString("yyyyMMddHHmmss"),
                        payload.UserId.ToString(),
                        DateTime.UtcNow.ToString("yyyyMMddHHmmss"),
                        obs.Remarks,
                        obs.WeqayaScreening,
                        obs.SequenceNo,
                        labResultId
                    );
                }
            }

            // Update detail and header statuses (Completed via enum mapping)
            detail.PerformDate = payload.PerformDate;
            if (header != null)
            {
                var resolved = ResolveStatus(LabOrderStatus.Completed, header.OrderStatus, header.IsSigned);
                header.OrderStatus = resolved.status;
                header.IsSigned = resolved.isSigned;
                header.UpdatedBy = payload.UserId.ToString();
                header.UpdatedDate = FormatDate(DateTime.UtcNow);
            }
            await _db.SaveChangesAsync();
            return labResultId;
        }
        public async Task<IEnumerable<OptionDTO>> GetRefPhysiciansAsync(int? employeeTypeId)
        {
            // Filter by EmployeeTypeId when provided (e.g., 1=Doctor, 7=Nurse), otherwise return all active/non-deleted
            var q = from e in _db.Hremployee
                    where e.Active && (e.IsDeleted ?? false) == false && (!employeeTypeId.HasValue || e.EmployeeType == employeeTypeId)
                    orderby e.FullName
                    select new OptionDTO { Id = (int)e.EmployeeId, Name = e.FullName };
            return await q.ToListAsync();
        }

        public Task<IEnumerable<OptionDTO>> GetNotifyRolesAsync()
        {
            // Restrict to Doctor(Provider=1) and Nurse(TypeID=7)
            IEnumerable<OptionDTO> roles = new List<OptionDTO>
            {
                new OptionDTO { Id = 1, Name = "Doctor" },
                new OptionDTO { Id = 7, Name = "Nurse" }
            };
            return Task.FromResult(roles);
        }

        public async Task<IEnumerable<OptionDTO>> GetReceiversByEmployeeTypeAsync(int? employeeTypeId)
        {
            var q = from e in _db.Hremployee
                    where (!employeeTypeId.HasValue || e.EmployeeType == employeeTypeId) && e.Active && (e.IsDeleted ?? false) == false
                    orderby e.FullName
                    select new OptionDTO { Id = (int)e.EmployeeId, Name = e.FullName };
            return await q.ToListAsync();
        }

        public async Task<LabOrderSetReadDTO?> GetOrderSetAsync(long orderSetId)
        {
            var hdrEntity = await _db.LabOrderSet.FirstOrDefaultAsync(x => x.LabOrderSetId == orderSetId);
            if (hdrEntity == null) return null;

            var header = new LabOrderSetHeaderDTO
            {
                OrderSetId = orderSetId,
                MRNo = hdrEntity.Mrno ?? 0,
                ProviderId = hdrEntity.ProviderId ?? 0,
                OrderDate = ParseDate(hdrEntity.OrderDate),
                VisitAccountNo = TryParseLong(hdrEntity.VisitAccountNo),
                // CreatedBy/UpdatedBy are strings in entity; keep defaults if not numeric
                CreatedBy = TryParseLong(hdrEntity.CreatedBy),
                CreatedDate = ParseDate(hdrEntity.CreatedDate),
                UpdatedBy = TryParseLong(hdrEntity.UpdatedBy),
                UpdatedDate = ParseDate(hdrEntity.UpdatedDate),
                OrderControlCode = hdrEntity.OrderControlCode,
                OrderStatus = hdrEntity.OrderStatus,
                OrderStatusEnum = ParseStatus(hdrEntity.OrderStatus, hdrEntity.IsSigned),
                IsHL7MsgCreated = hdrEntity.IsHl7msgCreated,
                IsHL7MessageGeneratedForPhilips = hdrEntity.IsHl7messageGeneratedForPhilips,
                IsSigned = hdrEntity.IsSigned,
                oldMRNo = hdrEntity.OldMrno,
                HL7MessageId = hdrEntity.Hl7messageId,
                OrderNumber = hdrEntity.OrderNumber
            };

            var details = await _db.LabOrderSetDetail
                .Where(d => d.OrderSetId == orderSetId && (d.IsDeleted ?? false) == false)
                .Select(d => new LabOrderSetDetailDTO
                {
                    OrderSetDetailId = d.OrderSetDetailId,
                    OrderSetId = d.OrderSetId,
                    LabTestId = d.LabTestId,
                    CPTCode = d.Cptcode,
                    PComments = d.Pcomments,
                    OrderQuantity = d.OrderQuantity,
                    SendToLabId = d.SendToLabId,
                    IsRadiologyTest = d.IsRadiologyTest,
                    IsInternalTest = d.IsInternalTest,
                    RadiologySide = d.RadiologySide,
                    ProfileLabTestID = d.ProfileLabTestId,
                    VisitOrderNo = d.VisitOrderNo,
                    ResultExpectedDate = d.ResultExpectedDate,
                    ReferralName = d.ReferralName,
                    ReferralId = d.ReferralId,
                    SignedDate = d.SignedDate,
                    ReferralTo = d.ReferralTo,
                    CancelComments = d.CancelComments,
                    InvestigationTypeId = d.InvestigationTypeId,
                    OldOrderDetailId = d.OldOrderDetailId,
                    RescheduledTo = d.RescheduledTo,
                    BillOnOrder = d.BillOnOrder,
                    IsDeleted = d.IsDeleted,
                    CollectDate = null,
                    Status = null,
                    PerformDate = null
                })
                .ToListAsync();

            return new LabOrderSetReadDTO { Header = header, Details = details };
        }

        public async Task<IEnumerable<LabOrderSetHeaderDTO>> GetOrderSetsByMrnoAsync(long mrno)
        {
            var list = await (
                from h in _db.LabOrderSet
                where h.Mrno == mrno
                select new LabOrderSetHeaderDTO
                {
                    OrderSetId = h.LabOrderSetId,
                    MRNo = h.Mrno ?? 0,
                    ProviderId = h.ProviderId ?? 0,
                    OrderDate = ParseDate(h.OrderDate),
                    VisitAccountNo = TryParseLong(h.VisitAccountNo),
                    CreatedBy = TryParseLong(h.CreatedBy),
                    CreatedDate = ParseDate(h.CreatedDate),
                    UpdatedBy = TryParseLong(h.UpdatedBy),
                    UpdatedDate = ParseDate(h.UpdatedDate),
                    OrderControlCode = h.OrderControlCode,
                    OrderStatus = h.OrderStatus,
                    OrderStatusEnum = ParseStatus(h.OrderStatus, h.IsSigned),
                    IsHL7MsgCreated = h.IsHl7msgCreated,
                    IsHL7MessageGeneratedForPhilips = h.IsHl7messageGeneratedForPhilips,
                    IsSigned = h.IsSigned,
                    oldMRNo = h.OldMrno,
                    HL7MessageId = h.Hl7messageId,
                    OrderNumber = h.OrderNumber,
                    SampleTypeId = (
                        from d in _db.LabOrderSetDetail
                        join t in _db.LabTests on d.LabTestId equals t.LabTestId into tleft
                        from t in tleft.DefaultIfEmpty()
                        where d.OrderSetId == h.LabOrderSetId && !(d.IsDeleted ?? false)
                        select t.SampleTypeId
                    ).FirstOrDefault(),
                    SampleTypeName = (
                        from d in _db.LabOrderSetDetail
                        join t in _db.LabTests on d.LabTestId equals t.LabTestId into tleft
                        from t in tleft.DefaultIfEmpty()
                        join st in _db.LabSampleTypes on t.SampleTypeId equals st.SampleTypeId into sleft
                        from st in sleft.DefaultIfEmpty()
                        where d.OrderSetId == h.LabOrderSetId && !(d.IsDeleted ?? false)
                        select st.SampleName
                    ).FirstOrDefault()
                }
            ).ToListAsync();
            return list;
        }

        public async Task<IEnumerable<IVFOrderGridRowDTO>> GetOrderGridByMrnoAsync(long mrno)
        {
            // Join header + active details + lab test meta for display columns
            var query = from h in _db.LabOrderSet
                        where h.Mrno == mrno
                        join d in _db.LabOrderSetDetail on h.LabOrderSetId equals d.OrderSetId
                        join t in _db.LabTests on d.LabTestId equals t.LabTestId into tleft
                        from t in tleft.DefaultIfEmpty()
                        join st in _db.LabSampleTypes on t.SampleTypeId equals st.SampleTypeId into sleft
                        from st in sleft.DefaultIfEmpty()
                        join emp in _db.Hremployee on (long?)h.ProviderId equals (long?)emp.EmployeeId into eleft
                        from emp in eleft.DefaultIfEmpty()
                        where !(d.IsDeleted ?? false)
                        select new
                        {
                            h.LabOrderSetId,
                            h.OrderNumber,
                            h.OrderDate,
                            Clinician = emp != null ? emp.FullName : string.Empty,
                            d.OrderSetDetailId,
                            d.VisitOrderNo,
                            d.CollectDate,
                            d.IsInternalTest,
                            d.Pcomments,
                            TestName = t != null ? t.LabName : null,
                            SampleName = st != null ? st.SampleName : null,
                            IsSigned = (h.IsSigned ?? false),
                            OrderStatus = h.OrderStatus
                        };

            var rows = await query.ToListAsync();
            return rows.Select(x => new IVFOrderGridRowDTO
            {
                OrderSetId = x.LabOrderSetId,
                OrderSetDetailId = x.OrderSetDetailId,
                OrderNumber = (x.VisitOrderNo.HasValue
                    ? x.VisitOrderNo.Value.ToString().PadLeft(10, '0')
                    : x.OrderSetDetailId.ToString().PadLeft(10, '0')),
                SampleDepDate = x.CollectDate.HasValue ? x.CollectDate.Value.ToString("dd.MM.yyyy") : string.Empty,
                Time = x.CollectDate.HasValue ? x.CollectDate.Value.ToString("HH:mm") : string.Empty,
                Clinician = x.Clinician,
                Name = x.TestName,
                Material = x.SampleName,
                Laboratory = "Internal",
                Status = x.IsSigned ? "✔" : (x.OrderStatus ?? "—"),
                Comment = x.Pcomments
            }).ToList();
        }

        public async Task<long> CreateOrderSetAsync(CreateUpdateLabOrderSetDTO payload)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var h = payload.Header;
                var resolvedCreate = ResolveStatus(h.OrderStatusEnum, h.OrderStatus, h.IsSigned);
                var details = payload.Details ?? new List<LabOrderSetDetailDTO>();

                // Generate order number ONCE per order set
                long? orderNumber = h.OrderNumber;
                if (!orderNumber.HasValue || orderNumber.Value == 0)
                {
                    orderNumber = await GetNextOrderNumberAsync();
                }

                // Always create a single header
                var hdr = new LabOrderSet
                {
                    Mrno = h.MRNo,
                    ProviderId = h.ProviderId,
                    OrderDate = FormatDate(h.OrderDate),
                    VisitAccountNo = h.VisitAccountNo?.ToString(),
                    CreatedBy = h.CreatedBy.ToString(),
                    CreatedDate = FormatDate(h.CreatedDate),
                    UpdatedBy = h.UpdatedBy?.ToString(),
                    UpdatedDate = h.UpdatedDate.HasValue ? FormatDate(h.UpdatedDate.Value) : null,
                    OrderControlCode = h.OrderControlCode,
                    OrderStatus = resolvedCreate.status,
                    IsHl7msgCreated = h.IsHL7MsgCreated,
                    IsHl7messageGeneratedForPhilips = h.IsHL7MessageGeneratedForPhilips,
                    IsSigned = resolvedCreate.isSigned,
                    OldMrno = h.oldMRNo,
                    Hl7messageId = (int?)h.HL7MessageId,
                    OrderNumber = orderNumber
                };

                _db.LabOrderSet.Add(hdr);
                await _db.SaveChangesAsync();

                var orderSetId = (long)hdr.LabOrderSetId;

                // Add all tests under the same header
                foreach (var d in details)
                {
                    long? visitOrderNo = d.VisitOrderNo;
                    if (!visitOrderNo.HasValue || visitOrderNo.Value == 0)
                    {
                        visitOrderNo = await GetNextVisitOrderNoAsync();
                    }

                    var ent = new LabOrderSetDetail
                    {
                        OrderSetId = orderSetId,
                        LabTestId = d.LabTestId,
                        Cptcode = d.CPTCode,
                        Pcomments = d.PComments,
                        OrderQuantity = d.OrderQuantity,
                        SendToLabId = d.SendToLabId,
                        IsRadiologyTest = d.IsRadiologyTest,
                        IsInternalTest = d.IsInternalTest,
                        RadiologySide = d.RadiologySide,
                        ProfileLabTestId = d.ProfileLabTestID,
                        VisitOrderNo = visitOrderNo,
                        ResultExpectedDate = d.ResultExpectedDate,
                        ReferralName = d.ReferralName,
                        ReferralId = d.ReferralId,
                        SignedDate = d.SignedDate,
                        ReferralTo = d.ReferralTo,
                        CancelComments = d.CancelComments,
                        InvestigationTypeId = d.InvestigationTypeId,
                        OldOrderDetailId = d.OldOrderDetailId,
                        RescheduledTo = d.RescheduledTo,
                        BillOnOrder = d.BillOnOrder,
                        IsDeleted = d.IsDeleted ?? false
                    };

                    _db.LabOrderSetDetail.Add(ent);
                }

                if (details.Count > 0)
                {
                    await _db.SaveChangesAsync();
                }

                await tx.CommitAsync();
                return orderSetId;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateOrderSetAsync(long orderSetId, CreateUpdateLabOrderSetDTO payload)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var hdr = await _db.LabOrderSet.FirstOrDefaultAsync(x => x.LabOrderSetId == orderSetId);
                if (hdr == null) return false;

                var h = payload.Header;
                var resolvedUpdate = ResolveStatus(h.OrderStatusEnum, h.OrderStatus, h.IsSigned);
                hdr.Mrno = h.MRNo;
                hdr.ProviderId = h.ProviderId;
                hdr.OrderDate = FormatDate(h.OrderDate);
                hdr.VisitAccountNo = h.VisitAccountNo?.ToString();
                hdr.CreatedBy = h.CreatedBy.ToString();
                hdr.CreatedDate = FormatDate(h.CreatedDate);
                hdr.UpdatedBy = h.UpdatedBy?.ToString();
                hdr.UpdatedDate = h.UpdatedDate.HasValue ? FormatDate(h.UpdatedDate.Value) : null;
                hdr.OrderControlCode = h.OrderControlCode;
                hdr.OrderStatus = resolvedUpdate.status;
                hdr.IsHl7msgCreated = h.IsHL7MsgCreated;
                hdr.IsHl7messageGeneratedForPhilips = h.IsHL7MessageGeneratedForPhilips;
                hdr.IsSigned = resolvedUpdate.isSigned;
                hdr.OldMrno = h.oldMRNo;
                hdr.Hl7messageId = (int?)h.HL7MessageId;
                if (h.OrderNumber.HasValue && h.OrderNumber.Value != 0)
                {
                    hdr.OrderNumber = h.OrderNumber;
                }

                // Enforce single-detail per order: update or create one detail
                var incomingDetails = payload.Details ?? new List<LabOrderSetDetailDTO>();
                if (incomingDetails.Count > 1)
                {
                    await tx.RollbackAsync();
                    return false;
                }

                var existingDetail = await _db.LabOrderSetDetail.FirstOrDefaultAsync(d => d.OrderSetId == orderSetId);
                if (incomingDetails.Count == 1)
                {
                    var d = incomingDetails[0];
                    long? visitOrderNo = d.VisitOrderNo;
                    if (!visitOrderNo.HasValue || visitOrderNo.Value == 0)
                    {
                        visitOrderNo = await GetNextVisitOrderNoAsync();
                    }

                    if (existingDetail == null)
                    {
                        var ent = new LabOrderSetDetail
                        {
                            OrderSetId = orderSetId,
                            LabTestId = d.LabTestId,
                            Cptcode = d.CPTCode,
                            Pcomments = d.PComments,
                            OrderQuantity = d.OrderQuantity,
                            SendToLabId = d.SendToLabId,
                            IsRadiologyTest = d.IsRadiologyTest,
                            IsInternalTest = d.IsInternalTest,
                            RadiologySide = d.RadiologySide,
                            ProfileLabTestId = d.ProfileLabTestID,
                            VisitOrderNo = visitOrderNo,
                            ResultExpectedDate = d.ResultExpectedDate,
                            ReferralName = d.ReferralName,
                            ReferralId = d.ReferralId,
                            SignedDate = d.SignedDate,
                            ReferralTo = d.ReferralTo,
                            CancelComments = d.CancelComments,
                            InvestigationTypeId = d.InvestigationTypeId,
                            OldOrderDetailId = d.OldOrderDetailId,
                            RescheduledTo = d.RescheduledTo,
                            BillOnOrder = d.BillOnOrder,
                            IsDeleted = d.IsDeleted ?? false
                        };
                        _db.LabOrderSetDetail.Add(ent);
                    }
                    else
                    {
                        existingDetail.LabTestId = d.LabTestId;
                        existingDetail.Cptcode = d.CPTCode;
                        existingDetail.Pcomments = d.PComments;
                        existingDetail.OrderQuantity = d.OrderQuantity;
                        existingDetail.SendToLabId = d.SendToLabId;
                        existingDetail.IsRadiologyTest = d.IsRadiologyTest;
                        existingDetail.IsInternalTest = d.IsInternalTest;
                        existingDetail.RadiologySide = d.RadiologySide;
                        existingDetail.ProfileLabTestId = d.ProfileLabTestID;
                        existingDetail.VisitOrderNo = visitOrderNo;
                        existingDetail.ResultExpectedDate = d.ResultExpectedDate;
                        existingDetail.ReferralName = d.ReferralName;
                        existingDetail.ReferralId = d.ReferralId;
                        existingDetail.SignedDate = d.SignedDate;
                        existingDetail.ReferralTo = d.ReferralTo;
                        existingDetail.CancelComments = d.CancelComments;
                        existingDetail.InvestigationTypeId = d.InvestigationTypeId;
                        existingDetail.OldOrderDetailId = d.OldOrderDetailId;
                        existingDetail.RescheduledTo = d.RescheduledTo;
                        existingDetail.BillOnOrder = d.BillOnOrder;
                        existingDetail.IsDeleted = d.IsDeleted ?? false;
                    }
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();
                return true;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteOrderSetAsync(long orderSetId, bool hardDelete = false)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var hdr = await _db.LabOrderSet.FirstOrDefaultAsync(x => x.LabOrderSetId == orderSetId);
                if (hdr == null) return false;

                var details = await _db.LabOrderSetDetail.Where(d => d.OrderSetId == orderSetId).ToListAsync();
                if (hardDelete)
                {
                    _db.LabOrderSetDetail.RemoveRange(details);
                    _db.LabOrderSet.Remove(hdr);
                }
                else
                {
                    foreach (var d in details) d.IsDeleted = true;
                    hdr.OrderStatus = "DELETED";
                    hdr.IsSigned = false;
                }
                await _db.SaveChangesAsync();
                await tx.CommitAsync();
                return true;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
        private static DateTime ParseDate(string? s)
        {
            if (DateTime.TryParse(s, out var dt)) return dt;
            return DateTime.MinValue;
        }

        private static long TryParseLong(string? s)
        {
            if (long.TryParse(s, out var n)) return n;
            return 0;
        }

        private static string FormatDate(DateTime dt) => dt.ToString("s");

        private static string SafeDate(string? s, string format)
        {
            if (DateTime.TryParse(s, out var dt)) return dt.ToString(format);
            return string.Empty;
        }

        private static string FormatY14(DateTime dt) => dt.ToString("yyyyMMddHHmmss");

        private static (string? status, bool? isSigned) ResolveStatus(LabOrderStatus? statusEnum, string? fallbackStatus, bool? fallbackIsSigned)
        {
            if (!statusEnum.HasValue)
            {
                return (fallbackStatus, fallbackIsSigned);
            }

            switch (statusEnum.Value)
            {
                case LabOrderStatus.New:
                    return ("NEW", false);
                case LabOrderStatus.InProgress:
                    return ("INPROG", false);
                case LabOrderStatus.SampleCollected:
                    return ("COLLECT", false);
                case LabOrderStatus.Completed:
                    return ("DONE", true);
                case LabOrderStatus.Cancel:
                    return ("CANCEL", false);
                default:
                    return (fallbackStatus, fallbackIsSigned);
            }
        }

        private async Task<long> GetNextOrderNumberAsync()
        {
            var max = await _db.LabOrderSet
                .Select(x => (long?)(x.OrderNumber ?? 0))
                .MaxAsync();
            return (max ?? 0) + 1;
        }

        private async Task<long> GetNextVisitOrderNoAsync()
        {
            var max = await _db.LabOrderSetDetail
                .Select(x => (long?)(x.VisitOrderNo ?? 0))
                .MaxAsync();
            return (max ?? 0) + 1;
        }

        private static LabOrderStatus? ParseStatus(string? status, bool? isSigned)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return (isSigned ?? false) ? LabOrderStatus.Completed : LabOrderStatus.New;
            }

            switch (status.Trim().ToUpperInvariant())
            {
                case "New":
                    return LabOrderStatus.New;
                case "IN_PROGRESS":
                    return LabOrderStatus.InProgress;
                case "SAMPLE_COLLECTED":
                    return LabOrderStatus.SampleCollected;
                case "COMPLETED":
                    return LabOrderStatus.Completed;
                case "CANCEL":
                case "CANCELED":
                    return LabOrderStatus.Cancel;
                default:
                    return (isSigned ?? false) ? LabOrderStatus.Completed : LabOrderStatus.New;
            }
        }
    }
}
