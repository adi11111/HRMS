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
using System.Configuration;
//using HRMS.Services.Services;

namespace HRMS.Services.Services
{
   public class ParticipantService : BaseService<Participant> , IParticipantService
    {
        IUnitOfWork _uow;
        public ParticipantService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }

        public bool UpdateParticipant(List<Participant> participants)
        {
            var _appointmentReferenceID = Convert.ToInt32( ConfigurationManager.AppSettings["AppointmentReferenceID"]);
            if (participants[0].EmployeeID == 0)
            {
            if(participants[0].AppointmentID == _appointmentReferenceID)
                {
                    _uow.Repository<Participant>().ExecSqlQuery("update participants set isdeleted = 1 where documentid =" + participants[0].DocumentID);
                }
                else
                {
                    _uow.Repository<Participant>().ExecSqlQuery("update participants set isdeleted = 1 where appointmentid =" + participants[0].AppointmentID);
                }
                
            }
            else 
            {
                var _ID = participants[0].AppointmentID;
                var _previousParticipants = new List<Participant>();
                if (participants[0].AppointmentID == _appointmentReferenceID)
                {
                    _ID = participants[0].DocumentID;
                    _previousParticipants = _uow.Repository<Participant>().Get(p => p.DocumentID == _ID && p.IsDeleted == false).ToList();
                }
                else 
                {
                    _previousParticipants = _uow.Repository<Participant>().Get(p => p.AppointmentID == _ID && p.IsDeleted == false).ToList();
                }
               
                if(_previousParticipants.Count > 0)
                {
                    for (int i = 0; i < _previousParticipants.Count; i++)
                    {
                        _uow.Repository<Participant>().Delete(_previousParticipants[i].ParticipantID);
                    }
                    _uow.Save();
                }
            
                //for (int i = 0; i < participants.Count; i++)
                //{
                    _uow.Repository<Participant>().AddRange(participants);
               // }
                _uow.Save();
            }
            return true;
        }
        public List<Participant> CheckIfAppointmentExist(List<Participant> participants)
        {
            SqlParameter appointmentID = new SqlParameter("appointmentID", System.Data.SqlDbType.Int);
            appointmentID.Value = participants[0].AppointmentID;
            var _previousParticipants = _uow.Repository<Participant>().ExecSql("Participant_GetByAppointment @appointmentID", appointmentID).ToList();
            var _existingParticipants = new List<Participant>();
            for (int i = 0; i < _previousParticipants.Count; i++)
            {
                if (participants.Any(p => p.EmployeeID == _previousParticipants[i].EmployeeID))
                {
                    _existingParticipants.Add(_previousParticipants[i]);
                }
            }
            return _existingParticipants;
        }
    }
}
