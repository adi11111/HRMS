using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.Models;
using HRMS.WebUI.Common;
using HRMS.WebUI.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRMS.WebUI.Controllers
{
    [Authorize]
    public class LeaveController : Controller
    {
        private ILeaveStatusService _leaveStatusService;
        private ILeaveTypeService  _leaveTypeService;
        private ILeaveService _leaveService;
        private IAttendenceService _attendenceService;
        private IEmployeeService _employeeService;
       
        public LeaveController(ILeaveService _leaveService, ILeaveStatusService _leaveStatusService, ILeaveTypeService _leaveTypeService, IAttendenceService _attendenceService, IEmployeeService _employeeService)
        {
            this._leaveStatusService = _leaveStatusService;
            this._leaveTypeService = _leaveTypeService;
            this._leaveService = _leaveService;
            this._attendenceService = _attendenceService;
            this._employeeService = _employeeService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Leave")]
        public ActionResult IsNameExists(int Id,string Entity, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (Entity == "status")
                {
                    if (_leaveStatusService.Get(at => at.LeaveStatusName.Equals(Name.ToLower()) && at.LeaveStatusID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "type")
                {
                    if (_leaveTypeService.Get(at => at.LeaveTypeName.Equals(Name.ToLower()) && at.LeaveTypeID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "attendence")
                {
                    var _date = Name;
                    var _day = Convert.ToInt32(_date.Split('/')[0]);
                    var _month = Convert.ToInt32(_date.Split('/')[1]);
                    var _year = Convert.ToInt32(_date.Split('/')[2]);
                    var _leaveStatusID = "ApprovedLeaveStatusID".GetConfigByKey<int>();
                    if (_leaveService.Get(at => (at.FromDate <= new DateTime(_year,_month,_day) && at.ToDate >= new DateTime(_year, _month, _day)) && at.EmployeeID == Id && at.IsDeleted == false && at.LeaveStatusID == _leaveStatusID).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            else
            {
                if (Entity == "status")
                {
                    if (_leaveStatusService.Get(at => at.LeaveStatusName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "type")
                {
                    if (_leaveTypeService.Get(at => at.LeaveTypeName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }

        #region Leave



        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "LeaveApplication")]
        public JsonResult AllLeaves()
        {
            List<Leave> _leaves = null;
            var _employees = _employeeService.Get(x => x.IsDeleted == false).ToList();
            if (CurrentUser.UserRoleId == "AdminRole".GetConfigByKey<int>() || CurrentUser.UserRoleId == "HRRole".GetConfigByKey<int>() || CurrentUser.UserRoleId == "GMRole".GetConfigByKey<int>())
            {
                _leaves = _leaveService.Get(x => x.IsDeleted == false).ToList();
            }
            else
            {
                _leaves = _leaveService.Get(x => (x.EmployeeMaster.ReportingToID == CurrentUser.EmployeeId || x.EmployeeID == CurrentUser.EmployeeId) && x.IsDeleted == false).ToList();
            }
            var _leaveModel = Utilities.GetPendingLeaves(_leaves, _employees);
            return Json(_leaveModel.OrderByDescending(x=>x.LeaveID), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "LeaveApplication")]
        public ActionResult CreateLeave(LeaveModel leave)
        {
            if (ModelState.IsValid)
            {
                //Byte[] bytes = Convert.FromBase64String(leave.LeaveDocumentPath.Substring((leave.LeaveDocumentPath.IndexOf(',') + 1)));
                //System.IO.File.WriteAllBytes(Server.MapPath("~/Content/Documents/Leave/" + leave.FileName ),bytes);
        
                _leaveService.Insert(new Leave
                {
                    EmployeeID = leave.EmployeeID,
                    LeaveTypeID = leave.LeaveTypeID,
                    LeaveStatusID = leave.LeaveStatusID,
                    Date = leave.Date,
                    ToDate = leave.ToDate,
                    FromDate = leave.FromDate,
                    LeaveBalance = leave.LeaveBalance,
                    LeaveDocumentPath = "-",
                    TotalLeaveDays = leave.TotalLeaveDays,
                    CreatedByUserID = CurrentUser.UserId,
                    CreatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = leave.Remarks
                });
            }
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "LeaveApplication")]
        public JsonResult LeaveById(int id)
        {
            return Json(_leaveService.Get(x => x.LeaveID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "LeaveApplication")]
        public JsonResult DeleteLeave(int Id)
        {
            var _leave = _leaveService.Get(x => x.LeaveID == Id).FirstOrDefault();
            if (_leave != null)
            {
                _leaveService.Update(new Leave
                {
                    LeaveID = Id,
                    EmployeeID = _leave.EmployeeID,
                    LeaveTypeID = _leave.LeaveTypeID,
                    LeaveStatusID = _leave.LeaveStatusID,
                    Date = _leave.Date,
                    ToDate = _leave.ToDate,
                    FromDate = _leave.FromDate,
                    LeaveBalance = _leave.LeaveBalance,
                    LeaveDocumentPath = _leave.LeaveDocumentPath,
                    TotalLeaveDays = _leave.TotalLeaveDays,
                    CreatedByUserID = _leave.CreatedByUserID,
                    CreatedDate = _leave.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _leave.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "LeaveApplication")]
        public JsonResult UpdateLeave(LeaveModel leave)
        {
            var _leave = _leaveService.Get(x => x.LeaveID == leave.LeaveID).FirstOrDefault();
            if (_leave != null)
            {
             var _fileName = "-";

                //if (leave.LeaveDocumentPath.Contains("base64"))
                //{
                //    Byte[] bytes = Convert.FromBase64String(leave.LeaveDocumentPath.Substring((leave.LeaveDocumentPath.IndexOf(',') + 1)));
                //    System.IO.File.WriteAllBytes(Server.MapPath("~/Content/Documents/Leave/" + leave.FileName), bytes);
                //    _fileName = leave.FileName;
                //}
                //else
                //     {
                //         _fileName = _leave.LeaveDocumentPath;
                //     }
                UpdateLeaveData(_leave,leave);
                _leaveService.Update(new Leave
                {
                    LeaveID = leave.LeaveID,
                    EmployeeID = leave.EmployeeID,
                    LeaveTypeID = leave.LeaveTypeID,
                    LeaveStatusID = leave.LeaveStatusID,
                    Date = leave.Date,
                    ToDate = leave.ToDate,
                    FromDate = leave.FromDate,
                    LeaveBalance = leave.LeaveBalance,
                    LeaveDocumentPath = _fileName,
                    TotalLeaveDays = leave.TotalLeaveDays,
                    CreatedByUserID = _leave.CreatedByUserID,
                    CreatedDate = _leave.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = leave.Remarks
                });
            }
            return Json(true);
        }

        public void UpdateLeaveData(Leave _leave,LeaveModel leave)
        {
            if (_leave.LeaveStatusID == "ApprovedLeaveStatusID".GetConfigByKey<int>())
            {
                List<Attendence> _attendence = new List<Attendence>();
                for (int i = 0; i < leave.TotalLeaveDays; i++)
                {
                    var _date = leave.FromDate.AddDays(i);
                    if (_attendenceService.Get(at => at.AttendenceDate == _date && at.EmployeeID == leave.EmployeeID).ToList().Count == 0)
                    {
                        _attendence.Add(new Attendence
                        {
                            AttendenceDate = DateTime.Now,
                            TimeIn = new TimeSpan(0, 0, 0),
                            TimeOut = new TimeSpan(0, 0, 0),
                            TotalWorkingHours = new TimeSpan(0, 0, 0),
                            DailyWorkingHours = new TimeSpan(0, 0, 0),
                            EmployeeID = leave.EmployeeID,
                            StatusID = "AbsentAttendenceStatusID".GetConfigByKey<int>(),
                            CreatedByUserID = CurrentUser.UserId,
                            CreatedDate = DateTime.Now,
                            IsDeleted = false,
                            Remarks = "On Leave"
                        });
                    }
                }
                if (_attendence.Count > 0)
                {
                    _attendenceService.AddRange(_attendence);
                }
            }

            //if (leave.LeaveStatusID == "ApprovedLeaveStatusID".GetConfigByKey<int>())
            //{
            //    var _employee = _employeeService.Get(e => e.EmployeeID == leave.EmployeeID && e.IsDeleted == false).FirstOrDefault();
            //    if (_employeeService != null)
            //    {
            //        _employeeService.Update(new EmployeeMaster
            //        {
            //            EmployeeID = _employee.EmployeeID,
            //            AttendenceReferenceID = _employee.AttendenceReferenceID,
            //            AccountNumber = _employee.AccountNumber,
            //            AccountTypeID = _employee.AccountTypeID,
            //            BankID = _employee.BankID,
            //            CompanyID = _employee.CompanyID,
            //            ContactPersonName = _employee.ContactPersonName,
            //            ContactPersonRelationship = _employee.ContactPersonRelationship,
            //            DepartmentID = _employee.DepartmentID,
            //            DesignationID = _employee.DesignationID,
            //            DOB = _employee.DOB,
            //            ReportingToID = _employee.ReportingToID,
            //            ActualDOB = _employee.ActualDOB,
            //            WeeklyOff = _employee.WeeklyOff,
            //            Email = _employee.Email,
            //            FamilyContactNumber = _employee.FamilyContactNumber,
            //            Gender = _employee.Gender,
            //            InternationalContactNumber = _employee.InternationalContactNumber,
            //            JoiningDate = _employee.JoiningDate,
            //            MigratedLeaveBalance = leave.RemainingLeaveDays,
            //            MedicalHistory = _employee.MedicalHistory,
            //            MobileNumber = _employee.MobileNumber,
            //            NationalityID = _employee.NationalityID,
            //            PhoneNumber = _employee.PhoneNumber,
            //            PhotoPath = "-",
            //            QualificationDescription = _employee.QualificationDescription,
            //            QualificationType = _employee.QualificationType,
            //            Address = _employee.Address,
            //            CountryID = _employee.CountryID,
            //            RegionID = _employee.RegionID,
            //            ShiftID = _employee.ShiftID,
            //            StaffID = _employee.StaffID,
            //            Status = _employee.Status,
            //            EmployeeName = _employee.EmployeeName,
            //            CreatedByUserID = _employee.CreatedByUserID,
            //            CreatedDate = _employee.CreatedDate,
            //            UpdatedByUserID = CurrentUser.UserId,
            //            UpdatedDate = DateTime.Now,
            //            IsDeleted = false,
            //            Remarks = _employee.Remarks
            //        });
            //    }
            //}
        }
        #endregion
        

        #region Leave Types

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "LeaveType")]
        public JsonResult AllLeaveTypes()
        {
            var _leaveTypes = _leaveTypeService.Get(x => x.IsDeleted == false).ToList();
            List<LeaveTypeModel> _leaveTypeModel = Mapper.Map<List<LeaveType>, List<LeaveTypeModel>>(_leaveTypes);
            return Json(_leaveTypeModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "LeaveType")]
        public ActionResult CreateLeaveType(LeaveTypeModel leaveType)
        {
            _leaveTypeService.Insert(new LeaveType
            {
                LeaveTypeName = leaveType.LeaveTypeName,
                TotalLeaveDays = leaveType.TotalLeaveDays,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = leaveType.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "LeaveType")]
        public JsonResult LeaveTypeById(int id)
        {
            return Json(_leaveTypeService.Get(x => x.LeaveTypeID == id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "LeaveType")]
        public JsonResult DeleteLeaveType(int Id)
        {
            var _leaveType = _leaveTypeService.Get(x => x.LeaveTypeID == Id).FirstOrDefault();
            if (_leaveType != null)
            {
                _leaveTypeService.Update(new LeaveType
                {
                    LeaveTypeID = Id,
                    LeaveTypeName = _leaveType.LeaveTypeName,
                    TotalLeaveDays = _leaveType.TotalLeaveDays,
                    CreatedByUserID = _leaveType.CreatedByUserID,
                    CreatedDate = _leaveType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _leaveType.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "LeaveType")]
        public JsonResult UpdateLeaveType(LeaveTypeModel leaveType)
        {
            var _leaveType = _leaveTypeService.Get(x => x.LeaveTypeID == leaveType.LeaveTypeID).FirstOrDefault();
            if (_leaveType != null)
            {
                _leaveTypeService.Update(new LeaveType
                {
                    LeaveTypeID = leaveType.LeaveTypeID,
                    LeaveTypeName = leaveType.LeaveTypeName,
                    TotalLeaveDays = leaveType.TotalLeaveDays,
                    CreatedByUserID = _leaveType.CreatedByUserID,
                    CreatedDate = _leaveType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = leaveType.Remarks
                });
            }
            return Json(true);
        }

        #endregion


        #region Leave Status

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "LeaveStatus")]
        public JsonResult AllLeaveStatus()
        {
            var _leaveStatus = _leaveStatusService.Get(x => x.IsDeleted == false).ToList();
            List<LeaveStatusModel> _leaveStatusModel = Mapper.Map<List<LeaveStatus>, List<LeaveStatusModel>>(_leaveStatus);
            return Json(_leaveStatusModel, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "LeaveStatus")]
        public ActionResult CreateLeaveStatus(LeaveStatusModel leaveStatus)
        {
            _leaveStatusService.Insert(new LeaveStatus
            {
                LeaveStatusName = leaveStatus.LeaveStatusName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = leaveStatus.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "LeaveStatus")]
        public JsonResult LeaveStatusById(int Id)
        {
            return Json(_leaveStatusService.Get(x => x.LeaveStatusID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "LeaveStatus")]
        public JsonResult DeleteLeaveStatus(int Id)
        {
            var _leaveStatus = _leaveStatusService.Get(x => x.LeaveStatusID == Id).FirstOrDefault();
            if (_leaveStatus != null)
            {
                _leaveStatusService.Update(new LeaveStatus
                {
                    LeaveStatusID = Id,
                    LeaveStatusName = _leaveStatus.LeaveStatusName,
                    CreatedByUserID = _leaveStatus.CreatedByUserID,
                    CreatedDate = _leaveStatus.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _leaveStatus.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "LeaveStatus")]
        public JsonResult UpdateLeaveStatus(LeaveStatusModel leaveStatus)
        {
            var _leaveStatus = _leaveStatusService.Get(x => x.LeaveStatusID == leaveStatus.LeaveStatusID).FirstOrDefault();
            if (_leaveStatus != null)
            {
                _leaveStatusService.Update(new LeaveStatus
                {
                    LeaveStatusID = leaveStatus.LeaveStatusID,
                    LeaveStatusName = leaveStatus.LeaveStatusName,
                    CreatedByUserID = _leaveStatus.CreatedByUserID,
                    CreatedDate = _leaveStatus.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = leaveStatus.Remarks
                });
            }
            return Json(true);
        }

        #endregion
        
    }
}
