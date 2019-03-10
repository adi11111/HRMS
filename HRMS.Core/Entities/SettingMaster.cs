using HRMS.Core.Entities.Foundation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Entities
{
    public class SettingMaster : BaseEntity
    {
        public SettingMaster() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SettingID { get; set; }
        public int? DocumentID { get; set; }
        public int? AppointmentID { get; set; }
        public bool IsPopUpRequired { get; set; }
        public bool IsEmailRequired { get; set; }
        public int PopUpDays { get; set; }
        public int EmailDays { get; set; }
        public DateTime? LastEmailSent { get; set; }
        public int Interval { get; set; }
        //public string Email { get; set; }
        [ForeignKey("DocumentID")]
        public virtual DocumentDetail DocumentDetail { get; set; }
        [ForeignKey("AppointmentID")]
        public virtual Appointment Appointment { get; set; }

    }
}
