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
    public class RegionController : Controller
    {
        private IRegionService _regionService;

        public RegionController(IRegionService _regionService)
        {
            this._regionService = _regionService;
        }
        // GET: Region
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Region")]
        public ActionResult IsNameExists(int Id, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_regionService.Get(at => at.RegionName.Equals(Name.ToLower()) && at.RegionID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_regionService.Get(at => at.RegionName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            return Json(_result);
        }


        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Region")]
        public JsonResult AllRegion()
        {
            var _region = _regionService.Get(x => x.IsDeleted == false).ToList();
            List<RegionModel> _regionModel = Mapper.Map<List<Region>, List<RegionModel>>(_region);
            return Json(_regionModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Region")]
        public ActionResult CreateRegion(RegionModel region)
        {
            _regionService.Insert(new Region
            {
                RegionName = region.RegionName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = region.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Region")]
        public JsonResult RegionById(int Id)
        {
            return Json(_regionService.Get(x => x.RegionID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Region")]
        public JsonResult DeleteRegion(int Id)
        {
            var _region = _regionService.Get(x => x.RegionID == Id).FirstOrDefault();
            if (_region != null)
            {
                _regionService.Update(new Region
                {
                    RegionID = Id,
                    RegionName = _region.RegionName,
                    CreatedByUserID = _region.CreatedByUserID,
                    CreatedDate = _region.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _region.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Region")]
        public JsonResult UpdateRegion(RegionModel region)
        {
            var _region = _regionService.Get(x => x.RegionID == region.RegionID).FirstOrDefault();
            if (_region != null)
            {
                _regionService.Update(new Region
                {
                    RegionID = region.RegionID,
                    RegionName = region.RegionName,
                    CreatedByUserID = _region.CreatedByUserID,
                    CreatedDate = _region.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = region.Remarks
                });
            }
            return Json(true);
        }

    }
}