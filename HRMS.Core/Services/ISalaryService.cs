using HRMS.Core.Entities;
using HRMS.Core.Entities.Foundation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Services
{
   public interface ISalaryService : IBaseService<Salary>
    {
        void Insert(Salary salary, Increment increment);
    }
}
