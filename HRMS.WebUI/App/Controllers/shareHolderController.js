(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('shareholderController', shareholderController);

    shareholderController.$inject = ['$scope', '$location', 'shareholderService', 'companyService', 'employeeService', ];

    function shareholderController($scope, $location, shareholderService, companyService, employeeService) {

        // Onload

            loadShareHolderTypes();

        // Shareholder Type

        var tblShareHolderType;
        $scope.shareHolderType = {
            ShareHolderTypeID: 0,
            ShareHolderTypeName: '',
            Remarks: ''
        }
        $scope.isCreateShareHolderType = false;
        $scope.triggerCreateShareHolderType = function () {
            $scope.isCreateShareHolderType = true;
            $scope.shareHolderType.ShareHolderTypeName = '';
            $scope.shareHolderType.Remarks = '';
            $('#mdlShareHolderType').modal("show");
            angular.forEach($scope.frmShareholderType.$error.required, function (field) {
                field.$valid = true;
            });
        }
        function loadShareHolderTypes() {

            shareholderService.getAllShareHolderType().then(
                   function (response) {
                   
                       if (window.location.href.toLowerCase().indexOf('shareholdertype') == -1) {
                           $scope.shareHolderTypes = response;
                       }
                       else {
                           if ($.fn.dataTable.isDataTable('#tblShareHolderType')) {
                               $('#tblShareHolderType').DataTable().destroy();
                           }
                           tblShareHolderType = $('#tblShareHolderType').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "ShareHolderTypeID" },
                                    { "data": "ShareHolderTypeName" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                    {
                                        "render": function (data, type, row) {
                                            return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete  glyphicon-remove-circle" ID="' + data + '"></i>';
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
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        if (window.location.href.toLowerCase().indexOf('report') == -1) {
            $('#tblShareHolderType').on('click', 'tbody tr i.edit', function () {
                var rowData = $('#tblShareHolderType').DataTable().row($(this).parents('tr')).data();
                if (rowData != undefined) {
                    $scope.$apply(function () {
                        $scope.shareHolderType.ShareHolderTypeID = rowData.ShareHolderTypeID;
                        $scope.shareHolderType.ShareHolderTypeName = rowData.ShareHolderTypeName;
                        $scope.shareHolderType.Remarks = rowData.Remarks;
                        $scope.isCreateShareHolderType = false;
                    });
                    $('#mdlShareHolderType').modal("show");
                }
            });
        }
        $('#tblShareHolderType').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.shareholderType.ShareHolderTypeID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlShareholderTypeDelete').modal("show");
        });
        $scope.createShareHolderType = function () {
            if (isFormValid($scope.frmShareholderType)) {
                $scope.$parent.isNameExist('Shareholder', 0, 'type', $scope.shareHolderType.ShareHolderTypeName).then(function(response){
                    if (response.data) addNotification('Error', 'Shareholder Type with same name already exists!', 'error');
                    else{
                        shareholderService.createShareHolderType($scope.shareHolderType).then(
                            function (response) {
                                addNotification('Success', 'New record is added in ShareHolder Type!', 'success');
                                $('#mdlShareHolderType').modal("hide");
                                loadShareHolderTypes();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlShareHolderType').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlShareHolderType').modal("hide");
                });
            }
        };

        $scope.updateShareHolderType = function () {
            if (isFormValid($scope.frmShareholderType)) {
                $scope.$parent.isNameExist('Shareholder', $scope.shareHolderType.ShareHolderTypeID, 'type', $scope.shareHolderType.ShareHolderTypeName).then(function (response) {
                    if (response.data) addNotification('Error', 'Shareholder Type with same name already exists!', 'error');
                    else {
                        shareholderService.updateShareHolderType($scope.shareHolderType).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlShareHolderType').modal("hide");
                                loadShareHolderTypes();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlShareHolderType').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlShareHolderType').modal("hide");
                });
            }
        };

        $scope.deleteShareHolderType = function () {
            shareholderService.deleteShareHolderType($scope.shareHolderType.ShareHolderTypeID).then(
                function (response) {
                    loadShareHolderTypes();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

        function getShareholderTypeById(Id) {
            var _shareholderTypeName;
            for (var i = 0; i < $scope.shareHolderTypes.length; i++) {
                if ($scope.shareHolderTypes[i].ShareHolderTypeID == Id) {
                    _shareholderTypeName = $scope.shareHolderTypes[i].ShareHolderTypeName
                    break;
                }
            }
            return _shareholderTypeName;
        }
        $scope.setShareholderType = function (ID, Name) {
            $scope.shareholder.ShareHolderTypeID = ID;
            $scope.selectedShareholderTypeName = Name;
        }
        // Shareholder

        var isUpdateDataTable = false;
        var tblShareholder;
        $scope.shareholder = {
            ShareHolderID: 0,
            ShareHolderName: '',
            ShareHolderTypeID: 0,
            Relationship: '',
            MobileNumber: '',
            ContactNumber: '',
            Address: '',
            TotalShares: '',
            DigitalSignature: '',
            //AuthorisedCapital: '',
            //TotalCapital: '',
            //ShareValue: '',
            CompanyID: 0,
            EmployeeID: 0,
            //NomialValue: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";
        clearDropDowns();
      
        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.shareholder.ShareHolderID = '';
            $scope.shareholder.ShareHolderTypeID = undefined;
            $scope.shareholder.ShareHolderName = '';
            $scope.shareholder.Relationship = '';
            $scope.shareholder.MobileNumber = '';
            $scope.shareholder.ContactNumber = '';
            $scope.shareholder.Address = '';
            $scope.shareholder.TotalShares = '';
            $scope.shareholder.DigitalSignature = '';
            //$scope.shareholder.AuthorisedCapital = '';
            //$scope.shareholder.TotalCapital = '';
            //$scope.shareholder.ShareValue = '';
            $scope.shareholder.CompanyID = undefined;
            $scope.shareholder.EmployeeID = undefined;
            //$scope.shareholder.NomialValue = '';
            $scope.shareholder.Remarks = '';
            clearDropDowns();
            $('#mdlShareholder').modal("show");
            angular.forEach($scope.frmShareholder.$error.required, function (field) {
                field.$valid = true;
            });
        }
        loadCompanies();

        function loadShareholders() {

            shareholderService.getAllShareholder().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblShareholder')) {
                               $('#tblShareholder').DataTable().destroy();
                           }
                           tblShareholder = $('#tblShareholder').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "ShareHolderID" },
                                    { "data": "ShareHolderName" },
                                    { "data": "ShareHolderTypeID" },
                                    { "data": "TotalShares" },
                                    { "data": "MobileNumber" },
                                    { "data": "ContactNumber" },
                                    { "data": "Address" },
                                    { "data": "DigitalSignature" },
                                    { "data": "CompanyID" },
                                    { "data": "EmployeeID" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                    //{ className: "hide_column", "targets": [14] },
                                    {
                                         "render": function (data, type, row) {
                                             return '<i class="glyphicon glyphicon-edit edit-shareholder"></i> / <i class="glyphicon delete-shareholder  glyphicon-remove-circle" shareholderID="' + data + '"></i>';
                                         },
                                         "targets": 0
                                     },
                                    {
                                        "render": function (data, type, row) {
                                            return getCompanyById(data);
                                        },
                                        "targets": 8
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getShareholderTypeById(data);
                                        },
                                        "targets": 2
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getEmployeesById(data);
                                        },
                                        "targets": 9
                                    }
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblShareholder').on('click', 'tbody tr i.edit-shareholder', function () {
            var rowData = $('#tblShareholder').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.shareholder.ShareHolderID = rowData.ShareHolderID;
                    $scope.shareholder.ShareHolderName = rowData.ShareHolderName;
                    $scope.shareholder.ShareHolderTypeID = rowData.ShareHolderTypeID;
                    $scope.shareholder.MobileNumber = rowData.MobileNumber;
                    $scope.shareholder.ContactNumber = rowData.ContactNumber;
                    $scope.shareholder.Address = rowData.Address;
                    $scope.shareholder.TotalShares = rowData.TotalShares;
                    $scope.shareholder.DigitalSignature = rowData.DigitalSignature;
                    //$scope.shareholder.AuthorisedCapital = rowData.AuthorisedCapital;
                    //$scope.shareholder.TotalCapital = rowData.TotalCapital;
                    //$scope.shareholder.ShareValue = rowData.ShareValue;
                    $scope.shareholder.CompanyID = rowData.CompanyID;
                    $scope.shareholder.EmployeeID = rowData.EmployeeID;
                    //$scope.shareholder.IssuedCapital = rowData.IssuedCapital;
                    //$scope.shareholder.NomialValue = rowData.NomialValue;
                    $scope.shareholder.Remarks = rowData.Remarks;
                    $scope.selectedCompanyName = getCompanyById(rowData.CompanyID);
                    $scope.selectedEmployeeName = getEmployeesById(rowData.EmployeeID);
                    $scope.selectedShareholderTypeName = getShareholderTypeById(rowData.ShareHolderTypeID);
                    $scope.employees = getEmployeeByCompanyID(rowData.CompanyID, $scope.allEmployees);
                    $scope.isCreate = false;
                });
                $('#mdlShareholder').modal("show");
            }
        });
        $('#tblShareholder').on('click', 'tbody tr i.delete-shareholder', function () {
            var _shareholderID = $(this).attr('shareholderID');
            var _deleteShareholderName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.shareholder.ShareHolderID = _shareholderID;
                $scope.deleteShareholderName = _deleteShareholderName;
            });
            $('#mdlShareholderDelete').modal("show");
        });
        $scope.createShareholder = function () {
            if (isDropDownsValid($scope.frmShareholder, $scope.shareholder)) {
                $scope.$parent.isNameExist('Shareholder', 0, '', $scope.shareholder.ShareHolderName).then(function(response){
                    if(response.data)    addNotification('Error', 'Shareholder with same name already exists!', 'error');
                    else{
                        shareholderService.createShareholder($scope.shareholder).then(
                             function (response) {
                                 addNotification('Success', 'New record is added in ShareHolder!', 'success');
                                 $('#mdlShareholder').modal("hide");
                                 loadShareholders();
                             },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlShareholder').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlShareholder').modal("hide");
                });
            }
        };

        $scope.updateShareholder = function () {
            if (isDropDownsValid($scope.frmShareholder, $scope.shareholder)) {
                $scope.$parent.isNameExist('Shareholder', $scope.shareholder.ShareHolderID, '', $scope.shareholder.ShareHolderName).then(function (response) {
                    if (response.data) addNotification('Error', 'Shareholder with same name already exists!', 'error');
                    else {
                        shareholderService.updateShareholder($scope.shareholder).then(
                             function (response) {
                                 addNotification('Success', 'Record is successfully updated!', 'success');
                                 $('#mdlShareholder').modal("hide");
                                 loadShareholders();
                             },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlShareholder').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlShareholder').modal("hide");
                });
            }
        };

        $scope.deleteShareholder = function () {
            shareholderService.deleteShareholder($scope.shareholder.ShareHolderID).then(
                function (response) {
                    isUpdateDataTable = true;
                    loadShareholders();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

        function loadCompanies() {
            companyService.getAllCompanies().then(
                  function (response) {
                      $scope.companies = response;
                      loadEmployees();
                  },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadEmployees() {
            employeeService.getAllEmployees().then(
                  function (response) {
                      $scope.allEmployees = response;
                      $scope.employees = response;
                      loadShareholders();
                  },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
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
        function getEmployeesById(Id) {
            var _employeeName;
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].EmployeeID == Id) {
                    _employeeName = $scope.employees[i].EmployeeName
                    break;
                }
            }
            return _employeeName;
        }
        $scope.setCompany = function (ID, Name) {
            $scope.employees = getEmployeeByCompanyID(ID, $scope.allEmployees);
            $scope.shareholder.CompanyID = ID;
            $scope.selectedCompanyName = Name;
        }
        $scope.setEmployee = function (ID, Name) {
            $scope.shareholder.EmployeeID = ID;
            $scope.selectedEmployeeName = Name;
        }

        function clearDropDowns() {
            $scope.selectedEmployeeName = "Select Employee";
            $scope.selectedCompanyName = "Select Company";
            $scope.selectedShareholderTypeName = "Select Shareholder Type";
        }

        function isDropDownsValid(frm, model) {
            var _result = true;
            if (model.EmployeeID == undefined) {
                frm.txtEmployeeID.$dirty = true;
                _result = false;
            }
            if (model.CompanyID == undefined) {
                frm.txtCompanyID.$dirty = true;
                _result = false;
            }
            if (model.ShareHolderTypeID == undefined) {
                frm.txtShareHolderTypeID.$dirty = true;
                _result = false;
            }
            if (!isFormValid(frm)) {
                _result = false;
            }
            return _result;
        }
    }
})();