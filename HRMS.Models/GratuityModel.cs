using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
    public class GratuityModel: BaseModel
    {
        public int GratuityID { get; set; }
        public int EmployeeID { get; set; }
        public DateTime SettlementDate { get; set; }
        public int TotalWorkingDays { get; set; }
        public decimal GratuityAmount { get; set; }
        public decimal TotalLeavePending { get; set; }
        public decimal TotalLeaveSalaryPending { get; set; }
        public string AdditionText1 { get; set; }
        public decimal AdditionAmount1 { get; set; }
        public string AdditionText2 { get; set; }
        public decimal AdditionAmount2 { get; set; }
        public string OtherText1 { get; set; }
        public decimal OtherAmount1 { get; set; }
        public string OtherText2 { get; set; }
        public decimal OtherAmount2 { get; set; }
        public string OtherText3 { get; set; }
        public decimal OtherAmount3 { get; set; }
        public string OtherText4 { get; set; }
        public decimal OtherAmount4 { get; set; }
        public decimal NoticePeriodDays { get; set; }
        public decimal NoticePeriodAmount { get; set; }
        public decimal AirTicketAmount1 { get; set; }
        public decimal AirTicketAmount2 { get; set; }
    }
}
