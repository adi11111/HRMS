using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class ShareHolderType : BaseEntity
    {
        public ShareHolderType() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ShareHolderTypeID { get; set; }
        [StringLength(70)]
        public string ShareHolderTypeName { get; set; }
     
    }
}
