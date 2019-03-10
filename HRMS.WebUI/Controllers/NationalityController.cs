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
    public class NationalityController : Controller
    {
        private INationalityService _nationlityService;

        public NationalityController(INationalityService _nationlityService)
        {
            this._nationlityService = _nationlityService;
        }
        // GET: Nationality
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Nationality")]
        public ActionResult IsNameExists(int Id, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_nationlityService.Get(at => at.NationalityName.Equals(Name.ToLower()) && at.NationalityID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_nationlityService.Get(at => at.NationalityName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            return Json(_result);
        }

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Nationality")]
        public JsonResult AllNationality()
        {
            var _nationality = _nationlityService.Get(x => x.IsDeleted == false).ToList();
            List<NationalityModel> _nationalityModel = Mapper.Map<List<Nationality>, List<NationalityModel>>(_nationality);
            return Json(_nationalityModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Nationality")]
        public ActionResult CreateNationality(NationalityModel nationality)
        {
            _nationlityService.Insert(new Nationality
            {
                NationalityName = nationality.NationalityName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = nationality.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Nationality")]
        public JsonResult NationalityById(int Id)
        {
            return Json(_nationlityService.Get(x => x.NationalityID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Nationality")]
        public JsonResult DeleteNationality(int Id)
        {
            var _nationality = _nationlityService.Get(x => x.NationalityID == Id).FirstOrDefault();
            if (_nationality != null)
            {
                _nationlityService.Update(new Nationality
                {
                    NationalityID = Id,
                    NationalityName = _nationality.NationalityName,
                    CreatedByUserID = _nationality.CreatedByUserID,
                    CreatedDate = _nationality.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _nationality.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Nationality")]
        public JsonResult UpdateNationality(NationalityModel nationality)
        {
            var _nationality = _nationlityService.Get(x => x.NationalityID == nationality.NationalityID).FirstOrDefault();
            if (_nationality != null)
            {
                _nationlityService.Update(new Nationality
                {
                    NationalityID = nationality.NationalityID,
                    NationalityName = nationality.NationalityName,
                    CreatedByUserID = _nationality.CreatedByUserID,
                    CreatedDate = _nationality.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = nationality.Remarks
                });
            }
            return Json(true);
        }

    }
}