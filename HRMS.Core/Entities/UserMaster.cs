using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class UserMaster : BaseEntity
    {
        public UserMaster() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }
        [Required]
        [StringLength(70)]
        public string UserName { get; set; }
        [Required]
        [StringLength(20)]
        public string Password { get; set; }
        public int UserRoleID { get; set; }
        [ForeignKey("UserRoleID")]
        public virtual UserRole UserRole { get; set; }
        public int? EmployeeID { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster Employee { get; set; }

    }
}
