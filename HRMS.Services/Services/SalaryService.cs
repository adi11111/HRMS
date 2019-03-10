using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Core.Services;
using HRMS.Core.Entities.Foundation;
using HRMS.Core.Data;
using HRMS.Core.Entities;

namespace HRMS.Services.Services
{
   public class SalaryService : BaseService<Salary> , ISalaryService 
    {
        IUnitOfWork _uow;
        public SalaryService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public void Insert(Salary salary,Increment increment) 
        {
            _uow.Repository<Salary>().Insert(salary);
            salary.IsInitial = true;
            _uow.Repository<Salary>().Insert(salary);
            //_uow.Repository<Increment>().Insert(increment);
            _uow.Save();
        }
        public override Salary Insert(Salary salary)
        {
            salary = _uow.Repository<Salary>().Insert(salary);
            _uow.Save();
            salary.IsInitial = true;
            _uow.Repository<Salary>().Insert(salary);
            //_uow.Repository<Increment>().Insert(increment);
            _uow.Save();
            return salary;
        }
    }
}
