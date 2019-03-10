using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Core.Services;
using HRMS.Core.Entities.Foundation;
using HRMS.Core.Data;
using HRMS.Core.Entities;
using System.Data.SqlClient;
//using HRMS.Services.Services;

namespace HRMS.Services.Services
{
   public class AppointmentService : BaseService<Appointment> , IAppointmentService 
    {
        IUnitOfWork _uow;
        public AppointmentService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }

        //public List<Appointment> GetAppointmentByUserId(int userId, int adminRoleId)
        //{
        //    //_uow.Repository<Participant>().Get(p => p.IsDeleted == false && p.Appointment.IsDeleted == false && p.Appointment.AppointmentID == p.AppointmentID && p.UserID == userId)

        //    //_uow.Repository<Participant>().Get(p => p.IsDeleted == false)
        //    //.Join(_uow.Repository<Appointment>().Get(a => a.IsDeleted == false), p => p.AppointmentID, a => a.AppointmentID, (p, a) => new { p, a })
        //    //.Where(x => x.p.UserID == userId || x.p.User.UserRoleID == adminRoleId);
        //}
    }
}
