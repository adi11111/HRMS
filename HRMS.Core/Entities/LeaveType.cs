using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class LeaveType : BaseEntity
    {
        public LeaveType() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LeaveTypeID { get; set; }
        [Required]
        [StringLength(70)]
        public string LeaveTypeName { get; set; }
        [Required]
        public int TotalLeaveDays { get; set; }
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
