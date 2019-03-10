using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
    public class UserAccessDetailModel
    {
        public int UserAccessDetailID { get; set; }
        public int InterfaceID { get; set; }
        public int EventAccess { get; set; }
        public int UserRoleID { get; set; }
        public int CreatedByUserID { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
