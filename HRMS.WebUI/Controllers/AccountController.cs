using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.Models;
using HRMS.WebUI.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace HRMS.WebUI.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private IUserAccessDetailService _userAccessService;
        private IUserService _userService;
        private IAccountTypeService _accountTypeService;
        private IInterfaceService _interfaceService;

        public AccountController(IUserAccessDetailService _userAccessService, IUserService _userService,IAccountTypeService _accountTypeService, IInterfaceService _interfaceService)
        {
            this._userAccessService = _userAccessService;
            this._userService = _userService;
            this._accountTypeService = _accountTypeService;
            this._interfaceService = _interfaceService;
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult IsNameExists(int Id,string Name)
        {
            var _result = false;
            if(Id > 0)
            {
                if (_accountTypeService.Get(at => at.AccountTypeName.Equals(Name.ToLower()) && at.AccountTypeID != Id && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            else 
            {
                if (_accountTypeService.Get(at => at.AccountTypeName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                {
                    _result = true;
                }
            }
            
            return Json(_result);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(string UserName,string Password)
        {
            if((!string.IsNullOrEmpty(UserName)) && (!string.IsNullOrEmpty(Password)))
            {
                var _user = _userService.Get(x => x.UserName == UserName && x.Password == Password).FirstOrDefault();
                if (_user != null)
                {
                    var _userAccess =  _userAccessService.Get(x => x.UserRoleID == _user.UserRoleID).ToList();
                    var _interfaces = _interfaceService.Get(i=>i.IsDeleted == false).ToList();
                    Utilities.Interfaces = _interfaces;
                    Utilities.UserAccess = _userAccess;
                    //Utilities.LoadInterfaces(_interfaces);
                    if (_userAccess.Count > 0 && _interfaces.Count > 0)
                    {
                        //JsonConvert.SerializeObject(_userAccessModel)
                        //List<UserAccessDetailModel> _userAccessModel = Mapper.Map<List<UserAccessDetail>, List<UserAccessDetailModel>>(_userAccess);
                       // FormsAuthentication.SetAuthCookie("test", false);
                        FormsAuthentication.SetAuthCookie(_user.UserID + "|" + UserName + "|" + _user.UserRoleID + "|" + _user.EmployeeID + "|" + _user.Employee.PhotoPath + "|" + _user.UserRole.RoleName + "|" + _user.Employee.ReportingToID , false);
                        return RedirectToAction("Index", "Home");
                    }
                }
            }

            //    using (userDbEntities entities = new userDbEntities())
            //    {
            //        string username = model.username;
            //        string password = model.password;

            //        // Now if our password was enctypted or hashed we would have done the
            //        // same operation on the user entered password here, But for now
            //        // since the password is in plain text lets just authenticate directly

            //        bool userValid = entities.Users.Any(user => user.username == username && user.password == password);

            //        // User found in the database
            //        if (userValid)
            //        {

            //            FormsAuthentication.SetAuthCookie(username, false);
            //            if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
            //                && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
            //            {
            //                return Redirect(returnUrl);
            //            }
            //            else
            //            {
            //                return RedirectToAction("Index", "Home");
            //            }

            //    }
            //}

            return RedirectToAction("Login", "Account");
        }

        [HttpGet]
        public JsonResult AllAccountTypes()
        {
            if (Response.StatusCode != 403)
            {
                var accountTypes = _accountTypeService.Get(x => x.IsDeleted == false).ToList();
                List<AccountTypeModel> _userAccessModel = Mapper.Map<List<AccountType>, List<AccountTypeModel>>(accountTypes);
                return Json(_userAccessModel, JsonRequestBehavior.AllowGet);
            }
            return Json(null,JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult CreateAccountType(AccountTypeModel accountType)
        {
            if (Response.StatusCode != 403)
            {
                _accountTypeService.Insert(new AccountType
                {
                    AccountTypeName = accountType.AccountTypeName,
                    CreatedByUserID = CurrentUser.UserId,
                    CreatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = accountType.Remarks
                });
                return Json(true);
            }
            return Json(false);
        }

        public JsonResult AccountTypeById(int id)
        {
            if (Response.StatusCode != 403)
            {
                return Json(_accountTypeService.Get(x => x.AccountTypeID == id).FirstOrDefault());
            }
            return Json(false);
        }

        public JsonResult DeleteAccountType(int Id)
        {
            if (Response.StatusCode != 403)
            {
                var _accountType = _accountTypeService.Get(x => x.AccountTypeID == Id).FirstOrDefault();
            if(_accountType != null)
            {
                _accountTypeService.Update(new AccountType
                {
                    AccountTypeID = Id,
                    AccountTypeName = _accountType.AccountTypeName,
                    CreatedByUserID = _accountType.CreatedByUserID,
                    CreatedDate = _accountType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _accountType.Remarks
                },true);
            }
           
            return Json(true);
            }
            return Json(false);
        }
        public JsonResult UpdateAccountType(AccountTypeModel accountType)
        {
            if (Response.StatusCode != 403)
            {
                var _accountType = _accountTypeService.Get(x => x.AccountTypeID == accountType.AccountTypeID).FirstOrDefault();
                if (_accountType != null)
                {
                    _accountTypeService.Update(new AccountType
                    {
                        AccountTypeID = accountType.AccountTypeID,
                        AccountTypeName = accountType.AccountTypeName,
                        CreatedByUserID = _accountType.CreatedByUserID,
                        CreatedDate = _accountType.CreatedDate,
                        UpdatedByUserID = CurrentUser.UserId,
                        UpdatedDate = DateTime.Now,
                        IsDeleted = false,
                        Remarks = accountType.Remarks
                    });
                }
                return Json(true);
            }
            return Json(false);
        }

        //public ActionResult Registration()
        //{
        //    var aa = HttpContext.User.Identity.Name;

        //    return View();
        //}

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }
    }
}
