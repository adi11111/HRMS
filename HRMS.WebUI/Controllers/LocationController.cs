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
    public class LocationController : Controller
    {
        private ILocationService _locationService;

        public LocationController(ILocationService _locationService)
        {
            this._locationService = _locationService;
        }
        // GET: Location
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Location")]
        public ActionResult IsNameExists(int Id, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_locationService.Get(at => at.LocationName.Equals(Name.ToLower()) && at.LocationID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_locationService.Get(at => at.LocationName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            return Json(_result);
        }

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Location")]
        public JsonResult AllLocation()
        {
            var _department = _locationService.Get(x => x.IsDeleted == false).ToList();
            List<LocationModel> _departmentModel = Mapper.Map<List<Location>, List<LocationModel>>(_department);
            return Json(_departmentModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Location")]
        public ActionResult CreateLocation(LocationModel department)
        {
            _locationService.Insert(new Location
            {
                LocationName = department.LocationName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = department.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Location")]
        public JsonResult LocationById(int Id)
        {
            return Json(_locationService.Get(x => x.LocationID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Location")]
        public JsonResult DeleteLocation(int Id)
        {
            var _department = _locationService.Get(x => x.LocationID == Id).FirstOrDefault();
            if (_department != null)
            {
                _locationService.Update(new Location
                {
                    LocationID = Id,
                    LocationName = _department.LocationName,
                    CreatedByUserID = _department.CreatedByUserID,
                    CreatedDate = _department.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _department.Remarks
                },true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Location")]
        public JsonResult UpdateLocation(LocationModel department)
        {
            var _department = _locationService.Get(x => x.LocationID == department.LocationID).FirstOrDefault();
            if (_department != null)
            {
                _locationService.Update(new Location
                {
                    LocationID = department.LocationID,
                    LocationName = department.LocationName,
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