using HRMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Data.Repositories
{
   public interface IAppointmentRepository
    {
        List<Appointment> GetAppointmentByUserId(int userId, int adminRoleId);
    }
}
