using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class CompanyStatus : BaseEntity
    {
        public CompanyStatus() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CompanyStatusID { get; set; }
        [Required]
        [StringLength(70)]
        public string CompanyStatusName { get; set; }

    }
}
