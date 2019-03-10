using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Attendence : BaseEntity
    {
        public Attendence() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendenceID { get; set; }
        // rename
        public DateTime AttendenceDate { get; set; }
        [Required]
        public int EmployeeID { get; set; }
        [Required]
        public TimeSpan TimeIn { get; set; }
        [Required]
        public TimeSpan TimeOut { get; set; }
        [Required]
        //rename and datatype int
        public TimeSpan TotalWorkingHours { get; set; }
        [Required]
        //rename and datatype int
        public TimeSpan DailyWorkingHours { get; set; }
        [Required]
        public int StatusID { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
        [ForeignKey("StatusID")]
        public virtual AttendenceStatus AttendenceStatus { get; set; }
    }
}
