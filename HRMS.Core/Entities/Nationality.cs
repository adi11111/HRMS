using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class Nationality : BaseEntity
    {
        public Nationality() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NationalityID { get; set; }
        [Required]
        [StringLength(70)]
        public string NationalityName { get; set; }
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
