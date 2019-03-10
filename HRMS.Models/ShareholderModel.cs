using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class ShareHolderModel : BaseModel
    {
        public int ShareHolderID { get; set; }
        public string ShareHolderName { get; set; }
        public int ShareHolderTypeID{ get; set; }
        public string MobileNumber { get; set; }
        public string ContactNumber { get; set; }
        public string TotalShares { get; set; }
        public string Address { get; set; }
        public string DigitalSignature { get; set; }
        public int CompanyID { get; set; }
        public int EmployeeID { get; set; }
    }
}
