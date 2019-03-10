using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace HRMS.WebUI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
              "DocumentDetail",
              "Document/CheckSearchName/{searchName}",
              new { Controller = "Document", action = "CheckSearchName", id = UrlParameter.Optional });
            routes.MapRoute(
            "GeneratePayrol",
            "Salary/GeneratePayslip/{month}",
            new { Controller = "Salary", action = "GeneratePayslip" });
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
           
        }
    }
}
