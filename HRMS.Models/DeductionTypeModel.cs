using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class DeductionTypeModel : BaseModel
    {
        public int DeductionTypeID { get; set; }
        public string DeductionTypeName { get; set; }
    }
}
