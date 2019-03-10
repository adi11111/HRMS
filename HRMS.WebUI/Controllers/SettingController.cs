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
    public class SettingController : Controller
    {
        private ISettingService _settingService;

        public SettingController( ISettingService _settingService)
        {
            this._settingService = _settingService;
        }
        // GET: Setting
        public ActionResult Index()
        {
            return View();
        }

        #region Setting

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Setting")]
        public JsonResult AllSettings(int Id)
        {
            List<SettingMaster> _settings = null;
            if (Id == 1)
            {
                _settings = _settingService.Get(x => x.IsDeleted == false && x.AppointmentID > 0).ToList();
            }
            else if (Id == 0)
            {
                _settings = _settingService.Get(x => x.IsDeleted == false && x.DocumentID > 0).ToList();
            }

            List<SettingModel> _settingModel = Mapper.Map<List<SettingMaster>, List<SettingModel>>(_settings);
            return Json(_settingModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Setting")]
        public ActionResult CreateSetting(SettingModel setting)
        {
            _settingService.Insert(new SettingMaster
            {
                AppointmentID = setting.AppointmentID,
                DocumentID = setting.DocumentID,
               // Email = setting.Email,
               Interval = setting.Interval,
               LastEmailSent = setting.LastEmailSent,
                EmailDays = setting.EmailDays,
                IsEmailRequired = setting.IsEmailRequired,
                PopUpDays = setting.PopUpDays,
                IsPopUpRequired = setting.IsPopUpRequired,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = setting.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Setting")]
        public JsonResult SettingById(int id)
        {
            return Json(_settingService.Get(x => x.SettingID == id && x.IsDeleted == false).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Setting")]
        public JsonResult DeleteSetting(int Id)
        {
            var _setting = _settingService.Get(x => x.SettingID == Id && x.IsDeleted == false).FirstOrDefault();
            if (_setting != null)
            {
                _settingService.Update(new SettingMaster
                {
                    SettingID = Id,
                    AppointmentID = _setting.AppointmentID,
                    DocumentID = _setting.DocumentID,
                    //Email = _setting.Email,
                    Interval = _setting.Interval,
                    LastEmailSent = _setting.LastEmailSent,
                    EmailDays = _setting.EmailDays,
                    IsEmailRequired = _setting.IsEmailRequired,
                    PopUpDays = _setting.PopUpDays,
                    IsPopUpRequired = _setting.IsPopUpRequired,
                    CreatedDate = _setting.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _setting.Remarks
                });
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Setting")]
        public JsonResult UpdateSetting(List<SettingModel> settings)
        {
            for (int i = 0; i < settings.Count; i++)
            {
                settings[i].CreatedByUserID = CurrentUser.UserId;
                settings[i].CreatedDate = DateTime.Now;
                settings[i].IsDeleted = false;
            }
           var _settings = Mapper.Map<List<SettingModel>, List<SettingMaster>>(settings);
            _settingService.UpdateSetting(_settings);
            return Json(true);
        }

        #endregion
    }
}