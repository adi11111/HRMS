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
    public class CompanyController : Controller
    {
        private ICompanyTypeService _companyTypeService;
        private ICompanyStatusService _companyStatusService;
        private ICompanyService _companyService;
        private IGraduitySettingService _graduitySettingService;
        private IGratuityService _gratuityService;
        private ILeaveService _leaveService;
        public CompanyController(ICompanyTypeService _companyTypeService,ICompanyService _companyService,ICompanyStatusService _companyStatusService, IGraduitySettingService _graduitySettingService, IGratuityService _gratuityService, ILeaveService _leaveService)
        {
            this._companyTypeService = _companyTypeService;
            this._companyService = _companyService;
            this._companyStatusService = _companyStatusService;
            this._graduitySettingService = _graduitySettingService;
            this._gratuityService = _gratuityService;
            this._leaveService = _leaveService;
        }
        public ActionResult Index()
        {
            return View();
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Company")]
        public ActionResult IsNameExists(int Id,string Entity, string Name)
        {
            var _result = false;
            if (Id > 0)
            {
                if (Entity == "status")
                {
                    if (_companyStatusService.Get(at => at.CompanyStatusName.Equals(Name.ToLower()) && at.CompanyStatusID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "type")
                {
                    if (_companyTypeService.Get(at => at.CompanyTypeName.Equals(Name.ToLower()) && at.CompanyTypeID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "company")
                {
                    if (_companyService.Get(at => at.CompanyName.Equals(Name.ToLower()) && at.CompanyID != Id && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "graduity")
                {
                    var _companyId = Convert.ToInt32(Name);
                    if (_graduitySettingService.Get(at => at.GraduitySettingID != Id && at.CompanyID == _companyId && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            else
            {
                if (Entity == "status")
                {
                    if (_companyStatusService.Get(at => at.CompanyStatusName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "type")
                {
                    if (_companyTypeService.Get(at => at.CompanyTypeName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "company")
                {
                    if (_companyService.Get(at => at.CompanyName.Equals(Name.ToLower()) && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
                if (Entity == "graduity")
                {
                    var _companyId = Convert.ToInt32(Name);
                    if (_graduitySettingService.Get(at => at.CompanyID == _companyId && at.IsDeleted == false).Count > 0)
                    {
                        _result = true;
                    }
                }
            }
            return Json(_result);
        }

        #region Company

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Company")]
        public JsonResult AllCompanies()
        {
            var companies = _companyService.Get(x => x.IsDeleted == false).ToList();
            List<CompanyModel> _companyModel = Mapper.Map<List<CompanyMaster>, List<CompanyModel>>(companies);
            return Json(_companyModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Company")]
        public ActionResult CreateCompany(CompanyModel company)
        {
            var image = Utilities.LoadImage(company.Logo.Substring((company.Logo.IndexOf(',') + 1)));
            var imageName = company.CompanyName + "(" + company.CompanyID + ")" + ".jpg";
            image.Save(Server.MapPath("~/Content/Images/CompanyImages/" + imageName));
             _companyService.Insert(new CompanyMaster
            {
                CompanyName = company.CompanyName,
                Logo = imageName,
                AssistedBy = company.AssistedBy,
                EstablishedBy = company.EstablishedBy,
                EstablishmentDate = company.EstablishmentDate,
                InitialValue= company.InitialValue,
                CurrentValue = company.CurrentValue,
                TotalCapital = company.TotalCapital,
                TotalShares = company.TotalShares,
                Currency = company.Currency,
                RegistrationID = company.RegistrationID,
                CompanyTypeID = company.CompanyTypeID,
                Address = company.Address,
                CompanyNumber = company.CompanyNumber,
                CompanyStatusID = company.CompanyStatusID,
                ContactPerson = company.ContactPerson,
                CountryID = company.CountryID,
                MobileNumber = company.MobileNumber,
                OfficeNumber = company.OfficeNumber,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                UpdatedByUserID = CurrentUser.UserId,
                UpdatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = company.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Company")]
        public JsonResult CompanyById(int id)
        {
            return Json(_companyService.Get(x => x.CompanyID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Company")]
        public JsonResult DeleteCompany(int Id)
        {
            var _company = _companyService.Get(x => x.CompanyID == Id).FirstOrDefault();
            if (_company != null)
            {
                _companyService.Update(new CompanyMaster
                {
                    CompanyID = Id,
                    CompanyName = _company.CompanyName,
                    Logo = _company.Logo,
                    AssistedBy = _company.AssistedBy,
                    EstablishedBy = _company.EstablishedBy,
                    EstablishmentDate = _company.EstablishmentDate,
                    InitialValue = _company.InitialValue,
                    CurrentValue = _company.CurrentValue,
                    TotalCapital = _company.TotalCapital,
                    TotalShares = _company.TotalShares,
                    RegistrationID = _company.RegistrationID,
                    CompanyTypeID = _company.CompanyTypeID,
                    Currency = _company.Currency,
                    Address = _company.Address,
                    CompanyNumber = _company.CompanyNumber,
                    CompanyStatusID = _company.CompanyStatusID,
                    ContactPerson = _company.ContactPerson,
                    CountryID = _company.CountryID,
                    MobileNumber = _company.MobileNumber,
                    OfficeNumber = _company.OfficeNumber,
                    CreatedByUserID = _company.CreatedByUserID,
                    CreatedDate = _company.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _company.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Company")]
        public JsonResult UpdateCompany(CompanyModel company)
        {
            var imageName = "";
            if (company.Logo.Contains("base64"))
            {
                var image = Utilities.LoadImage(company.Logo.Substring((company.Logo.IndexOf(',') + 1)));
                imageName = company.CompanyName + "(" + company.CompanyID + ")" + ".jpg";
                image.Save(Server.MapPath("~/Content/Images/CompanyImages/" + imageName));
            }
            else
            {
                imageName = company.Logo.Substring(company.Logo.LastIndexOf('/') + 1);
            }
            var _company = _companyService.Get(x => x.CompanyID == company.CompanyID).FirstOrDefault();
            if (_company != null)
            {
                _companyService.Update(new CompanyMaster
                {
                    CompanyID = company.CompanyID,
                    CompanyName = company.CompanyName,
                    Logo = imageName,
                    AssistedBy = company.AssistedBy,
                    EstablishedBy = company.EstablishedBy,
                    EstablishmentDate =  company.EstablishmentDate,
                    InitialValue = company.InitialValue,
                    CurrentValue = company.CurrentValue,
                    TotalCapital = company.TotalCapital,
                    TotalShares = company.TotalShares,
                    RegistrationID = company.RegistrationID,
                    CompanyTypeID = company.CompanyTypeID,
                    Currency = company.Currency,
                    Address = company.Address,
                    CountryID = company.CountryID,
                    CompanyNumber = company.CompanyNumber,
                    CompanyStatusID = company.CompanyStatusID,
                    ContactPerson = company.ContactPerson,
                    MobileNumber = company.MobileNumber,
                    OfficeNumber = company.OfficeNumber,
                    CreatedByUserID = _company.CreatedByUserID,
                    CreatedDate = _company.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = company.Remarks
                });
            }
            return Json(true);
        }

        #endregion
        
        #region Company Type

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Bank")]
        public JsonResult AllCompanyTypes()
        {
            var companyTypes = _companyTypeService.Get(x=>x.IsDeleted == false).ToList();
            List<CompanyTypeModel> _userAccessModel = Mapper.Map<List<CompanyType>, List<CompanyTypeModel>>(companyTypes);
            return Json( _userAccessModel,JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Bank")]
        public ActionResult CreateCompanyType(CompanyTypeModel companyType)
        {
            _companyTypeService.Insert(new CompanyType {
                CompanyTypeName = companyType.CompanyTypeName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = companyType.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Bank")]
        public JsonResult CompanyTypeById(int id)
        {
            return Json(_companyTypeService.Get(x => x.CompanyTypeID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Bank")]
        public JsonResult DeleteCompanyType(int Id)
        {
            var _companyType = _companyTypeService.Get(x => x.CompanyTypeID == Id).FirstOrDefault();
            if(_companyType != null)
            {
                _companyTypeService.Update(new CompanyType
                {
                    CompanyTypeID = Id,
                    CompanyTypeName = _companyType.CompanyTypeName,
                    CreatedByUserID = _companyType.CreatedByUserID,
                    CreatedDate = _companyType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _companyType.Remarks
                }, true);
            }
           
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Bank")]
        public JsonResult UpdateCompanyType(CompanyTypeModel companyType)
        {
            var _companyType = _companyTypeService.Get(x => x.CompanyTypeID == companyType.CompanyTypeID).FirstOrDefault();
            if (_companyType != null)
            {
                _companyTypeService.Update(new CompanyType
                {
                    CompanyTypeID = companyType.CompanyTypeID,
                    CompanyTypeName = companyType.CompanyTypeName,
                    CreatedByUserID = _companyType.CreatedByUserID,
                    CreatedDate = _companyType.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = companyType.Remarks
                });
            }
                return Json(true);
        }

        #endregion

        #region Company Status

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Bank")]
        public JsonResult AllCompanyStatuss()
        {
            var _companyStatuss = _companyStatusService.Get(x => x.IsDeleted == false).ToList();
            List<CompanyStatusModel> _companyStatusModel = Mapper.Map<List<CompanyStatus>, List<CompanyStatusModel>>(_companyStatuss);
            return Json(_companyStatusModel, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "Bank")]
        public ActionResult CreateCompanyStatus(CompanyStatusModel companyStatus)
        {
            _companyStatusService.Insert(new CompanyStatus
            {
                CompanyStatusName = companyStatus.CompanyStatusName,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = companyStatus.Remarks
            });
            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Bank")]
        public JsonResult CompanyStatusById(int id)
        {
            return Json(_companyStatusService.Get(x => x.CompanyStatusID == id).FirstOrDefault());
        }
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "Bank")]
        public JsonResult DeleteCompanyStatus(int Id)
        {
            var _companyStatus = _companyStatusService.Get(x => x.CompanyStatusID == Id).FirstOrDefault();
            if (_companyStatus != null)
            {
                _companyStatusService.Update(new CompanyStatus
                {
                    CompanyStatusID = Id,
                    CompanyStatusName = _companyStatus.CompanyStatusName,
                    CreatedByUserID = _companyStatus.CreatedByUserID,
                    CreatedDate = _companyStatus.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _companyStatus.Remarks
                }, true);
            }

            return Json(true);
        }
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "Bank")]
        public JsonResult UpdateCompanyStatus(CompanyStatusModel companyStatus)
        {
            var _companyStatus = _companyStatusService.Get(x => x.CompanyStatusID == companyStatus.CompanyStatusID).FirstOrDefault();
            if (_companyStatus != null)
            {
                _companyStatusService.Update(new CompanyStatus
                {
                    CompanyStatusID = companyStatus.CompanyStatusID,
                    CompanyStatusName = companyStatus.CompanyStatusName,
                    CreatedByUserID = _companyStatus.CreatedByUserID,
                    CreatedDate = _companyStatus.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = companyStatus.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region Graduity Setting

        [HttpGet]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "GraduitySetting")]
        public JsonResult AllGraduitySettings()
        {
            var _graduitySetting = _graduitySettingService.Get(x => x.IsDeleted == false).ToList();
            List<GraduityModel> _graduitySettingModel = Mapper.Map<List<GraduitySetting>, List<GraduityModel>>(_graduitySetting);
            return Json(_graduitySettingModel, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Add", InterfaceName = "GraduitySetting")]
        public ActionResult CreateGraduitySetting(GraduityModel graduitySetting)
        {
            _graduitySettingService.Insert(new GraduitySetting
            {
                Year1 = graduitySetting.Year1,
                Year2 = graduitySetting.Year2,
                Year3 = graduitySetting.Year3,
                Year4 = graduitySetting.Year4,
                Year5 = graduitySetting.Year5,
                YearAbove5 = graduitySetting.YearAbove5,
                GratuityType = graduitySetting.GratuityType,
                CompanyID = graduitySetting.CompanyID,
                CreatedByUserID = CurrentUser.UserId,
                CreatedDate = DateTime.Now,
                IsDeleted = false,
                Remarks = graduitySetting.Remarks
            });
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "GraduitySetting")]
        public JsonResult GraduitySettingById(int Id)
        {
            return Json(_graduitySettingService.Get(x => x.GraduitySettingID == Id).FirstOrDefault());
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Delete", InterfaceName = "GraduitySetting")]
        public JsonResult DeleteGraduitySetting(int Id)
        {
            var _graduitySetting = _graduitySettingService.Get(x => x.GraduitySettingID == Id).FirstOrDefault();
            if (_graduitySetting != null)
            {
                _graduitySettingService.Update(new GraduitySetting
                {
                    GraduitySettingID = Id,
                    Year1 = _graduitySetting.Year1,
                    Year2 = _graduitySetting.Year2,
                    Year3 = _graduitySetting.Year3,
                    Year4 = _graduitySetting.Year4,
                    Year5 = _graduitySetting.Year5,
                    YearAbove5 = _graduitySetting.YearAbove5,
                    GratuityType = _graduitySetting.GratuityType,
                    CompanyID = _graduitySetting.CompanyID,
                    CreatedByUserID = _graduitySetting.CreatedByUserID,
                    CreatedDate = _graduitySetting.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = true,
                    Remarks = _graduitySetting.Remarks
                }, true);
            }
            return Json(true);
        }
        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "Edit", InterfaceName = "GraduitySetting")]
        public JsonResult UpdateGraduitySetting(GraduityModel graduitySetting)
        {
            var _graduitySetting = _graduitySettingService.Get(x => x.GraduitySettingID == graduitySetting.GraduitySettingID).FirstOrDefault();
            if (_graduitySetting != null)
            {
                _graduitySettingService.Update(new GraduitySetting
                {
                    GraduitySettingID = graduitySetting.GraduitySettingID,
                    Year1 = graduitySetting.Year1,
                    Year2 = graduitySetting.Year2,
                    Year3 = graduitySetting.Year3,
                    Year4 = graduitySetting.Year4,
                    Year5 = graduitySetting.Year5,
                    YearAbove5 = graduitySetting.YearAbove5,
                    GratuityType = graduitySetting.GratuityType,
                    CompanyID = graduitySetting.CompanyID,
                    CreatedByUserID = _graduitySetting.CreatedByUserID,
                    CreatedDate = _graduitySetting.CreatedDate,
                    UpdatedByUserID = CurrentUser.UserId,
                    UpdatedDate = DateTime.Now,
                    IsDeleted = false,
                    Remarks = graduitySetting.Remarks
                });
            }
            return Json(true);
        }

        #endregion

        #region Gratuity

        [HttpPost]
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Gratuity")]
        public ActionResult GenerateGratuity(DateTime SettlementDate, int CompanyID)
        {
            var _gratuities = _gratuityService.GenerateReport(CompanyID, SettlementDate);
            //var _approvedLeaveStatusID = "ApprovedLeaveStatusID".GetConfigByKey<int>();
            //var _annualLeaveTypeID = "AnnualLeaveTypeID".GetConfigByKey<int>();
           
            //var _leaves = _leaveService.Get(x => x.IsDeleted == false && x.LeaveStatusID == _approvedLeaveStatusID && x.LeaveTypeID == _annualLeaveTypeID).ToList();
            //var _leaveModel = Utilities.GetPendingLeaves(_leaves, _gratuities.Select(g => g.Employee).ToList());

            //for (int i = 0; i < _gratuities.Count; i++)
            //{
            //    _gratuities[i].TotalLeavePending = Convert.ToDecimal(_leaveModel.Where(l => l.EmployeeID == _gratuities[i].EmployeeID).Select(x => x.LeaveBalanceAsNow).LastOrDefault());
            //    _gratuities[i].TotalLeaveSalaryPending =  (_gratuities[i].TotalLeavePending * Convert.ToDecimal(((_gratuities[i].Employee.DailyLeave / 365) * 12)));
            //   // _gratuities[i].GratuityAmount += _gratuities[i].TotalLeaveSalaryPending;
            //}
            List<GratuityModel> _gratuityModels = Mapper.Map<List<Gratuity>, List<GratuityModel>>(_gratuities);
            return Json(_gratuityModels);
        }
        [AccessAuthenticationFilter(EventAccess = "View", InterfaceName = "Gratuity")]
        public ActionResult CreateGratuity(List<GratuityModel> Gratuitys)
        {
            if (Gratuitys != null)
            {
                List<Gratuity> _Gratuitys = new List<Gratuity>();
                for (int i = 0; i < Gratuitys.Count; i++)
                {
                    //if (_previousGratuitys.Count(p => p.EmployeeID == Gratuitys[i].EmployeeID) == 0)
                    //{
                        _Gratuitys.Add(new Gratuity
                        {
                            EmployeeID = Gratuitys[i].EmployeeID,
                            TotalLeavePending = Gratuitys[i].TotalLeavePending,
                            TotalLeaveSalaryPending = Gratuitys[i].TotalLeaveSalaryPending,
                            AirTicketAmount1 = Gratuitys[i].AirTicketAmount1,
                            AirTicketAmount2 = Gratuitys[i].AirTicketAmount2,
                            GratuityAmount = Gratuitys[i].GratuityAmount,
                            OtherAmount1 = Gratuitys[i].OtherAmount1,
                            AdditionAmount1 = Gratuitys[i].AdditionAmount1,
                            AdditionAmount2 = Gratuitys[i].AdditionAmount2,
                            AdditionText1 = Gratuitys[i].AdditionText1,
                            AdditionText2 = Gratuitys[i].AdditionText2,
                            OtherAmount2 = Gratuitys[i].OtherAmount2,
                            OtherAmount3 = Gratuitys[i].OtherAmount3,
                            OtherAmount4 = Gratuitys[i].OtherAmount4,
                            OtherText1 = Gratuitys[i].OtherText1,
                            OtherText2 = Gratuitys[i].OtherText2,
                            OtherText3 = Gratuitys[i].OtherText3,
                            OtherText4 = Gratuitys[i].OtherText4,
                            NoticePeriodAmount = Gratuitys[i].NoticePeriodAmount,
                            NoticePeriodDays = Gratuitys[i].NoticePeriodDays,
                            SettlementDate = Gratuitys[i].SettlementDate,
                            TotalWorkingDays = Gratuitys[i].TotalWorkingDays,
                            CreatedByUserID = CurrentUser.UserId,
                            CreatedDate = DateTime.Now,
                            IsDeleted = false,
                            Remarks = Gratuitys[i].Remarks

                        });
                    //}

                }

                if (_gratuityService.ProcessGratuity(_Gratuitys))
                {
                    //Utilities.SendEmail(
                    //        "Appointment Summary",
                    //        "Your Appointment (" + appointment.AppointmentName + ") on " + appointment.AppointmentDate.ToShortDateString() + "\n From: " + appointment.StartTime + "\n To: " + appointment.EndTime + "\n Concluded: " + appointment.Conclusion,
                    //        "SenderEmail".GetConfigByKey<string>(),
                    //        "SenderPassword".GetConfigByKey<string>(),
                    //        participant.Employee.Email
                    //        );
                }
            }
            return Json(true);
        }

        #endregion
    }
}
