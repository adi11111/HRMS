using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.Models;
using HRMS.WebUI.Common;
using HRMS.WebUI.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRMS.WebUI.Controllers
{
    [Authorize]
    [AccessAuthenticationFilter]
    public class AppointmentController : Controller
    {
        private IAppointmentService _appointmentService;
        private IParticipantService _participantService;

        public AppointmentController(IAppointmentService _appointmentService, IParticipantService _participantService)
        {
            this._appointmentService = _appointmentService;
            this._participantService = _participantService;
        }
        public ActionResult Index()
        {
            return View();
        }


        #region Appointment
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Appointment")]
        public ActionResult IsNameExists(int Id, string Name)
        {
            if (Response.StatusCode != 403)
            {
                var _name = Name.Split(':')[0];
                var _remarks = Name.Split(':')[1];
                var _result = false;
                if (Id > 0)
                {
                    if (_appointmentService.Get(at => at.AppointmentName.ToLower().Equals(_name.ToLower()) && at.Remarks.ToLower().Equals(_remarks.ToLower()) && at.AppointmentID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                else
                {
                    if (_appointmentService.Get(at => at.AppointmentName.ToLower().Equals(_name.ToLower()) && at.Remarks.ToLower().Equals(_remarks.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }

                return Json(_result);
            }
            return Json(false);
        }


        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Appointment")]
        public JsonResult AllAppointments()
        {
           // var date = DateTime.ParseExact(DateTime.Now.AddDays(-1).ToString(),
                                //"MM/dd/yyyy",
                                //System.Globalization.CultureInfo.InvariantCulture,
                                //System.Globalization.DateTimeStyles.None);
    
                var date =  DateTime.Now.AddMonths(-2);
            List<Appointment> _appointments;
            if ("AdminRole".GetConfigByKey<int>() == CurrentUser.UserRoleId)
            {
                _appointments = _appointmentService.Get(a => a.IsDeleted == false && a.AppointmentDate >= date).ToList();
                //_appointments = _participantService.Get(p => p.Appointment.IsDeleted == false).Select(p => p.Appointment).ToList();
            }
            else
            {
                var _appointmentParticipants = _participantService.Get (p => p.IsDeleted == false && p.EmployeeID == CurrentUser.EmployeeId).Select(p => p.AppointmentID).ToList();
                _appointments = _appointmentService.Get(a => a.IsDeleted == false && ( _appointmentParticipants.Contains(a.AppointmentID) || a.EmployeeID == CurrentUser.EmployeeId )).ToList();
                //_appointments = _participantService.Get(p => p.IsDeleted == false && p.Appointment.IsDeleted == false && (( p.Appointment.AppointmentID == p.AppointmentID && p.EmployeeID == CurrentUser.EmployeeId) || p.Appointment.EmployeeID == CurrentUser.EmployeeId )).Select(p => p.Appointment).Distinct().ToList();
            }
            //var _appointments = _appointmentService.Get(x => x.IsDeleted == false).ToList();
            List<AppointmentModel> _appointmentModel = Mapper.Map<List<Appointment>, List<AppointmentModel>>(_appointments);
            return Json(_appointmentModel, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Appointment")]
        public JsonResult AllAppointmentsWithOutParticipants()
        {
            var date = DateTime.Now.AddMonths(-2);
            var _appointments = _appointmentService.Get(x => x.IsDeleted == false && x.AppointmentDate >= date).ToList();
            //List<AppointmentModel> _appointmentModel = Mapper.Map<List<Appointment>, List<AppointmentModel>>(_appointments);
            return Json(_appointments, JsonRequestBehavior.AllowGet);
        }
        [NonAction]
        [HttpPost]

        public ActionResult CheckIfAppointmentExist(AppointmentModel appointment)
        {

            var _prevoiusAppointment = _appointmentService.Get(a => a.IsDeleted == false && a.StartTime >= appointment.StartTime
            || a.EndTime <= appointment.EndTime && a.AppointmentDate == appointment.AppointmentDate).FirstOrDefault();

            return Json(_prevoiusAppointment);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Appointment")]
        public ActionResult CreateAppointment(AppointmentModel appointment)
        {
            _appointmentService.Insert(new Appointment
            {
                AppointmentName = appointment.AppointmentName,
                AppointmentDate = appointment.AppointmentDate,
                EmployeeID = appointment.EmployeeID,
                CompanyID = appointment.CompanyID,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = appointment.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Appointment")]
        public JsonResult AppointmentById(int id)
        {
            return Json(_appointmentService.Get(x => x.AppointmentID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Appointment")]
        public JsonResult DeleteAppointment(int Id)
        {
            var _appointment = _appointmentService.Get(x => x.AppointmentID == Id).FirstOrDefault();
            if (_appointment != null)
            {
                _appointmentService.Update(new Appointment
                {
                    AppointmentID = Id,
                    AppointmentName = _appointment.AppointmentName,
                    AppointmentDate = _appointment.AppointmentDate,
                    Conclusion = _appointment.Conclusion,
                    EmployeeID = _appointment.EmployeeID,
                    CompanyID = _appointment.CompanyID,
                    StartTime = _appointment.StartTime,
                    EndTime = _appointment.EndTime,
                    CreatedByUserID = _appointment.CreatedByUserID,
                    CreatedDate = _appointment.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _appointment.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Appointment")]
        public JsonResult UpdateAppointment(AppointmentModel appointment)
        {
            var _appointment = _appointmentService.Get(x => x.AppointmentID == appointment.AppointmentID).FirstOrDefault();
            
            if (_appointment != null)
            {
                var _participants = _participantService.Get(p=>p.AppointmentID == _appointment.AppointmentID).ToList();
                _appointmentService.Update(new Appointment
                {
                    AppointmentID = appointment.AppointmentID,
                    AppointmentName = appointment.AppointmentName,
                    AppointmentDate = appointment.AppointmentDate,
                    EmployeeID = appointment.EmployeeID,
                    CompanyID = appointment.CompanyID,
                    StartTime = appointment.StartTime,
                    EndTime = appointment.EndTime,
                    Conclusion = appointment.Conclusion,
                    CreatedByUserID = _appointment.CreatedByUserID,
                    CreatedDate = _appointment.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = appointment.Remarks
                });
                if(appointment.Conclusion.Trim().Length > 0)
                {
                    foreach (var participant in _participants)
                    {
                        Utilities.SendEmail(
                        "Appointment Summary",
                        "Your Appointment (" + appointment.AppointmentName + ") on " + appointment.AppointmentDate.ToShortDateString() + "\n From: " + appointment.StartTime + "\n To: " + appointment.EndTime + "\n Concluded: " + appointment.Conclusion,
                        "SenderEmail".GetConfigByKey<string>(),
                        "SenderPassword".GetConfigByKey<string>(),
                        participant.Employee.Email
                        );
                    }
                }
            }
            return Json(true);
        }
        #endregion

        #region Participant

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Participant")]
        public JsonResult AllParticipants()
        {
            var _participants = _participantService.Get(x => x.IsDeleted == false).ToList();
            List<ParticipantModel> _participantModel = Mapper.Map<List<Participant>, List<ParticipantModel>>(_participants);
            return Json(_participantModel, JsonRequestBehavior.AllowGet);
        }
        
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Participant")]
        public JsonResult ParticipantById(int id)
        {
            return Json(_participantService.Get(x => x.ParticipantID == id).FirstOrDefault());
        }

        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Participant")]
        public JsonResult UpdateParticipant(List<ParticipantModel> participantsModel)
        {
           // var _appointmentID = participantsModel[0].AppointmentID;
            //var _previous = _participantService.Get(p => p.AppointmentID == _appointmentID && p.IsDeleted == false).ToList();
            List<Participant> _participants = Mapper.Map<List<ParticipantModel>, List<Participant>>(participantsModel);
            if (_participants[0].EmployeeID == 0)
            {
                _participantService.UpdateParticipant(_participants);
            }
           
            var _previousParticipants =  _participantService.CheckIfAppointmentExist(_participants);
            if(_previousParticipants.Count > 0)
            {
                return Json(_previousParticipants);
            }
            else 
            {
                var _documentReferenceID = "DocumentReferenceID".GetConfigByKey<int>();
                for (int i = 0; i < _participants.Count; i++)
                {
                    _participants[i].DocumentID = _documentReferenceID;
                    _participants[i].CreatedByUserID = CurrentUser.UserId;
                    _participants[i].CreatedDate = DateTime.Now;
                }
                _participantService.UpdateParticipant(_participants);
            }
            
            return Json(true);
        }

        #endregion

    }
}
