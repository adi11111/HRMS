using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class DocumentCategory : BaseEntity
    {
        public DocumentCategory() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DocumentCategoryID { get; set; }
        [Required]
        [StringLength(70)]
        public string DocumentCategoryName { get; set; }

    }
}
