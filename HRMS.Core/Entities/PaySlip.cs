using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class PaySlip : BaseEntity
    {
        public PaySlip() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaySlipID { get; set; }
        [Required]
        public int EmployeeID { get; set; }
        [Required]
        //rename to totalDays
        public DateTime Date { get; set; }
        [Required]
        public float TotalDays { get; set; }
        [Required]
        public float TotalWorkingDays { get; set; }
        [Required]
        public float TotalPresentDays { get; set; }
        [Required]
        public float TotalPublicHolidays { get; set; }
        [Required]
        public float TotalWeekendDays { get; set; }
        [Required]
        public float TotalLeaveDays { get; set; }
        [Required]
        public float TotalAbsentDays { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float Basic { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float Telephone { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float Housing { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float Transport { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float TotalSalary { get; set; }
        [StringLength(70)]
        public string OtherText { get; set; }
        [DataType(DataType.Currency)]
        public float? OtherNumber { get; set; }
        [StringLength(70)]
        public string AdditionText { get; set; }
        [DataType(DataType.Currency)]
        public float? AdditionNumber { get; set; }
        public float? Gratuity { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
    }
}
