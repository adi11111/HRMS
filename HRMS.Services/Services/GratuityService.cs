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
   public class GratuityService : BaseService<Gratuity> , IGratuityService
    {

        IUnitOfWork _uow;
        public GratuityService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public List<Gratuity> GenerateReport(int companyId,DateTime settlementDate)
        {
            var _salaries = _uow.Repository<Salary>().Get(s => s.IsDeleted == false && s.IsInitial == false && s.EmployeeMaster.CompanyID == companyId).ToList();
            var _graduitySetting = _uow.Repository<GraduitySetting>().Get(g => g.IsDeleted == false && g.CompanyID == companyId).FirstOrDefault();
            //var _approvedLeaveStatusID = "ApprovedLeaveStatusID".GetConfigByKey<int>();
            //var _leaves = _leaveService.Get(x => x.IsDeleted == false && x.LeaveStatusID == _approvedLeaveStatusID).ToList();
            var _leaves = new List<Leave>();
            var _gratuities = new List<Gratuity>();
            if (_salaries != null)
            {
                for (int i = 0; i < _salaries.Count; i++)
                {
                    var _employee = _salaries[i].EmployeeMaster;
                    if(_employee.Status == "Active")
                    {
                        float _graduity = CalculateGratuity(_graduitySetting, _salaries[i], _salaries[i].Basic, settlementDate.Year, settlementDate.Month, settlementDate.Day);
                        _gratuities.Add(new Gratuity
                        {
                            GratuityAmount = Convert.ToDecimal(_graduity),
                            EmployeeID = _employee.EmployeeID,
                            SettlementDate = settlementDate,
                            TotalWorkingDays = (settlementDate - _employee.JoiningDate).Days + 1,
                            Employee = _employee,
                            IsDeleted = false
                        });
                    }
                }
            }
            return _gratuities;
        }
        public bool ProcessGratuity(List<Gratuity> gratuities)
        {
            _uow.Repository<Gratuity>().AddRange(gratuities);
            var _employees = _uow.Repository<EmployeeMaster>().Get(dd => dd.IsDeleted == false).ToList();
            for (int i = 0; i < gratuities.Count; i++)
            {
                var _employee = _employees.FirstOrDefault(e=> e.EmployeeID == gratuities[i].EmployeeID);
                _employee.Status = "InActive";
                _uow.Repository<EmployeeMaster>().Update(_employee);
            }
            _uow.Save();
            return true;
        }
    }
}
