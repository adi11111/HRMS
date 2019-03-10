using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Participant : BaseEntity
    {
        public Participant() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ParticipantID { get; set; }
        public int EmployeeID { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster Employee { get; set; }
        
        [Required]
        public int DocumentID { get; set; }
        [ForeignKey("DocumentID")]
        public virtual DocumentDetail DocumentDetail { get; set; }
        [Required]
        public int AppointmentID { get; set; }
        [ForeignKey("AppointmentID")]
        public virtual Appointment Appointment { get; set; }
    }
}
