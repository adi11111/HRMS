using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Gratuity : BaseEntity
    {
        public Gratuity() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GratuityID { get; set; }
        public int EmployeeID { get; set; }
        public DateTime SettlementDate { get; set; }
        public int TotalWorkingDays { get; set; }
        public decimal GratuityAmount{ get; set; }
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
        public decimal NoticePeriodDays{ get; set; }
        public decimal NoticePeriodAmount { get; set; }
        public decimal AirTicketAmount1 { get; set; }
        public decimal AirTicketAmount2 { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster Employee { get; set; }
    }
}
