/// <reference path="salaryController.js" />
(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('salaryController', salaryController);

    salaryController.$inject = ['$scope', '$location', 'salaryService', 'employeeService', 'companyService'];

    function salaryController($scope, $location, salaryService, employeeService, companyService) {

        // On Load
        if (window.location.href.toLowerCase().indexOf('publicholiday') != -1) {
            loadCompanies();
        }
        else if (window.location.href.toLowerCase().indexOf('payslip') == -1) {
            loadEmployees();
        }
        else if (window.location.href.toLowerCase().indexOf('payslip') > -1) {
            loadCompanies();
            $scope.months = loadMonthYears(2);
        }
        else {
            $scope.months = loadMonthYears(2);
        }
        function isValidDate(str) {
            return !isNaN(Date.parse(str));
        }

        // Salary

        var isUpdateDataTable = false;
        var tblSalary;
        $scope.salary = {
            SalaryID: 0,
            EmployeeID: 0,
            Basic: 0,
            Telephone: 0,
            Housing: 0,
            Transport: 0,
            TotalSalary: 0,
            OtherText: '',
            OtherNumber: 0,
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";
        clearDropDowns();
       
        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.salary.EmployeeID = undefined;
            $scope.salary.Basic = undefined;
            $scope.salary.Telephone = undefined;
            $scope.salary.Housing = undefined;
            $scope.salary.Transport = undefined;
            $scope.salary.TotalSalary = undefined;
            $scope.salary.OtherText = '';
            $scope.salary.OtherNumber = undefined;
            $scope.salary.Remarks = '';
            clearDropDowns();
            $('#mdlSalary').modal("show");
            angular.forEach($scope.frmSalary.$error.required, function (field) {
                field.$dirty = false;
            });
        }
       
        function loadSalaries() {

            salaryService.getAllSalary().then(
                   function (response) {
                       if (window.location.href.toLowerCase().indexOf('salary') > -1) {
                               if ($.fn.dataTable.isDataTable('#tblSalary')) {
                                   $('#tblSalary').DataTable().destroy();
                               }
                               var _empToDeleteIDs = new Array();
                               tblSalary = $('#tblSalary').DataTable({
                                   data: response,
                                   "order": [[1, "asc"]],
                                   "columns": [
                                        { "data": "SalaryID" },
                                        { "data": "EmployeeID" },
                                        { "data": "Basic" },
                                        { "data": "Telephone" },
                                        { "data": "Housing" },
                                        { "data": "Transport" },
                                        { "data": "TotalSalary" },
                                        { "data": "OtherText" },
                                        { "data": "OtherNumber" },
                                        { "data": "GratuitySalary" },
                                        { "data": "Remarks" }
                                   ],
                                   "columnDefs": [
                                         {
                                             "render": function (data, type, row) {
                                                 return '<i class="glyphicon glyphicon-edit edit"></i></i>';
                                             },
                                             "targets": 0
                                         },
                                        { className: "hide_column", "targets": [10] },
                                        {
                                            "render": function (data, type, row) {
                                                _empToDeleteIDs.push(data);
                                                return getEmployeeById(data);
                                            },
                                            "targets": 1
                                        }
                                   ],
                                   "rowCallback": function (row, data) {
                                   }
                               });
                               filterEmployees(_empToDeleteIDs);
                       }
                       else {
                           $scope.salaries = response;
                       }
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblSalary').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblSalary').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.salary.SalaryID = rowData.SalaryID;
                    $scope.salary.EmployeeID = rowData.EmployeeID;
                    $scope.salary.Basic = rowData.Basic;
                    $scope.salary.Telephone = rowData.Telephone;
                    $scope.salary.Housing = rowData.Housing;
                    $scope.salary.Transport = rowData.Transport;
                    $scope.salary.TotalSalary = rowData.TotalSalary;
                    $scope.salary.OtherText = rowData.OtherText;
                    $scope.salary.GratuitySalary = rowData.GratuitySalary;
                    $scope.salary.OtherNumber = parseFloat( rowData.OtherNumber);
                    $scope.salary.Remarks = rowData.Remarks;
                    $scope.selectedEmployeeName = getEmployeeById(rowData.EmployeeID);
                    $scope.isCreate = false;
                });
                $('#mdlSalary').modal("show");
            }
        });
        $('#tblSalary').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.salary.SalaryID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlSalaryDelete').modal("show");
        });
        $scope.createSalary = function () {
            if (isDropDownsValid($scope.frmSalary, $scope.salary)) {
               
                salaryService.createSalary($scope.salary).then(
                    function (response) {
                        addNotification('Success', 'New record is added in Salary!', 'success');
                        $('#mdlSalary').modal("hide");
                        loadSalaries();
                    },
                     function (data) {
                      if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                         $('#mdlSalary').modal("hide");
                 });
            }
        };

        $scope.updateSalary = function () {
            if (isDropDownsValid($scope.frmSalary, $scope.salary)) {
            salaryService.updateSalary($scope.salary).then(
                 function (response) {
                     addNotification('Success', 'New record is added in Salary!', 'success');
                     $('#mdlSalary').modal("hide");
                     loadSalaries();
                 },
                    function (data) {
                     if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlSalary').modal("hide");
             });
            }
        };

        $scope.deleteSalary = function () {
            salaryService.deleteSalary($scope.salary.SalaryID).then(
                function (response) {
                    isUpdateDataTable = true;
                    loadSalaries();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };

        $scope.salaryChange = function () {
            $scope.salary.TotalSalary = calculateSalarySum($scope.salary.Basic, $scope.salary.Transport, $scope.salary.Housing, $scope.salary.Telephone,$scope.salary.OtherNumber);
        }
        function filterEmployees(IDs) {
            var _filteredEmployees = new Array();
            for (var i = 0; i < $scope.employees.length; i++) {
                if (IDs.indexOf($scope.employees[i].EmployeeID) == -1) {
                    _filteredEmployees.push($scope.employees[i]);
                }
            }
            $scope.employees = _filteredEmployees;
        }

        // Increment

        var isUpdateIncrementDataTable = false;
        var tblIncrement;
        $scope.increment = {
            IncrementID: 0,
            EmployeeID: 0,
            IncrementDate : '',
            Basic: 0,
            Telephone: 0,
            Housing: 0,
            Transport: 0,
            TotalSalary: 0,
            OtherText: '',
            OtherNumber: 0,
            Remarks: ''
        }
        $scope.isCreateIncrement = false;
        $scope.triggerCreateIncrement = function () {
            $scope.isCreateIncrement = true;
            $scope.isAddition = false;
            $scope.increment.EmployeeID = undefined;
            $scope.increment.IncrementDate = undefined,
            $scope.increment.Basic = undefined;
            $scope.increment.Telephone = undefined;
            $scope.increment.Housing = undefined;
            $scope.increment.Transport = undefined;
            $scope.increment.TotalSalary = undefined;
            $scope.increment.OtherText = '';
            $scope.increment.OtherNumber = undefined;
            $scope.increment.Remarks = '';
            $('#mdlIncrement').modal("show");
            angular.forEach($scope.frmIncrement.$error.required, function (field) {
                field.$dirty = false;
            });
            $scope.frmIncrement.txtIncrementDate.$dirty = false;
        }

        function loadIncrements() {

            salaryService.getAllIncrement().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblIncrement')) {
                               $('#tblIncrement').DataTable().destroy();
                           }
                           //var _empToDeleteIDs = new Array();
                           tblIncrement = $('#tblIncrement').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "IncrementID" },
                                    { "data": "EmployeeID" },
                                    { "data": "IncrementDate" },
                                    { "data": "Basic" },
                                    { "data": "Telephone" },
                                    { "data": "Housing" },
                                    { "data": "Transport" },
                                    { "data": "TotalSalary" },
                                    { "data": "OtherText" },
                                    { "data": "OtherNumber" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                   {
                                       "render": function (data, type, row) {
                                           return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                       },
                                       "targets": 0
                                   },
                                   { className: "hide_column", "targets": [9] },
                                   {
                                       "render": function (data, type, row) {
                                          // _empToDeleteIDs.push(data);
                                           return getEmployeeById(data);
                                       },
                                       "targets": 1
                                   },
                                   {
                                       "render": function (data, type, row) {
                                           return ToJavaScriptDate(data);
                                       },
                                       "targets": 2
                                   }
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                           loadSalaries();
                          // filterEmployees(_empToDeleteIDs);
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblIncrement').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblIncrement').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.increment.IncrementID = rowData.IncrementID;
                    $scope.increment.EmployeeID = rowData.EmployeeID;
                    $scope.increment.IncrementDate = ToJavaScriptDate(rowData.IncrementDate);
                    $scope.increment.Basic = rowData.Basic;
                    $scope.increment.Telephone = rowData.Telephone;
                    $scope.increment.Housing = rowData.Housing;
                    $scope.increment.Transport = rowData.Transport;
                    $scope.increment.TotalSalary = rowData.TotalSalary;
                    $scope.increment.OtherText = rowData.OtherText;
                    $scope.increment.OtherNumber = parseFloat(rowData.OtherNumber);
                    $scope.increment.Remarks = rowData.Remarks;
                    $scope.selectedEmployeeName = getEmployeeById(rowData.EmployeeID);
                    $scope.isCreateIncrement = false;
                });
                $('#mdlIncrement').modal("show");
            }
        });
        $('#tblIncrement').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.increment.IncrementID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlIncrementDelete').modal("show");
        });
        $scope.createIncrement = function () {
            if (isDropDownsValid($scope.frmIncrement,$scope.increment)) {
                $scope.increment.IncrementDate = formatDateYYYYmmDD($scope.increment.IncrementDate);
                salaryService.createIncrement($scope.increment).then(
                     function (response) {
                         addNotification('Success', 'New record is added in Increment!', 'success');
                         $('#mdlIncrement').modal("hide");
                         loadIncrements();
                     },
                     function (data) {
                      if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                         $('#mdlIncrement').modal("hide");
                 });
            }
        };

        $scope.updateIncrement = function () {
            if (isDropDownsValid($scope.frmIncrement, $scope.increment)) {
                $scope.increment.IncrementDate = formatDateYYYYmmDD($scope.increment.IncrementDate);
                salaryService.updateIncrement($scope.increment).then(
                    function (response) {
                        addNotification('Success', 'New record is added in Increment!', 'success');
                        $('#mdlIncrement').modal("hide");
                        loadIncrements();
                    },
                     function (data) {
                      if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                         $('#mdlIncrement').modal("hide");
                 });
            }
        };

        $scope.deleteIncrement = function () {
            salaryService.deleteIncrement($scope.increment.IncrementID).then(
                function (response) {
                    loadIncrements();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };

        $scope.incrementChange = function () {
            $scope.increment.TotalSalary = calculateSalarySum($scope.increment.Basic, $scope.increment.Transport, $scope.increment.Housing, $scope.increment.Telephone, $scope.increment.OtherNumber);
        }

        // Deduction

        var tblDeduction;
        $scope.deduction = {
            DeductionID: 0,
            EmployeeID: 0,
            DeductionTypeID: 0,
            StartDate: new Date().format('d/m/Y'),
            EndDate: new Date().format('d/m/Y'),
            TotalMonth : 0,
            Basic: 0,
            Telephone: 0,
            Housing: 0,
            Transport: 0,
            TotalAmount: 0,
            OtherText: '',
            OtherNumber: 0,
            IsAddition:false,
            Remarks: ''
        }
        $scope.isCreateDeduction = false;
        
        $scope.triggerCreateDeduction = function () {
            $scope.isCreateDeduction = true;
            $scope.deduction.EmployeeID = undefined;
            $scope.deduction.DeductionTypeID = undefined;
            $scope.deduction.StartDate = new Date().format('d/m/Y');
            $scope.deduction.EndDate = new Date().format('d/m/Y');
            $scope.deduction.Basic = undefined;
            $scope.deduction.Telephone = undefined;
            $scope.deduction.Housing = undefined;
            $scope.deduction.Transport = undefined;
            $scope.deduction.TotalAmount = undefined;
            $scope.deduction.TotalMonth = undefined;
            $scope.deduction.OtherText = '';
            $scope.deduction.OtherNumber = undefined;
            $scope.setAction('Deduction');
            $scope.deduction.Remarks = '';
            $scope.selectedDeductionTypeName = 'Select Deduction Type';
            $scope.selectedEmployeeName = 'Select Employee';
            $scope.selectedDeductionOnName = 'Select Deduction On';
            $('#mdlDeduction').modal("show");
            angular.forEach($scope.frmDeduction.$error.required, function (field) {
                field.$dirty = false;
            });
            $scope.dateChange();
            $('#txtDeductionOn').attr('disabled', 'disabled');
            $scope.isDeductionDetail = false;
        }
        $scope.calculateDeduction = function () {
            calculateDeduction();
        }
        function calculateDeduction() {
            //if ($scope.deduction.TotalAmount != ($scope.deduction.Basic + $scope.deduction.Telephone + $scope.deduction.Transport + $scope.deduction.Housing)) {
            //    $scope.error += 'Total Deduction is not equal to the sum of all Deduction';
            //}

            if ($scope.deduction.TotalAmount > 0) {
                $scope.calculatedDeductions = new Array();
                var date = new Date($scope.deduction.StartDate.split('/').reverse().join('/'));
                var _startMonth = date.getMonth() + 1;
                var _startYear = date.getFullYear();
                for (var i = 0; i < $scope.deduction.TotalMonth; i++) {
                    $scope.calculatedDeductions.push({ DeductionDate: '1/' + (_startMonth + i) + '/' + _startYear, TotalDeduction: parseFloat(($scope.deduction.TotalAmount / $scope.deduction.TotalMonth).toFixed(3)) });
                }
                $scope.isDeductionDetail = true;
                //$scope.$apply();
            }
            else {
                $scope.isDeductionDetail = false;
            }
            
        }
        //$scope.individualDeductionChange = function (element) {
        //    if($scope.deduction.TotalAmount > 0){
        //        var _value = angular.element('#' + element).val();
        //        if (_value > $scope.deduction.TotalAmount) {
        //            angular.element('#' + element).val(_value.substr(0,_value.length - 1))
        //        }
        //        else {
        //            angular.forEach(angular.element('.individual-deduction'), function (elm) {
        //                if (angular.element(elm).attr('id') != element) {
        //                    angular.element(elm).val(parseFloat(($scope.deduction.TotalAmount - _value) / 3).toFixed(3));
        //                }
        //            });
        //        }
                 
        //    }
        //}
        $scope.totalDeductionChange = function () {
            if ($scope.deduction.EmployeeID > 0 && $scope.deduction.EmployeeID != '') {
                var _salary = getSalaryByEmployeeId($scope.deduction.EmployeeID);
                if (_salary != undefined) {
                    var _basicRatio = _salary.Basic / _salary.TotalSalary;
                    var _telephoneRatio = _salary.Telephone / _salary.TotalSalary;
                    var _transportRatio = _salary.Transport / _salary.TotalSalary;
                    var _housingRatio = _salary.Housing / _salary.TotalSalary;
                    if (_salary.OtherNumber > 0) {
                        var _otherRatio = _salary.OtherNumber / _salary.TotalSalary;
                        $scope.deduction.OtherNumber = Math.round(($scope.deduction.TotalAmount * _otherRatio) * 100) / 100;
                    }
                    else {
                        $scope.deduction.OtherNumber = 0;
                    }
                    
                    $scope.deduction.Basic = Math.round(($scope.deduction.TotalAmount * _basicRatio) * 100) / 100;
                    $scope.deduction.Telephone =  Math.round(($scope.deduction.TotalAmount * _telephoneRatio) * 100) / 100;
                    $scope.deduction.Transport = Math.round(( $scope.deduction.TotalAmount * _transportRatio) * 100) / 100;
                    $scope.deduction.Housing = Math.round(($scope.deduction.TotalAmount * _housingRatio) * 100) / 100;
                }
            }
            
        }
        $scope.dateChange = function () {
            if (isValidDate($scope.deduction.StartDate) && isValidDate($scope.deduction.EndDate)) {
                var _startMonth = parseInt( $scope.deduction.StartDate.split('/')[1]);
                var _startYear = parseInt($scope.deduction.StartDate.split('/')[2]);
                $scope.deduction.StartDate = '01/' + _startMonth + '/' + _startYear;
                var _endMonth =parseInt( $scope.deduction.EndDate.split('/')[1]);
                var _endYear = parseInt($scope.deduction.EndDate.split('/')[2]);
                $scope.deduction.EndDate = '01/' + _endMonth + '/' + _endYear;
                var startDate = new Date($scope.deduction.StartDate.split('/').reverse().join('/'));
                var endDate = new Date($scope.deduction.EndDate.split('/').reverse().join('/'));
                if (startDate >  endDate) {
                   addNotification('Error','The start date cannot be greater than end date!','error');
                }
                else {
                    var months;
                    months = (_endYear - _startYear) * 12;
                    months -= _startMonth;
                    months += _endMonth;
                    $scope.deduction.TotalMonth = (months <= 0 ? 0 : months) + 1 ;

                    //$scope.deduction.TotalMonth = (endDate.getMonth()) - (startDate.getMonth()) + 1;
                    $scope.checkBasicLimit();
                    $scope.checkTransportLimit();
                    $scope.checkTelephoneLimit();
                    $scope.checkHousingLimit();
                    $scope.checkOtherLimit();
               }
            }
        }
        $scope.deductionChange = function () {
            $scope.deduction.TotalAmount = calculateSalarySum($scope.deduction.Basic, $scope.deduction.Transport, $scope.deduction.Housing, $scope.deduction.Telephone, $scope.deduction.OtherNumber);
        }
        function loadDeductions() {
            salaryService.getAllDeduction().then(
                   function (response) {
                       $scope.deductions = response;
                           if ($.fn.dataTable.isDataTable('#tblDeduction')) {
                               $('#tblDeduction').DataTable().destroy();
                           }
                           //var _empToDeleteIDs = new Array();
                           tblDeduction = $('#tblDeduction').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "DeductionID" },
                                    { "data": "EmployeeID" },
                                    { "data": "DeductionTypeID" },
                                    { "data": "StartDate" },
                                    { "data": "EndDate" },
                                    { "data": "IsAddition" },
                                    { "data": "Basic" },
                                    { "data": "Telephone" },
                                    { "data": "Housing" },
                                    { "data": "Transport" },
                                    { "data": "TotalAmount" },
                                    { "data": "TotalMonth" },
                                    { "data": "OtherText" },
                                    { "data": "OtherNumber" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                   {
                                       "render": function (data, type, row) {
                                           return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                       },
                                       "targets": 0
                                   },
                                   { className: "hide_column", "targets": [13] },
                                   {
                                       "render": function (data, type, row) {
                                           //_empToDeleteIDs.push(data);
                                           return getEmployeeById(data);
                                       },
                                       "targets": 1
                                   },
                                    {
                                        "render": function (data, type, row) {
                                            return getDeductionTypeById(data);
                                        },
                                        "targets": 2
                                    },
                                   {
                                       "render": function (data, type, row) {
                                           return ToJavaScriptDate(data);
                                       },
                                       "targets": 3
                                   },
                                   {
                                       "render": function (data, type, row) {
                                           return ToJavaScriptDate(data);
                                       },
                                       "targets": 4
                                   },
                                    {
                                        "render": function (data, type, row) {
                                            if (data == true) return 'Addition';
                                            else return 'Deduction';
                                        },
                                        "targets": 5
                                    }
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                           //filterEmployees(_empToDeleteIDs);
                          // loadOtherTexts();
                           loadSalaries();
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
          

        }

        $scope.amountChange = function (index,amount) {
            if ((index + 1) != $scope.calculatedDeductions.length) {
                var _amount = 0;
                for (var i = 0; i <= index; i++) {
                    _amount += $scope.calculatedDeductions[i].TotalDeduction;
                }
                var _remainingAmount = $scope.deduction.TotalAmount - _amount;
                var _remainingIndex = $scope.calculatedDeductions.length - (index + 1);
                    for (var i = (index + 1) ; i < $scope.calculatedDeductions.length; i++) {
                        $scope.calculatedDeductions[i].TotalDeduction = _remainingAmount / _remainingIndex;
                    }
            }
        };

        $('#tblDeduction').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblDeduction').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.deduction.DeductionID = rowData.DeductionID;
                    $scope.deduction.EmployeeID = rowData.EmployeeID;
                    $scope.deduction.DeductionTypeID = rowData.DeductionTypeID;
                    $scope.deduction.StartDate = ToJavaScriptDate(rowData.StartDate);
                    $scope.deduction.EndDate = ToJavaScriptDate(rowData.EndDate);
                    $scope.deduction.Basic = rowData.Basic;
                    $scope.deduction.Telephone = rowData.Telephone;
                    $scope.deduction.Housing = rowData.Housing;
                    $scope.deduction.Transport = rowData.Transport;
                    $scope.deduction.TotalMonth = rowData.TotalMonth;
                    $scope.deduction.TotalAmount = rowData.TotalAmount;
                    $scope.deduction.OtherText = rowData.OtherText;
                    $scope.deduction.OtherNumber =  parseFloat( rowData.OtherNumber);
                    $scope.deduction.Remarks = rowData.Remarks;
                    $scope.selectedEmployeeName = getEmployeeById(rowData.EmployeeID);
                    $scope.selectedDeductionTypeName = getDeductionTypeById(rowData.DeductionTypeID);
                    if ($scope.deduction.Basic > 0) {
                        $scope.setDeductionOn('Basic');
                        $scope.selectedDeductionOnName = 'Basic';
                    }
                    else if ($scope.deduction.Telephone > 0) {
                        $scope.selectedDeductionOnName = 'Telephone';
                        $scope.setDeductionOn('Telephone');
                    }
                    else if ($scope.deduction.Housing > 0) {
                        $scope.selectedDeductionOnName = 'Housing';
                        $scope.setDeductionOn('Housing');
                    }
                    else if ($scope.deduction.Transport > 0) {
                        $scope.selectedDeductionOnName = 'Transport';
                        $scope.setDeductionOn('Transport');
                    }
                    else if ($scope.deduction.OtherNumber > 0) {
                        $scope.selectedDeductionOnName = 'OtherNumber';
                        $scope.setDeductionOn('OtherNumber');
                    }
                    var _salary = getSalaryByEmployeeId(rowData.EmployeeID);
                    if (_salary != undefined) {
                        $scope.deduction.salary = _salary;
                    }
                    $('#txtDeductionOn').removeAttr('disabled');
                    $scope.isCreateDeduction = false;
                    var _operation = rowData.IsAddition == true ? 'Addition' : 'Deduction';
                    $scope.setAction(_operation);
                    var _deduction = getDeductionById(rowData.DeductionID);
                    $scope.calculatedDeductions = new Array();
                    for (var i = 0; i < _deduction.DeductionDetails.length; i++) {
                        $scope.calculatedDeductions.push({ DeductionDate: formatDateYYYYmmDD( ToJavaScriptDate(_deduction.DeductionDetails[i].DeductionDate)), TotalDeduction: _deduction.DeductionDetails[i].TotalDeduction });
                    }
                    // calculateDeduction();
                    $scope.isDeductionDetail = true;
                });
                $('#mdlDeduction').modal("show");
            }
        });
        $('#tblDeduction').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.deduction.DeductionID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDeductionDelete').modal("show");
        });

        function calculateDeductionDetails(){
            var _totalDeduction = 0;
            //var _basic = Math.round($scope.deduction.Basic / $scope.calculatedDeductions.length * 100) / 100;
            //var _telephone = Math.round($scope.deduction.Telephone / $scope.calculatedDeductions.length * 100) / 100;
            //var _transport = Math.round($scope.deduction.Transport / $scope.calculatedDeductions.length * 100) / 100;
            //var _housing = Math.round($scope.deduction.Housing / $scope.calculatedDeductions.length * 100) / 100;
            //var _other = Math.round($scope.deduction.OtherNumber / $scope.calculatedDeductions.length * 100) / 100;
            for (var i = 0; i < $scope.calculatedDeductions.length; i++) {
                if ($scope.deduction.EmployeeID > 0 && $scope.deduction.EmployeeID != '') {
                    var _salary = getSalaryByEmployeeId($scope.deduction.EmployeeID);
                    if (_salary != undefined) {
                        //var _basicRatio = _salary.Basic / _salary.TotalSalary;
                        //var _telephoneRatio = _salary.Telephone / _salary.TotalSalary;
                        //var _transportRatio = _salary.Transport / _salary.TotalSalary;
                        //var _housingRatio = _salary.Housing / _salary.TotalSalary;
                        //if (_salary.OtherNumber > 0) {
                        //    //var _otherRatio = _salary.OtherNumber / _salary.TotalSalary;
                        //    $scope.calculatedDeductions[i].OtherNumber = _other;
                        //}
                        //else {
                        //    $scope.calculatedDeductions[i].OtherNumber = 0;
                        //}
                        //$scope.calculatedDeductions[i].Basic = Math.round( ($scope.calculatedDeductions[i].TotalDeduction * _basicRatio)* 100) / 100;
                        //$scope.calculatedDeductions[i].Telephone = Math.round(($scope.calculatedDeductions[i].TotalDeduction * _telephoneRatio)* 100) / 100;
                        //$scope.calculatedDeductions[i].Transport = Math.round(( $scope.calculatedDeductions[i].TotalDeduction * _transportRatio)* 100) / 100;
                        //$scope.calculatedDeductions[i].Housing = Math.round(($scope.calculatedDeductions[i].TotalDeduction * _housingRatio) * 100) / 100;
                        //$scope.calculatedDeductions[i].Basic = _basic;
                        //$scope.calculatedDeductions[i].Telephone = _telephone;
                        //$scope.calculatedDeductions[i].Transport = _transport;
                        //$scope.calculatedDeductions[i].Housing = _housing;

                        if ($scope.deduction.Basic > 0) {
                            $scope.calculatedDeductions[i].Basic = $scope.calculatedDeductions[i].TotalDeduction;
                            $scope.calculatedDeductions[i].Telephone = 0;
                            $scope.calculatedDeductions[i].Transport = 0;
                            $scope.calculatedDeductions[i].Housing = 0;
                            $scope.calculatedDeductions[i].OtherNumber = 0;
                        }
                        else if ($scope.deduction.Transport > 0) {
                            $scope.calculatedDeductions[i].Basic = 0;
                            $scope.calculatedDeductions[i].Telephone = 0;
                            $scope.calculatedDeductions[i].Transport = $scope.calculatedDeductions[i].TotalDeduction;
                            $scope.calculatedDeductions[i].Housing = 0;
                            $scope.calculatedDeductions[i].OtherNumber = 0;
                        }
                        else if ($scope.deduction.Telephone > 0) {
                            $scope.calculatedDeductions[i].Basic = 0;
                            $scope.calculatedDeductions[i].Telephone = $scope.calculatedDeductions[i].TotalDeduction;
                            $scope.calculatedDeductions[i].Transport = 0;
                            $scope.calculatedDeductions[i].Housing = 0;
                            $scope.calculatedDeductions[i].OtherNumber = 0;
                        }
                        else if ($scope.deduction.Housing > 0) {
                            $scope.calculatedDeductions[i].Basic = 0;
                            $scope.calculatedDeductions[i].Telephone = 0;
                            $scope.calculatedDeductions[i].Transport = 0;
                            $scope.calculatedDeductions[i].Housing = $scope.calculatedDeductions[i].TotalDeduction;
                            $scope.calculatedDeductions[i].OtherNumber = 0;
                        }
                        else if ($scope.deduction.OtherNumber > 0) {
                            $scope.calculatedDeductions[i].Basic = 0;
                            $scope.calculatedDeductions[i].Telephone = 0;
                            $scope.calculatedDeductions[i].Transport = 0;
                            $scope.calculatedDeductions[i].Housing = 0;
                            $scope.calculatedDeductions[i].OtherNumber = $scope.calculatedDeductions[i].TotalDeduction;
                        }
                    }
                }
                if ($scope.calculatedDeductions[i].TotalDeduction != '') {
                    _totalDeduction += parseFloat($scope.calculatedDeductions[i].TotalDeduction);
                }
            }
            //if ($scope.TotalDeduction != _totalDeduction) {
            //    addNotification('Error', 'Total Deduction is not equal to the sum of all Deduction!', 'error'); ;
            //}
        }
        $scope.createDeduction = function () {
            if (isDropDownsValid($scope.frmDeduction, $scope.deduction)) {
                if ($scope.isDeductionDetail == false) {
                    calculateDeduction();
                }
                calculateDeductionDetails();
                $scope.deduction.StartDate = formatDateYYYYmmDD($scope.deduction.StartDate);
                $scope.deduction.EndDate = formatDateYYYYmmDD($scope.deduction.EndDate);
                var deductionComplex =  { Deduction: $scope.deduction, DeductionDetails: $scope.calculatedDeductions };
                salaryService.createDeduction(deductionComplex).then(
                   function (response) {
                       addNotification('Success', 'New record is added in Deduction!', 'success');
                       $('#mdlDeduction').modal("hide");
                       loadDeductions();
                   },
                     function (data) {
                      if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                         $('#mdlDeduction').modal("hide");
                 });
            }
        };

        $scope.updateDeduction = function () {
            if (isDropDownsValid($scope.frmDeduction, $scope.deduction)) {
                if ($scope.isDeductionDetail == false) {
                    calculateDeduction();
                }
                calculateDeductionDetails();
                $scope.deduction.StartDate = formatDateYYYYmmDD($scope.deduction.StartDate);
                $scope.deduction.EndDate = formatDateYYYYmmDD($scope.deduction.EndDate);
                var deductionComplex = { Deduction: $scope.deduction, DeductionDetails: $scope.calculatedDeductions };
                salaryService.updateDeduction(deductionComplex).then(
                    function (response) {
                        addNotification('Success', 'Record is successfully updated!', 'success');
                        $('#mdlDeduction').modal("hide");
                        loadDeductions();
                    },
                     function (data) {
                      if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                         $('#mdlDeduction').modal("hide");
                 });
            }
        };

        $scope.deleteDeduction = function () {
            salaryService.deleteDeduction($scope.deduction.DeductionID).then(
                 function (response) {
                     addNotification('Success', 'Record is successfully deleted!', 'success');
                     $('#mdlDeductionDelete').modal("hide");
                     loadDeductions();
                 },
                     function (data) {
                         if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                         $('#mdlDeductionDelete').modal("hide");
                     });
        };

        $scope.checkBasicLimit = function () {
            if ($scope.deduction.Basic != 0 && $scope.deduction.Basic != undefined) {
                var _basic = $scope.deduction.Basic / $scope.deduction.TotalMonth;
                if (_basic > $scope.deduction.salary.Basic) {
                    $scope.deduction.Basic = $scope.deduction.salary.Basic * $scope.deduction.TotalMonth;
                    $scope.deduction.TotalAmount = $scope.deduction.Basic;
                    addNotification('Deduction Limit Exceeded', 'The Maximum deduction limit is ' + $scope.deduction.Basic, 'warning');
                }
            }
        }
        $scope.checkTelephoneLimit = function () {
            if ($scope.deduction.Telephone != 0 && $scope.deduction.Telephone != undefined) {
                var _basic = $scope.deduction.Telephone / $scope.deduction.TotalMonth;
                if (_basic > $scope.deduction.salary.Telephone) {
                    $scope.deduction.Telephone = $scope.deduction.salary.Telephone * $scope.deduction.TotalMonth;
                    $scope.deduction.TotalAmount = $scope.deduction.Telephone;
                    addNotification('Deduction Limit Exceeded', 'The Maximum deduction limit is ' + $scope.deduction.Telephone, 'warning');
                }
            }
        }
        $scope.checkHousingLimit = function () {
            if ($scope.deduction.Housing != 0 && $scope.deduction.Housing != undefined) {
                var _basic = $scope.deduction.Housing / $scope.deduction.TotalMonth;
                if (_basic > $scope.deduction.salary.Housing) {
                    $scope.deduction.Housing = $scope.deduction.salary.Housing * $scope.deduction.TotalMonth;
                    $scope.deduction.TotalAmount = $scope.deduction.Housing;
                    addNotification('Deduction Limit Exceeded', 'The Maximum deduction limit is ' + $scope.deduction.Housing, 'warning');
                }
            }
        }
        $scope.checkOtherLimit = function () {
            if ($scope.isAddition == false) {
                if ($scope.deduction.OtherNumber != 0 && $scope.deduction.OtherNumber != undefined) {
                    var _basic = $scope.deduction.OtherNumber / $scope.deduction.TotalMonth;
                    if (_basic > $scope.deduction.salary.OtherNumber) {
                        $scope.deduction.OtherNumber = $scope.deduction.salary.OtherNumber * $scope.deduction.TotalMonth;
                        $scope.deduction.TotalAmount = $scope.deduction.OtherNumber;
                        addNotification('Deduction Limit Exceeded', 'The Maximum deduction limit is ' + $scope.deduction.OtherNumber, 'warning');
                    }
                }
            }
        }
        $scope.checkTransportLimit = function () {
            if ($scope.deduction.Transport != 0 && $scope.deduction.Transport != undefined) {
                var _basic = $scope.deduction.Transport / $scope.deduction.TotalMonth;
                if (_basic > $scope.deduction.salary.Transport) {
                    $scope.deduction.Transport = $scope.deduction.salary.Transport * $scope.deduction.TotalMonth;
                    $scope.deduction.TotalAmount = $scope.deduction.Transport;
                    addNotification('Deduction Limit Exceeded', 'The Maximum deduction limit is ' + $scope.deduction.Transport, 'warning');
                }
            }
        }

        $scope.deductionOn = ['Basic', 'Telephone', 'Housing', 'Transport', 'Other (Allowance Type)'];

        $scope.setAction = function (value) {
            $('#lbl' + value).removeClass('btn-default').addClass('btn-primary');
            $('#lbl' + value).siblings().removeClass('btn-primary').addClass('btn-default');
            if (value == 'Addition') {
                $scope.setDeductionType($('#hdnHRDeductionTypeID').val(), 'HR Advance');
                //$('#txtDeductionTypeID').next('ul').find('li:eq(1) a').click();
                $scope.setDeductionOn('Other (Allowance Type)');
                //$('#txtDeductionOn').next('ul').find('li:eq(3) a').click();
                $scope.deduction.IsAddition = true;
            }
            else {
                $scope.deduction.IsAddition = false;
            }
        }

        // Deduction Type

        var tblDeductionType;
        $scope.deductionType = {
            DeductionTypeID: 0,
            DeductionTypeName : '',
            Remarks: ''
        }
        $scope.isCreateDeductionType = false;
        $scope.triggerCreateDeductionType = function () {
            $scope.isCreateDeductionType = true;
            $scope.deductionType.DeductionTypeName = '';
            $scope.deductionType.Remarks = '';
            $('#mdlDeductionType').modal("show");
            angular.forEach($scope.frmDeductionType.$error.required, function (field) {
                field.$valid = true;
            });
        }

        function loadDeductionTypes() {

            salaryService.getAllDeductionType().then(
                   function (response) {
                       if (window.location.href.toLowerCase().indexOf('deductiontype') > -1) {
                               if ($.fn.dataTable.isDataTable('#tblDeductionType')) {
                                   $('#tblDeductionType').DataTable().destroy();
                               }
                               tblDeductionType = $('#tblDeductionType').DataTable({
                                   data: response,
                                   "order": [[1, "asc"]],
                                   "columns": [
                                        { "data": "DeductionTypeID" },
                                        { "data": "DeductionTypeName" },
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
                           $scope.deductionTypes = response;
                           loadDeductions();
                       }
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblDeductionType').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblDeductionType').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.deductionType.DeductionTypeID = rowData.DeductionTypeID;
                    $scope.deductionType.DeductionTypeName = rowData.DeductionTypeName;
                    $scope.deductionType.Remarks = rowData.Remarks;
                    $scope.isCreateDeductionType = false;
                });
                $('#mdlDeductionType').modal("show");
            }
        });

        $('#tblDeductionType').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.deductionType.DeductionTypeID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDeductionTypeDelete').modal("show");
        });

        $scope.createDeductionType = function () {
            if (isFormValid($scope.frmDeductionType)) {
                $scope.$parent.isNameExist('Salary', 0, 'type', $scope.deductionType.DeductionTypeName).then(function (response) {
                    if (response.data) addNotification('Error', 'Deduction Type with same name already exists!', 'error');
                    else {

                    salaryService.createDeductionType($scope.deductionType).then(
                         function (response) {
                             addNotification('Success', 'New record is added in Deduction Type!', 'success');
                             $('#mdlDeductionType').modal("hide");
                             loadDeductionTypes();
                         },
                         function (data) {
                          if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                             $('#mdlDeductionType').modal("hide");
                         });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDeductionType').modal("hide");
                });
            }
        };

        $scope.updateDeductionType = function () {
            if (isFormValid($scope.frmDeductionType)) {
                $scope.$parent.isNameExist('Salary', $scope.deductionType.DeductionTypeID, 'type', $scope.deductionType.DeductionTypeName).then(function (response) {
                    if (response.data) addNotification('Error', 'Deduction Type with same name already exists!', 'error');
                    else {
                    salaryService.updateDeductionType($scope.deductionType).then(
                        function (response) {
                            addNotification('Success', 'Record is successfully updated!', 'success');
                            $('#mdlDeductionType').modal("hide");
                            loadDeductionTypes();
                        },
                         function (data) {
                          if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                             $('#mdlDeductionType').modal("hide");
                         });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDeductionType').modal("hide");
                });
            }
        };

        $scope.deleteDeductionType = function () {
            salaryService.deleteDeductionType($scope.deductionType.DeductionTypeID).then(
                function (response) {
                    loadDeductionTypes();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                 $('#mdlDeductionType').modal("hide");
             });
        };



        // Payslip

        //$scope.MonthID = 0;
        $scope.payslip = {
            MonthID: undefined,
            CompanyID: undefined,
            Year: undefined,
        };
        $scope.selectedEmployees = new Array();

        var payslip = {
            PayslipID: 0,
            EmployeeID: 0,
            Date: '',
            Basic: 0,
            Telephone: 0,
            Housing: 0,
            Transport: 0,
            TotalSalary: 0,
            TotalDays: 0,
            TotalWorkingDays: 0,
            OtherText: '',
            OtherNumber: '',
            Gratuity: 0,
            Remarks: ''
        };
        $('#tblPayslip').hide();
        //$('#tblPayslip').parent().next().next('input[type=button]').hide();
        function loadPayslips() {

            if ($scope.payslip.MonthID == undefined) {
                $scope.frmPayslip.txtMonthID.$dirty = true;
                return false;
            }
            if ($scope.payslip.CompanyID == undefined) {
                $scope.frmPayslip.txtCompanyID.$dirty = true;
                return false;
            }
           
            salaryService.generatePayslipByMonth($scope.payslip).then(
                   function (response) {
                       $('#tblPayslip').show();
                       if (response.data.length > 0) {
                           
                          // $('#tblPayslip').parent().next().next('input[type=button]').show();
                       }
                       if ($.fn.dataTable.isDataTable('#tblPayslip')) {
                           $('#tblPayslip').DataTable().destroy();
                       }
                       $('#tblPayslip').DataTable({
                           data: response.data,
                           "lengthMenu": [[50, -1], [50, "All"]],
                           "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "PaySlipID" },
                                    { "data": "Date" },
                                    { "data": "EmployeeID" },
                                    { "data": "TotalDays" },
                                    { "data": "TotalWorkingDays" },
                                    { "data": "TotalPresentDays" },
                                    { "data": "TotalPublicHolidays" },
                                    { "data": "TotalWeekendDays" },
                                    { "data": "TotalLeaveDays" },
                                    { "data": "TotalAbsentDays" },
                                    { "data": "Basic" },
                                    { "data": "Telephone" },
                                    { "data": "Housing" },
                                    { "data": "Transport" },
                                    { "data": "OtherText" },
                                    { "data": "OtherNumber" },
                                    { "data": "AdditionText" },
                                    { "data": "AdditionNumber" },
                                    { "data": "TotalSalary" },
                                    { "data": "Gratuity" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                    {
                                        "render": function (data, type, row) {
                                            //return ' <input type="checkbox" class="flat" name="table_records">';
                                            return ' <div class="icheckbox_flat-blue checkbox-container" data-employeeid="' + row.EmployeeID + '" >' +
                                                     '<input type="checkbox" class="flat">' +
                                                     '<ins class="iCheck-helper"></ins>' +
                                                 '</div>';
                                    },
                                    "targets": 0
                                    },
                                   {
                                       "render": function (data, type, row) {
                                           return getEmployeeById(data);
                                       },
                                       "targets": 2
                                   },
                                   {
                                       "render": function (data, type, row) {
                                           return ToJavaScriptDate(data);
                                       },
                                       "targets": 1
                                   }
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    //$scope.message = data.error_description;
                });
        }

        function processPayslip(payslip) {
            salaryService.createPayslip(payslip).then(
                      function (response) {
                          if (response.data) { addNotification('Payslip Processed', 'Payslip is successfully processed!', 'success'); loadPayslips(); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                      },
                    function (data) {
                        if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    });
        }

        $scope.generatePayslip = function () {
            loadEmployees();
        };
        $scope.processPayslip = function () {
            var payslip = new Array();
            
            $('#tblPayslip').DataTable().rows().every(function (rowIdx, tableLoop, rowLoop) {
                var data = this.data();
                if ($scope.selectedEmployees.indexOf(data.EmployeeID) > -1) {
                    payslip.push({
                    EmployeeID: data.EmployeeID
                   , Date: formatDateYYYYmmDD( ToJavaScriptDate(data.Date))
                   , TotalWorkingDays: data.TotalWorkingDays
                   , TotalPresentDays: data.TotalPresentDays
                   , TotalPublicHolidays: data.TotalPublicHolidays
                   , TotalWeekendDays: data.TotalWeekendDays
                   , TotalLeaveDays: data.TotalLeaveDays
                   , TotalAbsentDays: data.TotalAbsentDays
                   , Basic: data.Basic
                   , Telephone: data.Telephone
                   , Housing: data.Housing
                   , Transport: data.Transport
                   , TotalSalary: data.TotalSalary
                   , TotalDays: data.TotalDays
                   , OtherText: data.OtherText
                   , OtherNumber: data.OtherNumber
                   , Remarks: data.Remarks
                   , Gratuity: data.Gratuity
                    });
                }
             });
                //$('#tblPayslip tbody tr').each(function () {
                //var rowData = $('#tblPayslip').DataTable().row(this).data();
                //payslip.push({
                //     EmployeeID : rowData.EmployeeID
                //    ,Date : ToJavaScriptDate(rowData.Date)
                //    ,TotalWorkingDays : rowData.TotalWorkingDays
                //    ,Basic : rowData.Basic
                //    ,Telephone : rowData.Telephone
                //    ,Housing : rowData.Housing
                //    ,Transport : rowData.Transport
                //    ,TotalSalary: rowData.TotalSalary
                //    ,TotalDays: rowData.TotalDays
                //    ,OtherText : rowData.OtherText
                //    ,OtherNumber : rowData.OtherNumber
                //    ,Remarks : rowData.Remarks
                //});
            //});
            processPayslip(payslip)
        };
        $('body').on('click', '.checkbox-container', function () {
            var elm = $(this);
            var _employeeId = elm.data('employeeid');
            $scope.$apply(function () { 
          
            //if (elm.attr('id') == 'chkAll') {
            //    toggleCheck(elm);
            //    $('#tblPayslip').DataTable().rows().every(function (rowIdx, tableLoop, rowLoop) {
            //        var data = this.data();
            //        $scope.selectedEmployees.push(EmployeeID);
            //        toggleCheck(data[0]);
            //    });
            //}
            //else {
                toggleCheck(elm);
            //}
            function toggleCheck(elm) {
                var checked = elm.hasClass('checked');
                if (checked) {
                    $scope.selectedEmployees.splice( $scope.selectedEmployees.indexOf(_employeeId),1);
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
        $scope.switchChecked = function (elm) {
            var _checkbox = $('#' + elm);//.find('input[type="checkbox"]');

            var index = 1;
            //var checked = _checkbox.prop('checked');
            var checked = _checkbox.parent('div').hasClass('checked');
            var table = $('#tblPayslip').DataTable();
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
            $('#tblPayslip tbody tr .checkbox-container').each(function () {
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

            //table.rows().every(function (rowIdx, tableLoop, rowLoop) {
            //    var data = this.data();
            //    //var _value = $(data[index]).data('employeeid');
            //    if (_value) {
            //        if (checked) {
            //            data[index] = '<div class="icheckbox_flat-blue checkbox-container"  data-employeeid="' + row.EmployeeID + '"> <input type="checkbox"  class="flat" /> <ins class="iCheck-helper"></ins></div>';
            //            $scope.selectedEmployees.splice($scope.selectedEmployees.indexOf(_value), 1);
            //        }
            //        else {
            //            data[index] = '<div class="icheckbox_flat-blue checkbox-container checked"  data-employeeid="' + row.EmployeeID + '"> <input type="checkbox" checked="checked" class="flat" /> <ins class="iCheck-helper"></ins></div>';
            //            $scope.selectedEmployees.push(_value);
            //        }
            //    }
                
            //    this.data(data);
            //});
            //$('#tblUserAccess tbody tr').each(function () {
            //    $(this).find('td:eq('+index+') > input[type=checkbox]').prop('checked',checked);
            //});
        }
        // Public Holiday

        var tblPublicHoliday;
        $scope.publicHoliday = {
            PublicHolidayID: 0,
            PublicHolidayName: '',
            Date: new Date().format('d/m/Y'),
            Remarks: ''
        }
        $scope.isCreatePublicHoliday = false;
        $scope.triggerCreatePublicHoliday = function () {
            $scope.isCreatePublicHoliday = true;
            $scope.publicHoliday.PublicHolidayName = '';
            $scope.publicHoliday.Date = new Date().format('d/m/Y');
            $scope.publicHoliday.CompanyID = undefined;
            $scope.publicHoliday.Remarks = '';
            $('#mdlPublicHoliday').modal("show");
            angular.forEach($scope.frmPublicHoliday.$error.required, function (field) {
                field.$valid = true;
            });
        }

        function loadPublicHolidays() {

            salaryService.getAllPublicHoliday().then(
                   function (response) {
                       $scope.publicHolidays = response;
                           if ($.fn.dataTable.isDataTable('#tblPublicHoliday')) {
                               $('#tblPublicHoliday').DataTable().destroy();
                           }
                           tblPublicHoliday = $('#tblPublicHoliday').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "PublicHolidayID" },
                                    { "data": "PublicHolidayName" },
                                    { "data": "Date" },
                                    { "data": "CompanyID" },
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
                                         "targets": 2
                                     },
                                     {
                                         "render": function (data, type, row) {
                                             var _company = getCompanyById(data);
                                             if (_company != undefined) {
                                                 return _company.CompanyName;
                                             }
                                             else {
                                                 return ' - ';
                                             }
                                         },
                                         "targets": 3
                                     }
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                   },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        $('#tblPublicHoliday').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblPublicHoliday').DataTable().row($(this).parents('tr')).data();
            $scope.$apply(function () {
                $scope.publicHoliday.PublicHolidayID = rowData.PublicHolidayID;
                $scope.publicHoliday.PublicHolidayName = rowData.PublicHolidayName;
                $scope.publicHoliday.Date =ToJavaScriptDate( rowData.Date);
                $scope.publicHoliday.CompanyID = rowData.CompanyID;
                $scope.publicHoliday.Remarks = rowData.Remarks;
                $scope.isCreatePublicHoliday = false;
                var _company = getCompanyById(rowData.CompanyID);
                if (_company != undefined) {
                    $scope.selectedCompanyName =  _company.CompanyName;
                }
                else {
                    $scope.selectedCompanyName = ' - ';
                }
            });
            $('#mdlPublicHoliday').modal("show");
        });
        $('#tblPublicHoliday').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.publicHoliday.PublicHolidayID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlPublicHolidayDelete').modal("show");
        });
        $scope.createPublicHoliday = function () {
            if (isFormValid($scope.frmPublicHoliday)) {
                $scope.$parent.isNameExist('Salary', 0, 'publicholiday', $scope.publicHoliday.Date + ':' + $scope.publicHoliday.CompanyID).then(function (response) {
                    if (response.data) addNotification('Error', 'Public Holiday with same name already exists!', 'error');
                    else {
                        $scope.publicHoliday.Date = formatDateYYYYmmDD($scope.publicHoliday.Date);
                        salaryService.createPublicHoliday($scope.publicHoliday).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Public Holiday!', 'success');
                                $('#mdlPublicHoliday').modal("hide");
                                loadPublicHolidays();
                            },
                             function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlPublicHoliday').modal("hide");
                             });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlPublicHoliday').modal("hide");
                });
            }
        };

        $scope.updatePublicHoliday = function () {
            if (isFormValid($scope.frmPublicHoliday)) {
                $scope.$parent.isNameExist('Salary', $scope.publicHoliday.PublicHolidayID, 'publicholiday', $scope.publicHoliday.Date + ':' + $scope.publicHoliday.CompanyID).then(function (response) {
                    if (response.data) addNotification('Error', 'Public Holiday with same name already exists!', 'error');
                    else {
                        $scope.publicHoliday.Date = formatDateYYYYmmDD($scope.publicHoliday.Date);
                        salaryService.updatePublicHoliday($scope.publicHoliday).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlPublicHoliday').modal("hide");
                                loadPublicHolidays();
                            },
                             function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlPublicHoliday').modal("hide");
                             });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlPublicHoliday').modal("hide");
                });
            }
        };

        $scope.deletePublicHoliday = function () {
            salaryService.deletePublicHoliday($scope.publicHoliday.PublicHolidayID).then(
                function (response) {
                    addNotification('Success', 'Record is successfully updated!', 'success');
                    $('#mdlPublicHoliday').modal("hide");
                    loadPublicHolidays();
                },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlPublicHoliday').modal("hide");
                });
        };

        $scope.publicHolidayChange = function () {
            for (var i = 0; i < $scope.publicHolidays.length; i++) {
                if(ToJavaScriptDate($scope.publicHolidays[i].Date) == $scope.publicHoliday.Date){
                    addNotification('Warning', 'Public Holiday with the selected date already exists!', 'warning');
                    $scope.publicHoliday.Date = '';
                }
            }
        };

        // Common

        //function loadOtherTexts() {
        //    salaryService.getOtherTexts().then(
        //          function (response) {
        //              $scope.otherTexts = response;
        //          },
        //        function (data) {
        //            if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
        //        });
        //}
        function loadCompanies() {
            companyService.getAllCompanies().then(
                  function (response) {
                      $scope.companies = response;
                      loadPublicHolidays();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadEmployees() {
            employeeService.getAllEmployees(1).then(
                  function (response) {
                      $scope.employees = response;
                      $scope.unfilteredEmployees = response;
                      if (window.location.href.toLowerCase().indexOf('salary') > -1) {
                          loadSalaries();
                      }
                      else if (window.location.href.toLowerCase().indexOf('increment') > -1) {
                          loadIncrements();
                      }
                      else if (window.location.href.toLowerCase().indexOf('deduction') > -1) {
                          loadDeductionTypes();
                      }
                      else if (window.location.href.toLowerCase().indexOf('payslip') > -1) {
                          loadPayslips();
                      }
                      
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        //function loadMonths() {
        //    $scope.months = new Array();
        //    var _currentYear = new Date().getFullYear();
        //    var _months = [{ 'MonthID': 1, 'MonthName': "January" + ' - ' + _currentYear }, { 'MonthID': 2, 'MonthName': "February" + ' - ' + _currentYear },
        //    { 'MonthID': 3, 'MonthName': "March" + ' - ' + _currentYear }, { 'MonthID': 4, 'MonthName': "April" + ' - ' + _currentYear },
        //    { 'MonthID': 5, 'MonthName': "May" + ' - ' + _currentYear }, { 'MonthID': 6, 'MonthName': "June" + ' - ' + _currentYear },
        //    { 'MonthID': 7, 'MonthName': "July" + ' - ' + _currentYear }, { 'MonthID': 8, 'MonthName': "August" + ' - ' + _currentYear },
        //    { 'MonthID': 9, 'MonthName': "September" + ' - ' + _currentYear }, { 'MonthID': 10, 'MonthName': "October" + ' - ' + _currentYear },
        //    { 'MonthID': 11, 'MonthName': "November" + ' - ' + _currentYear }, { 'MonthID': 12, 'MonthName': "December" + ' - ' + _currentYear }, ];
        //    var _prevMonth = new Date().getMonth() - 1;
        //    for (var i = _prevMonth; i < _months.length; i++) {
        //        $scope.months.push(_months[i]);
        //    }
        //}
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
        function getEmployeeById(Id) {
            var _employeeName;
            for (var i = 0; i < $scope.unfilteredEmployees.length; i++) {
                if ($scope.unfilteredEmployees[i].EmployeeID === Id) {
                    _employeeName = $scope.unfilteredEmployees[i].EmployeeName
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
        $scope.setOtherText = function (Name) {
            $scope.increment.OtherText = Name;
            $scope.deduction.OtherText = Name;
            $scope.selectedOtherTextName = Name;
        }
        $scope.setEmployee = function (ID, Name) {
            $scope.salary.EmployeeID = ID;
            $scope.increment.EmployeeID = ID;
            $scope.deduction.EmployeeID = ID;
            $scope.selectedEmployeeName = Name;
            var _otherText = ' - ';
            var _salary = getSalaryByEmployeeId(ID);           
            if (_salary != undefined) {
                $scope.deduction.salary = _salary;
                _otherText = _salary.OtherText;
            }
            $scope.increment.OtherText = _otherText;
            $scope.deduction.OtherText = _otherText;
            $('#txtDeductionOn').removeAttr('disabled');
        }
        $scope.setDeductionOn = function (Name) {
            $scope.deduction.DeductionOn = Name;
            $scope.selectedDeductionOnName = Name;
            if (Name.toLowerCase().indexOf('basic') > -1) {
                $('#txtBasic').removeAttr('disabled');
                $('#txtTelephone , #txtHousing , #txtTransport , #txtOtherNumber , #txtOtherText ').attr('disabled', 'disabled');//.val(0);
                $scope.deduction.Telephone = 0;
                $scope.deduction.Housing = 0;
                $scope.deduction.Transport = 0;
                $scope.deduction.OtherNumber = 0;
            }
            else if (Name.toLowerCase().indexOf('transport') > -1) {
                $('#txtTransport').removeAttr('disabled');
                $scope.deduction.Basic = 0;
                $scope.deduction.Housing = 0;
                $scope.deduction.Telephone = 0;
                $scope.deduction.OtherNumber = 0;
                $('#txtBasic , #txtTelephone , #txtHousing , #txtOtherNumber , #txtOtherText ').attr('disabled', 'disabled');
            }
            else if (Name.toLowerCase().indexOf('housing') > -1) {
                $('#txtHousing').removeAttr('disabled');
                $scope.deduction.Basic = 0;
                $scope.deduction.Transport = 0;
                $scope.deduction.Telephone = 0;
                $scope.deduction.OtherNumber = 0;
                $('#txtBasic , #txtTelephone , #txtTransport , #txtOtherNumber , #txtOtherText ').attr('disabled', 'disabled');
            }
            else if (Name.toLowerCase().indexOf('telephone') > -1) {
                $('#txtTelephone').removeAttr('disabled');
                $scope.deduction.Basic = 0;
                $scope.deduction.Transport = 0;
                $scope.deduction.Housing = 0;
                $scope.deduction.OtherNumber = 0;
                $('#txtBasic , #txtHousing , #txtTransport , #txtOtherNumber , #txtOtherText ').attr('disabled', 'disabled');
            }
            else if (Name.toLowerCase().indexOf('other') > -1) {
                $('#txtOtherNumber , #txtOtherText').removeAttr('disabled');
                $scope.deduction.Basic = 0;
                $scope.deduction.Transport = 0;
                $scope.deduction.Housing = 0;
                $scope.deduction.Telephone = 0;
                $('#txtBasic , #txtTelephone , #txtHousing , #txtTransport').attr('disabled', 'disabled');
            }
        }
        $scope.setCompany = function (ID, Name) {
            $scope.publicHoliday.CompanyID = ID;
            $scope.payslip.CompanyID = ID;
            $scope.selectedCompanyName = Name;
        }
        function getCompanyById(Id) {
            var _company;
            for (var i = 0; i < $scope.companies.length; i++) {
                if ($scope.companies[i].CompanyID === Id) {
                    _company = $scope.companies[i];
                    break;
                }
            }
            return _company;
        }
        function getDeductionById(Id) {
            var _Deduction;
            for (var i = 0; i < $scope.deductions.length; i++) {
                if ($scope.deductions[i].DeductionID === Id) {
                    _Deduction = $scope.deductions[i];
                    break;
                }
            }
            return _Deduction;
        }
        function getDeductionTypeById(Id) {
            var _DeductionTypeName;
            for (var i = 0; i < $scope.deductionTypes.length; i++) {
                if ($scope.deductionTypes[i].DeductionTypeID === Id) {
                    _DeductionTypeName = $scope.deductionTypes[i].DeductionTypeName
                    break;
                }
            }
            return _DeductionTypeName;
        }

        $scope.setDeductionType = function (ID, Name) {
            $scope.deduction.DeductionTypeID = ID;
            $scope.selectedDeductionTypeName = Name;
        }
        $scope.setMonth = function (date) {
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var _month = date.split('-')[0].trim();
            $scope.payslip.MonthID = monthNames.indexOf(_month) + 1;
            $scope.payslip.Year = date.split('-')[1].trim();
            $scope.selectedMonthName = date;
        }
        function clearDropDowns() {
            $scope.selectedEmployeeName = "Select Employee";
            $scope.selectedDeductionOnName = "Select Deduction On";
            $scope.selectedMonthName = "Select Month";
            $scope.selectedCompanyName = "Select Company";
            $scope.selectedOtherTextName = "Select Allowance Type";
        }
        function isDropDownsValid(frm,model) {
            var _result = true;
            if (model.EmployeeID == undefined) {
                frm.txtEmployeeID.$dirty = true;
                _result = false;
            }
            if (!isFormValid(frm)) {
                _result = false;
            }
            return _result;
        }
    }
})();