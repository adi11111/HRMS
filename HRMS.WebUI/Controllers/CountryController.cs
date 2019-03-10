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
    public class CountryController : Controller
    {
        private ICountryService _countryService;
       
        public CountryController(ICountryService _countryService)
        {
            this._countryService = _countryService;
        }
        public ActionResult Index()
        {
            List<Country> _countries = _countryService.Get();

            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Country")]
        public ActionResult IsNameExists(int Id,string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_countryService.Get(at => at.CountryName.Equals(Name.ToLower()) && at.CountryID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_countryService.Get(at => at.CountryName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            return Json(_result);
        }
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Country")]
        public JsonResult AllCountry()
        {
            var _country = _countryService.Get(x => x.IsDeleted == false).ToList();
            List<CountryModel> _countryModel = Mapper.Map<List<Country>, List<CountryModel>>(_country);
            return Json(_countryModel, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Country")]
        public ActionResult CreateCountry(CountryModel country)
        {
            _countryService.Insert(new Country
            {
                CountryName = country.CountryName,
                CreatedByUserID = CurrentUser.UserId,
                ShortForm = country.ShortForm,
                Currency = country.Currency,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = country.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Country")]
        public JsonResult CountryById(int Id)
        {
            return Json(_countryService.Get(x => x.CountryID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Country")]
        public JsonResult DeleteCountry(int Id)
        {
            var _country = _countryService.Get(x => x.CountryID == Id).FirstOrDefault();
            if (_country != null)
            {
                _countryService.Update(new Country
                {
                    CountryID = Id,
                    CountryName = _country.CountryName,
                    ShortForm = _country.ShortForm,
                    Currency = _country.Currency,
                    CreatedByUserID = _country.CreatedByUserID,
                    CreatedDate = _country.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _country.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Country")]
        public JsonResult UpdateCountry(CountryModel country)
        {
            var _country = _countryService.Get(x => x.CountryID == country.CountryID).FirstOrDefault();
            if (_country != null)
            {
                _countryService.Update(new Country
                {
                    CountryID = country.CountryID,
                    CountryName = country.CountryName,
                    ShortForm = country.ShortForm,
                    Currency = country.Currency,
                    CreatedByUserID = _country.CreatedByUserID,
                    CreatedDate = _country.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = country.Remarks
                });
            }
            return Json(true);
        }

    }
}
