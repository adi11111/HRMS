using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class CompanyType : BaseEntity
    {
        public CompanyType() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CompanyTypeID { get; set; }
        [Required]
        [StringLength(70)]
        public string CompanyTypeName { get; set; }

    }
}
