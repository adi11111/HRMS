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
    public class BankController : Controller
    {
        private IBankService _bankService;

        public BankController(IBankService _bankService)
        {
            this._bankService = _bankService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Bank")]
        public ActionResult IsNameExists(int Id,string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (_bankService.Get(at => at.BankName.Equals(Name.ToLower()) && at.BankID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else
            {
                if (_bankService.Get(at => at.BankName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            return Json(_result);
        }
        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Bank")]
        public JsonResult AllBanks()
        {
            var _banks = _bankService.Get(x => x.IsDeleted == false).ToList();
            List<BankModel> _bankModel = Mapper.Map<List<BankMaster>, List<BankModel>>(_banks);
            return Json(_bankModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Bank")]
        public ActionResult CreateBank(BankModel bank)
        {
            _bankService.Insert(new BankMaster
            {
                BankName = bank.BankName,
                BranchName = bank.BranchName,
                ContactPerson = bank.ContactPerson,
                ContactNumber = bank.ContactNumber,
                RegionID = bank.RegionID,
                LocationID = bank.LocationID,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = bank.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Bank")]
        public JsonResult BankById(int id)
        {
            return Json(_bankService.Get(x => x.BankID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Bank")]
        public JsonResult DeleteBank(int Id)
        {
            var _bank = _bankService.Get(x => x.BankID == Id).FirstOrDefault();
            if (_bank != null)
            {
                _bankService.Update(new BankMaster
                {
                    BankID = Id,
                    BankName = _bank.BankName,
                    BranchName = _bank.BranchName,
                    ContactPerson = _bank.ContactPerson,
                    ContactNumber = _bank.ContactNumber,
                    RegionID = _bank.RegionID,
                    LocationID = _bank.LocationID,
                    CreatedByUserID = _bank.CreatedByUserID,
                    CreatedDate = _bank.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _bank.Remarks
                },true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Bank")]
        public JsonResult UpdateBank(BankModel bank)
        {
            var _bank = _bankService.Get(x => x.BankID == bank.BankID).FirstOrDefault();
            if (_bank != null)
            {
                _bankService.Update(new BankMaster
                {
                    BankID = bank.BankID,
                    BankName = bank.BankName,
                    BranchName = bank.BranchName,
                    ContactPerson = bank.ContactPerson,
                    ContactNumber = bank.ContactNumber,
                    RegionID = bank.RegionID,
                    LocationID = bank.LocationID,
                    CreatedByUserID = _bank.CreatedByUserID,
                    CreatedDate = _bank.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = bank.Remarks
                });
            }
            return Json(true);
        }
    }
}
