using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.WebUI.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRMS.WebUI.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private IHomeService _HomeService;
        private ISettingService _settingService;
       
        public HomeController(ISettingService _settingService, IHomeService _HomeService)
        {
            this._HomeService = _HomeService;
            this._settingService = _settingService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetNotifications()
        {
            return Json(_settingService.GetNotificationByUserID(CurrentUser.UserId));
        }
        [HttpPost]
        public ActionResult GetAdminHomeDetail()
        {
            return Json(_HomeService.GetAdminHomeDetail());
        }
        [HttpPost]
        public ActionResult GetHomeDetail()
        {
            return Json(_HomeService.GetHomeDetail(CurrentUser.UserId));
        }
    }
}
