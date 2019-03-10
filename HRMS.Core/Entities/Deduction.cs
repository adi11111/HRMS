using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using HRMS.Core.Entities.Foundation;

namespace HRMS.Core.Entities
{
    public class Deduction : BaseEntity
    {
        public Deduction()
        {
            DeductionDetail = new List<DeductionDetail>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DeductionID { get; set; }
        [Required]
        public int EmployeeID { get; set; }
        [Required]
        public int DeductionTypeID { get; set; }

        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        public int TotalMonth { get; set; }
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
        public float TotalAmount { get; set; }
        [StringLength(70)]
        public string OtherText { get; set; }
        [DataType(DataType.Currency)]
        public float? OtherNumber { get; set; }
        public bool IsAddition { get; set; }
        public virtual ICollection< DeductionDetail> DeductionDetail { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
        [ForeignKey("DeductionTypeID")]
        public virtual DeductionType DeductionType { get; set; }
    }
}
