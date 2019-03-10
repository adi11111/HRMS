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
    public class ShareholderController : Controller
    {
        private IShareholderService _shareholderService;
        private IShareholderTypeService _shareholderTypeService;

        public ShareholderController(IShareholderService _shareholderService, IShareholderTypeService _shareholderTypeService)
        {
            this._shareholderService = _shareholderService;
            this._shareholderTypeService = _shareholderTypeService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Shareholder")]
        public ActionResult IsNameExists(int Id, string Entity, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (Entity == "type")
                {
                    if (_shareholderTypeService.Get(at => at.ShareHolderTypeName.Equals(Name.ToLower()) && at.ShareHolderTypeID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                else 
                {
                    if (_shareholderService.Get(at => at.ShareHolderName.Equals(Name.ToLower()) && at.ShareHolderID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            else
            {
                if (Entity == "type")
                {
                    if (_shareholderTypeService.Get(at => at.ShareHolderTypeName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                else
                {
                    if (_shareholderService.Get(at => at.ShareHolderName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }

        #region Shareholder Type

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "ShareholderType")]
        public JsonResult AllshareholderTypes()
        {
            var _shareholderTypes = _shareholderTypeService.Get(x => x.IsDeleted == false).ToList();
            List<ShareHolderTypeModel> _ShareHolderTypeModel = Mapper.Map<List<ShareHolderType>, List<ShareHolderTypeModel>>(_shareholderTypes);
            return Json(_ShareHolderTypeModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "ShareholderType")]
        public ActionResult CreateshareholderType(ShareHolderTypeModel shareholderType)
        {
            _shareholderTypeService.Insert(new ShareHolderType
            {
                ShareHolderTypeName = shareholderType.ShareHolderTypeName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = shareholderType.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "ShareholderType")]
        public JsonResult shareholderTypeById(int id)
        {
            return Json(_shareholderTypeService.Get(x => x.ShareHolderTypeID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "ShareholderType")]
        public JsonResult DeleteShareholderType(int Id)
        {
            var _shareholderType = _shareholderTypeService.Get(x => x.ShareHolderTypeID == Id).FirstOrDefault();
            if (_shareholderType != null)
            {
                _shareholderTypeService.Update(new ShareHolderType
                {
                    ShareHolderTypeID = Id,
                    ShareHolderTypeName = _shareholderType.ShareHolderTypeName,
                    CreatedByUserID = _shareholderType.CreatedByUserID,
                    CreatedDate = _shareholderType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _shareholderType.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "ShareholderType")]
        public JsonResult UpdateShareholderType(ShareHolderTypeModel shareholderType)
        {
            var _shareholderType = _shareholderTypeService.Get(x => x.ShareHolderTypeID == shareholderType.ShareHolderTypeID).FirstOrDefault();
            if (_shareholderType != null)
            {
                _shareholderTypeService.Update(new ShareHolderType
                {
                    ShareHolderTypeID = shareholderType.ShareHolderTypeID,
                    ShareHolderTypeName = shareholderType.ShareHolderTypeName,
                    CreatedByUserID = _shareholderType.CreatedByUserID,
                    CreatedDate = _shareholderType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = shareholderType.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region Shareholder 

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Shareholder")]
        public JsonResult AllShareholders()
        {
            var _shareholder = _shareholderService.Get(x => x.IsDeleted == false).ToList();
            List<ShareHolderModel> _shareholderModel = Mapper.Map<List<ShareHolderDetail>, List<ShareHolderModel>>(_shareholder);
            return Json(_shareholderModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Shareholder")]
        public ActionResult CreateShareholder(ShareHolderModel shareholder)
        {
            var imageName = "";
            if (shareholder.DigitalSignature.Contains("base64"))
            {

                var image = Utilities.LoadImage(shareholder.DigitalSignature.Substring((shareholder.DigitalSignature.IndexOf(',') + 1)));
                imageName = shareholder.ShareHolderName + "(" + shareholder.ShareHolderID + ")" + ".jpg";
                image.Save(Server.MapPath("~/Content/Images/ShareholderImages/" + imageName));
            }
            else
            {
                imageName = shareholder.DigitalSignature.Substring(shareholder.DigitalSignature.LastIndexOf('/') + 1);
            }
            _shareholderService.Insert(new ShareHolderDetail
            {
                ShareHolderName = shareholder.ShareHolderName,
                Address = shareholder.Address,
                //AuthorisedCapital = shareholder.AuthorisedCapital,
                CompanyID = shareholder.CompanyID,
                ContactNumber = shareholder.ContactNumber,
                DigitalSignature = imageName,
                TotalShares = shareholder.TotalShares,
                //IssuedCapital = shareholder.IssuedCapital,
                EmployeeID = shareholder.EmployeeID,
                MobileNumber = shareholder.MobileNumber,
                //NomialValue = shareholder.NomialValue,
                //ShareValue = shareholder.ShareValue,
                //TotalCapital = shareholder.TotalCapital,
                ShareHolderTypeID = shareholder.ShareHolderTypeID,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = shareholder.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Shareholder")]
        public JsonResult ShareholderById(int id)
        {
            return Json(_shareholderService.Get(x => x.ShareHolderID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Shareholder")]
        public JsonResult DeleteShareholder(int Id)
        {
            var _shareholder = _shareholderService.Get(x => x.ShareHolderID == Id).FirstOrDefault();
            if (_shareholder != null)
            {
                _shareholderService.Update(new ShareHolderDetail
                {
                    ShareHolderID = Id,
                    ShareHolderName = _shareholder.ShareHolderName,
                    Address = _shareholder.Address,
                    //AuthorisedCapital = _shareholder.AuthorisedCapital,
                    CompanyID = _shareholder.CompanyID,
                    ContactNumber = _shareholder.ContactNumber,
                    DigitalSignature = _shareholder.DigitalSignature,
                    TotalShares = _shareholder.TotalShares,
                    //IssuedCapital = _shareholder.IssuedCapital,
                    EmployeeID = _shareholder.EmployeeID,
                    MobileNumber = _shareholder.MobileNumber,
                    //NomialValue = _shareholder.NomialValue,
                    //ShareValue = _shareholder.ShareValue,
                    //TotalCapital = _shareholder.TotalCapital,
                    ShareHolderTypeID = _shareholder.ShareHolderTypeID,
                    CreatedByUserID = _shareholder.CreatedByUserID,
                    CreatedDate = _shareholder.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _shareholder.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Shareholder")]
        public JsonResult UpdateShareholder(ShareHolderModel shareholder)
        {
            var imageName = "";
            if (shareholder.DigitalSignature.Contains("base64"))
            {

                var image = Utilities. LoadImage(shareholder.DigitalSignature.Substring((shareholder.DigitalSignature.IndexOf(',') + 1)));
                imageName = shareholder.ShareHolderName + "(" + shareholder.ShareHolderID + ")" + ".jpg";
                image.Save(Server.MapPath("~/Content/Images/ShareholderImages/" + imageName));
            }
            else
            {
                imageName = shareholder.DigitalSignature.Substring(shareholder.DigitalSignature.LastIndexOf('/') + 1);
            }
            var _shareholder = _shareholderService.Get(x => x.ShareHolderID == shareholder.ShareHolderID).FirstOrDefault();
            if (_shareholder != null)
            {
                _shareholderService.Update(new ShareHolderDetail
                {
                    ShareHolderID = shareholder.ShareHolderID,
                    ShareHolderName = shareholder.ShareHolderName,
                    Address = shareholder.Address,
                    //AuthorisedCapital = shareholder.AuthorisedCapital,
                    CompanyID = shareholder.CompanyID,
                    ContactNumber = shareholder.ContactNumber,
                    DigitalSignature = imageName,
                    TotalShares = shareholder.TotalShares,
                    //IssuedCapital = shareholder.IssuedCapital,
                    EmployeeID = shareholder.EmployeeID,
                    MobileNumber = shareholder.MobileNumber,
                    //NomialValue = shareholder.NomialValue,
                    //ShareValue = shareholder.ShareValue,
                    //TotalCapital = shareholder.TotalCapital,
                    ShareHolderTypeID = shareholder.ShareHolderTypeID,
                    CreatedByUserID = _shareholder.CreatedByUserID,
                    CreatedDate = _shareholder.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = shareholder.Remarks
                });
            }
            return Json(true);
        }

        #endregion

    }
}
