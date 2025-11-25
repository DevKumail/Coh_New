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
    }

    public class IVFLabOrderService : IIVFLabOrderService
    {
        private readonly HMISDbContext _db;
        public IVFLabOrderService(HMISDbContext db)
        {
            _db = db;
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
                IsHL7MsgCreated = hdrEntity.IsHl7msgCreated,
                IsHL7MessageGeneratedForPhilips = hdrEntity.IsHl7messageGeneratedForPhilips,
                IsSigned = hdrEntity.IsSigned,
                oldMRNo = hdrEntity.OldMrno,
                HL7MessageId = hdrEntity.Hl7messageId
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
            var list = await _db.LabOrderSet
                .Where(x => x.Mrno == mrno)
                .Select(h => new LabOrderSetHeaderDTO
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
                    IsHL7MsgCreated = h.IsHl7msgCreated,
                    IsHL7MessageGeneratedForPhilips = h.IsHl7messageGeneratedForPhilips,
                    IsSigned = h.IsSigned,
                    oldMRNo = h.OldMrno,
                    HL7MessageId = h.Hl7messageId
                })
                .ToListAsync();
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
                        join emp in _db.Hremployee on (long?)h.ProviderId equals (long?)emp.EmployeeId into eleft
                        from emp in eleft.DefaultIfEmpty()
                        where !(d.IsDeleted ?? false)
                        select new IVFOrderGridRowDTO
                        {
                            OrderSetId = h.LabOrderSetId,
                            OrderSetDetailId = d.OrderSetDetailId,
                            OrderNumber = h.LabOrderSetId.ToString().PadLeft(10, '0'),
                            SampleDepDate = SafeDate(h.OrderDate, "dd.MM.yyyy"),
                            Time = SafeDate(h.OrderDate, "HH:mm"),
                            Clinician = emp != null ? emp.FullName : string.Empty,
                            Name = t != null ? t.LabName : null,
                            Material = t != null ? t.LabUnit : null,
                            Laboratory = (d.IsInternalTest ?? false) ? "Internal" : "External",
                            Status = (h.IsSigned ?? false) ? "✔" : (h.OrderStatus ?? "—"),
                            Comment = d.Pcomments
                        };

            return await query.ToListAsync();
        }

        public async Task<long> CreateOrderSetAsync(CreateUpdateLabOrderSetDTO payload)
        {
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var h = payload.Header;
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
                    OrderStatus = h.OrderStatus,
                    IsHl7msgCreated = h.IsHL7MsgCreated,
                    IsHl7messageGeneratedForPhilips = h.IsHL7MessageGeneratedForPhilips,
                    IsSigned = h.IsSigned,
                    OldMrno = h.oldMRNo,
                    Hl7messageId = (int?)h.HL7MessageId
                };
                _db.LabOrderSet.Add(hdr);
                await _db.SaveChangesAsync();

                var orderSetId = (long)hdr.LabOrderSetId;

                if (payload.Details != null)
                {
                    foreach (var d in payload.Details)
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
                            IsDeleted = d.IsDeleted ?? false
                        };
                        _db.LabOrderSetDetail.Add(ent);
                    }
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
                hdr.Mrno = h.MRNo;
                hdr.ProviderId = h.ProviderId;
                hdr.OrderDate = FormatDate(h.OrderDate);
                hdr.VisitAccountNo = h.VisitAccountNo?.ToString();
                hdr.CreatedBy = h.CreatedBy.ToString();
                hdr.CreatedDate = FormatDate(h.CreatedDate);
                hdr.UpdatedBy = h.UpdatedBy?.ToString();
                hdr.UpdatedDate = h.UpdatedDate.HasValue ? FormatDate(h.UpdatedDate.Value) : null;
                hdr.OrderControlCode = h.OrderControlCode;
                hdr.OrderStatus = h.OrderStatus;
                hdr.IsHl7msgCreated = h.IsHL7MsgCreated;
                hdr.IsHl7messageGeneratedForPhilips = h.IsHL7MessageGeneratedForPhilips;
                hdr.IsSigned = h.IsSigned;
                hdr.OldMrno = h.oldMRNo;
                hdr.Hl7messageId = (int?)h.HL7MessageId;

                // Soft delete existing details
                var existing = await _db.LabOrderSetDetail.Where(d => d.OrderSetId == orderSetId).ToListAsync();
                foreach (var e in existing)
                {
                    e.IsDeleted = true;
                }
                await _db.SaveChangesAsync();

                if (payload.Details != null)
                {
                    foreach (var d in payload.Details)
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
                            IsDeleted = d.IsDeleted ?? false
                        };
                        _db.LabOrderSetDetail.Add(ent);
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
                    hdr.OrderStatus = (hdr.OrderStatus ?? string.Empty) + "_DELETED";
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
    }
}
