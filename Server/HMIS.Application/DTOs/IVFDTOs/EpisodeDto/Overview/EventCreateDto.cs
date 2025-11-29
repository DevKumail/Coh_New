using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview
{
    public class EventCreateDto
    {
        public long EventId { get; set; }
        public long AppId { get; set; }
        public long CategoryId { get; set; }
        public long OverviewId { get; set; }
        public DateTime Startdate { get; set; }
        public DateTime Enddate { get; set; }
    }
}
