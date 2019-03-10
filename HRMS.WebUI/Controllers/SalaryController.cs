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
    public class SalaryController : Controller
    {
        private ISalaryService _salaryService;
        private IIncrementService _incrementService;
        private IDeductionService _deductionService;
        private IDeductionTypeService _deductionTypeService;
        private IPayslipService _payslipService;
        private IPublicHolidayService _publicHolidayService;
        private IEmployeeService _employeeService;
        private IAttendenceService _attendenceService;
        public SalaryController(ISalaryService _salaryService, IIncrementService _incrementService, IDeductionService _deductionService,IDeductionTypeService _deductionTypeService, IPayslipService _payslipService,IPublicHolidayService _publicHolidayService, IEmployeeService _employeeService, IAttendenceService _attendenceService)
        {
            this._salaryService = _salaryService;
            this._incrementService = _incrementService;
            this._deductionService = _deductionService;
            this._deductionTypeService = _deductionTypeService;
            this._payslipService = _payslipService;
            this._publicHolidayService = _publicHolidayService;
            this._employeeService = _employeeService;
            this._attendenceService = _attendenceService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Salary")]
        public ActionResult IsNameExists(int Id, string Entity, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
               
                if (Entity == "type")
                {
                    if (_deductionTypeService.Get(at => at.DeductionTypeName.Equals(Name.ToLower()) && at.DeductionTypeID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "publicholiday")
                {
                    var _date = Name.Split(':')[0].Split('/');
                    var _companyId = Convert.ToInt32(Name.Split(':')[1]);
                    var _day = Convert.ToInt32(_date[0]);
                    var _month = Convert.ToInt32(_date[1]);
                    var _year = Convert.ToInt32(_date[2]);
                    if (_publicHolidayService.Get(at => at.Date == new DateTime(_year,_month,_day) && at.CompanyID == _companyId && at.PublicHolidayID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            else
            {
                
                if (Entity == "type")
                {
                    if (_deductionTypeService.Get(at => at.DeductionTypeName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "publicholiday")
                {
                    var _date = Name.Split(':')[0].Split('/');
                    var _companyId = Convert.ToInt32(Name.Split(':')[1]);
                    var _day = Convert.ToInt32(_date[0]);
                    var _month = Convert.ToInt32(_date[1]);
                    var _year = Convert.ToInt32(_date[2]);
                    if (_publicHolidayService.Get(at => at.Date == new DateTime(_year, _month, _day) && at.CompanyID == _companyId  && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }


        #region Salary

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Salary")]
        public JsonResult AllSalaries()
        {
            var _salarys = _salaryService.Get(x => x.IsDeleted == false && x.IsInitial == false).ToList();
            List<SalaryModel> _salaryModel = Mapper.Map<List<Salary>, List<SalaryModel>>(_salarys);
            return Json(_salaryModel, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Salary")]
        public JsonResult AllOtherTexts()
        {
            var _otherTexts = _salaryService.Get(x => x.IsDeleted == false && x.IsInitial == false).Select(x=> x.OtherText).Distinct().ToList();
            return Json(_otherTexts, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Salary")]
        public ActionResult CreateSalary(SalaryModel salary)
        {
            _salaryService.Insert(new Salary
            {
                EmployeeID = salary.EmployeeID,
                Basic = salary.Basic,
                Telephone = salary.Telephone,
                Housing = salary.Housing,
                Transport = salary.Transport,
                TotalSalary = salary.TotalSalary,
                OtherText = salary.OtherText,
                OtherNumber = salary.OtherNumber,
                GratuitySalary = salary.GratuitySalary,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = salary.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Salary")]
        public JsonResult SalaryById(int id)
        {
            return Json(_salaryService.Get(x => x.SalaryID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Salary")]
        public JsonResult DeleteSalary(int Id)
        {
            var _salary = _salaryService.Get(x => x.SalaryID == Id).FirstOrDefault();
            if (_salary != null)
            {
                _salaryService.Update(new Salary
                {
                    SalaryID = Id,
                    EmployeeID = _salary.EmployeeID,
                    Basic = _salary.Basic,
                    Telephone = _salary.Telephone,
                    Housing = _salary.Housing,
                    Transport = _salary.Transport,
                    TotalSalary = _salary.TotalSalary,
                    OtherText = _salary.OtherText,
                    OtherNumber = _salary.OtherNumber,
                    CreatedByUserID = _salary.CreatedByUserID,
                    CreatedDate = _salary.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _salary.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Salary")]
        public JsonResult UpdateSalary(SalaryModel salary)
        {
            var _salary = _salaryService.Get(x => x.SalaryID == salary.SalaryID).FirstOrDefault();
            if (_salary != null)
            {
                _salaryService.Update(new Salary
                {
                    SalaryID = salary.SalaryID,
                    EmployeeID = salary.EmployeeID,
                    Basic = salary.Basic,
                    Telephone = salary.Telephone,
                    Housing = salary.Housing,
                    Transport = salary.Transport,
                    TotalSalary = salary.TotalSalary,
                    OtherText = salary.OtherText,
                    OtherNumber = salary.OtherNumber,
                    GratuitySalary = salary.GratuitySalary,
                    CreatedByUserID = _salary.CreatedByUserID,
                    CreatedDate = _salary.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = salary.Remarks
                });
            }
            return Json(true);
        }

        #endregion
        
        
        #region Increment

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Increment")]
        public JsonResult AllIncrements()
        {
            var _increments = _incrementService.Get(x => x.IsDeleted == false).ToList();
            List<IncrementModel> _incrementModel = Mapper.Map<List<Increment>, List<IncrementModel>>(_increments);
            return Json(_incrementModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Increment")]
        public ActionResult CreateIncrement(IncrementModel increment)
        {
            _incrementService.Insert(new Increment
            {
                EmployeeID = increment.EmployeeID,
                IncrementDate = increment.IncrementDate,
                Basic = increment.Basic,
                Telephone = increment.Telephone,
                Housing = increment.Housing,
                Transport = increment.Transport,
                TotalSalary = increment.TotalSalary,
                OtherText = increment.OtherText,
                OtherNumber = increment.OtherNumber,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = increment.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Increment")]
        public JsonResult IncrementById(int id)
        {
            return Json(_incrementService.Get(x => x.IncrementID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Increment")]
        public JsonResult DeleteIncrement(int Id)
        {
            var _increment = _incrementService.Get(x => x.IncrementID == Id && x.IsDeleted == false).LastOrDefault();
            if (_increment != null)
            {
                _incrementService.Delete(new Increment
                {
                    IncrementID = Id,
                    EmployeeID = _increment.EmployeeID,
                    IncrementDate = _increment.IncrementDate,
                    Basic = _increment.Basic,
                    Telephone = _increment.Telephone,
                    Housing = _increment.Housing,
                    Transport = _increment.Transport,
                    TotalSalary = _increment.TotalSalary,
                    OtherText = _increment.OtherText,
                    OtherNumber = _increment.OtherNumber,
                    CreatedByUserID = _increment.CreatedByUserID,
                    CreatedDate = _increment.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _increment.Remarks
                });
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Increment")]
        public JsonResult UpdateIncrement(IncrementModel increment)
        {
            var _increment = _incrementService.Get(x => x.IncrementID == increment.IncrementID && x.IsDeleted == false).FirstOrDefault();
            if (_increment != null)
            {
                _incrementService.Update(new Increment
                {
                    IncrementID = increment.IncrementID,
                    EmployeeID = increment.EmployeeID,
                    IncrementDate = increment.IncrementDate,
                    Basic = increment.Basic,
                    Telephone = increment.Telephone,
                    Housing = increment.Housing,
                    Transport = increment.Transport,
                    TotalSalary = increment.TotalSalary,
                    OtherText = increment.OtherText,
                    OtherNumber = increment.OtherNumber,
                    CreatedByUserID = _increment.CreatedByUserID,
                    CreatedDate = _increment.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = increment.Remarks
                });
            }
            return Json(true);
        }


        #endregion

        
        #region Deduction

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DeductionDetails")]
        public JsonResult AllDeductions()
        {
            var _deductions = _deductionService.Get(x => x.IsDeleted == false,null,y => y.DeductionDetail).ToList();
            List<DeductionModel> _deductionModel = Mapper.Map<List<Deduction>, List<DeductionModel>>(_deductions);
            for (int i = 0; i < _deductions.Count; i++)
            {
                 _deductionModel[i].DeductionDetails = Mapper.Map<List<DeductionDetail>, List<DeductionDetailModel>>(_deductions[i].DeductionDetail.ToList());
            }
            return Json(_deductionModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "DeductionDetails")]
        public ActionResult CreateDeduction(DeductionComplex deductionComplex)
        {
            if (deductionComplex != null)
            {
                var _deduction = deductionComplex.Deduction;
                var _deductionDetails = deductionComplex.DeductionDetails;
                foreach (var deductionDetail in _deductionDetails)
                {
                    deductionDetail.DeductionID = _deduction.DeductionID;
                    deductionDetail.OtherText = deductionDetail.OtherText;
                    deductionDetail.OtherNumber = deductionDetail.OtherNumber;
                    deductionDetail.CreatedByUserID = CurrentUser.UserId;
                    deductionDetail.CreatedDate = DateTime.Now;
                    deductionDetail.IsDeleted = false;
                    deductionDetail.IsPayslipIssued = false;
                    deductionDetail.Remarks = deductionDetail.Remarks;
                }

                _deductionService.Insert(new Deduction
                {
                    EmployeeID = _deduction.EmployeeID,
                    DeductionTypeID = _deduction.DeductionTypeID,
                    StartDate = _deduction.StartDate,
                    EndDate = _deduction.EndDate,
                    Basic = _deduction.Basic,
                    Telephone = _deduction.Telephone,
                    Housing = _deduction.Housing,
                    Transport = _deduction.Transport,
                    TotalAmount = _deduction.TotalAmount,
                    TotalMonth = _deduction.TotalMonth,
                    OtherText = _deduction.OtherText,
                    OtherNumber = _deduction.OtherNumber,
                    IsAddition = _deduction.IsAddition,
                    CreatedByUserID = CurrentUser.UserId,
                    CreatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = _deduction.Remarks,
                    DeductionDetail = Mapper.Map<List<DeductionDetailModel>, List<DeductionDetail>>(_deductionDetails)
                });

                // }, Mapper.Map<List<DeductionDetailModel>, List<DeductionDetail>>(_deductionDetails));
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DeductionDetails")]
        public JsonResult DeductionById(int id)
        {
            return Json(_deductionService.Get(x => x.DeductionID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "DeductionDetails")]
        public JsonResult DeleteDeduction(int Id)
        {
            var _deduction = _deductionService.Get(x => x.DeductionID == Id).FirstOrDefault();
            if (_deduction != null)
            {
                _deductionService.Update(new Deduction
                {
                    DeductionID = Id,
                    EmployeeID = _deduction.EmployeeID,
                    DeductionTypeID = _deduction.DeductionTypeID,
                    StartDate = _deduction.StartDate,
                    EndDate = _deduction.EndDate,
                    Basic = _deduction.Basic,
                    Telephone = _deduction.Telephone,
                    Housing = _deduction.Housing,
                    Transport = _deduction.Transport,
                    TotalAmount = _deduction.TotalAmount,
                    TotalMonth = _deduction.TotalMonth,
                    OtherText = _deduction.OtherText,
                    OtherNumber = _deduction.OtherNumber,
                    CreatedByUserID = _deduction.CreatedByUserID,
                    CreatedDate = _deduction.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    IsAddition = _deduction.IsAddition,
                    Remarks = _deduction.Remarks
                }, true);
            }



            //if (_deduction != null)
            //{
            //    var _deductionDetails = _deduction.DeductionDetail.ToList();
            //   // var deduction = deductionComplex.Deduction;
            //  //  var deductionDetails = deductionComplex.DeductionDetails;
            //    for (int deductionDetail = 0; deductionDetail < _deductionDetails.Count; deductionDetail++)
            //    {
            //        //_deductionDetails[deductionDetail].DeductionID = _deduction.DeductionID;
            //        //_deductionDetails[deductionDetail].DeductionDetailID = _deductionDetails[deductionDetail].DeductionDetailID;

            //        //_deductionDetails[deductionDetail].OtherText = _deduction.OtherText;
            //        _deductionDetails[deductionDetail].CreatedByUserID = _deduction.CreatedByUserID;
            //        _deductionDetails[deductionDetail].CreatedDate = _deduction.CreatedDate;
            //        _deductionDetails[deductionDetail].UpdatedByUserID = CurrentUser.UserId;
            //        _deductionDetails[deductionDetail].UpdatedDate = DateTime.Now;
            //        _deductionDetails[deductionDetail].IsDeleted = true;
            //      //  _deductionDetails[deductionDetail].Remarks = _deductionDetails[deductionDetail].Remarks;
            //    }

            //    _deductionService.Update(new Deduction
            //    {
            //        DeductionID = Id,
            //        EmployeeID = _deduction.EmployeeID,
            //        DeductionTypeID = _deduction.DeductionTypeID,
            //        StartDate = _deduction.StartDate,
            //        EndDate = _deduction.EndDate,
            //        Basic = _deduction.Basic,
            //        Telephone = _deduction.Telephone,
            //        Housing = _deduction.Housing,
            //        Transport = _deduction.Transport,
            //        TotalAmount = _deduction.TotalAmount,
            //        TotalMonth = _deduction.TotalMonth,
            //        OtherText = _deduction.OtherText,
            //        OtherNumber = _deduction.OtherNumber,
            //        CreatedByUserID = _deduction.CreatedByUserID,
            //        CreatedDate = _deduction.CreatedDate,
            //        UpdatedByUserID = CurrentUser.UserId,
            //        UpdatedDate = DateTime.Now,
            //        IsDeleted = true,
            //        Remarks = _deduction.Remarks,
            //        DeductionDetail = _deductionDetails
            //    });
            //}

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "DeductionDetails")]
        public JsonResult UpdateDeduction(DeductionComplex deductionComplex)
        {
            var _deduction = _deductionService.Get(x => x.DeductionID == deductionComplex.Deduction.DeductionID).FirstOrDefault();
            if (deductionComplex != null && _deduction != null)
            {
                var _deductionDetails = _deduction.DeductionDetail.ToList();
                var deduction = deductionComplex.Deduction;
                var deductionDetails = deductionComplex.DeductionDetails;
                for (int deductionDetail = 0; deductionDetail < deductionDetails.Count; deductionDetail++)
                {
                    deductionDetails[deductionDetail].DeductionID = _deduction.DeductionID;
                    deductionDetails[deductionDetail].DeductionDetailID = _deductionDetails[deductionDetail].DeductionDetailID;
                    deductionDetails[deductionDetail].OtherText = deduction.OtherText;
                    deductionDetails[deductionDetail].CreatedByUserID = _deduction.CreatedByUserID;
                    deductionDetails[deductionDetail].CreatedDate = _deduction.CreatedDate;
                    deductionDetails[deductionDetail].UpdatedByUserID = CurrentUser.UserId;
                    deductionDetails[deductionDetail].UpdatedDate = DateTime.Now;
                    deductionDetails[deductionDetail].IsDeleted = false;
                    deductionDetails[deductionDetail].Remarks = deductionDetails[deductionDetail].Remarks;
                }

                _deductionService.Update(new Deduction
                {
                    DeductionID = deduction.DeductionID,
                    EmployeeID = deduction.EmployeeID,
                    DeductionTypeID = deduction.DeductionTypeID,
                    StartDate = deduction.StartDate,
                    EndDate = deduction.EndDate,
                    Basic = deduction.Basic,
                    Telephone = deduction.Telephone,
                    Housing = deduction.Housing,
                    Transport = deduction.Transport,
                    TotalAmount = deduction.TotalAmount,
                    TotalMonth = deduction.TotalMonth,
                    OtherText = deduction.OtherText,
                    OtherNumber = deduction.OtherNumber,
                    CreatedByUserID = _deduction.CreatedByUserID,
                    CreatedDate = _deduction.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    IsAddition = deduction.IsAddition,
                    Remarks = deduction.Remarks,
                    DeductionDetail = Mapper.Map<List<DeductionDetailModel>, List<DeductionDetail>>(deductionDetails)
                });
            }
            return Json(true);
        }



        #endregion
        
        #region Deduction Type

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DeductionType")]
        public JsonResult AllDeductionTypes()
        {
            var _deductionTypes = _deductionTypeService.Get(x => x.IsDeleted == false).ToList();
            List<DeductionTypeModel> _deductionTypeModel = Mapper.Map<List<DeductionType>, List<DeductionTypeModel>>(_deductionTypes);
            return Json(_deductionTypeModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "DeductionType")]
        public ActionResult CreateDeductionType(DeductionTypeModel deductionType)
        {
            _deductionTypeService.Insert(new DeductionType
            {
                DeductionTypeName = deductionType.DeductionTypeName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = deductionType.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DeductionType")]
        public JsonResult DeductionTypeById(int id)
        {
            return Json(_deductionTypeService.Get(x => x.DeductionTypeID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "DeductionType")]
        public JsonResult DeleteDeductionType(int Id)
        {
            var _deductionType = _deductionTypeService.Get(x => x.DeductionTypeID == Id).FirstOrDefault();
            if (_deductionType != null)
            {
                _deductionTypeService.Update(new DeductionType
                {
                    DeductionTypeID = Id,
                    DeductionTypeName = _deductionType.DeductionTypeName,
                    CreatedByUserID = _deductionType.CreatedByUserID,
                    CreatedDate = _deductionType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _deductionType.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "DeductionType")]
        public JsonResult UpdateDeductionType(DeductionTypeModel deductionType)
        {
            var _deductionType = _deductionTypeService.Get(x => x.DeductionTypeID == deductionType.DeductionTypeID).FirstOrDefault();
            if (_deductionType != null)
            {
                _deductionTypeService.Update(new DeductionType
                {
                    DeductionTypeID = _deductionType.DeductionTypeID,
                    DeductionTypeName = deductionType.DeductionTypeName,
                    CreatedByUserID = _deductionType.CreatedByUserID,
                    CreatedDate = _deductionType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = deductionType.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region Public Holiday

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "PublicHoliday")]
        public JsonResult AllPublicHoliday()
        {
            var _publicHoliday = _publicHolidayService.Get(x => x.IsDeleted == false).ToList();
            List<PublicHolidayModel> _publicHolidayModel = Mapper.Map<List<PublicHoliday>, List<PublicHolidayModel>>(_publicHoliday);
            return Json(_publicHolidayModel, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "PublicHoliday")]
        public ActionResult CreatePublicHoliday(PublicHolidayModel publicHoliday)
        {
            var _employees = _employeeService.Get(e => e.IsDeleted == false && e.CompanyID == publicHoliday.CompanyID).ToList();
            var _previousAttendence = _attendenceService.Get(at => at.AttendenceDate == publicHoliday.Date && at.IsDeleted == false).ToList();
            List<Attendence> _attendence = new List<Attendence>();
            for (int i = 0; i < _employees.Count; i++)
            {
                if (_previousAttendence.Where(at => at.EmployeeID == _employees[i].EmployeeID).Count() == 0)
                {
                    _attendence.Add(new Attendence
                    {
                        AttendenceDate = DateTime.Now,
                        TimeIn = new TimeSpan(0, 0, 0),
                        TimeOut = new TimeSpan(0, 0, 0),
                        TotalWorkingHours = new TimeSpan(0, 0, 0),
                        DailyWorkingHours = new TimeSpan(0, 0, 0),
                        EmployeeID = _employees[i].EmployeeID,
                        StatusID = "AbsentAttendenceStatusID".GetConfigByKey<int>(),
                        CreatedByUserID = CurrentUser.UserId,
                        CreatedDate = DateTime.Now,
                        IsDeleted = false,
                        Remarks = "On Leave"
                    });
                }
            }
            _attendenceService.AddRange(_attendence);
            _publicHolidayService.Insert(new Core.Entities.PublicHoliday
            {
                PublicHolidayName = publicHoliday.PublicHolidayName,
                Date = publicHoliday.Date,
                CompanyID = publicHoliday.CompanyID,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = publicHoliday.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "PublicHoliday")]
        public JsonResult PublicHolidayById(int Id)
        {
            return Json(_publicHolidayService.Get(x => x.PublicHolidayID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "PublicHoliday")]
        public JsonResult DeletePublicHoliday(int Id)
        {
            var _publicHoliday = _publicHolidayService.Get(x => x.PublicHolidayID == Id).FirstOrDefault();
            if (_publicHoliday != null)
            {
                _publicHolidayService.Update(new PublicHoliday
                {
                    PublicHolidayID = Id,
                    PublicHolidayName = _publicHoliday.PublicHolidayName,
                    Date = _publicHoliday.Date,
                    CompanyID = _publicHoliday.CompanyID,
                    CreatedByUserID = _publicHoliday.CreatedByUserID,
                    CreatedDate = _publicHoliday.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _publicHoliday.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "PublicHoliday")]
        public JsonResult UpdatePublicHoliday(PublicHolidayModel publicHoliday)
        {
            var _employees = _employeeService.Get(e=>e.IsDeleted == false && e.CompanyID == publicHoliday.CompanyID).ToList();
            var _previousAttendence = _attendenceService.Get(at => at.AttendenceDate == publicHoliday.Date && at.IsDeleted == false).ToList();
            List<Attendence> _attendence = new List<Attendence>();
            for (int i = 0; i < _employees.Count; i++)
            {
                if(_previousAttendence.Where(at => at.EmployeeID == _employees[i].EmployeeID).Count() == 0)
                {
                    _attendence.Add(new Attendence {
                        AttendenceDate = DateTime.Now,
                        TimeIn = new TimeSpan(0, 0, 0),
                        TimeOut = new TimeSpan(0, 0, 0),
                        TotalWorkingHours = new TimeSpan(0, 0, 0),
                        DailyWorkingHours = new TimeSpan(0, 0, 0),
                        EmployeeID = _employees[i].EmployeeID,
                        StatusID = "AbsentAttendenceStatusID".GetConfigByKey<int>(),
                        CreatedByUserID = CurrentUser.UserId,
                        CreatedDate = DateTime.Now,
                        IsDeleted = false,
                        Remarks = "On Leave"
                    });
                }
            }
            _attendenceService.AddRange(_attendence);
            //if (_attendenceService.Get(at => at.AttendenceDate == DateTime.Now && at.EmployeeID == leave.EmployeeID).ToList().Count == 0)
            //{
            //    _attendenceService.Insert(new Attendence
            //    {
            //        AttendenceDate = DateTime.Now,
            //        TimeIn = new TimeSpan(0, 0, 0),
            //        TimeOut = new TimeSpan(0, 0, 0),
            //        TotalWorkingHours = new TimeSpan(0, 0, 0),
            //        DailyWorkingHours = new TimeSpan(0, 0, 0),
            //        EmployeeID = leave.EmployeeID,
            //        StatusID = "AbsentAttendenceStatusID".GetConfigByKey<int>(),
            //        CreatedByUserID = CurrentUser.UserId,
            //        CreatedDate = DateTime.Now,
            //        IsDeleted = false,
            //        Remarks = "On Leave"
            //    });
            //}

            var _publicHoliday = _publicHolidayService.Get(x => x.PublicHolidayID == publicHoliday.PublicHolidayID).FirstOrDefault();
            if (_publicHoliday != null)
            {
                _publicHolidayService.Update(new PublicHoliday
                {
                    PublicHolidayID = publicHoliday.PublicHolidayID,
                    PublicHolidayName = publicHoliday.PublicHolidayName,
                    Date = publicHoliday.Date,
                    CompanyID = publicHoliday.CompanyID,
                    CreatedByUserID = _publicHoliday.CreatedByUserID,
                    CreatedDate = _publicHoliday.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = publicHoliday.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region Payslip

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Payslip")]
        public ActionResult GeneratePayslip(int MonthID,int Year,int CompanyID)
        {           
            return Json(_payslipService.GenerateReport(MonthID,Year, CompanyID));
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Payslip")]
        public ActionResult CreatePayslip(List<PaySlipModel> payslips)
        {
            if(payslips != null)
            {
                var _month = payslips.Select(p => p.Date.Month).FirstOrDefault();
                var _previousPayslips = _payslipService.Get(p=>p.IsDeleted == false && p.Date.Month == _month).ToList();
                List<PaySlip> _payslips = new List<PaySlip>();
                
                
                for (int i = 0; i < payslips.Count; i++)
                {
                    if (_previousPayslips.Count(p=>p.EmployeeID == payslips[i].EmployeeID) == 0)
                    {
                        _payslips.Add(new PaySlip
                        {
                            EmployeeID = payslips[i].EmployeeID,
                            Basic = payslips[i].Basic,
                            Housing = payslips[i].Housing,
                            Telephone = payslips[i].Telephone,
                            Transport = payslips[i].Transport,
                            TotalSalary = payslips[i].TotalSalary,
                            TotalDays = payslips[i].TotalDays,
                            TotalWorkingDays = payslips[i].TotalWorkingDays,
                            OtherNumber = payslips[i].OtherNumber,
                            OtherText = payslips[i].OtherText,
                            Date = payslips[i].Date,
                            CreatedByUserID = CurrentUser.UserId,
                            CreatedDate = DateTime.Now,
                            IsDeleted = false,
                            Gratuity = payslips[i].Gratuity,
                            Remarks = payslips[i].Remarks

                        });
                    }
                    
                }
                
                if(_payslipService.ProcessPayslip(_payslips, _month))
                {
                    //Utilities.SendEmail(
                    //        "Appointment Summary",
                    //        "Your Appointment (" + appointment.AppointmentName + ") on " + appointment.AppointmentDate.ToShortDateString() + "\n From: " + appointment.StartTime + "\n To: " + appointment.EndTime + "\n Concluded: " + appointment.Conclusion,
                    //        "SenderEmail".GetConfigByKey<string>(),
                    //        "SenderPassword".GetConfigByKey<string>(),
                    //        participant.Employee.Email
                    //        );
                }
            }
            return Json(true);
        }

        #endregion
    }
}
