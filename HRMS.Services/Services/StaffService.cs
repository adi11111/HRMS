using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Core.Services;
using HRMS.Core.Entities.Foundation;
using HRMS.Core.Data;
using HRMS.Core.Entities;
//using HRMS.Services.Services;

namespace HRMS.Services.Services
{
   public class StaffService : BaseService<Staff> , IStaffService 
    {
        
        public StaffService(IUnitOfWork _uow) : base(_uow)
        {
           
        }
    }
}
