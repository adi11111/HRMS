using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class DeductionType : BaseEntity
    {
        public DeductionType() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DeductionTypeID { get; set; }
        [Required]
        [StringLength(70)]
        public string DeductionTypeName { get; set; }

    }
}
