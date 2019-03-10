using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.Models;
using HRMS.WebUI.Common;
using HRMS.WebUI.Filters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Data.Entity;

namespace HRMS.WebUI.Controllers
{
    [Authorize]
    public class AttendenceController : Controller
    {
        //private IUserAccessDetailService _userAccessService;
        private IAttendenceService _attendenceService;
        private IAttendenceStatusService _attendenceStatusService;
        private IShiftService _shiftService;
        private IEmployeeService _employeeService;
        private IPayslipService _payslipService;
        private IPublicHolidayService _publicHolidayService;
        private ILeaveService _leaveService;
        public AttendenceController(IAttendenceService _attendenceService, IAttendenceStatusService _attendenceStatusService,IShiftService _shiftService,IEmployeeService _employeeService, IPublicHolidayService _publicHolidayService,IPayslipService _payslipService, ILeaveService _leaveService)
        {
            this._attendenceStatusService = _attendenceStatusService;
            this._attendenceService = _attendenceService;
            this._shiftService = _shiftService;
            this._employeeService = _employeeService;
            this._payslipService = _payslipService;
            this._publicHolidayService = _publicHolidayService;
            this._leaveService = _leaveService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Attendence")]
        public ActionResult IsNameExists(int Id,string Entity,string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (Entity == "status")
                {
                    if (_attendenceStatusService.Get(at => at.AttendenceStatusName.Equals(Name.ToLower()) && at.AttendenceStatusID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "shift")
                {
                    if (_shiftService.Get(at => at.ShiftName.Equals(Name.ToLower()) && at.ShiftID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "attendence")
                {
                    var _date = Name.Split(':')[0].Split('/');
                    var _employeeId = Convert.ToInt32(Name.Split(':')[1]);
                    var _day = Convert.ToInt32(_date[0]);
                    var _month = Convert.ToInt32(_date[1]);
                    var _year = Convert.ToInt32(_date[2]);
                    if (_attendenceService.Get(at => at.AttendenceDate == new DateTime(_year, _month, _day) && at.AttendenceID != Id && at.EmployeeID == _employeeId && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            else
            {
                if (Entity == "status")
                {
                    if (_attendenceStatusService.Get(at => at.AttendenceStatusName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "shift")
                {
                    if (_shiftService.Get(at => at.ShiftName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "attendence")
                {
                    var _date = Name.Split(':')[0].Split('/');
                    var _employeeId = Convert.ToInt32(Name.Split(':')[1]);
                    var _day = Convert.ToInt32(_date[0]);
                    var _month = Convert.ToInt32(_date[1]);
                    var _year = Convert.ToInt32(_date[2]);
                    if (_attendenceService.Get(at => at.AttendenceDate == new DateTime(_year,_month,_day) && at.EmployeeID == _employeeId && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }

        #region Attendence 

        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Attendence")]
        public ActionResult UploadAttendence(string attendenceFile) 
        {
            var _dtAttendence = InsertDateInAttendence(Utilities.ConvertCSVtoDataTable(attendenceFile.Substring((attendenceFile.IndexOf(',') + 1))));
            var _employees = _employeeService.Get(e => e.IsDeleted == false).ToList();
            
            List<Attendence> _attendence = new List<Attendence>();
            var _previousAttendence = _attendenceService.Get(at => at.IsDeleted == false && at.AttendenceDate.Month == Convert.ToDateTime( _dtAttendence.Rows[1]["Date"]).Month).ToList();
            for (int i = 0; i < _dtAttendence.Rows.Count; i++)
            {
                if(Convert.ToInt32(_dtAttendence.Rows[i]["IsDeleted"]) != 1)
                {
                    var _employee = _employees.SingleOrDefault(e => e.AttendenceReferenceID == Newtonsoft.Json.JsonConvert.DeserializeObject<int>(_dtAttendence.Rows[i][0].ToString()));
                    if(_employee != null)
                    {
                        var _timeIn = TimeSpan.Parse(_dtAttendence.Rows[i][4].ToString());
                        if(_timeIn.ToString().Contains(@"\"))
                        {
                            _timeIn = Newtonsoft.Json.JsonConvert.DeserializeObject<TimeSpan>(_dtAttendence.Rows[i][4].ToString());
                        }
                        var _timeOut = TimeSpan.Parse(_dtAttendence.Rows[i][5].ToString());
                        if(_timeOut.ToString().Contains(@"\"))
                        {
                            _timeOut = Newtonsoft.Json.JsonConvert.DeserializeObject<TimeSpan>(_dtAttendence.Rows[i][5].ToString());
                        }
                        var _dailyWorkingHours = _employee.ShiftMaster.TotalWorkingHours;
                        var _totalWorkingHours = _timeOut - _timeIn;
                        var _status = GetAttendenceStatus(_employee, _timeIn, _timeOut, _dailyWorkingHours, _totalWorkingHours);
                        var _date = DateTime.Parse(_dtAttendence.Rows[i]["Date"].ToString());
                        if(_date.ToString().Contains(@"\"))
                        {
                            _date = Newtonsoft.Json.JsonConvert.DeserializeObject<DateTime>(_dtAttendence.Rows[i]["Date"].ToString());
                        }
                        if(_previousAttendence.Where(at=>  at.AttendenceDate == _date).Count() == 0)
                        {
                            _attendence.Add(new Attendence
                            {
                                AttendenceDate = _date,
                                TimeIn = _timeIn,
                                TimeOut = _timeOut,
                                EmployeeID = _employee.EmployeeID,
                                TotalWorkingHours = _totalWorkingHours,
                                DailyWorkingHours = _dailyWorkingHours,
                                CreatedByUserID = CurrentUser.UserId,
                                CreatedDate = DateTime.Now,
                                StatusID = _status,
                                IsDeleted = false
                            });
                        }
                    }
                }
            }
            _attendenceService.AddRange(_attendence);
            return Json(true);
        }

        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Attendence")]
        public ActionResult BulkAttendence(List<int> employees, DateTime date)
        {
            if(employees.Count > 0)
            {

            var _month = Convert.ToInt32( date.ToString().Split('/')[1]);
            var _employees = _employeeService.Get(e => e.IsDeleted == false && employees.Contains(e.EmployeeID)).ToList();
            List<Attendence> _attendence = new List<Attendence>();
            var _previousAttendence = _attendenceService.Get(at => at.IsDeleted == false && at.AttendenceDate.Month == _month).ToList();
            var _weekends = Utilities.GetNumberOfWeekendDays(new DateTime(date.Year, _month, 1), new DateTime(date.Year, _month, 1).AddMonths(1).AddDays(-1))
            .Select(x=>x.Day).ToList();
                var _companyId = _employees[0].CompanyID;
            var _publicHolidays = _publicHolidayService.Get(p => p.IsDeleted == false && p.Date.Month == _month && p.CompanyID == _companyId).Select(p => p.Date.Day).ToList();
            //var _leaves = _leaveService.Get(l=> l.FromDate)
            
            var _totalHolidays = new List<int>();
            _totalHolidays.AddRange(_weekends);
            _totalHolidays.AddRange(_publicHolidays);
                for (int k = 1; k <= DateTime.DaysInMonth(date.Year, _month); k++)
            {
                for (int i = 0; i < _employees.Count; i++)
                {
                    var _date = new DateTime(date.Year, _month, k);
                    if (_previousAttendence.Count(at => at.AttendenceDate == _date && at.EmployeeID == _employees[i].EmployeeID) < 1)
                    {
                        
                        // public holidays and weekends will be marked as abscent and all other days would get the normal attendence entry.
                        if (_totalHolidays.Contains(k))
                        {
                            _attendence.Add(new Attendence
                            {
                                AttendenceDate = _date,
                                TimeIn = new TimeSpan(0,0,0),
                                TimeOut = new TimeSpan(0, 0, 0),
                                EmployeeID = _employees[i].EmployeeID,
                                TotalWorkingHours = new TimeSpan(0, 0, 0),
                                DailyWorkingHours = _employees[i].ShiftMaster.TotalWorkingHours,
                                CreatedByUserID = CurrentUser.UserId,
                                CreatedDate = DateTime.Now,
                                StatusID = GetAttendenceStatus(_employees[i], new TimeSpan(0, 0, 0), new TimeSpan(0, 0, 0), _employees[i].ShiftMaster.TotalWorkingHours, new TimeSpan(0, 0, 0)),
                                IsDeleted = false
                            });
                        }
                        else 
                        {
                            _attendence.Add(new Attendence
                            {
                                AttendenceDate = _date,
                                TimeIn = _employees[i].ShiftMaster.StartTime,
                                TimeOut = _employees[i].ShiftMaster.EndTime,
                                EmployeeID = _employees[i].EmployeeID,
                                TotalWorkingHours = _employees[i].ShiftMaster.EndTime - _employees[i].ShiftMaster.StartTime,
                                DailyWorkingHours = _employees[i].ShiftMaster.TotalWorkingHours,
                                CreatedByUserID = CurrentUser.UserId,
                                CreatedDate = DateTime.Now,
                                StatusID = GetAttendenceStatus(_employees[i], _employees[i].ShiftMaster.StartTime, _employees[i].ShiftMaster.EndTime, _employees[i].ShiftMaster.TotalWorkingHours, _employees[i].ShiftMaster.EndTime - _employees[i].ShiftMaster.StartTime),
                                IsDeleted = false
                            });
                        }
                    }
                }
            }
            if(_attendence.Count > 0)
            {
                _attendenceService.AddRange(_attendence);
                return Json(true);
            }

            }
            return Json(false);
        }
        
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Attendence")]
        public JsonResult AllAttendences()
        {
            var _attendences = _attendenceService.GetLastUpdatedAttendece();
            var _attendenceModel = Mapper.Map<List<Attendence>, List<AttendenceModel>>(_attendences);
            var result = Json(_attendenceModel,
                 JsonRequestBehavior.AllowGet);
                 result.MaxJsonLength = int.MaxValue;
                 return result;
            //var serializer = new JavaScriptSerializer();
            //// For simplicity just use Int32's max value
            //// You could always read the value from the config section mentioned above.
            //serializer.MaxJsonLength = Int32.MaxValue;
            //var result = new ContentResult
            //{
            //    Content = serializer.Serialize(_attendenceModel),
            //    ContentType = "application/json"
            //};
            //return result;
            //return Json(_attendenceModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Attendence")]
        public ActionResult CreateAttendence(AttendenceModel attendence)
        {
            //var _payslip = _payslipService.Get();
            //if(_payslip != null && _payslip.Count > 0)
            //{
                //var _lastProcessedPayslipMonth = _payslip.Max(p => p.Date).Month;
                //if (_lastProcessedPayslipMonth < attendence.AttendenceDate.Month)
                //{
                    _attendenceService.Insert(new Attendence
                    {
                        AttendenceDate = attendence.AttendenceDate,
                        TimeIn = attendence.TimeIn,
                        TimeOut = attendence.TimeOut,
                        TotalWorkingHours = attendence.TotalWorkingHours,
                        DailyWorkingHours = attendence.DailyWorkingHours,
                        EmployeeID = attendence.EmployeeID,
                        StatusID = attendence.StatusID,
                        CreatedByUserID = CurrentUser.UserId,
                        CreatedDate = DateTime.Now,
                        IsDeleted = false,
                        Remarks = attendence.Remarks
                    });
                    return Json(true);
            //    }
            //    else
            //    {
            //        return Json("");
            //    }
            //}
            //else 
            //{
            //    return Json("");
            //}
            
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Attendence")]
        public JsonResult AttendenceById(int id)
        {
            return Json(_attendenceService.Get(x => x.AttendenceID == id && x.IsDeleted == false).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Attendence")]
        public JsonResult DeleteAttendence(int Id)
        {
            var _attendence = _attendenceService.Get(x => x.AttendenceID == Id && x.IsDeleted == false).FirstOrDefault();
            if (_attendence != null)
            {
                _attendenceService.Update(new Attendence
                {
                    AttendenceID = Id,
                    AttendenceDate = _attendence.AttendenceDate,
                    TimeIn = _attendence.TimeIn,
                    TimeOut = _attendence.TimeOut,
                    TotalWorkingHours = _attendence.TotalWorkingHours,
                    DailyWorkingHours = _attendence.DailyWorkingHours,
                    EmployeeID = _attendence.EmployeeID,
                    StatusID = _attendence.StatusID,
                    CreatedByUserID = CurrentUser.UserId,
                    CreatedDate = DateTime.Now,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _attendence.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Attendence")]
        public JsonResult UpdateAttendence(AttendenceModel attendence)
        {
            var _attendence = _attendenceService.Get(x => x.AttendenceID == attendence.AttendenceID && x.IsDeleted == false).FirstOrDefault();
            if (_attendence != null)
            {
                _attendenceService.Update(new Attendence
                {
                    AttendenceID = _attendence.AttendenceID,
                    AttendenceDate = attendence.AttendenceDate,
                    TimeIn = attendence.TimeIn,
                    TimeOut = attendence.TimeOut,
                    TotalWorkingHours = attendence.TotalWorkingHours,
                    DailyWorkingHours = attendence.DailyWorkingHours,
                    EmployeeID = attendence.EmployeeID,
                    StatusID = attendence.StatusID,
                    CreatedByUserID = _attendence.CreatedByUserID,
                    CreatedDate = _attendence.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = _attendence.Remarks
                });
            }
            return Json(true);
        }

        [NonAction]
        public int GetAttendenceStatus(EmployeeMaster _employee, TimeSpan _timeIn, TimeSpan _timeOut, TimeSpan _dailyWorkingHours, TimeSpan _totalWorkingHours)
        {
            var _status = -1;
            var _attendenceStatus = _attendenceStatusService.Get(x => x.IsDeleted == false).ToList();
            if (_dailyWorkingHours <= _totalWorkingHours)
            {
                _status = _attendenceStatus.FirstOrDefault(x => x.AttendenceStatusName.ToLower().Equals("normal")).AttendenceStatusID;
            }
            else
            {
                if (_timeIn == new TimeSpan(0, 0, 0) || _timeOut == new TimeSpan(0, 0, 0))
                {
                    _status = _attendenceStatus.FirstOrDefault(x => x.AttendenceStatusName.ToLower().Equals("absence")).AttendenceStatusID;
                }
                else if (_totalWorkingHours < new TimeSpan(1, 0, 0))
                {
                    _status = _attendenceStatus.FirstOrDefault(x => x.AttendenceStatusName.ToLower().Equals("absence")).AttendenceStatusID;
                }
                else if (_timeIn > _employee.ShiftMaster.StartTime && _timeOut < _employee.ShiftMaster.EndTime)
                {
                    _status = _attendenceStatus.FirstOrDefault(x => x.AttendenceStatusName.ToLower().Equals("latein/earlyout")).AttendenceStatusID;
                }
                else if (_timeOut < _employee.ShiftMaster.EndTime)
                {
                    _status = _attendenceStatus.FirstOrDefault(x => x.AttendenceStatusName.ToLower().Equals("earlyout")).AttendenceStatusID;
                }
                else if (_timeIn > _employee.ShiftMaster.StartTime)
                {
                    _status = _attendenceStatus.FirstOrDefault(x => x.AttendenceStatusName.ToLower().Equals("latein")).AttendenceStatusID;
                }
            }
            return _status;
        }
        [NonAction]
        public DataTable InsertDateInAttendence(DataTable attendence)
        {
            DateTime _outDate = DateTime.Now;
            var _date = DateTime.Now;
            attendence.Columns.Add(new DataColumn { DataType = typeof(System.Int32), ColumnName = "IsDeleted" });
            attendence.Columns.Add(new DataColumn { DataType = typeof(System.DateTime), ColumnName = "Date" });
            var _lastColumnIndex = attendence.Columns.Count - 1;
            for (int i = 0; i < attendence.Rows.Count; i++)
            {
                var tempValue = attendence.Rows[i][0].ToString();
                if (tempValue.Contains(@"\"))
                {
                    tempValue = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(attendence.Rows[i][0].ToString());
                }
                if (DateTime.TryParseExact(tempValue, "dd/MM/yyyy",
                           CultureInfo.InvariantCulture,
                           DateTimeStyles.None,
                           out _outDate))
                {
                    _date = _outDate;
                }
                var _outInt = 0;
                if (!int.TryParse(tempValue, out _outInt))
                {
                    attendence.Rows[i]["IsDeleted"] = 1;
                }
                else
                {
                    attendence.Rows[i]["IsDeleted"] = 0;
                }
                attendence.Rows[i][_lastColumnIndex] = _date;
            }
            return attendence;
        }


        #endregion

        #region Attendence Status

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "AttendenceStatus")]
        public JsonResult AllAttendenceStatuss()
        {
            var accountTypes = _attendenceStatusService.Get(x => x.IsDeleted == false).ToList();
            List<AttendenceStatusModel> _userAccessModel = Mapper.Map<List<AttendenceStatus>, List<AttendenceStatusModel>>(accountTypes);
            return Json(_userAccessModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "AttendenceStatus")]
        public ActionResult CreateAttendenceStatus(AttendenceStatusModel attendenceStatus)
        {
            _attendenceStatusService.Insert(new AttendenceStatus
            {
                AttendenceStatusName = attendenceStatus.AttendenceStatusName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = attendenceStatus.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "AttendenceStatus")]
        public JsonResult AttendenceStatusById(int id)
        {
            return Json(_attendenceStatusService.Get(x => x.AttendenceStatusID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "AttendenceStatus")]
        public JsonResult DeleteAttendenceStatus(int Id)
        {
            var _accountType = _attendenceStatusService.Get(x => x.AttendenceStatusID == Id).FirstOrDefault();
            if (_accountType != null)
            {
                _attendenceStatusService.Update(new AttendenceStatus
                {
                    AttendenceStatusID = Id,
                    AttendenceStatusName = _accountType.AttendenceStatusName,
                    CreatedByUserID = _accountType.CreatedByUserID,
                    CreatedDate = _accountType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _accountType.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "AttendenceStatus")]
        public JsonResult UpdateAttendenceStatus(AttendenceStatusModel accountType)
        {
            var _accountType = _attendenceStatusService.Get(x => x.AttendenceStatusID == accountType.AttendenceStatusID).FirstOrDefault();
            if (_accountType != null)
            {
                _attendenceStatusService.Update(new AttendenceStatus
                {
                    AttendenceStatusID = accountType.AttendenceStatusID,
                    AttendenceStatusName = accountType.AttendenceStatusName,
                    CreatedByUserID = _accountType.CreatedByUserID,
                    CreatedDate = _accountType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = accountType.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region Shift


        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Shift")]
        public JsonResult AllShifts()
        {
            var _shifts = _shiftService.Get(x => x.IsDeleted == false).ToList();
            List<ShiftModel> _shiftModel = Mapper.Map<List<ShiftMaster>, List<ShiftModel>>(_shifts);
            return Json(_shiftModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Shift")]
        public ActionResult CreateShift(ShiftModel shift)
        {
            _shiftService.Insert(new ShiftMaster
            {
                ShiftName = shift.ShiftName,
                StartTime = shift.StartTime,
                EndTime = shift.EndTime,
                TotalTime = shift.TotalTime,
                BreakStartTime = shift.BreakStartTime,
                BreakEndTime = shift.BreakEndTime,
                TotalBreakHours = shift.TotalBreakHours,
                TotalWorkingHours = shift.TotalWorkingHours,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = shift.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Shift")]
        public JsonResult ShiftById(int id)
        {
            return Json(_shiftService.Get(x => x.ShiftID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Shift")]
        public JsonResult DeleteShift(int Id)
        {
            var _shift = _shiftService.Get(x => x.ShiftID == Id).FirstOrDefault();
            if (_shift != null)
            {
                _shiftService.Update(new ShiftMaster
                {
                    ShiftID = Id,
                    ShiftName = _shift.ShiftName,
                    StartTime = _shift.StartTime,
                    EndTime = _shift.EndTime,
                    TotalTime = _shift.TotalTime,
                    BreakStartTime = _shift.BreakStartTime,
                    BreakEndTime = _shift.BreakEndTime,
                    TotalBreakHours = _shift.TotalBreakHours,
                    TotalWorkingHours = _shift.TotalWorkingHours,
                    CreatedByUserID = _shift.CreatedByUserID,
                    CreatedDate = _shift.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _shift.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Shift")]
        public JsonResult UpdateShift(ShiftModel shift)
        {
            var _shift = _shiftService.Get(x => x.ShiftID == shift.ShiftID).FirstOrDefault();
            if (_shift != null)
            {
                _shiftService.Update(new ShiftMaster
                {
                    ShiftID = shift.ShiftID,
                    ShiftName = shift.ShiftName,
                    StartTime = shift.StartTime,
                    EndTime = shift.EndTime,
                    TotalTime = shift.TotalTime,
                    BreakStartTime = shift.BreakStartTime,
                    BreakEndTime = shift.BreakEndTime,
                    TotalBreakHours = shift.TotalBreakHours,
                    TotalWorkingHours = shift.TotalWorkingHours,
                    CreatedByUserID = _shift.CreatedByUserID,
                    CreatedDate = _shift.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = shift.Remarks
                });
            }
            return Json(true);
        }

        #endregion



    }
}
