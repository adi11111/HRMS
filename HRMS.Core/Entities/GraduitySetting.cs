using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class GraduitySetting : BaseEntity
    {
        public GraduitySetting() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GraduitySettingID { get; set; }
        [Required]
        public int Year1{ get; set; }
        [Required]
        public int Year2 { get; set; }
        [Required]
        public int Year3 { get; set; }
        [Required]
        public int Year4 { get; set; }
        [Required]
        public int Year5 { get; set; }
        [Required]
        public int YearAbove5 { get; set; }
        [Required]
        public int GratuityType{ get; set; } // 1 = Basic,2 = Full Salary, 3 = GratuitySalary
        [Required]
        public int CompanyID { get; set; }
        [ForeignKey("CompanyID")]
        public virtual CompanyMaster CompanyMaster { get; set; }

    }
}
