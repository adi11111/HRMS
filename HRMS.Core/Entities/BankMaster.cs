using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class BankMaster : BaseEntity
    {
        public BankMaster() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BankID { get; set; }
        [StringLength(70)]
        public string BankName { get; set; }
        [StringLength(70)]
        public string BranchName { get; set; }
        [StringLength(70)]
        public string ContactPerson { get; set; }
        [StringLength(20)]
        public string ContactNumber { get; set; }
        [Required]
        public int RegionID { get; set; }
        [Required]
        public int LocationID { get; set; }
        [ForeignKey("RegionID")]
        public virtual Region Region { get; set; }
        [ForeignKey("LocationID")]
        public virtual Location Location { get; set; }
    }
}
