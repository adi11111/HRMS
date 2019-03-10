using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace HRMS.Core.Entities.Foundation
{
    public class BaseEntity
    {
        [Required]
        public int CreatedByUserID { get; set; }

        public int? UpdatedByUserID { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        [Required]
        public Boolean IsDeleted { get; set; }
        public string Remarks { get; set; }

    }
}
