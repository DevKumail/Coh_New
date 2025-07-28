using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Demographics
{
    public class Assignments
    {
        public string? proofOfIncome { get; set; }

        public int? providerId { get; set; }

        public int? feeScheduleId { get; set; }

        public int? financialClassId { get; set; }

        public int? locationId { get; set; }

        public int? siteId { get; set; }

        public DateTime? signedDate { get; set; }

        public DateTime? unsignedDate { get; set; }

        public int? entityTypeId { get; set; }

        public int? entityNameId { get; set; }

        public int? referredById { get; set;}

        public int? TabsTypeId { get; set; }

    }
}
