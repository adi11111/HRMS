using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class DocumentRenewalStatus : BaseEntity
    {
        public DocumentRenewalStatus() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DocumentRenewalStatusID { get; set; }
        [Required]
        [StringLength(70)]
        public string DocumentRenewalStatusName { get; set; }

    }
}
