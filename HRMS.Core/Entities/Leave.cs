using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Leave : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LeaveID { get; set; }
        [Required]
        public int EmployeeID { get; set; }
        [Required]
        public int LeaveTypeID { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public DateTime FromDate { get; set; }
        [Required]
        public DateTime ToDate { get; set; }
        [Required]
        public float LeaveBalance { get; set; }
       // [StringLength(500)]
        [Required]
        public string LeaveDocumentPath { get; set; }
        [Required]
        public float TotalLeaveDays { get; set; }
        [Required]
        public int LeaveStatusID { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
        [ForeignKey("LeaveStatusID")]
        public virtual LeaveStatus LeaveStatus { get; set; }
        
        [ForeignKey("LeaveTypeID")]
        public virtual LeaveType LeaveType { get; set; }
        //[Required]
        //public int CreatedByUserID { get; set; }
        //public int UpdatedByUserID { get; set; }
        //[Required]
        //public DateTime CreatedDate { get; set; }
        //public DateTime UpdatedDate { get; set; }
        //[Required]
        //public Boolean IsDeleted { get; set; }
        //public string Remarks { get; set; }
    }
}
