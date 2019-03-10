using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class DocumentRenewalStatusModel : BaseModel
    {
        public int DocumentRenewalStatusID { get; set; }
        public string DocumentRenewalStatusName { get; set; }
    }
}
