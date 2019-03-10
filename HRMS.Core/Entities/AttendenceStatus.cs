using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class AttendenceStatus : BaseEntity
    {
        public AttendenceStatus() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendenceStatusID { get; set; }
        [Required]
        [StringLength(70)]
        public string AttendenceStatusName { get; set; }

    }
}
