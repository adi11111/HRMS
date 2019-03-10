using HRMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Services
{
   public interface IParticipantService : IBaseService<Participant>
    {
        bool UpdateParticipant(List<Participant> participants);
        List<Participant> CheckIfAppointmentExist(List<Participant> participants);
    }
}
