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
    public class StaffController : Controller
    {
        private IStaffService _staffService;

        public StaffController(IStaffService _staffService)
        {
            this._staffService = _staffService;
        }
        // GET: Staff
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Staff")]
        public ActionResult IsNameExists(int Id, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_staffService.Get(at => at.StaffName.Equals(Name.ToLower()) && at.StaffID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_staffService.Get(at => at.StaffName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }

            return Json(_result);
        }

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Staff")]
        public JsonResult AllStaff()
        {
            var _staff = _staffService.Get(x => x.IsDeleted == false).ToList();
            List<StaffModel> _staffModel = Mapper.Map<List<Staff>, List<StaffModel>>(_staff);
            return Json(_staffModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Staff")]
        public ActionResult CreateStaff(StaffModel staff)
        {
            _staffService.Insert(new Staff
            {
                StaffName = staff.StaffName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = staff.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Staff")]
        public JsonResult StaffById(int Id)
        {
            return Json(_staffService.Get(x => x.StaffID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Staff")]
        public JsonResult DeleteStaff(int Id)
        {
            var _staff = _staffService.Get(x => x.StaffID == Id).FirstOrDefault();
            if (_staff != null)
            {
                _staffService.Update(new Staff
                {
                    StaffID = Id,
                    StaffName = _staff.StaffName,
                    CreatedByUserID = _staff.CreatedByUserID,
                    CreatedDate = _staff.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _staff.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Staff")]
        public JsonResult UpdateStaff(StaffModel staff)
        {
            var _staff = _staffService.Get(x => x.StaffID == staff.StaffID).FirstOrDefault();
            if (_staff != null)
            {
                _staffService.Update(new Staff
                {
                    StaffID = staff.StaffID,
                    StaffName = staff.StaffName,
                    CreatedByUserID = _staff.CreatedByUserID,
                    CreatedDate = _staff.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = staff.Remarks
                });
            }
            return Json(true);
        }

    }
}