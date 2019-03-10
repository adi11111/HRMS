using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Unity.Mvc5;
using HRMS.Core.Services;
using HRMS.Services.Services;
using HRMS.Core.Entities.Foundation;
using HRMS.Core.Data.Repositories;
using HRMS.Data.Repositories;
using HRMS.Core.Data;
using HRMS.Data;

namespace HRMS.WebUI
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();
            container.RegisterType<IGenericRepository<TEntity>, GenericRepository<TEntity>>() ;

            container.RegisterType<IUnitOfWork, UnitOfWork>();
            container.RegisterType<IHomeService, HomeService>();
            container.RegisterType<IEmployeeService, EmployeeService>();
            container.RegisterType<IBankService,BankService>();
            container.RegisterType<IAppointmentService, AppointmentService>();
            container.RegisterType<IAccountTypeService, AccountTypeService>();
            container.RegisterType<IAttendenceService, AttendenceService>();
            container.RegisterType<IAttendenceStatusService, AttendenceStatusService>();
            container.RegisterType<IShiftService, ShiftService>();
            container.RegisterType<IAppointmentService, AppointmentService>();
            container.RegisterType<ICompanyDocumentAccessDetailService, CompanyDocumentAccessDetailService>();
            container.RegisterType<ICompanyService, CompanyService>();
            container.RegisterType<ICompanyTypeService, CompanyTypeService>();
            container.RegisterType<ICompanyStatusService, CompanyStatusService>();
            container.RegisterType<ILocationService, LocationService>();
            container.RegisterType<IRegionService, RegionService>();
            container.RegisterType<IDepartmentService, DepartmentService>();
            container.RegisterType<ILeaveService, LeaveService>();
            container.RegisterType<ILeaveStatusService, LeaveStatusService>();
            container.RegisterType<ILeaveTypeService, LeaveTypeService>();
            container.RegisterType<IInterfaceService, InterfaceService>();
            container.RegisterType<IUserService, UserService>();
            container.RegisterType<IUserAccessDetailService, UserAccessDetailService>();
            container.RegisterType<INationalityService, NationalityService>();
            container.RegisterType<IStaffService, StaffService>();
            container.RegisterType<ISalaryService, SalaryService>();
            container.RegisterType<IIncrementService, IncrementService>();
            container.RegisterType<IDeductionService, DeductionService>();
            container.RegisterType<IDeductionTypeService, DeductionTypeService>();
            container.RegisterType<IPayslipService, PayslipService>();
            container.RegisterType<IParticipantService, ParticipantService>();
            container.RegisterType<IDesignationService, DesignationService>();
            container.RegisterType<ICountryService, CountryService>();
            container.RegisterType<IDocumentDetailService, DocumentDetailService>();
            container.RegisterType<IDocumentCategoryService, DocumentCategoryService>();
            container.RegisterType<IDocumentTypeService, DocumentTypeService>();
            container.RegisterType<IDocumentRenewalStatusService, DocumentRenewalStatusService>();
            container.RegisterType<IUserRoleService, UserRoleService>();
            container.RegisterType<IShareholderTypeService, ShareholderTypeService>();
            container.RegisterType<IShareholderService, ShareholderService>();
            container.RegisterType<ISettingService, SettingService>();
            container.RegisterType<IPublicHolidayService, PublicHolidayService>();
            container.RegisterType<IGraduitySettingService, GraduitySettingService>();
            container.RegisterType<IGratuityService, GratuityService>();
            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }
    }
}