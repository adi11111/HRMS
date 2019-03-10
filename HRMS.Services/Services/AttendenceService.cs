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
   public class AttendenceService : BaseService<Attendence> , IAttendenceService
    {
        IUnitOfWork _uow;
        public AttendenceService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public List<Attendence> GetLastUpdatedAttendece()
        {

            //if(payslip.Count > 0)
            //{
            //    var _date = payslip.Max(p => p.Date);
            //    if (_date != null)
            //    {
            //        return _uow.Repository<Attendence>().Get(a => a.IsDeleted == false && a.AttendenceDate.Month > _date.Month).OrderByDescending(a=> a.EmployeeMaster.EmployeeName).ThenByDescending(a=>a.AttendenceDate).ToList();
            //    }
            //    else {
            //        return _uow.Repository<Attendence>().Get(a => a.IsDeleted == false).OrderByDescending(a => a.EmployeeMaster.EmployeeName).ThenByDescending(a => a.AttendenceDate).ToList();
            //    }
            //}



            var payslip = _uow.Repository<PaySlip>().Get();//.GroupBy(p=> p.EmployeeID).Select(p=> p.OrderByDescending(x=> x.Date).);
            if (payslip.Count > 0)
            {
                var _date = payslip.Max(p => p.Date);
                if (_date != null)
                {
                    return _uow.Repository<Attendence>().Get(a => a.IsDeleted == false && a.AttendenceDate.Month > _date.Month)
                    //.OrderByDescending(a => a.EmployeeMaster.EmployeeName)
                    .OrderByDescending(a => a.AttendenceDate).ToList();
                }
                else
                {
                    return _uow.Repository<Attendence>().Get(a => a.IsDeleted == false).OrderByDescending(a => a.EmployeeMaster.EmployeeName).ThenByDescending(a => a.AttendenceDate).ToList();
                }
            }



            return _uow.Repository<Attendence>().Get(a => a.IsDeleted == false).OrderByDescending(a => a.EmployeeMaster.EmployeeName).ThenByDescending(a => a.AttendenceDate).ToList();
            //return _uow.Repository<Attendence>().Get(a => a.IsDeleted == false && a.AttendenceDate.Month == _month)
            //.Select(a => new { a = a, LastMonth = _uow.Repository<Attendence>().Get().Max(at => at.AttendenceDate).Month })
            //.Where(a => a.a.AttendenceDate.Month == a.LastMonth)
            //.Select(a => a.a).ToList();
        }
        
    }
}
