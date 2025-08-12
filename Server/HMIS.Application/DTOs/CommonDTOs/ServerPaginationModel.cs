using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.CommonDTOs
{
    public abstract class ServerPaginationModel
    {
        public int? Page { get; set; }
        public int? Size { get; set; }
        public string? SortColumn { get; set; }
        public string? SortOrder { get; set; }
    }
}
