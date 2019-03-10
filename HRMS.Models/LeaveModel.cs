using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class LeaveModel : BaseModel
    {
        public int LeaveID { get; set; }
        public int EmployeeID { get; set; }
        public int LeaveTypeID { get; set; }
        public DateTime Date { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public float LeaveBalance { get; set; }
        public float LeaveBalanceAsNow { get; set; }
        public string LeaveDocumentPath { get; set; }
        public string FileName { get; set; }
        public float TotalLeaveDays { get; set; }
        public float RemainingLeaveDays { get; set; }
        public int LeaveStatusID { get; set; }
    }
}
