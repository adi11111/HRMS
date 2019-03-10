using System;


namespace HRMS.Models
{
   public class BaseModel
    {
        public int CreatedByUserID { get; set; }

        public int? UpdatedByUserID { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Boolean IsDeleted { get; set; }
        public string Remarks { get; set; }
    }
}
