using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class DeductionDetail : BaseEntity
    {
        public DeductionDetail() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DeductionDetailID { get; set; }
        [Required]
        public int DeductionID { get; set; }
        [Required]
        public DateTime DeductionDate { get; set; }
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
        public float TotalDeduction { get; set; }
        [StringLength(70)]
        public string OtherText { get; set; }
        [Required]
        public bool IsPayslipIssued { get; set; }
        [DataType(DataType.Currency)]
        public float? OtherNumber { get; set; }
        [ForeignKey("DeductionID")]
        public virtual Deduction Deduction { get; set; }
    }
}
