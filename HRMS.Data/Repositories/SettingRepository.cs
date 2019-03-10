using HRMS.Core.Data.Repositories;
using HRMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Data.Repositories
{
   public class SettingRepository : ISettingRepository
    {
        private HRMSDbContext context;
        public SettingRepository(HRMSDbContext context)
        {
            this.context = context;
        }
        public dynamic GetNotificationByUserID(int userID)
        {
            var _user = context.UserMaster.FirstOrDefault(u => u.UserID == userID);
            List<Appointment> appointments = null;
            if (_user != null)
            {
                return context.SettingMaster
                  .GroupJoin(context.Appointment, s => s.AppointmentID, a => a.AppointmentID, (s, a) => new { s, a = a.DefaultIfEmpty() })
                  .SelectMany(sm => sm.a.Select(smd => new { sm.s, smd }))
                  .GroupJoin(context.Participant, ou => ou.smd.AppointmentID, part => part.AppointmentID, (ou, part) => new { ou, part = part.DefaultIfEmpty() })
                  .SelectMany(sm => sm.part.Select(smd => new { sm.ou, smd }))
                  .GroupJoin(context.DocumentDetail, s => s.ou.s.DocumentID, d => d.DocumentID, (s, d) => new { s, d = d.DefaultIfEmpty() })
                  .SelectMany(sm => sm.d.Select(smd => new { sm.s, smd }))
                  .Where(x => (x.s.smd.EmployeeID == _user.EmployeeID && x.s.ou.smd.AppointmentDate >= DateTime.Now && x.s.ou.s.IsPopUpRequired &&
                   x.s.ou.s.PopUpDays >= DbFunctions.DiffDays( DateTime.Now , x.s.ou.smd.AppointmentDate) &&
                    x.s.ou.smd.IsDeleted == false && x.s.smd.IsDeleted == false) ||
                   (x.smd.EmployeeID == _user.EmployeeID && x.smd.ExpiryDate >= DateTime.Now && x.smd.IsDeleted == false &&
                   x.s.ou.s.PopUpDays >= DbFunctions.DiffDays( DateTime.Now, x.smd.ExpiryDate) && x.s.ou.s.IsPopUpRequired))

                  //.GroupJoin(context.Set<SettingMaster>(), k => k.a.AppointmentID, s => s.AppointmentID, (k, s) => new { k, s })
                  //.Where(x => x.s.IsPopUpRequired && x.s.PopUpDays <= (DateTime.Compare(x.k.a.AppointmentDate, DateTime.Now)))
                  .Select(g => new { Appointment = g.s.ou.smd, DocumentDetail = g.smd }).ToList();









                //appointments = context.Set<Participant>()
                //.Join(context.Set<Appointment>(), p => p.AppointmentID, a => a.AppointmentID, (p, a) => new { p, a })
                //.Where(x => x.p.EmployeeID == _user.EmployeeID && x.a.AppointmentDate >= DateTime.Now)
                //.Join(context.Set<SettingMaster>(), k => k.a.AppointmentID, s => s.AppointmentID, (k, s) => new { k, s })
                //.Where(x => x.s.IsPopUpRequired && x.s.PopUpDays <= (DateTime.Compare(x.k.a.AppointmentDate, DateTime.Now)))
                //.Select(g => g.k.a ).ToList();
            }
            return appointments;
        }
    }
    
}
