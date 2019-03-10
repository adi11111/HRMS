using HRMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Data.Repositories
{
  public  class AppointmentRepository
    {
        private HRMSDbContext context;
        public AppointmentRepository(HRMSDbContext context)
        {
            this.context = context;
        }
        public List<Appointment> GetAppointmentByUserId(int userId, int adminRoleId,bool isAdmin)
        {
            List<Appointment> _appointments = new List<Appointment>();
            //var date = DateTime.Now.AddMonths(-2);
            //if (isAdmin)
            //{
            //    _appointments = context.Appointment.Where(a=> a.IsDeleted == false && a.AppointmentDate >= date).ToList();
            //    //_appointments = _appointmentService.Get(a => a.IsDeleted == false && a.AppointmentDate >= date).ToList();
            //    //_appointments = _participantService.Get(p => p.Appointment.IsDeleted == false).Select(p => p.Appointment).ToList();
            //}
            //else
            //{
            //    _appointments = context.Appointment.GroupJoin(context.Participant,a=>a.AppointmentID,p=>p.ParticipantID,(a,p) => new { a, p })
            //    .SelectMany(s=> s.p.DefaultIfEmpty(),(s,aps) => new {s.a,s.p,aps })    



            //    _appointments = _participantService.Get(p => p.IsDeleted == false && p.Appointment.IsDeleted == false && ((p.Appointment.AppointmentID == p.AppointmentID && p.EmployeeID == CurrentUser.EmployeeId) || p.Appointment.EmployeeID == CurrentUser.EmployeeId)).Select(p => p.Appointment).Distinct().ToList();
            //}
            return _appointments;
        }
    }
}
