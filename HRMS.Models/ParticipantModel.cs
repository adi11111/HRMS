using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
    public class ParticipantModel : BaseModel
    {
        public int ParticipantID { get; set; }
        public int EmployeeID { get; set; }
        public int AppointmentID { get; set; }
        public int DocumentID { get; set; }
    }
}
