using System;
using AutoMapper;
using HMIS.Application.DTOs.Clinical;
using HMIS.Core.Entities;

namespace HMIS.API.Profiles
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ClinicalNoteSaveDto, EmrnotesNote>()
                .ForMember(dest => dest.SignedBy, opt => opt.MapFrom(src =>
                    src.SignedBy.HasValue ? (long?)src.SignedBy.Value : null))
                .ForMember(dest => dest.VisitAcNo, opt => opt.MapFrom(src =>
                    src.VisitAcNo.HasValue ? (long?)src.VisitAcNo.Value : null))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src =>
                    src.CreatedBy.HasValue ? (long?)src.CreatedBy.Value : null))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src =>
                    src.UpdatedBy.HasValue ? (long?)src.UpdatedBy.Value : null))
                .ForMember(dest => dest.CosignedBy, opt => opt.MapFrom(src =>
                    src.CosignedBy.HasValue ? (long?)src.CosignedBy.Value : null))
                .ForMember(dest => dest.MrcosignedBy, opt => opt.MapFrom(src =>
                    src.MrcosignedBy.HasValue ? (long?)src.MrcosignedBy.Value : null))
                .ForMember(dest => dest.NoteCosignProvId, opt => opt.MapFrom(src =>
                    src.NoteCosignProvId.HasValue ? (long?)src.NoteCosignProvId.Value : null))
                .ForMember(dest => dest.ReviewedBy, opt => opt.MapFrom(src =>
                    src.ReviewedBy.HasValue ? (long?)src.ReviewedBy.Value : null))
                .ForMember(dest => dest.ReceiverEmpId, opt => opt.MapFrom(src =>
                    src.ReceiverEmpId.HasValue ? (long?)src.ReceiverEmpId.Value : null))
                .ForMember(dest => dest.LabOrderSetDetailId, opt => opt.MapFrom(src =>
                    src.LabOrderSetDetailId.HasValue ? (long?)src.LabOrderSetDetailId.Value : null))
                .ForMember(dest => dest.OldNoteId, opt => opt.MapFrom(src =>
                    src.OldNoteId.HasValue ? (long?)src.OldNoteId.Value : null))

                .ForMember(dest => dest.NotesTitle, opt => opt.MapFrom(src => src.NotesTitle))
                .ForMember(dest => dest.NoteText, opt => opt.MapFrom(src => src.NoteText))
                .ForMember(dest => dest.NoteHtmltext, opt => opt.MapFrom(src => src.NoteHtmltext))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(src => src.CreatedOn))
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => src.UpdatedDate))
                .ForMember(dest => dest.Signed, opt => opt.MapFrom(src => src.Signed))
                .ForMember(dest => dest.IsEdit, opt => opt.MapFrom(src => src.IsEdit))
                .ForMember(dest => dest.Review, opt => opt.MapFrom(src => src.Review))
                .ForMember(dest => dest.NoteType, opt => opt.MapFrom(src => src.NoteType))
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Active))
                .ForMember(dest => dest.SignedDate, opt => opt.MapFrom(src => src.SignedDate))
                .ForMember(dest => dest.CosignedDate, opt => opt.MapFrom(src => src.CosignedDate))
                .ForMember(dest => dest.MrcosignedDate, opt => opt.MapFrom(src => src.MrcosignedDate))
                .ForMember(dest => dest.ReviewedDate, opt => opt.MapFrom(src => src.ReviewedDate))
                .ForMember(dest => dest.NoteStatus, opt => opt.MapFrom(src => src.NoteStatus))
                .ForMember(dest => dest.Mrno, opt => opt.MapFrom(src => src.Mrno))
                .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.Documents))
                .ForMember(dest => dest.CaseId, opt => opt.MapFrom(src => src.CaseId))
                .ForMember(dest => dest.IsNursingNote, opt => opt.MapFrom(src => src.IsNursingNote))
                .ForMember(dest => dest.ReceiverRoleId, opt => opt.MapFrom(src => src.ReceiverRoleId))
                .ForMember(dest => dest.ReferredSiteId, opt => opt.MapFrom(src => src.ReferredSiteId))
                .ForMember(dest => dest.OldMrno, opt => opt.MapFrom(src => src.OldMrno))
                .ForMember(dest => dest.IsMbrcompleted, opt => opt.MapFrom(src => src.IsMbrcompleted))

                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src =>
                    src.NoteId > 0 ? src.CreatedAt : (src.CreatedAt ?? DateTime.Now)))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src =>
                    src.UpdatedAt ?? DateTime.Now));
        }
    }
}