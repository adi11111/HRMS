using System;
namespace HRMS.Models
{
   public class AppointmentModel : BaseModel
    {
        public int AppointmentID { get; set; }
        public int EmployeeID { get; set; }
        public int CompanyID { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string AppointmentName { get; set; }
        public string Conclusion { get; set; }
        public DateTime AppointmentDate { get; set; }
    }
}
