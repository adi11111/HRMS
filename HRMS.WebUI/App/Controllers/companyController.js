(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('companyController', companyController);

    companyController.$inject = ['$scope', '$location', 'companyService', 'countryService', 'employeeService', 'salaryService'];

    function companyController($scope, $location, companyService, countryService, employeeService, salaryService) {
 
        // on load
        var isCompanyType = window.location.href.toLowerCase().indexOf('companytype') > -1;
        if (isCompanyType) {
            loadCompanyTypes();
        }
        else if (window.location.href.toLowerCase().indexOf('companystatus') > -1) {
            loadCompanyStatuss();
        }
        else if (window.location.href.toLowerCase().indexOf('report') > -1) {
            showReport();
        }
        else if (window.location.href.toLowerCase().indexOf('graduitysetting') > -1) {
            loadCompanies();
        }
        else if (window.location.href.toLowerCase().indexOf('gratuity') > -1) {
            loadCompanies();
        }
        else {
            loadCountries();
        }

        function showReport() {
            window.open("../Report/ShowReport","_blank");
        }
        
        // Company
        
        $scope.company = {
            CompanyID: 0,
            CompanyName: '',
            RegistrationID: '',
            CountryID: 0,
            CompanyTypeID: 0,
            Logo: '',
            EstablishedBy: '',
            EstablishmentDate: '',
            AssistedBy: '',
            TotalCapital: 0,
            TotalShares: 0,
            InitialValue: 0,
            CurrentValue: 0,
            Address: '',
            ContactPerson: '',
            MobileNumber: '',
            OfficeNumber: '',
            Remarks: ''
        };
        var tblCompany;
        $scope.isCreateCompany = false;
        $scope.triggerCreateCompany = function () {
            $scope.isCreateCompany = true;
            $scope.company.CompanyName = '';
            $scope.company.Logo = '';
            $scope.company.EstablishedBy = undefined;
            $scope.company.EstablishmentDate = formatDate(new Date());;
            $scope.company.AssistedBy = undefined;
            $scope.company.TotalCapital = undefined;
            $scope.company.TotalShares = undefined;
            $scope.company.InitialValue = undefined;
            $scope.company.CurrentValue = undefined;
            $scope.company.RegistrationID = '';
            $scope.company.CountryID = undefined;
            $scope.company.Currency = '';
            $scope.company.CompanyTypeID = undefined;
            $scope.company.CompanyNumber = '';
            $scope.company.CompanyStatus = undefined;
            $scope.company.CompanyStatusID = undefined;
            $scope.company.Address = '';
            $scope.company.ContactPerson = '';
            $scope.company.MobileNumber = '';
            $scope.company.OfficeNumber = '';
            $scope.company.Remarks = '';
            $scope.selectedCompanyTypeName = 'Select Company Type';
            $scope.selectedCountryName = 'Select Country';
            $scope.selectedCompanyStatusName = 'Select Company Status';
            $('#mdlCompany').modal("show");
            $('#fileLogo').val('');
            angular.element('#fileLogo').removeClass('border-red');
            angular.element('#fileLogo').next('span').addClass('hide');
            $('#imgCompany').attr('src', '');
        }
        
        function loadCompanies() {
            companyService.getAllCompanies().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblCompany')) {
                               $('#tblCompany').DataTable().destroy();
                           }
                           if (window.location.href.toLowerCase().indexOf('graduity') > -1) {
                               $scope.companies = response;
                               loadGraduitySettings();
                           }
                           else if (window.location.href.toLowerCase().indexOf('gratuity') > -1) {
                               $scope.selectedCompanyName = 'Select Company';
                               $scope.companies = response;
                               loadSalaries();
                           }
                           else {
                               tblCompany = $('#tblCompany').DataTable({
                                   data: response,
                                   "order": [[1, "asc"]],
                                   "columns": [
                                        { "data": "CompanyID" },
                                        { "data": "CompanyName" },
                                        { "data": "EstablishedBy" },
                                        { "data": "EstablishmentDate" },
                                        { "data": "AssistedBy" },
                                        { "data": "TotalCapital" },
                                        { "data": "TotalShares" },
                                        { "data": "InitialValue" },
                                        { "data": "CurrentValue" },
                                        { "data": "RegistrationID" },
                                        { "data": "CountryID" },
                                        { "data": "CompanyTypeID" },
                                        { "data": "CompanyStatusID" },
                                        { "data": "Currency" },
                                        { "data": "Address" },
                                        { "data": "ContactPerson" },
                                        { "data": "CompanyNumber" },
                                        { "data": "MobileNumber" },
                                        { "data": "OfficeNumber" },
                                        { "data": "Logo" },
                                        { "data": "Remarks" }
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
                                                  return ToJavaScriptDate(data);
                                              },
                                              "targets": 3
                                          },
                                          {
                                              "render": function (data, type, row) {
                                                  return getCountryById(data);
                                              },
                                              "targets": 10
                                          },
                                        {
                                            "render": function (data, type, row) {
                                                return getCompanyTypeById(data);
                                            },
                                            "targets": 11
                                        },
                                        {
                                            "render": function (data, type, row) {
                                                return getCompanyStatusById(data);
                                            },
                                            "targets": 12
                                        },
                                   ],
                                   "rowCallback": function (row, data) {
                                   }
                               });
                           }
                        
                          
                   },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
         $('#tblCompany').on('click', 'tbody tr i.edit', function () {
             var rowData = $('#tblCompany').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.company.CompanyID = rowData.CompanyID;
                    $scope.company.CompanyName = rowData.CompanyName;
                    $scope.company.EstablishedBy = rowData.EstablishedBy;
                    $scope.company.EstablishmentDate = ToJavaScriptDate(rowData.EstablishmentDate);
                    $scope.company.Logo = '/Content/Images/CompanyImages/' + rowData.Logo;
                    $scope.company.AssistedBy = rowData.AssistedBy;
                    $scope.company.TotalCapital = rowData.TotalCapital;
                    $scope.company.TotalShares = rowData.TotalShares;
                    $scope.company.InitialValue = rowData.InitialValue;
                    $scope.company.CurrentValue = rowData.CurrentValue;
                    $scope.company.CompanyName = rowData.CompanyName;
                    $scope.company.RegistrationID = rowData.RegistrationID;
                    $scope.company.CountryID = rowData.CountryID;
                    $scope.company.Currency = rowData.Currency;
                    $scope.company.CompanyTypeID = rowData.CompanyTypeID;
                    $scope.company.CompanyNumber = rowData.CompanyNumber;
                    $scope.company.CompanyStatusID = rowData.CompanyStatusID;
                    $scope.company.Address = rowData.Address;
                    $scope.company.ContactPerson = rowData.ContactPerson;
                    $scope.company.MobileNumber = rowData.MobileNumber;
                    $scope.company.OfficeNumber = rowData.OfficeNumber;
                    $scope.company.Remarks = rowData.Remarks;
                    $scope.selectedCountryName = getCountryById(rowData.CountryID);
                    $scope.selectedCompanyStatusName = getCompanyStatusById(rowData.CompanyStatusID);
                    $scope.selectedCompanyTypeName = getCompanyTypeById(rowData.CompanyTypeID);
                    $scope.isCreateCompany = false;
                });
                $('#mdlCompany').modal("show");
            }
        });
         $('#tblCompany').on('click', 'tbody tr i.delete', function () {
             var _ID = $(this).attr('ID');
             var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
             $scope.$apply(function () {
                 $scope.company.CompanyID = _ID;
                 $scope.deleteName = _deleteName;
             });
             $('#mdlCompanyDelete').modal("show");
         });
         $scope.createCompany = function () {
             if (isDropDownsValid($scope.frmCompany, $scope.company)) {
                 $scope.$parent.isNameExist('Company', 0, 'company', $scope.company.CompanyName).then(function(response){
                     if (response.data) addNotification('Error', 'Company with same name already exists!', 'error');
                     else {
                         $scope.company.EstablishmentDate = formatDateYYYYmmDD($scope.company.EstablishmentDate);
                         companyService.createCompany($scope.company).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Company!', 'success');
                                $('#mdlCompany').modal("hide");
                                loadCompanies();
                            },
                              function (data) {
                                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                  $('#mdlCompany').modal("hide");
                              });
                     }
                 },function(response){
                     if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     $('#mdlCompany').modal("hide");
                 });
             }
        };

         $scope.updateCompany = function () {
             if (isDropDownsValid($scope.frmCompany, $scope.company)) {
                 $scope.$parent.isNameExist('Company', $scope.company.CompanyID, 'company', $scope.company.CompanyName).then(function (response) {
                     if (response.data) addNotification('Error', 'Company with same name already exists!', 'error');
                     else {
                         $scope.company.EstablishmentDate = formatDateYYYYmmDD($scope.company.EstablishmentDate);
                         companyService.updateCompany($scope.company).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlCompany').modal("hide");
                                loadCompanies();
                            },
                              function (data) {
                                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                  $('#mdlCompany').modal("hide");
                              });
                     }
                 }, function (response) {
                     if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     $('#mdlCompany').modal("hide");
                 });
             }
        };

         $scope.deleteCompany = function () {
            companyService.deleteCompany($scope.company.CompanyID).then(
                function (response) {
                    loadCompanies();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };


        function loadCountries() {
            countryService.getAllCountry().then(
                  function (response) {
                      $scope.countries = response;
                      loadCompanyTypes();
                  },
                function (data) {
                    $scope.message = data.error_description;
                });
        }
        function getCountryById(Id) {
            var _countryName;
            for (var i = 0; i < $scope.countries.length; i++) {
                if ($scope.countries[i].CountryID === Id) {
                    _countryName = $scope.countries[i].CountryName
                    break;
                }
            }
            return _countryName;
        }
        function getCompanyTypeById(Id) {
            var _companyTypeName;
            for (var i = 0; i < $scope.companyTypes.length; i++) {
                if ($scope.companyTypes[i].CompanyTypeID === Id) {
                    _companyTypeName = $scope.companyTypes[i].CompanyTypeName
                    break;
                }
            }
            return _companyTypeName;
        }
        function getCompanyStatusById(Id) {
            var _companyStatusName;
            for (var i = 0; i < $scope.companyStatus.length; i++) {
                if ($scope.companyStatus[i].CompanyStatusID === Id) {
                    _companyStatusName = $scope.companyStatus[i].CompanyStatusName
                    break;
                }
            }
            return _companyStatusName;
        }
        function getCompanyById(Id) {
            var _companyName;
            for (var i = 0; i < $scope.companies.length; i++) {
                if ($scope.companies[i].CompanyID === Id) {
                    _companyName = $scope.companies[i].CompanyName
                    break;
                }
            }
            return _companyName;
        }
        $scope.setCompanyType = function (ID, Name) {
            $scope.company.CompanyTypeID = ID;
            $scope.selectedCompanyTypeName = Name;
        }
        $scope.setCompanyStatus = function (ID, Name) {
            $scope.company.CompanyStatusID = ID;
            $scope.selectedCompanyStatusName = Name;
        }
        $scope.setCountry = function (ID, Name) {
            $scope.company.CountryID = ID;
            $scope.selectedCountryName = Name;
        }
        $scope.setCompany = function (ID, Name) {
            $scope.graduitySetting.CompanyID = ID;
            $scope.gratuity.CompanyID = ID;
            $scope.selectedCompanyName = Name;
        }

        // Company Status

        var tblCompanyStatus;
        $scope.companyStatus = {
            CompanyStatusID: 0,
            CompanyStatusName: '',
            Remarks: ''
        }
        $scope.isCreateCompanyStatus = false;
        $scope.triggerCreateCompanyStatus = function () {
            $scope.isCreateCompanyStatus = true;
            $scope.companyStatus.CompanyStatusName = '';
            $scope.companyStatus.Remarks = '';
            $('#mdlCompanyStatus').modal("show");
            angular.forEach($scope.frmCompanyStatus.$error.required, function (field) {
                field.$valid = true;
            });
        }

        function loadCompanyStatuss() {

            companyService.getAllCompanyStatus().then(
                   function (response) {
                       if (window.location.href.toLowerCase().indexOf('companystatus') == -1){
                           $scope.companyStatus = response;
                           loadCompanies();
                       }
                       else {
                           if ($.fn.dataTable.isDataTable('#tblCompanyStatus')) {
                               $('#tblCompanyStatus').DataTable().destroy();
                           }
                           tblCompanyStatus = $('#tblCompanyStatus').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "CompanyStatusID" },
                                    { "data": "CompanyStatusName" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                    {
                                        "render": function (data, type, row) {
                                            return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                        },
                                        "targets": 0
                                    },
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                          
                       }
                   },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblCompanyStatus').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblCompanyStatus').DataTable().row($(this).parents('tr')).data();
            $scope.$apply(function () {
                $scope.companyStatus.CompanyStatusID = rowData.CompanyStatusID;
                $scope.companyStatus.CompanyStatusName = rowData.CompanyStatusName;
                $scope.companyStatus.Remarks = rowData.Remarks;
                $scope.isCreateCompanyStatus = false;
            });
            $('#mdlCompanyStatus').modal("show");
        });
        $('#tblCompanyStatus').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.companyStatus.CompanyStatusID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlCompanyStatusDelete').modal("show");
        });
        $scope.createCompanyStatus = function () {
            if (isFormValid($scope.frmCompanyStatus)) {
                $scope.$parent.isNameExist('Company', 0, 'status', $scope.companyStatus.CompanyStatusName).then(function(response){
                    if (response.data) addNotification('Error', 'Company Status with same name already exists!', 'error');
                    else{
                        companyService.createCompanyStatus($scope.companyStatus).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Company Status!', 'success');
                                $('#mdlCompanyStatus').modal("hide");
                                loadCompanyStatuss();
                            },
                             function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlCompanyStatus').modal("hide");
                             });
                        }
                    }, function (response) {
                        if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlCompanyStatus').modal("hide");
                    });
            }
        };

        $scope.updateCompanyStatus = function () {
            if (isFormValid($scope.frmCompanyStatus)) {
                $scope.$parent.isNameExist('Company', $scope.companyStatus.CompanyStatusID, 'status', $scope.companyStatus.CompanyStatusName).then(function (response) {
                if (response.data) addNotification('Error', 'Company Status with same name already exists!', 'error');
                else{
                    companyService.updateCompanyStatus($scope.companyStatus).then(
                        function (response) {
                            addNotification('Success', 'Record is successfully updated!', 'success');
                            $('#mdlCompanyStatus').modal("hide");
                            loadCompanyStatuss();
                        },
                         function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                             $('#mdlCompanyStatus').modal("hide");
                         });
                }
            }, function (response) {
                if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                $('#mdlCompanyStatus').modal("hide");
            });
            }
        };

        $scope.deleteCompanyStatus = function () {
            companyService.deleteCompanyStatus($scope.companyStatus.CompanyStatusID).then(
                function (response) {
                    loadCompanyStatuss();
                },
             function (data) {
                 if (data.status == 403) {
                     addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');
                 }
                 $scope.message = data.error_description;
             });
        };


        // Company Type
        var tblCompanyType;
        $scope.companyType = {
            CompanyTypeID: 0,
            CompanyTypeName: '',
            Remarks: ''
        }
        $scope.isCreateCompanyType = false;
        $scope.triggerCreateCompanyType = function () {
            $scope.isCreateCompanyType = true;
            $scope.companyType.CompanyTypeName = '';
            $scope.companyType.Remarks = '';
            $('#mdlCompanyType').modal("show");
        }
      //  loadCompanyTypes();
        function loadCompanyTypes() {

            companyService.getAllCompanyTypes().then(
                   function (response) {
                       if (isCompanyType) {
                           if ($.fn.dataTable.isDataTable('#tblCompanyType')) {
                               $('#tblCompanyType').DataTable().destroy();
                           }
                           tblCompanyType = $('#tblCompanyType').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "CompanyTypeID" },
                                    { "data": "CompanyTypeName" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                    {
                                        "render": function (data, type, row) {
                                            return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                        },
                                        "targets": 0
                                    },
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                          
                       }
                       else {
                           $scope.companyTypes = response;
                           loadCompanyStatuss();
                       }
                   },
                function (data) {
                    if (data.status == 403) {
                        addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');
                    }
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblCompanyType').on('click', 'tbody tr i.edit', function () {
            var rowData = tblCompanyType.row($(this).parents('tr')).data();
            $scope.$apply(function () {
                $scope.companyType.CompanyTypeID = rowData.CompanyTypeID;
                $scope.companyType.CompanyTypeName = rowData.CompanyTypeName;
                $scope.companyType.Remarks = rowData.Remarks;
                $scope.isCreateCompanyType = false;
            });
            $('#mdlCompanyType').modal("show");
        });
        $('#tblCompanyType').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.companyType.CompanyTypeID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlCompanyTypeDelete').modal("show");
        });
        $scope.createCompanyType = function () {
            if (isFormValid($scope.frmCompanyType)) {
                $scope.$parent.isNameExist('Company', 0, 'type', $scope.companyType.CompanyTypeName).then(function (response) {
                    if (response.data) addNotification('Error', 'Company Type with same name already exists!', 'error');
                    else {
                        companyService.createCompanyType($scope.companyType).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Company Type!', 'success');
                                $('#mdlCompanyType').modal("hide");
                                loadCompanyTypes();
                            },
                             function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlCompanyType').modal("hide");
                             });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlCompanyType').modal("hide");
                });
            }
        };

        $scope.updateCompanyType = function () {
            if (isFormValid($scope.frmCompanyType)) {
                $scope.$parent.isNameExist('Company', $scope.companyType.CompanyTypeID, 'type', $scope.companyType.CompanyTypeName).then(function (response) {
                    if (response.data) addNotification('Error', 'Company Type with same name already exists!', 'error');
                    else {
                        companyService.updateCompanyType($scope.companyType).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlCompanyType').modal("hide");
                                loadCompanyTypes();
                            },
                             function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlCompanyType').modal("hide");
                             });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlCompanyType').modal("hide");
                });
            }
        };

        $scope.deleteCompanyType = function () {
            companyService.deleteCompanyType($scope.companyType.CompanyTypeID).then(
                function (response) {
                    loadCompanyTypes();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

        // Graduity Settings

        var tblGraduitySetting;
        $scope.graduitySetting = {
            GraduitySettingID: 0,
            CompanyID: 0,
            Year1 : 0,
            Year2 : 0,
            Year3 : 0,
            Year4 : 0,
            Year5 : 0,
            YearAbout5 : 0,
            IsBasicOnly : false,
            Remarks: ''
        }
        $scope.isCreateGraduitySetting = false;

        $scope.triggerCreateGraduitySetting = function () {
            $scope.isCreateGraduitySetting = true;
            $scope.graduitySetting.CompanyID = 0;
            $scope.graduitySetting.Year1 = 0;
            $scope.graduitySetting.Year2 = 0;
            $scope.graduitySetting.Year3 = 0;
            $scope.graduitySetting.Year4 = 0;
            $scope.graduitySetting.Year5 = 0;
            $scope.graduitySetting.YearAbove5 = 0;
            $scope.graduitySetting.IsBasicOnly = false;
            $scope.graduitySetting.Remarks = '';
            $scope.selectedCompanyName = 'Select Company';
            $('#mdlGraduitySetting').modal("show");
            angular.forEach($scope.frmGraduitySetting.$error.required, function (field) {
                field.$dirty = false;
            });
        }
       
        function loadGraduitySettings() {

            companyService.getAllGraduitySettings().then(
                   function (response) {
                       if ($.fn.dataTable.isDataTable('#tblGraduitySetting')) {
                           $('#tblGraduitySetting').DataTable().destroy();
                       }
                       tblGraduitySetting = $('#tblGraduitySetting').DataTable({
                           data: response,
                           "order": [[1, "asc"]],
                           "columns": [
                                { "data": "GraduitySettingID" },
                                { "data": "CompanyID" },
                                { "data": "Year1" },
                                { "data": "Year2" },
                                { "data": "Year3" },
                                { "data": "Year4" },
                                { "data": "Year5" },
                                { "data": "YearAbove5" },
                                { "data": "GratuityType" },
                                { "data": "Remarks" }
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
                                     "targets": 1
                                 },
                                  {
                                      "render": function (data, type, row) {
                                          return getGratuityTypeById(data);
                                      },
                                      "targets": 8
                                  },
                           ],
                           "rowCallback": function (row, data) {
                           }
                       });

                   },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblGraduitySetting').on('click', 'tbody tr i.edit', function () {
            var rowData = tblGraduitySetting.row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.graduitySetting.GraduitySettingID = rowData.GraduitySettingID;
                    $scope.graduitySetting.Year1 = rowData.Year1;
                    $scope.graduitySetting.Year2 = rowData.Year2;
                    $scope.graduitySetting.Year3 = rowData.Year3;
                    $scope.graduitySetting.Year4 = rowData.Year4;
                    $scope.graduitySetting.Year5 = rowData.Year5;
                    $scope.graduitySetting.YearAbove5 = rowData.YearAbove5;
                    $scope.graduitySetting.GratuityType = rowData.GratuityType;
                    $scope.selectedGratuityTypeName = getGratuityTypeById(rowData.GratuityType);
                    //$scope.graduitySetting.IsBasicOnly = rowData.IsBasicOnly;
                    $scope.graduitySetting.CompanyID = rowData.CompanyID;
                    $scope.selectedCompanyName = getCompanyById(rowData.CompanyID);
                    $scope.graduitySetting.Remarks = rowData.Remarks;
                    $scope.isCreateGraduitySetting = false;
                });
                $('#mdlGraduitySetting').modal("show");
            }
        });
        $('#tblGraduitySetting').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.graduitySetting.GraduitySettingID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlGraduitySettingDelete').modal("show");
        });
        $scope.createGraduitySetting = function () {
            if (isFormValid($scope.frmGraduitySetting)) {
                $scope.$parent.isNameExist('Company', 0, 'graduity', '' + $scope.graduitySetting.CompanyID).then(function (response) {
                    if (response.data) addNotification('Error', 'Graduity Setting with same company already exists!', 'error');
                    else {
                        companyService.createGraduitySetting($scope.graduitySetting).then(
                               function (response) {
                                   addNotification('Success', 'New record is added in gratuitySettings!', 'success');
                                   $('#mdlGraduitySetting').modal("hide");
                                   loadGraduitySettings();
                               },
                                function (data) {
                                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlGraduitySetting').modal("hide");
                                });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
            }
        };

        $scope.updateGraduitySetting = function () {
            if (isFormValid($scope.frmGraduitySetting)) {
                $scope.$parent.isNameExist('Company', $scope.graduitySetting.GraduitySettingID, 'graduity', '' + $scope.graduitySetting.CompanyID).then(function (response) {
                    if (response.data) addNotification('Error', 'Graduity Setting with same company already exists!', 'error');
                    else {
                        companyService.updateGraduitySetting($scope.graduitySetting).then(
                           function (response) {
                               addNotification('Success', 'Record is successfully updated!', 'success');
                               $('#mdlGraduitySetting').modal("hide");
                               loadGraduitySettings();
                           },
                            function (data) {
                                if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlGraduitySetting').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
            }
        };
        $scope.deleteGraduitySetting = function () {
            companyService.deleteGraduitySetting($scope.graduitySetting.GraduitySettingID).then(
                function (response) {
                    loadGraduitySettings();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };
        $scope.setGrauityType = function (gratuityType,Name) {
            $scope.graduitySetting.GratuityType = gratuityType;
            $scope.selectedGratuityTypeName = Name;
        }
        $('body').on('click', '#mdlGraduitySetting .checkbox-container', function () {
            var elm = $(this);
            $scope.$apply(function () {
                toggleCheck(elm);
                function toggleCheck(elm) {
                    var checked = elm.hasClass('checked');
                    if (checked) {
                        $scope.graduitySetting.IsBasicOnly = false;
                        elm.removeClass('checked');
                        elm.find('input[type=checkbox]').prop('checked', false);
                    }
                    else {
                        $scope.graduitySetting.IsBasicOnly = true;
                        elm.addClass('checked');
                        elm.find('input[type=checkbox]').prop('checked', true);
                    }
                }
            });
        });
        function getGratuityTypeById(data) {
            if (data == 1) {
                return 'Basic';
            }
            else if (data == 2) {
                return 'Full Salary';
            }
            if (data == 3) {
                return 'Grauity Salary';
            }
        }
        function isDropDownsValid(frm, model) {
            var _result = true;
            if (model.CountryID == undefined) {
                frm.txtCountryID.$dirty = true;
                _result = false;
            }
            if (model.CompanyTypeID == undefined) {
                frm.txtCompanyTypeID.$dirty = true;
                _result = false;
            }
            if (model.CompanyStatusID == undefined) {
                frm.txtCompanyStatusID.$dirty = true;
                _result = false;
            }
            if (window.location.href.toLowerCase().indexOf('companystatus') == -1 && window.location.href.toLowerCase().indexOf('companytype') == -1)
            {
                if (model.Logo == undefined || model.Logo == '') {
                    angular.element('#filePhoto').addClass('border-red');
                    angular.element('#filePhoto').next('span').removeClass('hide');
                    _result = false;
                }
            }
            
            if (!isFormValid(frm)) {
                _result = false;
            }
            return _result;
        }

        // Gratuity
        $scope.gratuity = {
            MonthID: undefined,
            CompanyID: undefined,
            Year: undefined,
        };
        $scope.selectedEmployees = new Array();

        var gratuity = {
            GratuityID: 0,
            EmployeeID: 0,
            SettlementDate: '',
            JoiningDate: '',
            GratuityAmount: 0,
            TotalLeavePending: 0,
            TotalLeaveSalaryPending: 0,
            OtherText: 0,
            OtherAmount: '',
            Remarks: ''
        };
        $('#tblGratuity').hide();
        //$('#tblGratuity').parent().next().next('input[type=button]').hide();
        function loadGratuitys() {
            if ($scope.gratuity.SettlementDate == undefined) {
                $scope.frmGratuity.txtSettlementDate.$dirty = true;
                return false;
            }
            if ($scope.gratuity.CompanyID == undefined) {
                $scope.frmGratuity.txtCompanyID.$dirty = true;
                return false;
            }
           // $scope.gratuity.SettlementDate = formatDateYYYYmmDD($scope.gratuity.SettlementDate);
            var _gratuity = {CompanyID : $scope.gratuity.CompanyID,SettlementDate : formatDateYYYYmmDD($scope.gratuity.SettlementDate)};
            companyService.generateGratuityByMonth(_gratuity).then(
                   function (response) {
                       $scope.selectedEmployees = new Array();
                       $('#tblGratuity').show();
                       if (response.data.length > 0) {

                           // $('#tblGratuity').parent().next().next('input[type=button]').show();
                       }
                       if ($.fn.dataTable.isDataTable('#tblGratuity')) {
                           $('#tblGratuity').DataTable().destroy();
                       }
                       $('#tblGratuity').DataTable({
                           fixedHeader: {
                               header: true
                           },
                           data: response.data,
                           "lengthMenu": [[25, -1], [25, "All"]],
                           "order": [[1, "asc"]],
                           "columns": [
                                { "data": "GratuityID" },
                                { "data": "SettlementDate" },
                                { "data": "EmployeeID" },
                                { "data": "JoiningDate" },
                                { "data": "TotalWorkingDays" },
                                { "data": "TotalLeavePending" },
                                { "data": "TotalLeaveSalaryPending" },
                                { "data": "NoticePeriodDays" },
                                { "data": "NoticePeriodAmount" },
                                { "data": "AirTicketAmount1" },
                                { "data": "AirTicketAmount2" },
                                { "data": "AdditionText1" },
                                { "data": "AdditionAmount1" },
                                { "data": "AdditionText2" },
                                { "data": "AdditionAmount2" },
                                { "data": "OtherText1" },
                                { "data": "OtherAmount1" },
                                { "data": "OtherText2" },
                                { "data": "OtherAmount2" },
                                { "data": "OtherText3" },
                                { "data": "OtherAmount3" },
                                { "data": "OtherText4" },
                                { "data": "OtherAmount4" },
                            
                                { "data": "GratuityAmount" },
                                { "data": "Remarks" }
                           ],
                           "columnDefs": [
                                {
                                    "render": function (data, type, row) {
                                        return ' <div class="icheckbox_flat-blue checkbox-container" data-employeeid="' + row.EmployeeID + '" >' +
                                                 '<input type="checkbox" class="flat">' +
                                                 '<ins class="iCheck-helper"></ins>' +
                                             '</div>';
                                    },
                                    "targets": 0
                                },
                                 {
                                     "render": function (data, type, row) {
                                         return ToJavaScriptDate(data);
                                     },
                                     "targets": 1
                                 },
                               {
                                   "render": function (data, type, row) {
                                       return getEmployeeById(data).EmployeeName;
                                   },
                                   "targets": 2
                               },
                               {
                                   "render": function (data, type, row) {
                                       return ToJavaScriptDate(getEmployeeById(row.EmployeeID).JoiningDate);
                                   },
                                   "targets": 3
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others AdditionText1" />';
                                   },
                                   "targets": 11
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="others AdditionAmount1" />';
                                   },
                                   "targets": 12
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others AdditionText2" />';
                                   },
                                   "targets": 13
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="others AdditionAmount2" />';
                                   },
                                   "targets": 14
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others OtherText1" />';
                                   },
                                   "targets": 15
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others OtherAmount1" />';
                                   },
                                   "targets": 16
                               }, 
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others OtherText2" />';
                                   },
                                   "targets": 17
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="others OtherAmount2" />';
                                   },
                                   "targets": 18
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others OtherText3" />';
                                   },
                                   "targets": 19
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="others OtherAmount3" />';
                                   },
                                   "targets": 20
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others OtherText4" />';
                                   },
                                   "targets": 21
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="others OtherAmount4" />';
                                   },
                                   "targets": 22
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="leave-days" />';
                                   },
                                   "targets": 5
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="leave-amount" disabled />';
                                   },
                                   "targets": 6
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="notice-days" />';
                                   },
                                   "targets": 7
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="notice-amount" disabled />';
                                   },
                                   "targets": 8
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="others AirTicketAmount1" />';
                                   },
                                   "targets": 9
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="number" class="others AirTicketAmount2" />';
                                   },
                                   "targets": 10
                               },
                               {
                                   "render": function (data, type, row) {
                                       return '<input type="text" class="others Remarks" />';
                                   },
                                   "targets": 24
                               }
                           ],
                           "rowCallback": function (row, data) {
                           }
                       });
                   },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    //$scope.message = data.error_description;
                });
        }

        function processGratuity(gratuity) {
            companyService.createGratuity(gratuity).then(
                function (response) {
                    if (response.data) {
                        addNotification('Gratuity Processed', 'Gratuity is successfully processed!', 'success');
                        //if ($.fn.dataTable.isDataTable('#tblGratuity')) {
                        //    $('#tblGratuity').DataTable().destroy();
                        //    $('#tblGratuity').hide();
                        //    $scope.selectedEmployees = new Array();
                        //}
                        loadGratuitys();
                    } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        $scope.generateGratuity = function () {
            loadEmployees();
        };
        $scope.processGratuity = function () {
            var gratuity = new Array();

            $('#tblGratuity').DataTable().rows().every(function (rowIdx, tableLoop, rowLoop) {
                var data = this.data();
                if ($scope.selectedEmployees.indexOf(data.EmployeeID) > -1) {
                    gratuity.push({
                        EmployeeID: data.EmployeeID
                   , SettlementDate: formatDateYYYYmmDD(ToJavaScriptDate(data.SettlementDate))
                  // , JoiningDate: formatDateYYYYmmDD(ToJavaScriptDate(getEmployeeById(data.EmployeeID).JoiningDate))
                   , GratuityAmount: data.GratuityAmount
                   , TotalLeavePending: data.TotalLeavePending
                   , TotalWorkingDays: data.TotalWorkingDays
                   , TotalLeaveSalaryPending: data.TotalLeaveSalaryPending
                   , AdditionText1: data.AdditionText1
                   , AdditionAmount1: data.AdditionAmount1
                   , AdditionText2: data.AdditionText2
                   , AdditionAmount2: data.AdditionAmount2
                   , OtherText1: data.OtherText1
                   , OtherAmount1: data.OtherAmount1
                   , OtherText2: data.OtherText2
                   , OtherAmount2: data.OtherAmount2
                   , OtherText3: data.OtherText3
                   , OtherAmount3: data.OtherAmount3
                   , OtherText4: data.OtherText4
                   , OtherAmount4: data.OtherAmount4
                   , NoticePeriodDays: data.NoticePeriodDays
                   , NoticePeriodAmount: data.NoticePeriodAmount
                   , AirTicketAmount1: data.AirTicketAmount1
                   , AirTicketAmount2: data.AirTicketAmount2
                   , Remarks: data.Remarks
                    });
                }
            });
            processGratuity(gratuity)
        };
        $('body').on('click', '#tblGratuity .checkbox-container', function () {
            var elm = $(this);
            var _employeeId = elm.data('employeeid');
            $scope.$apply(function () {
                toggleCheck(elm);
                function toggleCheck(elm) {
                    var checked = elm.hasClass('checked');
                    if (checked) {
                        $scope.selectedEmployees.splice($scope.selectedEmployees.indexOf(_employeeId), 1);
                        elm.removeClass('checked');
                        elm.find('input[type=checkbox]').prop('checked', false);
                    }
                    else {
                        $scope.selectedEmployees.push(_employeeId);
                        elm.addClass('checked');
                        elm.find('input[type=checkbox]').prop('checked', true);
                    }
                }
            });
        });
        $('#tblGratuity').on('blur', 'tbody tr .notice-days', function () {
            var _elm = $(this);
            var rowData = $('#tblGratuity').DataTable().row(_elm.parents('tr')).data();
            if (rowData != undefined) {
                rowData.NoticePeriodDays =  parseFloat(_elm.val());
                rowData.NoticePeriodAmount = (getSalaryByEmployeeId(rowData.EmployeeID).TotalSalary * rowData.NoticePeriodDays).toFixed(2);
                _elm.parents('tr').find('.notice-amount').val(rowData.NoticePeriodAmount);
               // $('#tblGratuity').DataTable().row(_elm.parents('tr')).data(rowData).draw();
            }
           // 7000 *12 / 365 * 48
        });
        $('#tblGratuity').on('blur', 'tbody tr .leave-days', function () {
            var _elm = $(this);
            var rowData = $('#tblGratuity').DataTable().row(_elm.parents('tr')).data();
            if (rowData != undefined) {
                rowData.TotalLeavePending = parseFloat(_elm.val());
                rowData.TotalLeaveSalaryPending = ((getSalaryByEmployeeId(rowData.EmployeeID).TotalSalary) / 22 * rowData.TotalLeavePending).toFixed(2);
                _elm.parents('tr').find('.leave-amount').val(rowData.TotalLeaveSalaryPending);
                // $('#tblGratuity').DataTable().row(_elm.parents('tr')).data(rowData).draw();
            }

        });

        $('#tblGratuity').on('focus', 'tbody tr input', function () {
            var _elm = $(this);
            $('#tblGratuity tbody tr').removeClass('bg-blue');
            _elm.parents('tr').addClass('bg-blue');
        });

        $('#tblGratuity').on('blur', 'tbody tr .others', function () {
            var _elm = $(this);
            var rowData = $('#tblGratuity').DataTable().row(_elm.parents('tr')).data();
            if (rowData != undefined) {
                if (_elm.is(":text")) {
                    rowData[_elm.attr('class').replace('others ', '')] = _elm.val();
                }
                else {
                    rowData[_elm.attr('class').replace('others ', '')] = parseFloat(_elm.val()).toFixed(2);
                }
                
                // $('#tblGratuity').DataTable().row(_elm.parents('tr')).data(rowData).draw();
            }

        });
        $scope.switchChecked = function (elm) {
            var _checkbox = $('#' + elm);//.find('input[type="checkbox"]');

            var index = 1;
            //var checked = _checkbox.prop('checked');
            var checked = _checkbox.parent('div').hasClass('checked');
            var table = $('#tblGratuity').DataTable();
            if (checked) {
                _checkbox.parent('div').removeClass('checked');
                table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var data = this.data();
                    //var _value = $(data[index]).data('employeeid');
                    $scope.selectedEmployees.splice($scope.selectedEmployees.indexOf(data.EmployeeID), 1);
                });
            }
            else {
                _checkbox.parent('div').addClass('checked');
            }
            $('#tblGratuity tbody tr .checkbox-container').each(function () {
                var elm = $(this);
                if (checked) {
                    $scope.selectedEmployees.splice($scope.selectedEmployees.indexOf(elm.data('employeeid')), 1);
                    elm.removeClass('checked');
                    elm.find('input[type=checkbox]').prop('checked', false);
                }
                else {
                    elm.addClass('checked');
                    elm.find('input[type=checkbox]').prop('checked', true);
                    $scope.selectedEmployees.push(elm.data('employeeid'));
                }
            });
        }


        function getMonthById() {
            var _monthName;
            for (var i = 0; i < $scope.months.length; i++) {
                if ($scope.months[i].MonthID === Id) {
                    _monthName = $scope.months[i].MonthName
                    break;
                }
            }
            return _monthName;
        }
        function loadEmployees() {
            employeeService.getAllEmployees(1).then(
                  function (response) {
                      $scope.employees = response;
                      $scope.unfilteredEmployees = response;
                      loadGratuitys();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadSalaries() {
            salaryService.getAllSalary().then(
                   function (response) {
                       $scope.salaries = response;;
                   },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function getEmployeeById(Id) {
            var _employeeName;
            for (var i = 0; i < $scope.unfilteredEmployees.length; i++) {
                if ($scope.unfilteredEmployees[i].EmployeeID === Id) {
                    _employeeName = $scope.unfilteredEmployees[i];
                    break;
                }
            }
            return _employeeName;
        }
        function getSalaryByEmployeeId(Id) {
            for (var i = 0; i < $scope.salaries.length; i++) {
                if ($scope.salaries[i].EmployeeID == Id) {
                    return $scope.salaries[i];
                }
            }
        }
    }
})();