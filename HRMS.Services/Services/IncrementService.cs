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
   public class IncrementService : BaseService<Increment> , IIncrementService
    {
        IUnitOfWork _uow;
        public IncrementService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public override Increment Insert(Increment increment) 
        {
            var _salary = _uow.Repository<Salary>().Query(s => s.EmployeeID == increment.EmployeeID && s.IsInitial == false).FirstOrDefault();
            if(_salary != null)
            {
               increment =  _uow.Repository<Increment>().Insert(increment);
                _uow.Repository<Salary>().Update(new Salary
                {
                    SalaryID = _salary.SalaryID,
                    EmployeeID = _salary.EmployeeID,
                    Housing = _salary.Housing + increment.Housing,
                    Basic = _salary.Basic + increment.Basic,
                    Telephone = _salary.Telephone + increment.Telephone,
                    Transport = _salary.Transport + increment.Transport,
                    TotalSalary = _salary.TotalSalary + increment.TotalSalary,
                    OtherNumber =  _salary.OtherNumber +  increment.OtherNumber,
                    OtherText = _salary.OtherText,
                    IsDeleted = _salary.IsDeleted,
                    Remarks = _salary.Remarks,
                    CreatedByUserID = _salary.CreatedByUserID,
                    CreatedDate = _salary.CreatedDate,
                    UpdatedByUserID = increment.UpdatedByUserID,
                    UpdatedDate = increment.UpdatedDate
                });
            }
            
            _uow.Save();
            return increment;
        }

        public override void Update(Increment increment)
        {
            var _salary = _uow.Repository<Salary>().Query(s => s.EmployeeID == increment.EmployeeID && s.IsInitial == false).FirstOrDefault();
            
            if (_salary != null)
            {
                _uow.Repository<Increment>().Update(increment);
                var _previousIncrement = _uow.Repository<Increment>().Query(i => i.IncrementID == increment.IncrementID).FirstOrDefault();
                //increment.Basic = increment.Basic - _previousIncrement.Basic;
                //increment.Telephone = increment.Telephone - _previousIncrement.Telephone;
                //increment.Transport = increment.Transport - _previousIncrement.Transport;
                //increment.Housing = increment.Housing - _previousIncrement.Housing;
               
                _uow.Repository<Salary>().Update(new Salary
                {
                    SalaryID = _salary.SalaryID,
                    EmployeeID = _salary.EmployeeID,
                    Housing = _salary.Housing - _previousIncrement.Housing + increment.Housing,
                    Basic = _salary.Basic - _previousIncrement.Basic + increment.Basic,
                    Telephone = _salary.Telephone - _previousIncrement.Telephone + increment.Telephone,
                    Transport = _salary.Transport - _previousIncrement.Transport + increment.Transport,
                    TotalSalary = _salary.TotalSalary - _previousIncrement.TotalSalary + increment.TotalSalary,
                    OtherNumber = _salary.OtherNumber - _previousIncrement.OtherNumber + increment.OtherNumber,
                    OtherText = _salary.OtherText,
                    IsDeleted = _salary.IsDeleted,
                    Remarks = _salary.Remarks,
                    CreatedByUserID = _salary.CreatedByUserID,
                    CreatedDate = _salary.CreatedDate,
                    UpdatedByUserID = increment.UpdatedByUserID,
                    UpdatedDate = increment.UpdatedDate
                });
            }

            _uow.Save();
        }
        public  void Delete(Increment increment)
        {
            var _salary = _uow.Repository<Salary>().Query(s => s.EmployeeID == increment.EmployeeID && s.IsInitial == false).FirstOrDefault();
            if (_salary != null)
            {
                _uow.Repository<Increment>().Update(increment);
                _uow.Repository<Salary>().Update(new Salary
                {
                    SalaryID = _salary.SalaryID,
                    EmployeeID = _salary.EmployeeID,
                    Housing = _salary.Housing - increment.Housing,
                    Basic = _salary.Basic - increment.Basic,
                    Telephone = _salary.Telephone - increment.Telephone,
                    Transport = _salary.Transport - increment.Transport,
                    TotalSalary = _salary.TotalSalary - increment.TotalSalary,
                    OtherNumber = _salary.OtherNumber - increment.OtherNumber,
                    OtherText = _salary.OtherText,
                    IsDeleted = _salary.IsDeleted,
                    Remarks = _salary.Remarks,
                    CreatedByUserID = _salary.CreatedByUserID,
                    CreatedDate = _salary.CreatedDate,
                    UpdatedByUserID = increment.UpdatedByUserID,
                    UpdatedDate = increment.UpdatedDate
                });
            }

            _uow.Save();
        }
    }
}
