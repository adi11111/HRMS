using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
    public class GraduityModel : BaseModel
    {
        public int GraduitySettingID { get; set; }
        public int Year1 { get; set; }
        public int Year2 { get; set; }
        public int Year3 { get; set; }
        public int Year4 { get; set; }
        public int Year5 { get; set; }
        public int YearAbove5 { get; set; }
        public int GratuityType { get; set; }
        public int CompanyID { get; set; }
    }
}
