using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
    public class SettingModel : BaseModel
    {
        public int SettingID { get; set; }
        public int? DocumentID { get; set; }
        public int? AppointmentID { get; set; }
        public bool IsPopUpRequired { get; set; }
        public bool IsEmailRequired { get; set; }
        public int PopUpDays { get; set; }
        public int EmailDays { get; set; }
        public DateTime? LastEmailSent { get; set; }
        public int Interval { get; set; }
        // public string Email { get; set; }
    }
}
