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
    public class DepartmentController : Controller
    {
        private IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService _departmentService)
        {
            this._departmentService = _departmentService;
        }
        // GET: Department
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Department")]
        public ActionResult IsNameExists(int Id,string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_departmentService.Get(at => at.DepartmentName.Equals(Name.ToLower()) && at.DepartmentID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_departmentService.Get(at => at.DepartmentName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            return Json(_result);
        }
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Department")]
        public JsonResult AllDepartment()
        {
            var _department = _departmentService.Get(x => x.IsDeleted == false).ToList();
            List<DepartmentModel> _departmentModel = Mapper.Map<List<Department>, List<DepartmentModel>>(_department);
            return Json(_departmentModel, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Department")]
        public ActionResult CreateDepartment(DepartmentModel department)
        {
            _departmentService.Insert(new Department
            {
                DepartmentName = department.DepartmentName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = department.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Department")]
        public JsonResult DepartmentById(int Id)
        {
            return Json(_departmentService.Get(x => x.DepartmentID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Department")]
        public JsonResult DeleteDepartment(int Id)
        {
            var _department = _departmentService.Get(x => x.DepartmentID == Id).FirstOrDefault();
            if (_department != null)
            {
                _departmentService.Update(new Department
                {
                    DepartmentID = Id,
                    DepartmentName = _department.DepartmentName,
                    CreatedByUserID = _department.CreatedByUserID,
                    CreatedDate = _department.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _department.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Department")]
        public JsonResult UpdateDepartment(DepartmentModel department)
        {
            var _department = _departmentService.Get(x => x.DepartmentID == department.DepartmentID).FirstOrDefault();
            if (_department != null)
            {
                _departmentService.Update(new Department
                {
                    DepartmentID = department.DepartmentID,
                    DepartmentName = department.DepartmentName,
                    CreatedByUserID = _department.CreatedByUserID,
                    CreatedDate = _department.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = department.Remarks
                });
            }
            return Json(true);
        }

    }
}