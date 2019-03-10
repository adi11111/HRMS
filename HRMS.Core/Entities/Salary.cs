using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Salary : BaseEntity
    {
        public Salary() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SalaryID { get; set; }
        [Required]
        public int EmployeeID { get; set; }
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
        public float GratuitySalary { get; set; }
        public bool IsInitial { get; set; }
        [DataType(DataType.Currency)]
        public float? OtherNumber { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
    }
}
