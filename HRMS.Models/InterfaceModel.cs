using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
    public class InterfaceModel : BaseModel
    {
        public int InterfaceID { get; set; }
        public string InterfaceName { get; set; }
        public int ParentInterfaceID { get; set; }
    }
}
