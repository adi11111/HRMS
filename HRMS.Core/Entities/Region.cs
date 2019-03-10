using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Region : BaseEntity
    {
        public Region() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RegionID { get; set; }
        [Required]
        [StringLength(70)]
        public string RegionName { get; set; }
        //[Required]
        //public int CreatedByUserID { get; set; }
        //public int UpdatedByUserID { get; set; }
        //[Required]
        //public DateTime CreatedDate { get; set; }
        //public DateTime UpdatedDate { get; set; }
        //[Required]
        //public Boolean IsDeleted { get; set; }
        //public string Remarks { get; set; }

    }
}
