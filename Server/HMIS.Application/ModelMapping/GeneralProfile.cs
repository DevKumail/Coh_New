using AutoMapper;
using HMIS.Service.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ModelMapping
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile() {

            CreateMap<EMRNotesQuestionModel, NoteModel>()
                    .ForMember(sup => sup.Quest_Title, opt => opt.MapFrom(src => src.Quest_Title))
                     .ForMember(sup => sup.Answer, opt => opt.MapFrom(src => src.Answer))
                   .ForMember(sup => sup.Type, opt => opt.MapFrom(src => src.Type))
                .ForMember(sup => sup.Children, opt => opt.MapFrom(src => src.Children));
        }
    }
}
