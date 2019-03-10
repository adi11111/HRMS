using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Interface : BaseEntity
    {
        public Interface() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InterfaceID { get; set; }
        [StringLength(70)]
        public string InterfaceName { get; set; }
        public int ParentInterfaceID { get; set; }
    }
}
