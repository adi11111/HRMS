using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class DeductionDetailModel : BaseModel
    {
        public int DeductionDetailID { get; set; }
        public int DeductionID { get; set; }           
        public DateTime DeductionDate { get; set; }
        public float Basic { get; set; }
        public float Telephone { get; set; }
        public float Housing { get; set; }
        public float Transport { get; set; }
        public float TotalDeduction { get; set; }
        public string OtherText { get; set; }
        public float OtherNumber { get; set; }
        public bool IsPayslipIssued { get; set; }
    }
}
