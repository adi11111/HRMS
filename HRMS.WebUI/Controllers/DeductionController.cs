using HRMS.Core.Entities;
using HRMS.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRMS.WebUI.Controllers
{
    [Authorize]
    public class DeductionController : Controller
    {
        private IEmployeeService _EmployeeService;
        private INationalityService _nationalityService;
       
        public DeductionController(IEmployeeService _EmployeeService,INationalityService _nationalityService)
        {
            this._EmployeeService = _EmployeeService;
            this._nationalityService = _nationalityService;
        }
        public ActionResult Index()
        {
            // List<EmployeeMaster> HRMS = _EmployeeService.Get();
            List<Nationality> nationalities = _nationalityService.Get();
            ViewBag.Title = "Home Page";

            return View();
        }
    }
}
