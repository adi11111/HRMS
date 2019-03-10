using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace HRMS.WebUI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            UnityConfig.RegisterComponents();
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<UserAccessDetail, UserAccessDetailModel>();
                cfg.CreateMap<UserAccessDetailModel, UserAccessDetail>();
                cfg.CreateMap<AttendenceStatus, AttendenceStatusModel>();
                cfg.CreateMap<ShiftMaster, ShiftModel>();
                cfg.CreateMap<Attendence, AttendenceModel>();
                cfg.CreateMap<Appointment, AppointmentModel>();
                cfg.CreateMap<Participant, ParticipantModel>();
                cfg.CreateMap<ParticipantModel, Participant>();
                cfg.CreateMap<BankMaster, BankModel>();
                cfg.CreateMap<Interface, InterfaceModel>();
                cfg.CreateMap<UserRole, UserRoleModel>();
                cfg.CreateMap<UserMaster, UserModel>();
                cfg.CreateMap<AccountType, AccountTypeModel>();
                cfg.CreateMap<Leave, LeaveModel>();
                cfg.CreateMap<LeaveStatus, LeaveStatusModel>();
                cfg.CreateMap<LeaveType, LeaveTypeModel>();
                cfg.CreateMap<Nationality, NationalityModel>();
                cfg.CreateMap<Region, RegionModel>();
                cfg.CreateMap<Department, DepartmentModel>();
                cfg.CreateMap<Designation, DesignationModel>();
                cfg.CreateMap<ShareHolderType, ShareHolderTypeModel>();
                cfg.CreateMap<ShareHolderDetail, ShareHolderModel>();
                cfg.CreateMap<Staff, StaffModel>();
                cfg.CreateMap<Salary, SalaryModel>();
                cfg.CreateMap<Increment, IncrementModel>();
                cfg.CreateMap<Deduction, DeductionModel>();
                cfg.CreateMap<DeductionDetail, DeductionDetailModel>();
                cfg.CreateMap<DeductionDetailModel, DeductionDetail>();
                cfg.CreateMap<DeductionType, DeductionTypeModel>();
                cfg.CreateMap<PaySlip, PaySlipModel>();
                cfg.CreateMap<Location, LocationModel>();
                cfg.CreateMap<Country, CountryModel>();
                cfg.CreateMap<DocumentDetail, DocumentDetailModel>();
                cfg.CreateMap<DocumentCategory, DocumentCategoryModel>();
                cfg.CreateMap<DocumentType, DocumentTypeModel>();
                cfg.CreateMap<DocumentRenewalStatus, DocumentRenewalStatusModel>();
                cfg.CreateMap<CompanyMaster, CompanyModel>();
                cfg.CreateMap<CompanyType, CompanyTypeModel>();
                cfg.CreateMap<CompanyStatus, CompanyStatusModel>();
                cfg.CreateMap<CompanyDocumentAccessDetail, CompanyDocumentAccessModel>();
                cfg.CreateMap<EmployeeMaster, EmployeeModel>();
                cfg.CreateMap<SettingMaster, SettingModel>();
                cfg.CreateMap<SettingModel, SettingMaster>();
                cfg.CreateMap<PublicHolidayModel, PublicHoliday>();
                cfg.CreateMap<PublicHoliday, PublicHolidayModel>();
                cfg.CreateMap<GraduitySetting, GraduityModel>();
                cfg.CreateMap<Gratuity, GratuityModel>();
                cfg.CreateMap<GratuityModel, Gratuity>();
            });
        }
    }
}
