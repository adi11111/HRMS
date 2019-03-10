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
    public class DesignationController : Controller
    {
        private IDesignationService _designationService;

        public DesignationController(IDesignationService _designationService)
        {
            this._designationService = _designationService;
        }
        // GET: Designation
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Designation")]
        public ActionResult IsNameExists(int Id,string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_designationService.Get(at => at.DesignationName.Equals(Name.ToLower()) && at.DesignationID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_designationService.Get(at => at.DesignationName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            return Json(_result);
        }
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Designation")]
        public JsonResult AllDesignation()
        {
            var _department = _designationService.Get(x => x.IsDeleted == false).ToList();
            List<DesignationModel> _departmentModel = Mapper.Map<List<Designation>, List<DesignationModel>>(_department);
            return Json(_departmentModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Designation")]
        public ActionResult CreateDesignation(DesignationModel department)
        {
            _designationService.Insert(new Designation
            {
                DesignationName = department.DesignationName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = department.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Designation")]
        public JsonResult DesignationById(int Id)
        {
            return Json(_designationService.Get(x => x.DesignationID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Designation")]
        public JsonResult DeleteDesignation(int Id)
        {
            var _department = _designationService.Get(x => x.DesignationID == Id).FirstOrDefault();
            if (_department != null)
            {
                _designationService.Update(new Designation
                {
                    DesignationID = Id,
                    DesignationName = _department.DesignationName,
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
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Designation")]
        public JsonResult UpdateDesignation(DesignationModel department)
        {
            var _department = _designationService.Get(x => x.DesignationID == department.DesignationID).FirstOrDefault();
            if (_department != null)
            {
                _designationService.Update(new Designation
                {
                    DesignationID = department.DesignationID,
                    DesignationName = department.DesignationName,
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