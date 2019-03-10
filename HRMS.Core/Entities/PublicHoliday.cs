using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class PublicHoliday : BaseEntity
    {
        public PublicHoliday() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PublicHolidayID { get; set; }
        [Required]
        [StringLength(70)]
        public string PublicHolidayName { get; set; }
        public DateTime Date { get; set; }
        public int CompanyID { get; set; }
        [ForeignKey("CompanyID")]
        public virtual CompanyMaster CompanyMaster { get; set; }
    }
}
