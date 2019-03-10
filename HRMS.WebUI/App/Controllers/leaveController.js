(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('leaveController', leaveController);

    leaveController.$inject = ['$scope', '$location', 'leaveService', 'employeeService'];

    function leaveController($scope, $location, leaveService, employeeService) {

        // On Load

        var isLeave, isLeaveStatus, isLeaveType = false;

        if (window.location.href.toLowerCase().indexOf('leavetype') > -1) {
            loadLeaveTypes();
        }
        else if (window.location.href.toLowerCase().indexOf('leavestatus') > -1){
            loadLeaveStatus();
        }
        else {
            isLeave = true;
            loadEmployees();
            var _roleName = $('#CurrentUserRoleName').text().toLowerCase();
            if (_roleName.indexOf('manager') > -1 && _roleName.indexOf('general') == -1 ) {
                $scope.isManager = true;
            }
            else {
                $scope.isManager = false;
            }
            if (_roleName.indexOf('general') > -1) {
                $scope.isGM = true;
            }
            else {
                $scope.isGM = false;
            }
        }


        // Leave

        var tblLeave;
        $scope.leave = {
            LeaveID: 0,
            EmployeeID: '',
            LeaveTypeID: 0,
            LeaveStatusID: 0,
            Date: new Date(),
            ToDate: new Date(),
            FromDate: new Date(),
            LeaveBalance: 0,
            RemainingLeaveDays: 0,
            PreviousLeaveDays: 0,
            TotalLeaveDays: 0,
            LeaveDocumentPath: '',
            FileName : '',
           // FileExt : '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";
        clearDropDowns();
        $scope.triggerCreate = function () {
            loadEmployees();
            $scope.isCreate = true;
            $scope.isEdit = false;
            $scope.leave.EmployeeID = undefined;
            $scope.leave.LeaveTypeID = undefined;
            $scope.leave.LeaveStatusID = undefined;
            $scope.leave.Date = formatDate(new Date());
            $scope.leave.ToDate = formatDate(new Date());
            $scope.leave.FromDate = formatDate(new Date());
            $scope.leave.LeaveBalance = undefined;
            $scope.leave.TotalLeaveDays = undefined;
            $scope.leave.RemainingLeaveDays = undefined;
            $scope.leave.PreviousLeaveDays = undefined;
            $scope.leave.LeaveDocumentPath = undefined;
           // $scope.leave.FileExt = '',
            $scope.leave.FileName = '',
            $scope.leave.Remarks = '';
            $('#mdlLeave').modal("show");
            clearDropDowns();
            angular.forEach($scope.frmLeave.$error.required, function (field) {
                field.$dirty = false;
                //field.$valid = false;
            });
            angular.element('#txtLeaveDocumentPath').removeClass('border-red');
            angular.element('#txtLeaveDocumentPath').next('span').addClass('hide');
            $scope.isManagerApproved = false;
            var _roleName = $('#CurrentUserRoleName').text().toLowerCase();
            if (_roleName.indexOf('manager') > -1 && _roleName.indexOf('general') == -1 ) {
                $scope.isManager = true;
            }
            else {
                $scope.isManager = false;
            }
            if (_roleName.indexOf('general') > -1) {
                $scope.isGM = true;
            }
            else {
                $scope.isGM = false;
            }
        }

        function loadLeaves() {

            leaveService.getAllLeave().then(
                   function (response) {
                       $scope.leaves = response;
                           if ($.fn.dataTable.isDataTable('#tblLeave')) {
                               $('#tblLeave').DataTable().destroy();
                           }
                           tblLeave = $('#tblLeave').DataTable({
                               data: response,
                              // "order": [[0, "dsc"]],
                               "columns": [
                                    { "data": "LeaveID" },
                                    { "data": "EmployeeID" },
                                    { "data": "LeaveTypeID" },
                                    { "data": "LeaveStatusID" },
                                    { "data": "Date" },
                                    { "data": "FromDate" },
                                    { "data": "ToDate" },
                                    { "data": "LeaveBalance" },
                                    { "data": "TotalLeaveDays" },
                                    { "data": "LeaveBalanceAsNow" },
                                //    { "data": "LeaveDocumentPath" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                    {
                                        "render": function (data, type, row) {
                                            var _hidden = '';
                                            if (row.LeaveStatusID == 3) {
                                                _hidden = 'hidden';
                                            }
                                            return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon '+ _hidden +' delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                        },
                                        "targets": 0
                                    },
                                    { className: "hide_column", "targets": [9] },
                                    { className: "hide_column", "targets": [10] },
                                    {
                                        "render": function (data, type, row) {
                                            var _emp = getEmployeeById(data);
                                            if (_emp != undefined) {
                                                return _emp.EmployeeName;
                                            }
                                            return ' - ';
                                        },
                                        "targets": 1
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            var _leaveType = getLeaveTypeById(data);
                                            if (_leaveType != undefined) {
                                                return _leaveType.LeaveTypeName;
                                            }
                                            return ' - ';
                                        },
                                        "targets": 2
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getLeaveStatusById(data);
                                        },
                                        "targets": 3
                                    }
                                    ,
                                    {
                                        "render": function (data, type, row) {
                                            return ToJavaScriptDate(data);
                                        },
                                        "targets": 4
                                    }
                                    ,
                                    {
                                        "render": function (data, type, row) {
                                            return ToJavaScriptDate(data);
                                        },
                                        "targets": 5
                                    }
                                    ,
                                    {
                                        "render": function (data, type, row) {
                                            return ToJavaScriptDate(data);
                                        },
                                        "targets": 6
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

        $('#tblLeave').on('click', 'tbody tr i.edit', function () {
            loadEmployees();
            var rowData = $('#tblLeave').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.leave.LeaveID = rowData.LeaveID;
                    $scope.leave.EmployeeID = rowData.EmployeeID;
                    $scope.leave.LeaveTypeID = rowData.LeaveTypeID;
                    $scope.leave.LeaveStatusID = rowData.LeaveStatusID;
                    $scope.leave.Date = ToJavaScriptDate(rowData.Date);
                    $scope.leave.ToDate = ToJavaScriptDate(rowData.ToDate);
                    $scope.leave.FromDate = ToJavaScriptDate(rowData.FromDate);
                    $scope.leave.LeaveBalance = rowData.LeaveBalance;
                    $scope.leave.LeaveBalanceAsNow = rowData.LeaveBalanceAsNow;
                    $scope.leave.TotalLeaveDays = rowData.TotalLeaveDays;
                 //   $scope.leave.LeaveDocumentPath = rowData.LeaveDocumentPath;
                    $scope.leave.Remarks = rowData.Remarks;
                    var _emp = getEmployeeById(rowData.EmployeeID);
                    if(_emp != undefined){
                        $scope.selectedEmployeeName = _emp.EmployeeName;
                    }
                    var _leaveType = getLeaveTypeById(rowData.LeaveTypeID);
                    if (_leaveType != undefined) {
                        $scope.selectedLeaveTypeName = _leaveType.LeaveTypeName;
                        $scope.leave.LeaveBalance = _emp.LeaveBalanceAsNow;
                    }
                    $scope.selectedLeaveStatusName = getLeaveStatusById(rowData.LeaveStatusID);
                    $scope.leave.RemainingLeaveDays = rowData.LeaveBalance;
                    $scope.leave.PreviousLeaveDays = rowData.LeaveBalance;
                    //$scope.leaveDaysChange();
                    $scope.isCreate = false;
                    $scope.isEdit = true;
                    if (rowData.LeaveStatusID == 3) {
                        //$scope.isManagerApproved = true;
                        $scope.selectedManagerApprovalName = 'Approved';
                        $scope.selectedGMApprovalName = 'Approved';
                        $scope.isEdit = false;
                    }
                    else {
                        $scope.selectedGMApprovalName = "Select GM Approval";
                    }
                    var _employee = getEmployeeById(rowData.EmployeeID);
                    if (_employee.ReportingToID == $('#hdnGmEmployeeID').val() && $('#CurrentUserRoleName').text().toLowerCase().indexOf('general') >= -1) {
                        $scope.isManagerApproved = true;
                    }
                    if (rowData.LeaveStatusID == 2) {
                        $scope.isManagerApproved = true;
                        $scope.selectedManagerApprovalName = 'Approved';
                        //$scope.isManager = true;
                    }
                    if (rowData.LeaveStatusID == 4) {
                        if (_employee.ReportingToID == $('#hdnGmEmployeeID').val() && $('#CurrentUserRoleName').text().toLowerCase().indexOf('general') >= -1) {
                            $scope.isManagerApproved = true;
                            $scope.selectedManagerApprovalName = "Select Manager Approval";
                            $scope.selectedGMApprovalName = 'Rejected';
                        }
                        else {
                            $scope.isManagerApproved = false;
                            $scope.selectedManagerApprovalName = 'Rejected';
                        }
                       
                        //$scope.isManager = true;
                    }
                    else if (rowData.LeaveStatusID != 2) {
                        $scope.isManagerApproved = false;
                        $scope.selectedManagerApprovalName = "Select Manager Approval";
                        //$scope.isManager = false;
                    }
                    if (_employee != undefined) {
                        // if (_employee.ReportingToID == $('#CurrentUserEmployeeId').text() && $('#CurrentUserRoleName').text().toLowerCase().indexOf('manager') > -1 && $('#CurrentUserRoleName').text().toLowerCase().indexOf('general') == -1) {
                        if (($('#CurrentUserRoleName').text().toLowerCase().indexOf('manager') > -1 && $('#CurrentUserRoleName').text().toLowerCase().indexOf('general') == -1)) {
                            $scope.isManager = true;
                        }
                        else {
                            $scope.isManager = false;
                        }
                    }
                    if ($('#CurrentUserRoleName').text().toLowerCase().indexOf('general') > -1) {
                        $scope.isGM = true;
                    }
                    else {
                        $scope.isGM = false;
                    }
                    // if current user is logged in and he is manager then he wont be able to change the manager approval status
                    if ($scope.leave.EmployeeID == $('#CurrentUserEmployeeId').text()) {
                        $scope.isManager = false;
                    }
                    calculateLeaveBalance();
                });
                $('#mdlLeave').modal("show");
            }
        });
        $('#tblLeave').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.leave.LeaveID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlLeaveDelete').modal("show");
        });
        $scope.createLeave = function () {
            if (isDropDownsValid($scope.frmLeave, $scope.leave)) {
                //$scope.leave.FileName = $('#txtLeaveDocumentPath').val().split('\\').pop();
                // $scope.leave.FileExt = $('#txtLeaveDocumentPath').val().split('/').pop();
                $scope.leave.FromDate = formatDateYYYYmmDD($scope.leave.FromDate);
                $scope.leave.ToDate = formatDateYYYYmmDD($scope.leave.ToDate);
                $scope.leave.Date = formatDateYYYYmmDD($scope.leave.Date);
                if ($scope.leave.LeaveStatusID == 0 || $scope.leave.LeaveStatusID == undefined) {
                    $scope.leave.LeaveStatusID = 1;
                }
                leaveService.createLeave($scope.leave).then(
                   function (response) {
                       addNotification('Success', 'New record is added in Leave!', 'success');
                       $('#mdlLeave').modal("hide");
                       loadLeaves();
                   },
                    function (data) {
                     if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlLeave').modal("hide");
                 });
            }
        };

        $scope.updateLeave = function () {
            if (isDropDownsValid($scope.frmLeave, $scope.leave)) {
                //$scope.leave.FileName = $('#txtLeaveDocumentPath').val().split('\\').pop();
                $scope.leave.FromDate = formatDateYYYYmmDD($scope.leave.FromDate);
                $scope.leave.ToDate = formatDateYYYYmmDD($scope.leave.ToDate);
                $scope.leave.Date = formatDateYYYYmmDD($scope.leave.Date);
                leaveService.updateLeave($scope.leave).then(
                    function (response) {
                        addNotification('Success', 'Record is successfully updated!', 'success');
                        $('#mdlLeave').modal("hide");
                        loadLeaves();
                    },
                    function (data) {
                     if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlLeave').modal("hide");
                 });
            }
        };

        $scope.deleteLeave = function () {
            leaveService.deleteLeave($scope.leave.LeaveID).then(
               function (response) {
                   addNotification('Success', 'Record is successfully deleted!', 'success');
                   $('#mdlLeaveDelete').modal("hide");
                   loadLeaves();
               },
                    function (data) {
                        if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlLeaveDelete').modal("hide");
                    });
        };

        $scope.dateChange = function () {
            try {
                if (new Date($scope.leave.ToDate) < new Date($scope.leave.FromDate)) {
                    $scope.leave.ToDate = formatDate(new Date($scope.leave.FromDate).addDays(1));
                    addNotification('Error', 'To Date cannot be less than from Date!', 'error');
                }
                else {
                    var _leaveType = getLeaveTypeById($scope.leave.LeaveTypeID);
                    if(new Date(formatDateYYYYmmDD($scope.leave.FromDate)) == new Date(formatDateYYYYmmDD($scope.leave.ToDate))){
                        $scope.leave.TotalLeaveDays = 1;
                    }
                    else{
                        if (_leaveType.LeaveTypeName.toLowerCase().indexOf('annual') > -1) {
                            $scope.leave.TotalLeaveDays = getWorkingDays(new Date(formatDateYYYYmmDD($scope.leave.FromDate)), new Date(formatDateYYYYmmDD($scope.leave.ToDate)));
                        }
                        else {
                            $scope.leave.TotalLeaveDays = (new Date(formatDateYYYYmmDD($scope.leave.ToDate)).getDate() - new Date(formatDateYYYYmmDD($scope.leave.FromDate)).getDate()) + 1;
                        }
                    }
                    $scope.leaveDaysChange();
                }
            }
            catch (e) { }
        };

        function loadEmployees() {
            employeeService.getAllEmployees().then(
                  function (response) {
                      $scope.employees = response;
                      loadLeaveStatus();
                  },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function getLeaveStatusById(Id) {
            var _leaveStatusName;
            for (var i = 0; i < $scope.leaveStatus.length; i++) {
                if ($scope.leaveStatus[i].LeaveStatusID === Id) {
                    _leaveStatusName = $scope.leaveStatus[i].LeaveStatusName
                    break;
                }
            }
            return _leaveStatusName;
        }
        function getLeaveTypeById(Id) {
            var _leaveType;
            for (var i = 0; i < $scope.leaveTypes.length; i++) {
                if ($scope.leaveTypes[i].LeaveTypeID === Id) {
                    _leaveType = $scope.leaveTypes[i]
                    break;
                }
            }
            return _leaveType;
        }
        function getEmployeeById(Id) {
            var _employee;
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].EmployeeID === Id) {
                    _employee = $scope.employees[i];
                    break;
                }
            }
            return _employee;
        }
        $scope.setLeaveStatus = function (ID, Name) {
            $scope.leave.LeaveStatusID = ID;
            $scope.selectedLeaveStatusName = Name;
        }
        $scope.setLeaveType = function (ID, Name) {
            $scope.leave.LeaveTypeID = ID;
            $scope.selectedLeaveTypeName = Name;
            $scope.dateChange();
            calculateLeaveBalance();
            //var _leaveType = getLeaveTypeById(ID);
            //if (_leaveType != undefined) {
            //    $scope.leave.LeaveBalance = _leaveType.TotalLeaveDays;
            //}
        }
        $scope.setEmployee = function (ID, Name) {
            $scope.leave.EmployeeID = ID;
            $scope.selectedEmployeeName = Name;
            var _employee = getEmployeeById(ID);
            if (_employee != undefined) {
                if (_employee.ReportingToID == $('#CurrentUserReportingToID').text()) {
                    $scope.isManager = true;
                }
                else {
                    $scope.isManager = false;
                }
            }
            calculateLeaveBalance();
        }
        $scope.setManagerApproval = function (status) {
            if (status.toLowerCase().indexOf('approved') > -1) {
                $scope.leave.LeaveStatusID = 2;
            }
            else {
                $scope.leave.LeaveStatusID = 4;
            }
            $scope.selectedManagerApprovalName = status;
        }
        $scope.setGMApproval = function (status) {
            if (status.toLowerCase().indexOf('approved') > -1) {
                $scope.leave.LeaveStatusID = 3;
            }
            else {
                $scope.leave.LeaveStatusID = 4;
            }
            $scope.selectedGMApprovalName = status;
        }
        $scope.leaveDaysChange = function (leaveType,leaveStatus) {
            if ($scope.leave.TotalLeaveDays != undefined && $scope.leave.TotalLeaveDays !== '') {
                //if ($scope.leave.TotalLeaveDays > $scope.leave.LeaveBalance) {
                //    addNotification('Warning', 'Leave Days cannot be greater than Leave Balance!', 'warning');
                //    $scope.leave.TotalLeaveDays = undefined;
                //}
                //else {
                // if (($scope.leave.RemainingLeaveDays != $scope.leave.PreviousLeaveBalance) || $scope.isCreate == true) {
                if(leaveStatus.toLowerCase() != 'approved'){
                    if (leaveType.LeaveTypeName.toLowerCase().indexOf('compensatory') > -1) {
                        $scope.leave.RemainingLeaveDays = $scope.leave.LeaveBalance + $scope.leave.TotalLeaveDays;
                    }
                    else {
                        $scope.leave.RemainingLeaveDays = $scope.leave.LeaveBalance - $scope.leave.TotalLeaveDays;
                    }
                }
                //}
            }
            else {
                $scope.leave.RemainingLeaveDays = 0;
            }   
        }
        function calculateLeaveBalance() {
            if ($scope.leave.EmployeeID != undefined && $scope.leave.LeaveTypeID != undefined) {
                var _empLeave = 0; var _leaveType = undefined; var _leaveStatus = undefined; var _year = new Date().getFullYear();
                _leaveStatus = getLeaveStatusById($scope.leave.LeaveStatusID);
                for (var i = 0; i < $scope.leaves.length; i++) {
                    if ($scope.leaves[i].EmployeeID == $scope.leave.EmployeeID && $scope.leaves[i].LeaveStatusID == 3 && $scope.leaves[i].LeaveTypeID == $scope.leave.LeaveTypeID && $scope.leaves[i].IsDeleted == false && ((new Date(formatDateYYYYmmDD(ToJavaScriptDate($scope.leaves[i].FromDate)))).getFullYear() == _year || (new Date(formatDateYYYYmmDD(ToJavaScriptDate($scope.leaves[i].ToDate)))).getFullYear() == _year)) {
                        _leaveType = getLeaveTypeById($scope.leave.LeaveTypeID);
                        if (_leaveType.LeaveTypeName.toLowerCase().indexOf('annual') == -1 &&  (new Date(ToJavaScriptDate( $scope.leaves[i].FromDate))).getFullYear() == new Date().getFullYear()) {
                                _empLeave += $scope.leaves[i].TotalLeaveDays;
                        }
                        else {
                            _empLeave += $scope.leaves[i].TotalLeaveDays;
                        }
                    }
                }
                if (_leaveType == undefined) {
                    _leaveType = getLeaveTypeById($scope.leave.LeaveTypeID);
                }
                if (_leaveType.LeaveTypeName.toLowerCase().indexOf('annual') > -1 || _leaveType.LeaveTypeName.toLowerCase().indexOf('compensatory') > -1) {
                    var _employee = getEmployeeById($scope.leave.EmployeeID);
                    if (_employee != undefined) {
                        $scope.leave.LeaveBalance = _employee.LeaveBalanceAsNow;
                    }
                }
                else {
                        $scope.leave.LeaveBalance = _leaveType.TotalLeaveDays - _empLeave;
                }
            }
            $scope.leaveDaysChange(_leaveType,_leaveStatus);
        }

        function clearDropDowns() {
            $scope.selectedEmployeeName = "Select Employee";
            $scope.selectedLeaveStatusName = "Select Leave Status";
            $scope.selectedLeaveTypeName = "Select Leave Type";
            $scope.selectedManagerApprovalName = "Select Manager Approval";
            $scope.selectedGMApprovalName = "Select GM Approval";
        }


      
        // Leave Status

        var tblleaveStatus;
        $scope.leaveStatus = {
            LeaveStatusID: 0,
            LeaveStatusName: '',
            Remarks: ''
        }
        $scope.isCreateLeaveStatus = false;
        $scope.triggerCreateLeaveStatus = function () {
            $scope.isCreateLeaveStatus = true;
            $scope.leaveStatus.LeaveStatusName = '';
            $scope.leaveStatus.Remarks = '';
            $('#mdlLeaveStatus').modal("show");
            angular.forEach($scope.frmLeaveStatus.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        //loadLeaveStatus();
        function loadLeaveStatus() {

            leaveService.getAllLeaveStatus().then(
                   function (response) {
                       if (isLeave) {
                           $scope.leaveStatus = response;
                           loadLeaveTypes();
                       }
                       else {
                           if ($.fn.dataTable.isDataTable('#tblLeaveStatus') ) {
                               $('#tblLeaveStatus').DataTable().destroy();
                           }
                           tblleaveStatus = $('#tblLeaveStatus').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "LeaveStatusID" },
                                    { "data": "LeaveStatusName" },
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
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }

        $scope.createLeaveStatus = function () {
            if (isFormValid($scope.frmLeaveStatus)) {
                $scope.$parent.isNameExist('Leave', $scope.leave.LeaveStatusID, 'status', $scope.leaveStatus.LeaveStatusName).then(function(response){
                    if (response.data) addNotification('Error', 'Leave Status with same name already exists!', 'error');
                    else {
                        leaveService.createLeaveStatus($scope.leaveStatus).then(
                               function (response) {
                                   addNotification('Success', 'New record is added in Leave Status!', 'success');
                                   $('#mdlLeaveStatus').modal("hide");
                                   loadLeaveStatus();
                               },
                               function (data) {
                                if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                   $('#mdlLeaveStatus').modal("hide");
                               });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlLeaveStatus').modal("hide");
                }); 
            }
        };


        $scope.updateLeaveStatus = function () {
            if (isFormValid($scope.frmLeaveStatus)) {
                $scope.$parent.isNameExist('Leave', $scope.leaveStatus.LeaveStatusID, 'status', $scope.leaveStatus.LeaveStatusName).then(function (response) {
                    if (response.data) addNotification('Error', 'Leave Status with same name already exists!', 'error');
                    else {
                        leaveService.updateLeaveStatus($scope.leaveStatus).then(
                               function (response) {
                                   addNotification('Success', 'Record is successfully updated!', 'success');
                                   $('#mdlLeaveStatus').modal("hide");
                                   loadLeaveStatus();
                               },
                               function (data) {
                                if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                   $('#mdlLeaveStatus').modal("hide");
                               });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlLeaveStatus').modal("hide");
                });
            }
        };


        $scope.deleteLeaveStatus = function () {
            leaveService.deleteLeaveStatus($scope.leaveStatus.LeaveStatusID).then(
                function (response) {
                    addNotification('Success', 'Record is successfully updated!', 'success');
                    $('#mdlLeaveStatus').modal("hide");
                    loadLeaveStatus();
                },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlLeaveStatus').modal("hide");
                });
        };

        $('#tblLeaveStatus').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblLeaveStatus').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.leaveStatus.LeaveStatusID = rowData.LeaveStatusID;
                    $scope.leaveStatus.LeaveStatusName = rowData.LeaveStatusName;
                    $scope.leaveStatus.Remarks = rowData.Remarks;
                    $scope.isCreateLeaveStatus = false;
                });
                $('#mdlLeaveStatus').modal("show");
            }
        });
        $('#tblLeaveStatus').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.leaveStatus.LeaveStatusID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlLeaveStatusDelete').modal("show");
        });
        // Leave Type
        var tblLeaveType;
        $scope.leaveType = {
            LeaveTypeID: 0,
            LeaveTypeName: '',
            TotalLeaveDays: undefined,
            Remarks: ''
        }
        $scope.isCreateLeaveType = false;
        $scope.message = "";
      
        $scope.triggerCreateLeaveType = function () {
            $scope.isCreateLeaveType = true;
            $scope.leaveType.LeaveTypeName = '';
            $scope.leaveType.TotalLeaveDays = '';
            $scope.leaveType.Remarks = '';
            $('#mdlLeaveType').modal("show");
            angular.forEach($scope.frmLeaveType.$error.required, function (field) {
                field.$valid = true;
            });
        }
        //loadLeaveTypes();
        function loadLeaveTypes() {

            leaveService.getAllLeaveTypes().then(
                   function (response) {
                       if (isLeave) {
                           $scope.leaveTypes = response;
                           loadLeaves();
                       }
                       else {
                               if ($.fn.dataTable.isDataTable('#tblLeaveType')) {
                                   $('#tblLeaveType').DataTable().destroy();
                               }
                               tblLeaveType = $('#tblLeaveType').DataTable({
                                   data: response,
                                   "order": [[1, "asc"]],
                                   "columns": [
                                        { "data": "LeaveTypeID" },
                                        { "data": "LeaveTypeName" },
                                        { "data": "TotalLeaveDays" },
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
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }

        $('#tblLeaveType').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblLeaveType').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.leaveType.LeaveTypeID = rowData.LeaveTypeID;
                    $scope.leaveType.LeaveTypeName = rowData.LeaveTypeName;
                    $scope.leaveType.TotalLeaveDays = rowData.TotalLeaveDays;
                    $scope.leaveType.Remarks = rowData.Remarks;
                    $scope.isCreateLeaveType = false;
                });
                $('#mdlLeaveType').modal("show");
            }
        });
        $('#tblLeaveType').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.leaveType.LeaveTypeID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlLeaveTypeDelete').modal("show");
        });
        $scope.createLeaveType = function () {
            if (isFormValid($scope.frmLeaveType)) {
                $scope.$parent.isNameExist('Leave', 0, 'type', $scope.leaveType.LeaveTypeName).then(function(response){
                    if(response.data) addNotification('Error', 'Leave Type with same name already exists!', 'error');
                    else{
                    leaveService.createLeaveType($scope.leaveType).then(
                        function (response) {
                            addNotification('Success', 'New record is added in Leave Type!', 'success');
                            $('#mdlLeaveType').modal("hide");
                            loadLeaveTypes();
            

                        },
                        function (data) {
                         if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                            $('#mdlLeaveType').modal("hide");
                        });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlLeaveType').modal("hide");
                }); 
            }
        };

        $scope.updateLeaveType = function () {
            if (isFormValid($scope.frmLeaveType)) {
                $scope.$parent.isNameExist('Leave', $scope.leaveType.LeaveTypeID, 'type', $scope.leaveType.LeaveTypeName).then(function (response) {
                    if (response.data) addNotification('Error', 'Leave Type with same name already exists!', 'error');
                    else {
                        leaveService.updateLeaveType($scope.leaveType).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlLeaveType').modal("hide");
                                loadLeaveTypes();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlLeaveType').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlLeaveType').modal("hide");
                });
            }
        };

        $scope.deleteLeaveType = function () {
            leaveService.deleteLeaveType($scope.leaveType.LeaveTypeID).then(
                function (response) {
                    loadLeaveTypes();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };

        function isDropDownsValid(frm, model) {
            var _result = true;
            if (model.EmployeeID == undefined) {
                frm.txtEmployeeID.$dirty = true;
                _result = false;
            }
            if (model.LeaveTypeID == undefined) {
                frm.txtLeaveTypeID.$dirty = true;
                _result = false;
            }
            //if (model.LeaveStatusID == undefined) {
            //    frm.txtLeaveStatusID.$dirty = true;
            //    _result = false;
            //}
            //if (model.LeaveDocumentPath == undefined) {
            //    angular.element('#txtLeaveDocumentPath').addClass('border-red');
            //    angular.element('#txtLeaveDocumentPath').next('span').removeClass('hide');
            //    _result = false;
            //}
            //if ($scope.leave != undefined) {
            //    if (($scope.isManagerApproved && $scope.isGM) && $scope.leave.LeaveStatusID < 3) {
            //        $('#btnGMApproval').addClass('border-red');
            //        $('.spnGMApproval').removeClass('hidden').show();
            //        _result = false;
            //    }
            //    if ($scope.isManager && $scope.leave.LeaveStatusID < 2) {
            //        $('#btnManagerApproval').addClass('border-red');
            //        $('.spnManagerApproval').removeClass('hidden').show();
            //        _result = false;
            //    }
               
            //}
            if (!isFormValid(frm)) {
                _result = false;
            }
            return _result;
        }
    }
})();