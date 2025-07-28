using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs
{
    //[AtLeastOneDaySelected(ErrorMessage = "At least one day must be selected.")]
    public class PrioritySet
    {
        public long PSId { get; set; }
        [Required(ErrorMessage = "Please select Provider.")]
        public long? ProviderId { get; set; }
        public int Priority { get; set; }
    }
}
