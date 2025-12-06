using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IIVFLabOrderService
    {
        Task<LabOrderSetReadDTO?> GetOrderSetAsync(long orderSetId);
        Task<IEnumerable<LabOrderSetHeaderDTO>> GetOrderSetsByMrnoAsync(long mrno);
        Task<IEnumerable<IVFOrderGridParentDTO>> GetOrderGridByMrnoAsync(long mrno);
        Task<long> CreateOrderSetAsync(CreateUpdateLabOrderSetDTO payload);
        Task<bool> UpdateOrderSetAsync(long orderSetId, CreateUpdateLabOrderSetDTO payload);
        Task<bool> DeleteOrderSetAsync(long orderSetId, bool hardDelete = false);
        Task<IEnumerable<OptionDTO>> GetRefPhysiciansAsync(int? employeeTypeId);
        Task<IEnumerable<OptionDTO>> GetNotifyRolesAsync();
        Task<IEnumerable<OptionDTO>> GetReceiversByEmployeeTypeAsync(int? employeeTypeId);
        Task<bool> CollectSampleAsync(long OrderSetDetailId, CollectSampleDTO payload);
        Task<bool> MarkCompleteOrderAsync(long orderSetDetailId);
        Task<int> CompleteOrderAsync(long orderSetDetailId, CompleteLabOrderDTO payload);
        Task<IEnumerable<OrderCollectionDetailsDTO>> GetOrderCollectionDetailsAsync(long orderSetId);
        Task<IEnumerable<PathologyResultDTO>> GetPathologyResultsAsync(long mrno, string? search);
        Task<int> CancelOrderAsync(long orderSetId, CancelOrderDTO payload);
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
                        OrderSetDetailId = d.OrderSetDetailId,
                        LabTestId = d.LabTestId,
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

        public async Task<IEnumerable<PathologyResultDTO>> GetPathologyResultsAsync(long mrno, string? search)
        {
            var mrnoString = mrno.ToString();

            var sql = @"
SELECT
    r.LabResultId,
    r.OrderSetDetailId,
    r.MRNo      AS Mrno,
    r.TestName,
    r.TestNameAbbreviation,
    r.CPTCode   AS Cptcode,
    r.PerformDate,
    st.SampleName,
    emp.FullName AS Clinician
FROM LabResultsMain r
LEFT JOIN LabOrderSetDetail d ON r.OrderSetDetailId = d.OrderSetDetailId
LEFT JOIN LabTests t ON d.LabTestId = t.LabTestId
LEFT JOIN LabSampleTypes st ON t.SampleTypeId = st.SampleTypeId
LEFT JOIN HREmployee emp ON r.ProviderId = emp.EmployeeId
WHERE r.MRNo = @Mrno";

            string? term = null;
            if (!string.IsNullOrWhiteSpace(search))
            {
                term = search.Trim().ToUpperInvariant();
                sql += @"
AND (
    UPPER(r.TestName) LIKE '%' + @Term + '%'
    OR UPPER(r.TestNameAbbreviation) LIKE '%' + @Term + '%'
    OR UPPER(r.CPTCode) LIKE '%' + @Term + '%'
)";
            }

            var mainRows = (await DapperHelper.QueryAsync<PathologyMainRow>(sql, new { Mrno = mrnoString, Term = term })).ToList();
            if (mainRows.Count == 0)
            {
                return new List<PathologyResultDTO>();
            }

            var labResultIds = mainRows.Select(x => x.LabResultId).ToList();

            var observations = await _db.LabResultsObservation
                .Where(o => o.LabResultId.HasValue && labResultIds.Contains(o.LabResultId.Value))
                .ToListAsync();

            // Group by OrderSetDetailId to combine multiple LabResultIds for the same test
            var grouped = mainRows
                .GroupBy(x => new { x.OrderSetDetailId, x.TestName, x.TestNameAbbreviation, x.Cptcode })
                .Select(g =>
                {
                    var first = g.First();
                    var mrParsed = TryParseLong(first.Mrno);
                    
                    // Get all LabResultIds for this group
                    var groupLabResultIds = g.Select(x => x.LabResultId).ToList();
                    
                    // Combine all observations from all LabResultIds in this group
                    var obsList = observations
                        .Where(o => o.LabResultId.HasValue && groupLabResultIds.Contains(o.LabResultId.Value))
                        .OrderBy(o => o.SequenceNo)
                        .Select(o => new PathologyObservationDTO
                        {
                            SequenceNo = o.SequenceNo,
                            Observation = o.ObservationIdentifierFullName,
                            Abbreviation = o.ObservationIdentifierShortName,
                            Value = o.ObservationValue,
                            Unit = o.Units,
                            ReferenceRangeMin = o.ReferenceRangeMin,
                            ReferenceRangeMax = o.ReferenceRangeMax,
                            Status = o.ResultStatus,
                            Note = o.Remarks
                        })
                        .ToList();

                    return new PathologyResultDTO
                    {
                        LabResultId = first.LabResultId,
                        OrderSetDetailId = first.OrderSetDetailId,
                        MRNo = mrParsed,
                        PerformDate = ParseDate(first.PerformDate),
                        TestName = first.TestName,
                        TestAbbreviation = first.TestNameAbbreviation,
                        CptCode = first.Cptcode,
                        Sample = first.SampleName,
                        Clinician = first.Clinician,
                        Observations = obsList
                    };
                })
                .OrderByDescending(r => r.PerformDate)
                .ToList();

            return grouped;
        }

        private class PathologyMainRow
        {
            public int LabResultId { get; set; }
            public long? OrderSetDetailId { get; set; }
            public string Mrno { get; set; }
            public string TestName { get; set; }
            public string TestNameAbbreviation { get; set; }
            public string Cptcode { get; set; }
            public string PerformDate { get; set; }
            public string? SampleName { get; set; }
            public string? Clinician { get; set; }
        }

        public async Task<bool> CollectSampleAsync(long OrderSetDetailId, CollectSampleDTO payload)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                // Get the detail record
                var detail = await _db.LabOrderSetDetail
                    .FirstOrDefaultAsync(d => d.OrderSetDetailId == OrderSetDetailId && !(d.IsDeleted ?? false));

                if (detail == null) return false;

                // Update CollectDate and Status for the test detail
                detail.CollectDate = payload.CollectDate;
                detail.Status = ((int)LabOrderStatus.SampleCollected).ToString(); // Store ID: "3"

                // Check if all details in this order have samples collected
                var allDetails = await _db.LabOrderSetDetail
                    .Where(d => d.OrderSetId == detail.OrderSetId && !(d.IsDeleted ?? false))
                    .ToListAsync();

                bool allCollected = allDetails.All(d => d.CollectDate.HasValue || d.OrderSetDetailId == OrderSetDetailId);

                // Update parent order status
                var header = await _db.LabOrderSet.FirstOrDefaultAsync(h => h.LabOrderSetId == detail.OrderSetId);
                if (header != null)
                {
                    if (allCollected)
                    {
                        // All samples collected → Status = SampleCollected (3)
                        header.OrderStatus = ((int)LabOrderStatus.SampleCollected).ToString();
                    }
                    else
                    {
                        // Some samples collected → Status = InProgress (2)
                        header.OrderStatus = ((int)LabOrderStatus.InProgress).ToString();
                    }
                    
                    //header.UpdatedBy = payload.UserId.ToString();
                    //header.UpdatedDate = FormatDate(DateTime.UtcNow);
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();
                return true;
            }
            catch(Exception ex)
            {
                await tx.RollbackAsync();
                throw ex;
            }
        }

        public async Task<bool> MarkCompleteOrderAsync(long orderSetDetailId)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                // Get the detail record
                var detail = await _db.LabOrderSetDetail
                    .FirstOrDefaultAsync(d => d.OrderSetDetailId == orderSetDetailId && !(d.IsDeleted ?? false));

                if (detail == null) return false;

                // Update Status for the test detail to Completed
                detail.Status = ((int)LabOrderStatus.Completed).ToString(); // Store ID: "4"

                // Check if all details in this order are completed
                var allDetails = await _db.LabOrderSetDetail
                    .Where(d => d.OrderSetId == detail.OrderSetId && !(d.IsDeleted ?? false))
                    .ToListAsync();

                bool allCompleted = allDetails.All(d => 
                    d.Status == ((int)LabOrderStatus.Completed).ToString() || 
                    d.OrderSetDetailId == orderSetDetailId);

                // Update parent order status
                var header = await _db.LabOrderSet.FirstOrDefaultAsync(h => h.LabOrderSetId == detail.OrderSetId);
                if (header != null)
                {
                    if (allCompleted)
                    {
                        // All tests completed → Status = Completed (4)
                        header.OrderStatus = ((int)LabOrderStatus.Completed).ToString();
                    }
                    else
                    {
                        // Some tests completed → Status = InProgress (2)
                        header.OrderStatus = ((int)LabOrderStatus.InProgress).ToString();
                    }
                    
                    //header.UpdatedDate = FormatDate(DateTime.UtcNow);
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();
                return true;
            }
            catch(Exception ex)
            {
                await tx.RollbackAsync();
                throw ex;
            }
        }

        public async Task<int> CompleteOrderAsync(long orderSetDetailId, CompleteLabOrderDTO payload)
        {
            // Load detail + header + test
            var detail = await _db.LabOrderSetDetail.FirstOrDefaultAsync(d => d.OrderSetDetailId == orderSetDetailId);
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
                CreatedBy = Convert.ToInt32(payload.UserId),
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
                PerformAtLabId = payload.PerformAtLabId,
                Note = payload.Note
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
                var resolved = ResolveStatus(LabOrderStatus.Completed, header.OrderStatus);
                header.OrderStatus = resolved;
              //  header.UpdatedBy = payload.UserId.ToString();
               // header.UpdatedDate = FormatDate(DateTime.UtcNow);
            }

            if(payload.Attachments != null && payload.Attachments.Count > 0)
            {
                foreach (var att in payload.Attachments)
                {
                    var attachment = new LabResultsScannedImages
                    {
                        LabResultId = labResultId,
                        FileId = att.FileId
                    };
                    _db.Add(attachment);
                }
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
                    CreatedDate = (DateTime)h.CreatedAt,
                    //UpdatedBy = TryParseLong(h.UpdatedBy),
                    //UpdatedDate = ParseDate(h.UpdatedDate),
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

        public async Task<IEnumerable<IVFOrderGridParentDTO>> GetOrderGridByMrnoAsync(long mrno)
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
                            ParentStatus = h.OrderStatus, // Parent order status
                            DetailStatus = d.Status // Child detail status
                        };

            var rows = await query.ToListAsync();

            // Group by OrderSetId to build parent + children structure
            var grouped = rows
                .GroupBy(x => x.LabOrderSetId)
                .Select(g => new IVFOrderGridParentDTO
                {
                    OrderSetId = g.Key,
                    OrderNumber = g.First().OrderNumber.HasValue
                        ? g.First().OrderNumber.Value.ToString().PadLeft(10, '0')
                        : g.First().LabOrderSetId.ToString().PadLeft(10, '0'),
                    SampleDepDate = g.First().CollectDate.HasValue ? g.First().CollectDate.Value.ToString("dd.MM.yyyy") : string.Empty,
                    Time = g.First().CollectDate.HasValue ? g.First().CollectDate.Value.ToString("HH:mm") : string.Empty,
                    Clinician = g.First().Clinician,
                    Material = g.First().SampleName,
                    Laboratory = "Internal",
                    Status = FormatStatusForView(g.First().ParentStatus, null),
                    StatusId = GetStatusIdForView(g.First().ParentStatus, null),
                    Comment = g.First().Pcomments,
                    Children = g.Select(x => new IVFOrderGridRowDTO
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
                        Status = FormatStatusForView(x.DetailStatus, null),
                        StatusId = GetStatusIdForView(x.DetailStatus, null),
                        Comment = x.Pcomments
                    }).ToList()
                })
                .ToList();

            return grouped;
        }

        public async Task<long> CreateOrderSetAsync(CreateUpdateLabOrderSetDTO payload)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var h = payload.Header;
                var resolvedCreate = ResolveStatus(h.OrderStatusEnum, h.OrderStatus);
                var details = payload.Details ?? new List<LabOrderSetDetailDTO>();

                long? orderNumber = h.OrderNumber;
                if (!orderNumber.HasValue || orderNumber.Value == 0)
                {
                    orderNumber = await GetNextOrderNumberAsync();
                }

                var hdr = new LabOrderSet
                {
                    Mrno = h.MRNo,
                    ProviderId = h.ProviderId,
                    OrderDate = FormatDate(h.OrderDate),
                    VisitAccountNo = h.VisitAccountNo?.ToString(),
                    OrderControlCode = h.OrderControlCode,
                    OrderStatus = resolvedCreate,
                    IsHl7msgCreated = h.IsHL7MsgCreated,
                    IsHl7messageGeneratedForPhilips = h.IsHL7MessageGeneratedForPhilips,
                    OldMrno = h.oldMRNo,
                    Hl7messageId = h.HL7MessageId.HasValue ? (int?)h.HL7MessageId.Value : null
                };

                _db.LabOrderSet.Add(hdr);
                await _db.SaveChangesAsync();

                var orderSetId = (long)hdr.LabOrderSetId;
                var orderSetDetailIds = new List<long>();

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
                        IsDeleted = d.IsDeleted ?? false,
                        Status = ((int)LabOrderStatus.New).ToString() // Store ID: "1" for new orders
                    };

                    _db.LabOrderSetDetail.Add(ent);

                    await _db.SaveChangesAsync();

                    var orderSetDetailId = (long)ent.OrderSetDetailId;
                    orderSetDetailIds.Add(orderSetDetailId);

                    d.OrderSetDetailId = orderSetDetailId;
                }

                if (payload.Header.OverviewId > 0 && orderSetDetailIds.Count > 0)
                {
                    var ivfLabOrder = new IvflabOrderSet
                    {
                        OrderSetId = orderSetId, 
                        OverviewId = payload.Header.OverviewId ?? 0
                    };
                    _db.IvflabOrderSet.Add(ivfLabOrder);
                    await _db.SaveChangesAsync();
                }

                await tx.CommitAsync();


                return orderSetId;
            }
            catch (Exception ex)
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
                var resolvedUpdate = ResolveStatus(h.OrderStatusEnum, h.OrderStatus);
                hdr.Mrno = h.MRNo;
                hdr.ProviderId = h.ProviderId;
                hdr.OrderDate = FormatDate(h.OrderDate);
                hdr.VisitAccountNo = h.VisitAccountNo?.ToString();
                hdr.OrderControlCode = h.OrderControlCode;
                hdr.OrderStatus = resolvedUpdate;
                hdr.IsHl7msgCreated = h.IsHL7MsgCreated;
                hdr.IsHl7messageGeneratedForPhilips = h.IsHL7MessageGeneratedForPhilips;
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
                            IsDeleted = d.IsDeleted ?? false,
                            Status = ((int)LabOrderStatus.New).ToString() // Store ID: "1" for new orders
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

        public async Task<int> CancelOrderAsync(long orderSetId, CancelOrderDTO payload)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var header = await _db.LabOrderSet.FirstOrDefaultAsync(h => h.LabOrderSetId == orderSetId);
                if (header == null) return 0; // Order not found

                // Check if order can be cancelled (not already completed)
                if (header.OrderStatus == "4") // Status 4 = Completed
                {
                    return -1; // Cannot cancel completed orders
                }

                // Update header status to Cancel
                var resolved = ResolveStatus(LabOrderStatus.Cancel, header.OrderStatus);
                header.OrderStatus = resolved;
                //header.UpdatedBy = payload.UserId.ToString();
               // header.UpdatedDate = FormatDate(payload.CancelDate);

                await _db.SaveChangesAsync();
                await tx.CommitAsync();
                return 1; // Success
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

        private static string FormatStatusForView(string? status, bool? isSigned)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return (isSigned ?? false) ? "Marked as Complete" : "New Order";
            }

            var trimmed = status.Trim();

            // First try numeric codes (1-5) that map to LabOrderStatus enum values
            if (int.TryParse(trimmed, out var code))
            {
                switch (code)
                {
                    case (int)LabOrderStatus.New:
                        return "New Order";
                    case (int)LabOrderStatus.InProgress:
                        return "In Progress";
                    case (int)LabOrderStatus.SampleCollected:
                        return "Sample Collected";
                    case (int)LabOrderStatus.Completed:
                        return "Marked as Completed";
                    case (int)LabOrderStatus.Cancel:
                        return "Marked as Cancelled";
                }
            }

            // Fallback for textual status values stored in DB (enum names or old values)
            var upper = trimmed.ToUpperInvariant();
            switch (upper)
            {
                case "NEW":
                case "NEW_ORDER":
                    return "New Order";
                case "INPROG":
                case "IN_PROGRESS":
                case "INPROGRESS":
                    return "In Progress";
                case "COLLECT":
                case "SAMPLE_COLLECTED":
                case "SAMPLECOLLECTED":
                    return "Sample Collected";
                case "DONE":
                case "COMPLETED":
                    return "Completed";
                case "CANCEL":
                case "CANCELED":
                    return "Cancelled";
                default:
                    return (isSigned ?? false) ? "Completed" : "New Order";
            }
        }

        private static int GetStatusIdForView(string? status, bool? isSigned)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return (int)((isSigned ?? false) ? LabOrderStatus.Completed : LabOrderStatus.New);
            }

            var trimmed = status.Trim();

            if (int.TryParse(trimmed, out var code))
            {
                if (code >= (int)LabOrderStatus.New && code <= (int)LabOrderStatus.Cancel)
                {
                    return code;
                }
            }

            var upper = trimmed.ToUpperInvariant();
            switch (upper)
            {
                case "NEW":
                case "NEW_ORDER":
                    return (int)LabOrderStatus.New;
                case "INPROG":
                case "IN_PROGRESS":
                case "INPROGRESS":
                    return (int)LabOrderStatus.InProgress;
                case "COLLECT":
                case "SAMPLE_COLLECTED":
                case "SAMPLECOLLECTED":
                    return (int)LabOrderStatus.SampleCollected;
                case "DONE":
                case "COMPLETED":
                    return (int)LabOrderStatus.Completed;
                case "CANCEL":
                case "CANCELED":
                    return (int)LabOrderStatus.Cancel;
                default:
                    return (int)((isSigned ?? false) ? LabOrderStatus.Completed : LabOrderStatus.New);
            }
        }

        private static string? ResolveStatus(LabOrderStatus? statusEnum, string? fallbackStatus)
        {
            if (!statusEnum.HasValue)
            {
                return fallbackStatus;
            }

            // Simply return the enum ID as string
            return ((int)statusEnum.Value).ToString();
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
