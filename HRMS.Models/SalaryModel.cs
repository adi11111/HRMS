using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class SalaryModel : BaseModel
    {
        public int SalaryID { get; set; }
        public int EmployeeID { get; set; }
        public float Basic { get; set; }
        public float Telephone { get; set; }
        public float Housing { get; set; }
        public float Transport { get; set; }
        public float TotalSalary { get; set; }
        public string OtherText { get; set; }
        public float OtherNumber { get; set; }
        public float GratuitySalary { get; set; }
        public bool IsInitial { get; set; }
    }
}
