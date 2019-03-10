(function () {
    'use strict';

    angular.module('HRMS')
        .config(['$httpProvider', '$interpolateProvider', '$routeProvider', function ($httpProvider, $interpolateProvider, $routeProvider) {
            $httpProvider.interceptors.push('httpRequestInterceptor');

            $routeProvider.when('/AccountType', {
                templateUrl: '/App/Templates/Account/AccountType.html',
                //  requiresLogin: true,
                controller: 'accountController'
            })
            .when('/Appointment', {
                templateUrl: '/App/Templates/Appointment/Index.html',
                //  requiresLogin: true,
                controller: 'appointmentController'
            })
            .when('/Participant', {
                templateUrl: '/App/Templates/Appointment/Participant.html',
                //  requiresLogin: true,
                controller: 'appointmentController'
            })
            .when('/Leave', {
                templateUrl: '/App/Templates/Leave/Index.html',
                    //  requiresLogin: true,
                controller: 'leaveController'
            })
            .when('/LeaveType', {
                templateUrl: '/App/Templates/Leave/LeaveType.html',
                    //  requiresLogin: true,
                controller: 'leaveController'
            })
            .when('/LeaveStatus', {
                templateUrl: '/App/Templates/Leave/LeaveStatus.html',
                //  requiresLogin: true,
                controller: 'leaveController'
            })
            .when('/Nationality', {
                templateUrl: '/App/Templates/Nationality/Index.html',
                //  requiresLogin: true,
                controller: 'nationalityController'
            })
            .when('/Region', {
                templateUrl: '/App/Templates/Region/Index.html',
                //  requiresLogin: true,
                controller: 'regionController'
            })
            .when('/Location', {
                templateUrl: '/App/Templates/Location/Index.html',
                //  requiresLogin: true,
                controller: 'locationController'
            })
            .when('/Staff', {
                templateUrl: '/App/Templates/Staff/Index.html',
                //  requiresLogin: true,
                controller: 'staffController'
            })
            .when('/Salary', {
                templateUrl: '/App/Templates/Salary/Index.html',
                //  requiresLogin: true,
                controller: 'salaryController'
            })
            .when('/Increment', {
                templateUrl: '/App/Templates/Salary/Increment.html',
                //  requiresLogin: true,
                controller: 'salaryController'
            })
            .when('/Deduction', {
                templateUrl: '/App/Templates/Salary/Deduction.html',
                //  requiresLogin: true,
                controller: 'salaryController'
            })
            .when('/DeductionType', {
                templateUrl: '/App/Templates/Salary/DeductionType.html',
                //  requiresLogin: true,
                controller: 'salaryController'
            })
            .when('/Payslip', {
                templateUrl: '/App/Templates/Salary/Payslip.html',
                //  requiresLogin: true,
                controller: 'salaryController'
            })
            .when('/Document', {
                templateUrl: '/App/Templates/Document/Index.html',
                //  requiresLogin: true,
                controller: 'documentController'
            })
            .when('/DocumentCategory', {
                templateUrl: '/App/Templates/Document/DocumentCategory.html',
                //  requiresLogin: true,
                controller: 'documentController'
            })
            .when('/DocumentType', {
                templateUrl: '/App/Templates/Document/DocumentType.html',
                //  requiresLogin: true,
                controller: 'documentController'
            })
            .when('/DocumentRenewalStatus', {
                templateUrl: '/App/Templates/Document/DocumentRenewalStatus.html',
                //  requiresLogin: true,
                controller: 'documentController'
            })
            .when('/Company', {
                templateUrl: '/App/Templates/Company/Index.html',
                //  requiresLogin: true,
                controller: 'companyController'
            })
            .when('/CompanyDocument', {
                templateUrl: '/App/Templates/Document/CompanyDocument.html',
                //  requiresLogin: true,
                controller: 'companyController'
            })
            .when('/CompanyType', {
                templateUrl: '/App/Templates/Company/CompanyType.html',
                //  requiresLogin: true,
                controller: 'companyController'
            })
            .when('/CompanyStatus', {
                templateUrl: '/App/Templates/Company/CompanyStatus.html',
                //  requiresLogin: true,
                controller: 'companyController'
            })
            .when('/Country', {
                templateUrl: '/App/Templates/Country/Index.html',
                //  requiresLogin: true,
                controller: 'countryController'
            })
            .when('/Department', {
                templateUrl: '/App/Templates/Department/Index.html',
                //  requiresLogin: true,
                controller: 'departmentController'
            })
            .when('/Designation', {
                templateUrl: '/App/Templates/Designation/Index.html',
                //  requiresLogin: true,
                controller: 'designationController'
            })
            .when('/Attendance', {
                templateUrl: '/App/Templates/Attendence/Index.html',
                //  requiresLogin: true,
                controller: 'attendenceController'
            })
            .when('/AttendanceStatus', {
                templateUrl: '/App/Templates/Attendence/AttendenceStatus.html',
                //  requiresLogin: true,
                controller: 'attendenceController'
            })
            .when('/Shift', {
                templateUrl: '/App/Templates/Attendence/Shift.html',
                //  requiresLogin: true,
                controller: 'attendenceController'
            })
            .when('/User', {
                templateUrl: '/App/Templates/User/Index.html',
                //  requiresLogin: true,
                controller: 'userController'
            })
            .when('/UserRole', {
                templateUrl: '/App/Templates/User/UserRole.html',
                //  requiresLogin: true,
                controller: 'userController'
            })
            .when('/UserAccess', {
                templateUrl: '/App/Templates/User/UserAccess.html',
                //  requiresLogin: true,
                controller: 'userController'
            })
            .when('/Interface', {
                templateUrl: '/App/Templates/User/Interface.html',
                //  requiresLogin: true,
                controller: 'userController'
            })
            .when('/Employee', {
                templateUrl: '/App/Templates/Employee/Index.html',
                //  requiresLogin: true,
                controller: 'employeeController'
            })
            .when('/EmployeeDocument', {
                templateUrl: '/App/Templates/Document/EmployeeDocument.html',
                //  requiresLogin: true,
                controller: 'employeeController'
            })
            .when('/Bank', {
                templateUrl: '/App/Templates/Bank/Index.html',
                //  requiresLogin: true,
                controller: 'bankController'
            })
            .when('/Shareholder', {
                templateUrl: '/App/Templates/Shareholder/Index.html',
                //  requiresLogin: true,
                controller: 'shareholderController'
            })
            .when('/ShareholderType', {
                templateUrl: '/App/Templates/Shareholder/ShareholderType.html',
                //  requiresLogin: true,
                controller: 'shareholderController'
            })
            .when('/PublicHolidays', {
                templateUrl: '/App/Templates/Salary/PublicHoliday.html',
                //  requiresLogin: true,
                controller: 'salaryController'
            })
             .when('/GraduitySetting', {
                 templateUrl: '/App/Templates/Company/GraduitySetting.html',
                 //  requiresLogin: true,
                 controller: 'companyController'
             })
              .when('/Gratuity', {
                  templateUrl: '/App/Templates/Company/Gratuity.html',
                  //  requiresLogin: true,
                  controller: 'companyController'
              })
            .when('/404', {
                templateUrl: '/App/Templates/Shared/_404.html',
            })
            .when('/403', {
                templateUrl: '/App/Templates/Shared/_403.html',
            })
            .when('/500', {
                templateUrl: '/App/Templates/Shared/_500.html',
            })
            .when('/Home', {
                templateUrl: '/App/Templates/Shared/Home.html',
            })
            .when('/AppointmentSetting', {
                templateUrl: '/App/Templates/Setting/Appointment.html',
            })
            .when('/DocumentSetting', {
                templateUrl: '/App/Templates/Setting/Document.html',
            })
            .when('/Account/Login', {
            templateUrl: '/App/Templates/Account/Login.html',
            controller: 'LoginController'
          })
          .when('/Account/Register', {
              templateUrl: '/App/Templates/Account/Register.html',
              controller: 'RegisterController'
          })
          .when('/AttendenceReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
             // controller: 'RegisterController'
          })
          .when('/AppointmentReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
              // controller: 'RegisterController'
          })
          .when('/BankReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
              // controller: 'RegisterController'
          })
          .when('/CompanyReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
          })
          .when('/DocumentReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
          })
          .when('/EmployeeReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
              // controller: 'RegisterController'
          })
          .when('/IncrementReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
          })
          .when('/LeaveReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
              // controller: 'RegisterController'
          })
          .when('/PayslipReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
          })
           .when('/GratuityReport', {
               templateUrl: '/App/Templates/Shared/Report.html',
           })
          .when('/SalaryScheduleReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
          })
          .when('/SalaryReport', {
              templateUrl: '/App/Templates/Shared/Report.html',
          })
          .when('/', {
              templateUrl: '/App/Templates/Shared/Home.html',
              // controller: 'RegisterController'
          })
          .otherwise({
              templateUrl: '/App/Templates/Shared/Home.html'
          })
        }]);
        //.run(checkAuthentication);

    //checkAuthentication.$inject = ['$rootScope', '$location', 'tokenHandler'];
    //function checkAuthentication($rootScope, $location, tokenHandler) {
    //    $rootScope.$on('$routeChangeStart', function (event, next, current) {
    //        var requiresLogin = next.requiresLogin || false;
    //        if (requiresLogin) {

    //            var loggedIn = tokenHandler.hasLoginToken();

    //            if (!loggedIn) {
    //                $location.path('/Account/Login');
    //            }
    //        }
    //    });
    //}
})();