
using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
   public class Appointment : BaseEntity
    {
        public Appointment() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AppointmentID { get; set; }
        [Required]
        public int EmployeeID { get; set; }
        [Required]
        public int CompanyID { get; set; }
        [StringLength(70)]
        public string AppointmentName { get; set; }
        [StringLength(800)]
        public string Conclusion { get; set; }
        [Required]
        public TimeSpan StartTime { get; set; }
        [Required]
        public TimeSpan EndTime { get; set; }
        [Required]
        public DateTime AppointmentDate { get; set; }
        [ForeignKey("CompanyID")]
        public virtual CompanyMaster CompanyMaster { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster{ get; set; }

    }
}
