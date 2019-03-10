using HRMS.WebUI.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Filters;

namespace HRMS.WebUI.Filters
{
    public class AccessAuthenticationFilter : ActionFilterAttribute, IAuthenticationFilter
    {

        public string InterfaceName { get; set; }
        public string EventAccess { get; set; }

        void IAuthenticationFilter.OnAuthentication(AuthenticationContext filterContext)
        {

            //var Controller = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            //var Action = filterContext.ActionDescriptor.ActionName;
            //var User = filterContext.HttpContext.User;
            //var IP = filterContext.HttpContext.Request.UserHostAddress;
            if("AdminRole".GetConfigByKey<int>() != CurrentUser.UserRoleId)
            {
                //var _interfaces = InterfaceName.Split(',');
                //for (int i = 0; i <  _interfaces.Count(); i++)
                //{
                    var _userAccess = Utilities.UserAccess.Where(ua => ua.EventAccess == EventAccess.GetConfigByKey<int>() && ua.InterfaceID == Utilities.GetInterfaceIdByName(InterfaceName) && ua.UserRoleID == CurrentUser.UserRoleId).FirstOrDefault();
                    if (_userAccess == null)
                    {
                 
                    filterContext.HttpContext.Response.StatusCode = 403;
                    filterContext.Result = new EmptyResult();
                }
                //}
               
            }

           // throw new NotImplementedException();
        }

        void IAuthenticationFilter.OnAuthenticationChallenge(AuthenticationChallengeContext filterContext)
        {
            if (filterContext.Result == null || filterContext.Result is HttpUnauthorizedResult)
            {
                filterContext.Result = new RedirectToRouteResult("Default",
                new System.Web.Routing.RouteValueDictionary{
                {"controller", "Account"},
                {"action", "Login"},
                {"returnUrl", filterContext.HttpContext.Request.RawUrl}
                });
            }
        }
    }
}