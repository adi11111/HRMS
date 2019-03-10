using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.Models;
using HRMS.WebUI.Common;
using HRMS.WebUI.Filters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace HRMS.WebUI.Controllers
{
    [AllowAnonymous]
    public class EmployeeController : Controller
    {
        private IUserService _userService;
        private IEmployeeService _employeeService;
        private ILeaveService _leaveService;

        public EmployeeController(IUserService _userService,IEmployeeService _employeeService,ILeaveService _leaveService)
        {
            this._userService = _userService;
            this._employeeService = _employeeService;
            this._leaveService = _leaveService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Employee")]
        public ActionResult IsNameExists(int Id,string Name)
        {
            var _result = false;
            if (Response.StatusCode != 403)
            {
                
                if (Id > 0)
                {
                    if (_employeeService.Get(at => at.EmployeeName.Equals(Name.ToLower()) && at.EmployeeID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                else
                {
                    if (_employeeService.Get(at => at.EmployeeName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Employee")]
        public JsonResult AllEmployees(int Id = 0)
        {
            List<EmployeeMaster> employees = null;
            if (CurrentUser.UserRoleId == "AdminRole".GetConfigByKey<int>() || CurrentUser.UserRoleId == "HRRole".GetConfigByKey<int>() || CurrentUser.UserRoleId == "GMRole".GetConfigByKey<int>() || Id == 1)
            {
                employees = _employeeService.Get(x => x.IsDeleted == false).ToList();
            }
            else
            {
                employees = _employeeService.Get(x => (x.ReportingToID == CurrentUser.EmployeeId || x.EmployeeID == CurrentUser.EmployeeId) && x.IsDeleted == false).ToList();
            }
            List<EmployeeModel> _employeeModel = Mapper.Map<List<EmployeeMaster>, List<EmployeeModel>>(employees);
            var _approvedLeaveStatusID = "ApprovedLeaveStatusID".GetConfigByKey<int>();
            var _annualLeaveTypeID = "AnnualLeaveTypeID".GetConfigByKey<int>();
            var _compensatoryLeaveTypeID = "CompensatoryLeaveTypeID".GetConfigByKey<int>();
            var _approvedLeaves = _leaveService.Get(x => x.LeaveStatusID == _approvedLeaveStatusID);
            for (int i = 0; i < _employeeModel.Count; i++)
            {
                var _empApprovedAnnualLeaves = _approvedLeaves.Where(x => x.EmployeeID == _employeeModel[i].EmployeeID && x.LeaveTypeID == _annualLeaveTypeID);
                var _empApprovedCompensatoryLeaves = _approvedLeaves.Where(x => x.EmployeeID == _employeeModel[i].EmployeeID && x.LeaveTypeID == _compensatoryLeaveTypeID);
                if (_employeeModel != null)
                {
                    _employeeModel[i].LeaveBalanceAsNow = (_employeeModel[i].DailyLeave * (DateTime.Now - _employeeModel[i].MigratedDate).Days) + _employeeModel[i].MigratedLeaveBalance + _empApprovedCompensatoryLeaves.Sum(x => x.TotalLeaveDays) - _empApprovedAnnualLeaves.Sum(x => x.TotalLeaveDays);
                }

               
            }
            return Json( _employeeModel,JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Employee")]
        public ActionResult CreateEmployee(EmployeeModel employee)
        {
            if (Response.StatusCode != 403)
            {
                if (ModelState.IsValid)
                {
                    var image = Utilities.LoadImage(employee.PhotoPath.Substring((employee.PhotoPath.IndexOf(',') + 1)));
                    var imageName = employee.EmployeeName + "(" + employee.EmployeeID + ")" + ".jpg";
                    image.Save(Server.MapPath("~/Content/Images/EmployeeImages/" + imageName));
                    _employeeService.Insert(new EmployeeMaster
                    {
                        EmployeeName = employee.EmployeeName,
                        AccountNumber = employee.AccountNumber,
                        BankID = employee.BankID,
                        CompanyID = employee.CompanyID,
                        AccountTypeID = employee.AccountTypeID,
                        AttendenceReferenceID = employee.AttendenceReferenceID,
                        ContactPersonName = employee.ContactPersonName,
                        ContactPersonRelationship = employee.ContactPersonRelationship,
                        DepartmentID = employee.DepartmentID,
                        DesignationID = employee.DesignationID,
                        DOB = employee.DOB,
                        ReportingToID = employee.ReportingToID,
                        WeeklyOff = employee.WeeklyOff,
                        ActualDOB = employee.ActualDOB,
                        Email = employee.Email,
                        FamilyContactNumber = employee.FamilyContactNumber,
                        Gender = employee.Gender,
                        InternationalContactNumber = employee.InternationalContactNumber,
                        JoiningDate = employee.JoiningDate,
                        MigratedLeaveBalance = employee.MigratedLeaveBalance,
                        DailyLeave = employee.DailyLeave,
                        MigratedDate = employee.MigratedDate,
                        MedicalHistory = employee.MedicalHistory,
                        MobileNumber = employee.MobileNumber,
                        NationalityID = employee.NationalityID,
                        PhoneNumber = employee.PhoneNumber,
                        PhotoPath = imageName,
                        QualificationDescription = employee.QualificationDescription,
                        QualificationType = employee.QualificationType,
                        Address = employee.Address,
                        CountryID = employee.CountryID,
                        RegionID = employee.RegionID,
                        ShiftID = employee.ShiftID,
                        StaffID = employee.StaffID,
                        Status = employee.Status,
                        CreatedByUserID = CurrentUser.UserId,
                        CreatedDate = DateTime.Now,
                        IsDeleted = false,
                        Remarks = employee.Remarks
                    });
                }
            }
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Employee")]
        public JsonResult EmployeeById(int id)
        {
            return Json(_employeeService.Get(x => x.EmployeeID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Employee")]
        public JsonResult DeleteEmployee(int Id)
        {
            if(Response.StatusCode != 403)
            {
            var _employee = _employeeService.Get(x => x.EmployeeID == Id).FirstOrDefault();
            if(_employee != null)
            {
                _employeeService.Update(new EmployeeMaster
                {
                    EmployeeID = Id,
                    AttendenceReferenceID = _employee.AttendenceReferenceID,
                    AccountNumber = _employee.AccountNumber,
                    AccountTypeID = _employee.AccountTypeID,
                    BankID = _employee.BankID,
                    CompanyID = _employee.CompanyID,
                    ContactPersonName = _employee.ContactPersonName,
                    ContactPersonRelationship = _employee.ContactPersonRelationship,
                    DepartmentID = _employee.DepartmentID,
                    DesignationID = _employee.DesignationID,
                    DOB = _employee.DOB,
                    ReportingToID = _employee.ReportingToID,
                    WeeklyOff = _employee.WeeklyOff,
                    ActualDOB = _employee.ActualDOB,
                    Email = _employee.Email,
                    FamilyContactNumber = _employee.FamilyContactNumber,
                    Gender = _employee.Gender,
                    InternationalContactNumber = _employee.InternationalContactNumber,
                    JoiningDate = _employee.JoiningDate,
                    MigratedLeaveBalance = _employee.MigratedLeaveBalance,
                    MedicalHistory = _employee.MedicalHistory,
                    MobileNumber = _employee.MobileNumber,
                    NationalityID = _employee.NationalityID,
                    PhoneNumber = _employee.PhoneNumber,
                    PhotoPath = _employee.PhotoPath,
                    QualificationDescription = _employee.QualificationDescription,
                    QualificationType = _employee.QualificationType,
                    Address = _employee.Address,
                    CountryID = _employee.CountryID,
                    RegionID = _employee.RegionID,
                    StaffID = _employee.StaffID,
                    ShiftID = _employee.ShiftID,
                    Status = _employee.Status,
                    EmployeeName = _employee.EmployeeName,
                    CreatedByUserID = _employee.CreatedByUserID,
                    CreatedDate = _employee.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _employee.Remarks
                }, true);
            }


            }
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Employee")]
        public JsonResult UpdateEmployee(EmployeeModel employee)
        {
            if (Response.StatusCode != 403)
            {
                var imageName = "";
                if (employee.PhotoPath.Contains("base64"))
                {
                    var image = Utilities.LoadImage(employee.PhotoPath.Substring((employee.PhotoPath.IndexOf(',') + 1)));
                    imageName = employee.EmployeeName + "(" + employee.EmployeeID + ")" + ".jpg";
                    image.Save(Server.MapPath("~/Content/Images/EmployeeImages/" + imageName));
                }
                else
                {
                    imageName = employee.PhotoPath.Substring(employee.PhotoPath.LastIndexOf('/') + 1);
                }
                var _employee = _employeeService.Get(x => x.EmployeeID == employee.EmployeeID).FirstOrDefault();
                if (_employee != null)
                {
                    _employeeService.Update(new EmployeeMaster
                    {
                        EmployeeID = employee.EmployeeID,
                        AttendenceReferenceID = employee.AttendenceReferenceID,
                        AccountNumber = employee.AccountNumber,
                        AccountTypeID = employee.AccountTypeID,
                        BankID = employee.BankID,
                        CompanyID = employee.CompanyID,
                        ContactPersonName = employee.ContactPersonName,
                        ContactPersonRelationship = employee.ContactPersonRelationship,
                        DepartmentID = employee.DepartmentID,
                        DesignationID = employee.DesignationID,
                        DOB = employee.DOB,
                        ReportingToID = employee.ReportingToID,
                        ActualDOB = employee.ActualDOB,
                        WeeklyOff = employee.WeeklyOff,
                        Email = employee.Email,
                        FamilyContactNumber = employee.FamilyContactNumber,
                        Gender = employee.Gender,
                        InternationalContactNumber = employee.InternationalContactNumber,
                        JoiningDate = employee.JoiningDate,
                        MigratedLeaveBalance = employee.MigratedLeaveBalance,
                        DailyLeave = employee.DailyLeave,
                        MigratedDate = employee.MigratedDate,
                        MedicalHistory = employee.MedicalHistory,
                        MobileNumber = employee.MobileNumber,
                        NationalityID = employee.NationalityID,
                        PhoneNumber = employee.PhoneNumber,
                        PhotoPath = imageName,
                        QualificationDescription = employee.QualificationDescription,
                        QualificationType = employee.QualificationType,
                        Address = employee.Address,
                        CountryID = employee.CountryID,
                        RegionID = employee.RegionID,
                        ShiftID = employee.ShiftID,
                        StaffID = employee.StaffID,
                        Status = employee.Status,
                        EmployeeName = employee.EmployeeName,
                        CreatedByUserID = _employee.CreatedByUserID,
                        CreatedDate = _employee.CreatedDate,
                        UpdatedByUserID = CurrentUser.UserId,
                        UpdatedDate = DateTime.Now,
                        IsDeleted = false,
                        Remarks = employee.Remarks
                    });
                }
            }
                return Json(true);
        }
       
    }
}
