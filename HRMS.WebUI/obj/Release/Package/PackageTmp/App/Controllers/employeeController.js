(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('employeeController', employeeController);

    employeeController.$inject = ['$scope', '$location', 'accountService', 'staffService', 'designationService', 'departmentService', 'nationalityService', 'employeeService', 'attendenceService', 'regionService', 'countryService', 'bankService', 'companyService'];

    function employeeController($scope, $location, accountService, staffService, designationService, departmentService, nationalityService, employeeService, attendenceService, regionService, countryService, bankService, companyService) {
        var isUpdateDataTable = false;
        var tblEmployee;
       
        $scope.isCreate = false;
        clearDropDowns();
        $scope.setAccountType = function (ID,Name) {
            $scope.employee.AccountTypeID = ID;
            $scope.selectedAccountTypeName = Name;
        }
        $scope.setReportingTo = function (ID, Name) {
            $scope.employee.ReportingToID = ID;
            $scope.selectedReportingToName = Name;
        }
        $scope.setNationality = function (ID, Name) {
            $scope.employee.NationalityID = ID;
            $scope.selectedNationalityName = Name;
        }
        $scope.setStaff = function (ID, Name) {
            $scope.employee.StaffID = ID;
            $scope.selectedStaffName = Name;
        }
        $scope.setShift = function (ID, Name) {
            $scope.employee.ShiftID = ID;
            $scope.selectedShiftName = Name;
        }
        $scope.setDepartment = function (ID, Name) {
            $scope.employee.DepartmentID = ID;
            $scope.selectedDepartmentName = Name;
        }
        $scope.setDesignation = function (ID, Name) {
            $scope.employee.DesignationID = ID;
            $scope.selectedDesignationName = Name;
        }
        $scope.setCountry = function (ID, Name) {
            $scope.employee.CountryID = ID;
            $scope.selectedCountryName = Name;
        }
        $scope.setRegion = function (ID, Name) {
            $scope.employee.RegionID = ID;
            $scope.selectedRegionName = Name;
        }
        $scope.setBank = function (ID, Name) {
            $scope.employee.BankID = ID;
            $scope.selectedBankName = Name;
        }
        $scope.setCompany = function (ID, Name) {
            $scope.employee.CompanyID = ID;
            $scope.selectedCompanyName = Name;
        }
        $scope.setGender = function (Gender) {
            $scope.employee.Gender = Gender;
            $('#lbl' + Gender).removeClass('btn-default').addClass('btn-primary');
            $('#lbl' + Gender).siblings().removeClass('btn-primary').addClass('btn-default');
        }
        $scope.setStatus = function (ID, Name) {
            $scope.employee.Status = ID;
            $scope.selectedStatusName = Name;
        }
        $scope.setQualificationType = function (Name) {
            $scope.employee.QualificationType = Name;
            $scope.selectedQualificationType = Name;
        }
        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.employee = {
                EmployeeID: 0,
                EmployeeName: '',
                ShiftID : undefined,
                StaffID: undefined,
                BankID: undefined,
                CompanyID: undefined,
                DesignationID: undefined,
                DepartmentID: undefined,
                RegionID: undefined,
                ReportingToID: undefined,
                Qualification: '',
                PhoneNumber: '',
                MobileNumber: '',
                FamilyContactNumber: '',
                ContactPersonNumber: '',
                ContactPersonName: '',
                ContactPersonRelationship: '',
                NationalityID: undefined,
                Gender: 'Male',
                DOB: '',
                ActualDOB: '',
                Email: '',
                InternationalContactNumber: '',
                PhotoPath: '',
                Status: '',
                MedicalHistory: '',
                MigratedLeaveBalance: '',
                MigratedDate: '',
                LeaveBalanceAsNow: '',
                AccountNumber: '',
                JoiningDate: '',
                AccountTypeID: undefined,
                WeeklyOff : undefined,
                Remarks: ''

            }
            $('#imgEmployee').attr('src', '');
            $('#filePhoto').val('');
            clearDropDowns();
            $scope.isMale = true;
            $('#mdlEmployee').modal("show");
            angular.forEach($scope.frmEmployee.$error.required, function (field) {
                field.$dirty = false;
            });
            $scope.frmEmployee.txtEmployeeDOB.$valid = true;
            $scope.frmEmployee.txtEmployeeJoiningDate.$valid = true;
            $scope.frmEmployee.txtEmployeeDOB.$dirty = false;
            $scope.frmEmployee.txtEmployeeJoiningDate.$dirty = false;
            angular.element('#filePhoto').removeClass('border-red');
            angular.element('#filePhoto').next('span').addClass('hide');
        }
       
        loadAccountTypes();
     
        $scope.employee = {
            EmployeeID: 0,
            EmployeeName: '',
            AttendenceReferenceID : 0,
            NationalityID: 0,
            StaffID: 0,
            BankID: 0,
            CompanyID: 0,
            DesignationID: 0,
            DepartmentID: 0,
            CountryID: 0,
            RegionID: 0,
            ReportingToID: 0,
            QualificationType: '',
            QualificationDescription: '',
            Address: '',
            PhoneNumber: '',
            MobileNumber: '',
            FamilyContactNumber: '',
            //  ContactPersonNumber: '',
            ContactPersonName: '',
            ContactPersonRelationship: '',
            Gender: '',
            DOB: '',
            ActualDOB: '',
            Email: '',
            InternationalContactNumber: '',
            PhotoPath: '',
            Status: '',
            MedicalHistory: '',
            MigratedLeaveBalance: '',
            MigratedDate: '',
            LeaveBalanceAsNow: '',
            AccountNumber: '',
            JoiningDate: '',
            AccountTypeID: 0,
            WeeklyOff: undefined,
            Remarks: ''

        }

        function loadEmployees() {
            employeeService.getAllEmployees().then(
                   function (response) {
                       $scope.employees = response;
                       if ($.fn.dataTable.isDataTable('#tblEmployee') ) {
                           $('#tblEmployee').DataTable().destroy();
                       }
                       loadStatus();
                       loadQualificationTypes();
                       tblEmployee = $('#tblEmployee').DataTable({
                           data: response,
                           "order": [[1, "asc"]],
                           "columns": [
                                { "data": "EmployeeID" },
                                { "data": "EmployeeName" },
                                { "data": "CompanyID" },
                                { "data": "NationalityID" },
                                { "data": "StaffID" },
                                { "data": "DesignationID" },
                                { "data": "DepartmentID" },
                                { "data": "AccountTypeID" },
                                { "data": "ShiftID" },
                                { "data": "QualificationType" },
                                { "data": "QualificationDescription" },
                                { "data": "Address" },
                                { "data": "RegionID" },
                                { "data": "CountryID" },
                                { "data": "PhoneNumber" },
                                { "data": "MobileNumber" },
                                { "data": "FamilyContactNumber" },
                                { "data": "ContactPersonName" },
                                { "data": "ContactPersonRelationship" },
                                { "data": "Gender" },
                                { "data": "DOB" },
                                { "data": "ActualDOB" },
                                { "data": "Email" },
                                { "data": "InternationalContactNumber" },
                                { "data": "Status" },
                                { "data": "MedicalHistory" },
                                { "data": "MigratedLeaveBalance" },
                                { "data": "MigratedDate" },
                                { "data": "LeaveBalanceAsNow" },
                                { "data": "DailyLeave" },
                                { "data": "BankID" },
                                { "data": "AccountNumber" },
                                { "data": "JoiningDate" },
                                { "data": "AttendenceReferenceID" },
                                { "data": "WeeklyOff" }
                                //{ "data": "Remarks" }
                           ],

                           "columnDefs": [
                                 {
                                     "render": function (data, type, row) {
                                         return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                     },
                                     "targets": 0
                                 },
                                  {
                                      "render": function (data, type, row) {
                                          return getCompanyById(data);
                                      },
                                      "targets": 2
                                  },
                                 {
                                     "render": function (data, type, row) {
                                         return getNationalityById(data);
                                     },
                                     "targets": 3
                                 },
                                 {
                                     "render": function (data, type, row) {
                                         return getStaffById(data);
                                     },
                                     "targets": 4
                                 },
                                 {
                                     "render": function (data, type, row) {
                                         return getDesignationById(data);
                                     },
                                     "targets": 5
                                 },
                                 {
                                     "render": function (data, type, row) {
                                         return getDepartmentById(data);
                                     },
                                     "targets": 6
                                 },
                                  {
                                      "render": function (data, type, row) {
                                          return getAccountTypeById(data);
                                      },
                                      "targets": 7
                                  },
                                  {
                                      "render": function (data, type, row) {
                                          return getShiftById(data);
                                      },
                                      "targets": 8
                                  },
                                  {
                                      "render": function (data, type, row) {
                                          return getCountryById(data);
                                      },
                                      "targets": 13
                                  },
                                  {
                                      "render": function (data, type, row) {
                                          return getRegionById(data);
                                      },
                                      "targets": 12
                                  },
                                  {
                                      "render": function (data, type, row) {
                                          return ToJavaScriptDate(data);
                                      },
                                      "targets": 20
                                  },
                                   {
                                       "render": function (data, type, row) {
                                           return ToJavaScriptDate(data);
                                       },
                                       "targets": 21
                                   },
                                    {
                                        "render": function (data, type, row) {
                                            return ToJavaScriptDate(data);
                                        },
                                        "targets": 27
                                    },
                                   {
                                       "render": function (data, type, row) {
                                           return getBankById(data);
                                       },
                                       "targets": 30
                                   },
                                {
                                    "render": function (data, type, row) {
                                        return ToJavaScriptDate(data);
                                    },
                                    "targets": 32
                                }//,
                               //  { "visible": true, "targets": [3] }
                           ],
                           "rowCallback": function (row, data) {
                           }
                       });
                   },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        $('#tblEmployee').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblEmployee').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.employee.EmployeeID = rowData.EmployeeID;
                    $scope.employee.AttendenceReferenceID = rowData.AttendenceReferenceID;
                    $scope.employee.EmployeeName = rowData.EmployeeName;
                    $scope.employee.QualificationType = rowData.QualificationType;
                    $scope.employee.QualificationDescription = rowData.QualificationDescription;
                    $scope.employee.RegionID = rowData.RegionID;
                    $scope.employee.ShiftID = rowData.ShiftID;
                    $scope.employee.BankID = rowData.BankID;
                    $scope.employee.CompanyID = rowData.CompanyID;
                    $scope.employee.CountryID = rowData.CountryID;
                    $scope.employee.Address = rowData.Address;
                    $scope.employee.WeeklyOff = rowData.WeeklyOff;
                    $scope.employee.PhoneNumber = rowData.PhoneNumber;
                    $scope.employee.MobileNumber = rowData.MobileNumber;
                    $scope.employee.InternationalContactNumber = rowData.InternationalContactNumber;
                    $scope.employee.FamilyContactNumber = rowData.FamilyContactNumber;
                    $scope.employee.ContactPersonName = rowData.ContactPersonName;
                    //  $scope.employee.ContactPersonNumber = rowData.ContactPersonNumber;
                    $scope.employee.ContactPersonRelationship = rowData.ContactPersonRelationship;
                    //if(rowData.Gender == 'Male')
                    $scope.employee.Gender = rowData.Gender;
                    $scope.employee.DOB = ToJavaScriptDate(rowData.DOB);
                    $scope.employee.ActualDOB = ToJavaScriptDate(rowData.ActualDOB);
                    $scope.employee.Email = rowData.Email;
                    $scope.employee.Status = rowData.Status;
                    $scope.employee.MigratedLeaveBalance = rowData.MigratedLeaveBalance;
                    $scope.employee.MigratedDate = ToJavaScriptDate(rowData.MigratedDate);
                    $scope.employee.LeaveBalanceAsNow = rowData.LeaveBalanceAsNow;
                    $scope.employee.DailyLeave = rowData.DailyLeave;
                    $scope.employee.AccountNumber = rowData.AccountNumber;
                    $scope.employee.JoiningDate = ToJavaScriptDate(rowData.JoiningDate);
                    $scope.employee.MedicalHistory = rowData.MedicalHistory;
                    $scope.employee.PhotoPath = '/Content/Images/EmployeeImages/' + rowData.PhotoPath;
                    $scope.employee.AccountTypeID = rowData.AccountTypeID;
                    $scope.employee.NationalityID = rowData.NationalityID;
                    $scope.employee.DepartmentID = rowData.DepartmentID;
                    $scope.employee.StaffID = rowData.StaffID;
                    $scope.employee.DesignationID = rowData.DesignationID;
                    $scope.employee.ReportingToID = rowData.ReportingToID;
                    $scope.employee.Remarks = rowData.Remarks;
                    $scope.selectedReportingToName = getEmployeeById(rowData.ReportingToID);
                    $scope.selectedAccountTypeName = getAccountTypeById(rowData.AccountTypeID);
                    $scope.selectedNationalityName = getNationalityById(rowData.NationalityID);
                    $scope.selectedDepartmentName = getDepartmentById(rowData.DepartmentID);
                    $scope.selectedDesignationName = getDesignationById(rowData.DesignationID);
                    $scope.selectedRegionName = getRegionById(rowData.RegionID);
                    $scope.selectedCountryName = getCountryById(rowData.CountryID);
                    $scope.selectedCompanyName = getCompanyById(rowData.CompanyID);
                    $scope.selectedShiftName = getShiftById(rowData.ShiftID);
                    $scope.selectedQualificationType = rowData.QualificationType;
                    $scope.selectedStaffName = getStaffById(rowData.StaffID);
                    $scope.selectedBankName = getBankById (rowData.BankID);
                    $scope.selectedStatusName = rowData.Status;
                    $scope.isCreate = false;
                    $('#filePhoto').val('');
                    $('#lbl' + rowData.Gender).removeClass('btn-default').addClass('btn-primary');
                    $('#lbl' + rowData.Gender).siblings().removeClass('btn-primary').addClass('btn-default');
                });
                $('#mdlEmployee').modal("show");

            }
        });
        $('#tblEmployee').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.employee.EmployeeID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlEmployeeDelete').modal("show");
        });
        $scope.createEmployee = function () {
            //  $scope.employee.PhotoPath = $('#txtEmployeePhotoPath').val();
            if (getAge($scope.employee.DOB) < 18) {
                addNotification('Error', 'Employee age cannot be less than 18 years!', 'error');
            }
            else {
                if (isDropDownsValid()) {
                    $scope.$parent.isNameExist('Employee', 0, 'type', $scope.employee.EmployeeName).then(function (response) {
                        if (response.data) addNotification('Error', 'Employee with same name already exists!', 'error');
                        else {
                            $scope.employee.DOB = formatDateYYYYmmDD($scope.employee.DOB);
                            $scope.employee.JoiningDate = formatDateYYYYmmDD($scope.employee.JoiningDate);
                            employeeService.createEmployee($scope.employee).then(
                                function (response) {
                                    addNotification('Success', 'New record is added in Employee!', 'success');
                                    $('#mdlEmployee').modal("hide");
                                    loadEmployees();
                                },
                                function (data) {
                                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlEmployee').modal("hide");
                                });
                        }
                    }, function (response) {
                        if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlEmployee').modal("hide");
                    }); ayeshaza1101
                }
            }
        };

        $scope.updateEmployee = function () {
            if (getAge($scope.employee.DOB) < 18) {
                addNotification('Error', 'Employee age cannot be less than 18 years!', 'error');
            }
            else {
                if (isDropDownsValid()) {
                    $scope.$parent.isNameExist('Employee', $scope.employee.EmployeeID, 'type', $scope.employee.EmployeeName).then(function (response) {
                        if (response.data) addNotification('Error', 'Employee with same name already exists!', 'error');
                        else {
                            $scope.employee.ActualDOB = formatDateYYYYmmDD($scope.employee.ActualDOB);
                            $scope.employee.DOB = formatDateYYYYmmDD($scope.employee.DOB);
                            $scope.employee.JoiningDate = formatDateYYYYmmDD($scope.employee.JoiningDate);
                            employeeService.updateEmployee($scope.employee).then(
                                function (response) {
                                    addNotification('Success', 'Record is successfully updated!', 'success');
                                    $('#mdlEmployee').modal("hide");
                                    loadEmployees();
                                },
                                function (data) {
                                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlEmployee').modal("hide");
                                });
                        }
                    }, function (response) {
                        if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlEmployee').modal("hide");
                    });
                }
            }
        };

        $scope.deleteEmployee = function () {
            employeeService.deleteEmployee($scope.employee.EmployeeID).then(
                function (response) {
                    loadEmployees();
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlEmployee').modal("hide");
                });
        };
        $scope.dobChange = function (type) {
            if (type == 'actual') {
                if (getAge(formatDateMMddYYYY($scope.employee.ActualDOB)) < 18) {
                    $scope.employee.ActualDOB = '';
                    addNotification('Error', 'Employee age cannot be less than 18 years!', 'error');
                }
            }
            else {
                if (getAge(formatDateMMddYYYY($scope.employee.DOB)) < 18) {
                    $scope.employee.DOB = '';
                    addNotification('Error', 'Employee age cannot be less than 18 years!', 'error');
                }
            }  
        };
        $scope.leaveBalanceChange = function(){
            if($scope.employee.DailyLeave != 0 && $scope.employee.DailyLeave != undefined && $scope.employee.MigratedDate != '' && $scope.employee.MigratedDate != undefined){
                $scope.employee.LeaveBalanceAsNow = Date.daysBetween(new Date($scope.employee.MigratedDate), new Date()) * $scope.employee.DailyLeave;
            }
        }
        function loadAccountTypes() {
            accountService.getAllAccountTypes().then(
                  function (response) {
                      $scope.accountTypes = response;
                      loadDepartments();
                     

                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadNationality() {
            nationalityService.getAllNationality().then(
                  function (response) {
                      $scope.nationality = response;
                      loadStaffs();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadDesignations() {
            designationService.getAllDesignations().then(
                  function (response) {
                      $scope.designations = response;
                      loadCompanies();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadCompanies() {
            companyService.getAllCompanies().then(
                  function (response) {
                      $scope.companies = response;
                      loadBanks();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadBanks() {
            bankService.getAllBank().then(
                  function (response) {
                      $scope.banks = response;
                      loadNationality();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadDepartments() {
            departmentService.getAllDepartments().then(
                  function (response) {
                      $scope.departments = response;
                      loadDesignations();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadStaffs() {
            staffService.getAllStaffs().then(
                  function (response) {
                      $scope.staffs = response;
                      loadShifts();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadCountries() {
            countryService.getAllCountry().then(
                  function (response) {
                      $scope.countries = response;
                      loadRegions();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadRegions() {
            regionService.getAllRegions().then(
                  function (response) {
                      $scope.regions = response;
                      loadEmployees();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function loadShifts() {
            attendenceService.getAllShift().then(
                  function (response) {
                      $scope.shifts = response;
                      loadCountries();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadStatus() {
            $scope.statuss = [{ 'StatusID': 'Active', 'StatusName': 'Active' }, { 'StatusID': 'InActive', 'StatusName': 'InActive' }];
        }
        function loadQualificationTypes() {
            $scope.qualificationTypes = [
            'Misc Certifications',
            'Secondary Education',
            'Higher Secondary Education',
            'Graduate Diploma',
            'Bachelors Degree',
            'Post Graduate Diploma',
            'Masters Degree',
            'Doctorate',
            'CA/CPA/ACCA'
            ];
        }
        function getEmployeeById(Id) {
            var _employeeName = '-';
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].EmployeeID == Id) {
                    _employeeName = $scope.employees[i].EmployeeName
                    break;
                }
            }
            return _employeeName;
        }
        function getAccountTypeById(Id) {
            var _accountTypeName = '-';
            for (var i = 0; i < $scope.accountTypes.length; i++) {
                if ($scope.accountTypes[i].AccountTypeID == Id) {
                    _accountTypeName = $scope.accountTypes[i].AccountTypeName
                    break;
                }
            }
            return _accountTypeName;
        }
        function getStaffById(Id) {
            var _staffName = '-';
            for (var i = 0; i < $scope.staffs.length; i++) {
                if ($scope.staffs[i].StaffID == Id) {
                    _staffName = $scope.staffs[i].StaffName
                    break;
                }
            }
            return _staffName;
        }
        function getShiftById(Id) {
            var _shiftName = '-';
            for (var i = 0; i < $scope.shifts.length; i++) {
                if ($scope.shifts[i].ShiftID == Id) {
                    _shiftName = $scope.shifts[i].ShiftName
                    break;
                }
            }
            return _shiftName;
        }
        function getNationalityById(Id) {
            var _nationalityName = '-';
            for (var i = 0; i < $scope.nationality.length; i++) {
                if ($scope.nationality[i].NationalityID == Id) {
                    _nationalityName = $scope.nationality[i].NationalityName
                    break;
                }
            }
            return _nationalityName;
        }
        function getDepartmentById(Id) {
            var _departmentName = '-';
            for (var i = 0; i < $scope.departments.length; i++) {
                if ($scope.departments[i].DepartmentID == Id) {
                    _departmentName = $scope.departments[i].DepartmentName
                    break;
                }
            }
            return _departmentName;
        }
        function getDesignationById(Id) {
            var _designationName = '-';
            for (var i = 0; i < $scope.designations.length; i++) {
                if ($scope.designations[i].DesignationID == Id) {
                    _designationName = $scope.designations[i].DesignationName
                    break;
                }
            }
            return _designationName;
        }
        function getCountryById(Id) {
            var _countryName = '-';
            for (var i = 0; i < $scope.countries.length; i++) {
                if ($scope.countries[i].CountryID == Id) {
                    _countryName = $scope.countries[i].CountryName
                    break;
                }
            }
            return _countryName;
        }
        function getRegionById(Id) {
            var _regionName = '-';
            for (var i = 0; i < $scope.regions.length; i++) {
                if ($scope.regions[i].RegionID == Id) {
                    _regionName = $scope.regions[i].RegionName
                    break;
                }
            }
            return _regionName;
        }
        function getBankById(Id) {
            var _bankName = '-';
            for (var i = 0; i < $scope.banks.length; i++) {
                if ($scope.banks[i].BankID == Id) {
                    _bankName = $scope.banks[i].BankName
                    break;
                }
            }
            return _bankName;
        }
        function getCompanyById(Id) {
            var _companyName = '-';
            for (var i = 0; i < $scope.companies.length; i++) {
                if ($scope.companies[i].CompanyID == Id) {
                    _companyName = $scope.companies[i].CompanyName
                    break;
                }
            }
            return _companyName;
        }
        function clearDropDowns() {
            $scope.selectedAccountTypeName = "Select Account Type";
            $scope.selectedNationalityName = "Select Nationality";
            $scope.selectedStaffName = "Select Staff";
            $scope.selectedDepartmentName = "Select Department";
            $scope.selectedDesignationName = "Select Designation";
            $scope.selectedShiftName = "Select Shift";
            $scope.selectedCountryName = "Select Country";
            $scope.selectedRegionName = "Select Region";
            $scope.selectedStatusName = "Select Status";
            $scope.selectedBankName = "Select Bank";
            $scope.selectedCompanyName = "Select Company";
            $scope.selectedReportingToName = "Select Reporting To";
            $scope.selectedQualificationType = "Select Qualification Type";
        }
        function isDropDownsValid() {
            var _result = true;
            if ($scope.employee.AccountTypeID == undefined) {
                $scope.frmEmployee.txtAccountTypeID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.StaffID == undefined) {
                $scope.frmEmployee.txtStaffID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.ShiftID == undefined) {
                $scope.frmEmployee.txtShiftID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.NationalityID == undefined) {
                $scope.frmEmployee.txtNationalityID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.DepartmentID == undefined) {
                $scope.frmEmployee.txtDepartmentID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.DesignationID == undefined) {
                $scope.frmEmployee.txtDesignationID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.RegionID == undefined) {
                $scope.frmEmployee.txtRegionID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.CountryID == undefined) {
                $scope.frmEmployee.txtCountryID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.BankID == undefined) {
                $scope.frmEmployee.txtBankID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.CompanyID == undefined) {
                $scope.frmEmployee.txtCompanyID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.ReportingToID == undefined) {
                $scope.frmEmployee.txtReportingToID.$dirty = true;
                _result = false;
            }
            if ($scope.employee.PhotoPath == undefined || $scope.employee.PhotoPath == '') {
                angular.element('#filePhoto').addClass('border-red');
                angular.element('#filePhoto').next('span').removeClass('hide');
                _result = false;
            }
            if (!isFormValid($scope.frmEmployee)) {
                _result = false;
            }
            return _result;
        }
    }
})();