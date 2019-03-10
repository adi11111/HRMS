using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class DeductionModel : BaseModel
    {
        public int DeductionID { get; set; }
        public int EmployeeID { get; set; }
        public int DeductionTypeID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public float Basic { get; set; }
        public float Telephone { get; set; }
        public float Housing { get; set; }
        public float Transport { get; set; }
        public float TotalAmount{ get; set; }
        public int TotalMonth { get; set; }
        public string OtherText { get; set; }
        public float OtherNumber { get; set; }
        public bool IsAddition { get; set; }
        public List<DeductionDetailModel> DeductionDetails { get; set; }
    }
    public class DeductionComplex 
    {
        public DeductionModel Deduction { get; set; }
        public List<DeductionDetailModel> DeductionDetails { get; set; }
    }
}
