using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.PermissionDTOs
{
    public class PermissionTree
    {
        public string label { get; set; }
        public string data { get; set; }
        public string expandedIcon { get; set; }
        public string collapsedIcon { get; set; }
        public List<Child> children { get; set; }
    }

    public class Child
    {
        public string label { get; set; }
        public string data { get; set; }
        public string expandedIcon { get; set; }
        public string collapsedIcon { get; set; }
        public List<Child> children { get; set; }
        public string icon { get; set; }
    }
}
