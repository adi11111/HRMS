using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.Models;
using HRMS.WebUI.Common;
using HRMS.WebUI.Filters;
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
    public class DocumentController : Controller
    {
        private IDocumentCategoryService _documentCategoryService;
        private IDocumentTypeService _documentTypeService;
        private IDocumentDetailService _documentDetailService;
        private IDocumentRenewalStatusService _documentRenewalStatusService;
        private ISettingService _settingService;
        private IParticipantService _participantService;

        public DocumentController(IDocumentTypeService _documentTypeService, IDocumentDetailService _documentDetailService, IDocumentCategoryService _documentCategoryService, ISettingService _settingService, IDocumentRenewalStatusService _documentRenewalStatusService,IParticipantService _participantService)
        {
            this._documentCategoryService = _documentCategoryService;
            this._documentTypeService = _documentTypeService;
            this._documentDetailService = _documentDetailService;
            this._settingService = _settingService;
            this._documentRenewalStatusService = _documentRenewalStatusService;
            this._participantService = _participantService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Document")]
        public ActionResult IsNameExists(int Id,string Entity, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (Entity == "category")
                {
                    if (_documentCategoryService.Get(at => at.DocumentCategoryName.Equals(Name.ToLower()) && at.DocumentCategoryID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "type")
                {
                    if (_documentTypeService.Get(at => at.DocumentTypeName.Equals(Name.ToLower()) && at.DocumentTypeID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "renewal")
                {
                    if (_documentRenewalStatusService.Get(at => at.DocumentRenewalStatusName.Equals(Name.ToLower()) && at.DocumentRenewalStatusID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "document")
                {
                    if (_documentDetailService.Get(at => at.SearchName.Equals(Name.ToLower()) && at.DocumentID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            else
            {
                if (Entity == "category")
                {
                    if (_documentCategoryService.Get(at => at.DocumentCategoryName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "type")
                {
                    if (_documentTypeService.Get(at => at.DocumentTypeName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "renewal")
                {
                    if (_documentRenewalStatusService.Get(at => at.DocumentRenewalStatusName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "document")
                {
                    if (_documentDetailService.Get(at => at.SearchName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }

        #region Document

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Document")]
        public JsonResult AllDocuments()
        {
            var _documents = _documentDetailService.Get(x => x.IsDeleted == false).ToList();
            List<DocumentDetailModel> _documentModel = Mapper.Map<List<DocumentDetail>, List<DocumentDetailModel>>(_documents);
            return Json(_documentModel, JsonRequestBehavior.AllowGet);
        }
        // 
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Document")]
        public ActionResult CreateDocument(DocumentDetailModel document)
        {
            var _documentType = _documentTypeService.Get(d=>d.DocumentTypeID == document.DocumentTypeID && d.IsDeleted == false).FirstOrDefault();
            DocumentDetail _documentDetail = null;
            if(_documentType != null)
            {
                Byte[] bytes = Convert.FromBase64String(document.FileLocation.Substring((document.FileLocation.IndexOf(',') + 1)));
                System.IO.File.WriteAllBytes(Server.MapPath("~/Content/Documents/" + _documentType.DocumentTypeName + "/" + document.SearchName + "." + document.FileExt), bytes);
                _documentDetail = _documentDetailService.Insert(new DocumentDetail
                {
                    CompanyID = document.CompanyID,
                    EmployeeID = document.EmployeeID,
                    ProcessOwnerID = document.ProcessOwnerID,
                    DocumentCategoryID = document.DocumentCategoryID,
                    DocumentTypeID = document.DocumentTypeID,
                    SearchName = document.SearchName + "." + document.FileExt,
                    DocumentIssueDate = document.DocumentIssueDate,
                    ExpiryDate = document.ExpiryDate,
                    IssuingAuthority = document.IssuingAuthority,
                    DocumentNumber = document.DocumentNumber,
                    DocumentRenewalStatusID = document.DocumentRenewalStatusID,
                    CreatedByUserID = CurrentUser.UserId,
                    CreatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = document.Remarks
                });
            }
            var _appointmentReferenceID = "AppointmentReferenceID".GetConfigByKey<int>();
            List<Participant> _participants = Mapper.Map<List<ParticipantModel>, List<Participant>>(document.Participants);
            for (int i = 0; i < _participants.Count; i++)
            {
                _participants[i].CreatedByUserID = CurrentUser.UserId;
                _participants[i].CreatedDate = DateTime.Now;
                _participants[i].DocumentID = _documentDetail.DocumentID;
                _participants[i].AppointmentID = _appointmentReferenceID;
                _participants[i].IsDeleted = false;
            }
            _participantService.UpdateParticipant(_participants);
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Document")]
        public JsonResult DocumentById(int id)
        {
            return Json(_documentDetailService.Get(x => x.DocumentID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Document")]
        public JsonResult DeleteDocument(int Id)
        {
            var _document = _documentDetailService.Get(x => x.DocumentID == Id).FirstOrDefault();
            if (_document != null)
            {
                _documentDetailService.Update(new DocumentDetail
                {
                    DocumentID = Id,
                    CompanyID = _document.CompanyID,
                    EmployeeID = _document.EmployeeID,
                    ProcessOwnerID = _document.ProcessOwnerID,
                    DocumentCategoryID = _document.DocumentCategoryID,
                    DocumentRenewalStatusID = _document.DocumentRenewalStatusID,
                    DocumentTypeID = _document.DocumentTypeID,
                    SearchName = _document.SearchName,
                    DocumentIssueDate = _document.DocumentIssueDate,
                    ExpiryDate = _document.ExpiryDate,
                    IssuingAuthority = _document.IssuingAuthority,
                    DocumentNumber = _document.DocumentNumber,
                    CreatedByUserID = _document.CreatedByUserID,
                    CreatedDate = _document.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _document.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Document")]
        public JsonResult UpdateDocument(DocumentDetailModel document)
        {
            var _document = _documentDetailService.Get(x => x.DocumentID == document.DocumentID).FirstOrDefault();
            if (_document != null)
            {
                if (document.FileLocation != null)
                {
                    Byte[] bytes = Convert.FromBase64String(document.FileLocation.Substring((document.FileLocation.IndexOf(',') + 1)));
                    if(document.SearchName.IndexOf('.') > 0)
                    document.SearchName = document.SearchName.Substring(0,document.SearchName.LastIndexOf('.'));
                    System.IO.File.WriteAllBytes(Server.MapPath("~/Content/Documents/" + _document.DocumentType.DocumentTypeName + "/" + document.SearchName + "." + document.FileExt), bytes);
                }
                _documentDetailService.Update(new DocumentDetail
                {
                    DocumentID = document.DocumentID,
                    CompanyID = document.CompanyID,
                    EmployeeID = document.EmployeeID,
                    ProcessOwnerID = document.ProcessOwnerID,
                    DocumentTypeID = document.DocumentTypeID,
                    DocumentCategoryID = document.DocumentCategoryID,
                    DocumentRenewalStatusID = document.DocumentRenewalStatusID,
                    SearchName = document.SearchName + "." + document.FileExt,
                    DocumentIssueDate = document.DocumentIssueDate,
                    ExpiryDate = document.ExpiryDate,
                    IssuingAuthority = document.IssuingAuthority,
                    DocumentNumber = document.DocumentNumber,
                    CreatedByUserID = _document.CreatedByUserID,
                    CreatedDate = _document.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = document.Remarks
                });
                var _appointmentReferenceID = "AppointmentReferenceID".GetConfigByKey<int>();
                List<Participant> _participants = Mapper.Map<List<ParticipantModel>, List<Participant>>(document.Participants);
                for (int i = 0; i < _participants.Count; i++)
                {
                    _participants[i].CreatedByUserID = CurrentUser.UserId;
                    _participants[i].CreatedDate = DateTime.Now;
                    _participants[i].DocumentID = document.DocumentID;
                    _participants[i].AppointmentID = _appointmentReferenceID;
                    _participants[i].IsDeleted = false;
                }
                
                _participantService.UpdateParticipant(_participants);
            }
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Document")]
        public JsonResult CheckSearchName(string searchName)
        {
            return Json(_documentDetailService.Get(d => d.SearchName.ToLower().Equals(searchName.ToLower())).Count > 0,JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Document Category

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DocumentCategory")]
        public JsonResult AllDocumentCategorys()
        {
            var _documentCategorys = _documentCategoryService.Get(x => x.IsDeleted == false).ToList();
            List<DocumentCategoryModel> _documentCategoryModel = Mapper.Map<List<DocumentCategory>, List<DocumentCategoryModel>>(_documentCategorys);
            return Json(_documentCategoryModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "DocumentCategory")]
        public ActionResult CreateDocumentCategory(DocumentCategoryModel documentCategory)
        {
            _documentCategoryService.Insert(new DocumentCategory
            {
                DocumentCategoryName = documentCategory.DocumentCategoryName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = documentCategory.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DocumentCategory")]
        public JsonResult DocumentCategoryById(int id)
        {
            return Json(_documentCategoryService.Get(x => x.DocumentCategoryID == id && x.IsDeleted == false).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "DocumentCategory")]
        public JsonResult DeleteDocumentCategory(int Id)
        {
            var _documentCategory = _documentCategoryService.Get(x => x.DocumentCategoryID == Id).FirstOrDefault();
            if (_documentCategory != null)
            {
                _documentCategoryService.Update(new DocumentCategory
                {
                    DocumentCategoryID = Id,
                    DocumentCategoryName = _documentCategory.DocumentCategoryName,
                    CreatedDate = _documentCategory.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _documentCategory.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "DocumentCategory")]
        public JsonResult UpdateDocumentCategory(DocumentCategoryModel documentCategory)
        {
            var _documentCategory = _documentCategoryService.Get(x => x.DocumentCategoryID == documentCategory.DocumentCategoryID && x.IsDeleted == false).FirstOrDefault();
            if (_documentCategory != null)
            {
                _documentCategoryService.Update(new DocumentCategory
                {
                    DocumentCategoryID = documentCategory.DocumentCategoryID,
                    DocumentCategoryName = documentCategory.DocumentCategoryName,
                    CreatedByUserID = _documentCategory.CreatedByUserID,
                    CreatedDate = _documentCategory.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = documentCategory.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region Document Type

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DocumentType")]
        public JsonResult AllDocumentTypes()
        {
            var documentTypes = _documentTypeService.Get(x => x.IsDeleted == false).ToList();
            List<DocumentTypeModel> _userAccessModel = Mapper.Map<List<DocumentType>, List<DocumentTypeModel>>(documentTypes);
            return Json(_userAccessModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "DocumentType")]
        public ActionResult CreateDocumentType(DocumentTypeModel documentType)
        {
            _documentTypeService.Insert(new DocumentType
            {
                DocumentTypeName = documentType.DocumentTypeName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = documentType.Remarks
            });
            System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/Documents/"+documentType.DocumentTypeName));
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DocumentType")]
        public JsonResult DocumentTypeById(int id)
        {
            return Json(_documentTypeService.Get(x => x.DocumentTypeID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "DocumentType")]
        public JsonResult DeleteDocumentType(int Id)
        {
            var _documentType = _documentTypeService.Get(x => x.DocumentTypeID == Id).FirstOrDefault();
            if (_documentType != null)
            {
                _documentTypeService.Update(new DocumentType
                {
                    DocumentTypeID = Id,
                    DocumentTypeName = _documentType.DocumentTypeName,
                    CreatedByUserID = _documentType.CreatedByUserID,
                    CreatedDate = _documentType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _documentType.Remarks
                }, true);
            }
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "DocumentType")]
        public JsonResult UpdateDocumentType(DocumentTypeModel documentType)
        {
            var _documentType = _documentTypeService.Get(x => x.DocumentTypeID == documentType.DocumentTypeID).FirstOrDefault();
            if (_documentType != null)
            {
                _documentTypeService.Update(new DocumentType
                {
                    DocumentTypeID = documentType.DocumentTypeID,
                    DocumentTypeName = documentType.DocumentTypeName,
                    CreatedByUserID = _documentType.CreatedByUserID,
                    CreatedDate = _documentType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = documentType.Remarks
                });
                System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/Documents/" + documentType.DocumentTypeName));
            }
            return Json(true);
        }


        #endregion

        #region Document Renewal Status

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DocumentRenewalStatus")]
        public JsonResult AllDocumentRenewalStatus()
        {
            var _documentRenewalStatus = _documentRenewalStatusService.Get(x => x.IsDeleted == false).ToList();
            List<DocumentRenewalStatusModel> _documentRenewalStatusModel = Mapper.Map<List<DocumentRenewalStatus>, List<DocumentRenewalStatusModel>>(_documentRenewalStatus);
            return Json(_documentRenewalStatusModel, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "DocumentRenewalStatus")]
        public ActionResult CreateDocumentRenewalStatus(DocumentRenewalStatusModel documentRenewalStatus)
        {
            _documentRenewalStatusService.Insert(new DocumentRenewalStatus
            {
                DocumentRenewalStatusName = documentRenewalStatus.DocumentRenewalStatusName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = documentRenewalStatus.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "DocumentRenewalStatus")]
        public JsonResult DocumentRenewalStatusById(int Id)
        {
            return Json(_documentRenewalStatusService.Get(x => x.DocumentRenewalStatusID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "DocumentRenewalStatus")]
        public JsonResult DeleteDocumentRenewalStatus(int Id)
        {
            var _documentRenewalStatus = _documentRenewalStatusService.Get(x => x.DocumentRenewalStatusID == Id).FirstOrDefault();
            if (_documentRenewalStatus != null)
            {
                _documentRenewalStatusService.Update(new DocumentRenewalStatus
                {
                    DocumentRenewalStatusID = Id,
                    DocumentRenewalStatusName = _documentRenewalStatus.DocumentRenewalStatusName,
                    CreatedByUserID = _documentRenewalStatus.CreatedByUserID,
                    CreatedDate = _documentRenewalStatus.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _documentRenewalStatus.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "DocumentRenewalStatus")]
        public JsonResult UpdateDocumentRenewalStatus(DocumentRenewalStatusModel documentRenewalStatus)
        {
            var _documentRenewalStatus = _documentRenewalStatusService.Get(x => x.DocumentRenewalStatusID == documentRenewalStatus.DocumentRenewalStatusID).FirstOrDefault();
            if (_documentRenewalStatus != null)
            {
                _documentRenewalStatusService.Update(new DocumentRenewalStatus
                {
                    DocumentRenewalStatusID = documentRenewalStatus.DocumentRenewalStatusID,
                    DocumentRenewalStatusName = documentRenewalStatus.DocumentRenewalStatusName,
                    CreatedByUserID = _documentRenewalStatus.CreatedByUserID,
                    CreatedDate = _documentRenewalStatus.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = documentRenewalStatus.Remarks
                });
            }
            return Json(true);
        }

        #endregion

    }
}
