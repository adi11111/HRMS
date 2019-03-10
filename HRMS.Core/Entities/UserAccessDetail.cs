using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class UserAccessDetail : BaseEntity
    {
        public UserAccessDetail() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserAccessDetailID { get; set; }
        public int InterfaceID { get; set; }
        public int EventAccess { get; set; }
       
        public int UserRoleID { get; set; }
        [ForeignKey("InterfaceID")]
        public virtual Interface Interface { get; set; }
        [ForeignKey("UserRoleID")]
        public virtual UserRole UserRole { get; set; }

    }
}
