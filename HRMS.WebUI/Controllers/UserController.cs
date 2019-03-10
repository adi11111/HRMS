using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.Models;
using HRMS.WebUI.Common;
using HRMS.WebUI.Filters;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace HRMS.WebUI.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private IUserRoleService _userRoleService;
        private IUserService _userService;
        private IInterfaceService _interfaceService;
        private IUserAccessDetailService _userAccessDetailService;

        public UserController(IUserRoleService _userRoleService,IUserService _userService, IInterfaceService _interfaceService, IUserAccessDetailService _userAccessDetailService)
        {
            this._userRoleService = _userRoleService;
            this._userService = _userService;
            this._interfaceService = _interfaceService;
            this._userAccessDetailService = _userAccessDetailService;
        }
        // GET: UserRole
        public ActionResult Index()
        {
            return View();
        }

        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "User")]
        public ActionResult IsNameExists(int Id, string Entity, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (Entity == "role")
                {
                    if (_userRoleService.Get(at => at.RoleName.Equals(Name.ToLower()) && at.UserRoleID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "interface")
                {
                    if (_interfaceService.Get(at => at.InterfaceName.Equals(Name.ToLower()) && at.InterfaceID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            else
            {
                if (Entity == "role")
                {
                    if (_userRoleService.Get(at => at.RoleName.Equals(Name.ToLower()) && at.UserRoleID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "interface")
                {
                    if (_interfaceService.Get(at => at.InterfaceName.Equals(Name.ToLower()) && at.InterfaceID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }

        #region User

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "UserDetails")]
        public JsonResult AllUsers()
        {
            var _users = _userService.Get(x => x.IsDeleted == false).ToList();
            List<UserModel> _userModel = Mapper.Map<List<UserMaster>, List<UserModel>>(_users);
            return Json(_userModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "UserDetails")]
        public ActionResult CreateUser(UserModel user)
        {
            _userService.Insert(new UserMaster
            {
                UserName = user.UserName,
                Password = user.Password,
                EmployeeID = user.EmployeeID,
                UserRoleID = user.UserRoleID,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = user.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "UserDetails")]
        public JsonResult UserById(int id)
        {
            return Json(_userService.Get(x => x.UserID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "UserDetails")]
        public JsonResult DeleteUser(int Id)
        {
            var _user = _userService.Get(x => x.UserID == Id).FirstOrDefault();
            if (_user != null)
            {
                _userService.Update(new UserMaster
                {
                    UserID = Id,
                    UserName = _user.UserName,
                    Password = _user.Password,
                    EmployeeID = _user.EmployeeID,
                    UserRoleID = _user.UserRoleID,
                    CreatedByUserID = _user.CreatedByUserID,
                    CreatedDate = _user.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _user.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "UserDetails")]
        public JsonResult UpdateUser(UserModel user)
        {
            var _user = _userService.Get(x => x.UserID == user.UserID).FirstOrDefault();
            if (_user != null)
            {
                _userService.Update(new UserMaster
                {
                    UserID = user.UserID,
                    UserName = user.UserName,
                    Password = user.Password,
                    EmployeeID = user.EmployeeID,
                    UserRoleID = user.UserRoleID,
                    CreatedByUserID = _user.CreatedByUserID,
                    CreatedDate = _user.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = user.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region User Role

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "UserRoles")]
        public JsonResult AllUserRole()
        {
            var _userRole = _userRoleService.Get(x => x.IsDeleted == false).ToList();
            List<UserRoleModel> _userRoleModel = Mapper.Map<List<UserRole>, List<UserRoleModel>>(_userRole);
            return Json(_userRoleModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "UserRoles")]
        public ActionResult CreateUserRole(UserRoleModel userRole)
        {
            _userRoleService.Insert(new UserRole
            {
                RoleName = userRole.RoleName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = userRole.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "UserRoles")]
        public JsonResult UserRoleById(int Id)
        {
            return Json(_userRoleService.Get(x => x.UserRoleID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "UserRoles")]
        public JsonResult DeleteUserRole(int Id)
        {
            var _userRole = _userRoleService.Get(x => x.UserRoleID == Id).FirstOrDefault();
            if (_userRole != null)
            {
                _userRoleService.Update(new UserRole
                {
                    UserRoleID = Id,
                    RoleName = _userRole.RoleName,
                    CreatedByUserID = _userRole.CreatedByUserID,
                    CreatedDate = _userRole.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _userRole.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "UserRoles")]
        public JsonResult UpdateUserRole(UserRoleModel userRole)
        {
            var _userRole = _userRoleService.Get(x => x.UserRoleID == userRole.UserRoleID).FirstOrDefault();
            if (_userRole != null)
            {
                _userRoleService.Update(new UserRole
                {
                    UserRoleID = userRole.UserRoleID,
                    RoleName = userRole.RoleName,
                    CreatedByUserID = _userRole.CreatedByUserID,
                    CreatedDate = _userRole.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = userRole.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        
        #region User Access 

        //  [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "UserRights")]
        public ActionResult AllUserAccessByRoleId(int Id)
        {
            var _userAccessDetail = _userAccessDetailService.Get(a => a.IsDeleted == false && a.UserRoleID == Id).ToList();
            List<UserAccessDetailModel> _userAccessDetailModel = Mapper.Map<List<UserAccessDetail>, List<UserAccessDetailModel>>(_userAccessDetail);
            return Json(_userAccessDetailModel, JsonRequestBehavior.AllowGet);
        }

        //[HttpGet]
        //public ActionResult AllUserEvents()
        //{
        //    return Json(new List<HRMS.Core.Entities.EventAccess> { new EventAccess() }, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "UserRights")]
        public ActionResult CreateUserAccess(List<UserAccessDetailModel> userAccessDetailModel)
        {
            List<UserAccessDetail> _userAccessDetail = Mapper.Map<List<UserAccessDetailModel>, List<UserAccessDetail>>(userAccessDetailModel);
            for (int i = 0; i < _userAccessDetail.Count; i++)
            {
                _userAccessDetail[i].CreatedByUserID = CurrentUser.UserId;
                _userAccessDetail[i].CreatedDate = DateTime.Now;
            }
            //_userAccessDetailService.ExecSql("UserAccess_DeleteByRoleID"
            //, new SqlParameter("@UserRoleID", SqlDbType.Int) { Value = userAccessDetailModel[0].UserRoleID}
            //);
            _userAccessDetailService.ExecSqlQuery("delete from useraccessdetails where userroleid =" + userAccessDetailModel[0].UserRoleID);
            //_userAccessDetailService.DeleteBulk(_userAccessDetail);
            _userAccessDetailService.AddRange(_userAccessDetail);
            Utilities.UserAccess = _userAccessDetail;
            return Json(true);
        }

        #endregion

        
        #region Interface

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "InterfaceDetails")]
        public JsonResult AllInterfaces()
        {
            var interfaces = _interfaceService.Get(x => x.IsDeleted == false).ToList();
            List<InterfaceModel> interfaceModel = Mapper.Map<List<Interface>, List<InterfaceModel>>(interfaces);
            return Json(interfaceModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "InterfaceDetails")]
        public ActionResult CreateInterface(InterfaceModel interfaceModel)
        {
            _interfaceService.Insert(new Interface
            {
                InterfaceName = interfaceModel.InterfaceName,
                ParentInterfaceID = interfaceModel.ParentInterfaceID,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = interfaceModel.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "InterfaceDetails")]
        public JsonResult InterfaceById(int id)
        {
            return Json(_interfaceService.Get(x => x.InterfaceID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "InterfaceDetails")]
        public JsonResult DeleteInterface(int Id)
        {
            var _interface = _interfaceService.Get(x => x.InterfaceID == Id).FirstOrDefault();
            if (_interface != null)
            {
                _interfaceService.Update(new Interface
                {
                    InterfaceID = Id,
                    InterfaceName = _interface.InterfaceName,
                    ParentInterfaceID = _interface.ParentInterfaceID,
                    CreatedByUserID = _interface.CreatedByUserID,
                    CreatedDate = _interface.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _interface.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "InterfaceDetails")]
        public JsonResult UpdateInterface(InterfaceModel interfaceModel)
        {
            var _interface = _interfaceService.Get(x => x.InterfaceID == interfaceModel.InterfaceID).FirstOrDefault();
            if (_interface != null)
            {
                _interfaceService.Update(new Interface
                {
                    InterfaceID = _interface.InterfaceID,
                    InterfaceName = interfaceModel.InterfaceName,
                    ParentInterfaceID = interfaceModel.ParentInterfaceID,
                    CreatedByUserID = _interface.CreatedByUserID,
                    CreatedDate = _interface.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = interfaceModel.Remarks
                });
            }
            return Json(true);
        }

        #endregion

    }
}