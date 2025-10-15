using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs
{
    public class TranslationRecord
    {
        public long Id { get; set; }
        public string Key { get; set; }
        public int LanguageId { get; set; } // 1 = English, 2 = Arabic
        public string Title { get; set; }
    }
}
