using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class AttendenceModel : BaseModel
    {
        public int AttendenceID { get; set; }
        // rename
        public DateTime AttendenceDate { get; set; }
        public int EmployeeID { get; set; }
        public TimeSpan TimeIn { get; set; }
        public TimeSpan TimeOut { get; set; }
        //rename and datatype int
        public TimeSpan TotalWorkingHours { get; set; }
        //rename and datatype int
        public TimeSpan DailyWorkingHours { get; set; }
        public int StatusID { get; set; }
    }
}
