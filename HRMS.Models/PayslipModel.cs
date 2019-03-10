using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class PaySlipModel : BaseModel
    {
        public int PaySlipID { get; set; }
        public int EmployeeID { get; set; }
        //rename to totalDays
        public DateTime Date { get; set; }
        public float TotalDays { get; set; }
        public float TotalWorkingDays { get; set; }
        public float TotalPresentDays { get; set; }
        public float TotalPublicHolidays { get; set; }
        public float TotalWeekendDays { get; set; }
        public float TotalLeaveDays { get; set; }
        public float TotalAbsentDays { get; set; }
        public float Basic { get; set; }
        public float Telephone { get; set; }
        public float Housing { get; set; }
        public float Transport { get; set; }
        public float TotalSalary { get; set; }
        public string OtherText { get; set; }
        public float OtherNumber { get; set; }
        public string AdditionText { get; set; }
        public float AdditionNumber { get; set; }
        public float Gratuity { get; set; }
    }
}
