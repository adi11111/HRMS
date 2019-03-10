(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('attendenceController', attendenceController);

    attendenceController.$inject = ['$scope', '$location', 'attendenceService', 'employeeService', 'companyService'];

    function attendenceController($scope, $location, attendenceService, employeeService,companyService) {

        // On Load

        if (window.location.href.toLowerCase().indexOf('shift') > -1) {
            loadShifts();
        }
        
        else {
            loadAttendenceStatuss();
        }
        

        // Attendence

        $scope.attendence = {
            AttendenceID : 0,
            AttendenceDate : '',
            EmployeeID: 0,
            EmployeeName: '',
            TimeIn : '',
            TimeOut : '',
            StatusID: 0,
            StatusName: '',
            TotalWorkingHours : '',
            DailyWorkingHours : '',
            Remarks : ''
        };
        
        clearDropdown();
        $scope.isCreateAttendence = false;
        $scope.triggerCreateAttendence = function () {
            $scope.isCreateAttendence = true;
            $scope.attendence.AttendenceID = 0;
            $scope.attendence.AttendenceDate;
            $scope.attendence.EmployeeID = undefined;
            $scope.attendence.EmployeeName = '';
            $scope.attendence.TimeIn = undefined;
            $scope.attendence.TimeOut = undefined;
            $scope.attendence.StatusID = 0;
            $scope.attendence.StatusName = '';
            $scope.attendence.TotalWorkingHours = '00:00';
            $scope.attendence.DailyWorkingHours = '00:00';
            $scope.attendence.Remarks = '';
            clearDropdown();
            $('#mdlAttendence').modal("show");
            angular.forEach($scope.frmAttendence.$error.required, function (field) {
                field.$dirty = false;
            });

        }
        function loadAttendence() {
            attendenceService.getAllAttendence().then(
                  function (response) {
                      $scope.monthYears = loadMonthYears(6);
                      if ($.fn.dataTable.isDataTable('#tblAttendence')) {
                          $('#tblAttendence').DataTable().destroy();
                      }
                      tblAttendenceStatus = $('#tblAttendence').DataTable({
                          data: response,
                          "order": [[1, "asc"]],
                          "columns": [
                               { "data": "AttendenceID" },
                               { "data": "AttendenceDate" },
                               { "data": "EmployeeID" },
                               { "data": "TimeIn" },
                               { "data": "TimeOut" },
                               { "data": "StatusID" },
                               { "data": "TotalWorkingHours" },
                               { "data": "DailyWorkingHours" },
                               { "data": "Remarks" }
                          ],
                          "columnDefs": [
                                {
                                    "render": function (data, type, row) {
                                        return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                    },
                                    "targets": 0
                                },
                               { className: "hide_column", "targets": [8] },
                               {
                                   "render": function (data, type, row) {
                                       return ToJavaScriptDate(data);
                                   },
                                   "targets": 1
                               },
                               {
                                   "render": function (data, type, row) {
                                       return getEmployeesById(data);
                                   },
                                   "targets": 2
                               },
                               {
                                   "render": function (data, type, row) {
                                       return MinutesToTime(data.TotalMinutes);
                                   },
                                   "targets": 3
                               },
                               {
                                   "render": function (data, type, row) {
                                       return MinutesToTime(data.TotalMinutes);
                                   },
                                   "targets": 4
                               },
                               {
                                   "render": function (data, type, row) {
                                       return getAttendenceStatusById(data);
                                   },
                                   "targets": 5
                               },
                                {
                                    "render": function (data, type, row) {
                                        return MinutesToTime(data.TotalMinutes);
                                    },
                                    "targets": 6
                                },
                                {
                                    "render": function (data, type, row) {
                                        return MinutesToTime(data.TotalMinutes);
                                    },
                                    "targets": 7
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
        $('#tblAttendence').on('click', 'tbody tr i.edit', function (e) {
            e.stopPropagation();
            var rowData = $('#tblAttendence').DataTable().row($(this).parents('tr')).data();
            $scope.$apply(function () {
                $scope.attendence.AttendenceID = rowData.AttendenceID;
                $scope.attendence.AttendenceDate = ToJavaScriptDate(rowData.AttendenceDate);
                $scope.attendence.EmployeeID = rowData.EmployeeID;
                $scope.selectedEmployeeName = getEmployeesById(rowData.EmployeeID);
                //$scope.attendence.EmployeeName = $scope.attendence.SelectedEmployeeName;
                $scope.attendence.TimeIn = MinutesToTime(rowData.TimeIn.TotalMinutes);
                $scope.attendence.TimeOut = MinutesToTime(rowData.TimeOut.TotalMinutes);
                $scope.attendence.StatusID = rowData.StatusID;
                $scope.selectedAttendenceStatusName = getAttendenceStatusById(rowData.StatusID);
                $scope.attendence.AttendenceStatus = $scope.selectedAttendenceStatusName;
                $scope.attendence.TotalWorkingHours = MinutesToTime(rowData.TotalWorkingHours.TotalMinutes);
                $scope.attendence.DailyWorkingHours = MinutesToTime(rowData.DailyWorkingHours.TotalMinutes);
                $scope.attendence.Remarks = rowData.Remarks;
                $scope.isCreateAttendence = false;
            });
            $('#mdlAttendence').modal("show");
        });
        $('#tblAttendence').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.attendence.AttendenceID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlAttendenceDelete').modal("show");
        });
        $scope.createAttendence = function () {
            if (isDropDownsValid($scope.frmAttendence, $scope.attendence)) {
                $scope.$parent.isNameExist('Attendence', 0, 'attendence', $scope.attendence.AttendenceDate + ':' + $scope.attendence.EmployeeID).then(function (response) {
                    if(response.data) addNotification('Error', 'Attedence with same date already exists!', 'error');
                    else{
                        //if (!$scope.frmAttendence.txtEmployeeID.$invalid) {

                        $scope.attendence.AttendenceDate = formatDateYYYYmmDD($scope.attendence.AttendenceDate);
                            attendenceService.createAttendence($scope.attendence).then(
                             function (response) {
                                 addNotification('Success', 'New record is added in Attendence!', 'success');
                                 $('#mdlAttendence').modal("hide");
                                 loadAttendence();
                             },
                                function (data) {
                                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlAttendence').modal("hide");
                                });
                    }
                }, function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlAttendenceStatus').modal("hide");
                });
                //}
                //else {
                //    $scope.frmAttendence.txtEmployeeID.$setDirty();
                //    $scope.frmAttendence.txtEmployeeID.$valid = false;
                //}
            }
        };

        $scope.updateAttendence = function () {
            if (isDropDownsValid($scope.frmAttendence, $scope.attendence)) {
                $scope.$parent.isNameExist('Attendence', $scope.attendence.AttendenceID, 'attendence', $scope.attendence.AttendenceDate + ':' + $scope.attendence.EmployeeID).then(function (response) {
                    if(response.data) addNotification('Error', 'Attedence with same date already exists!', 'error');
                    else {
                        $scope.dateChange();
                        $scope.attendence.AttendenceDate = formatDateYYYYmmDD($scope.attendence.AttendenceDate);
                        attendenceService.updateAttendence($scope.attendence).then(
                           function (response) {
                               addNotification('Success', 'Record is successfully updated!', 'success');
                               $('#mdlAttendence').modal("hide");
                               loadAttendence();
                           },
                                 function (data) {
                                     if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                     $('#mdlAttendence').modal("hide");
                                 });
                    }
                }, function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlAttendenceStatus').modal("hide");
                });
            }
        };

        $scope.deleteAttendence = function () {
            attendenceService.deleteAttendence($scope.attendence.AttendenceID).then(
                function (response) {
                    addNotification('Success', 'Record is successfully deleted!', 'success');
                    $('#mdlAttendenceDelete').modal("hide");
                    loadAttendence();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                 $('#mdlAttendenceStatus').modal("hide");
             });
        };
        $scope.uploadAttendence = function () {
            if ($scope.attendenceFile != '') {
                attendenceService.uploadAttendenceFile({ attendenceFile: $scope.attendenceFile }).then(
                function (response) {
                    loadEmployees();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                 $('#mdlAttendenceStatus').modal("hide");
             });
            }
        };
       
        $scope.timeChange = function() {
            timeChange();
        }
        $scope.setEmployee = function (ID, Name) {
            $scope.attendence.EmployeeID = ID;
            $scope.selectedEmployeeName = Name;
            $scope.$parent.isNameExist('Leave', $scope.attendence.EmployeeID, 'attendence', $scope.attendence.AttendenceDate).then(function (response) {
                if (response.data) {
                    addNotification('On Leave', 'Employee is on leave in the selected date!', 'error');
                    $scope.attendence.TimeIn = '00:00';
                    $scope.attendence.TimeOut = '00:00';
                    timeChange();
                }
                else {
                    var _shift = getShiftDataById(getEmployeeDataById($scope.attendence.EmployeeID).ShiftID);
                    $scope.attendence.TimeIn = TimespanToString(_shift.StartTime);
                    $scope.attendence.TimeOut = TimespanToString(_shift.EndTime);
                    timeChange();
                }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlShift').modal("hide");
                }); 
           
        }
        $scope.setCompany = function (ID, Name) {
            $scope.bulkEmployees = new Array();
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].CompanyID == ID) {
                    $scope.bulkEmployees.push($scope.employees[i]);
                }
            }
            $scope.attendenceBulk.CompanyID = ID;
            $scope.selectedCompanyName = Name;
            // $scope.selectedParticipants = new Array();
            var _list = $scope.selectedParticipants.slice(0);
            for (var i = 0; i < _list.length; i++) {
                removeParticipantFromList(_list[i]);
            }
            //$('.participant-list ul li').each(function (k, elm) {
            //    var _anchor = $('.checkbox-container[data-employeeID=' + $(elm).attr('employeeID') + ']').parents('a');
            //    _anchor.find('input[type=checkbox]').prop('checked', false);
            //    $('.participant-list ul li').eq(k).remove();
            //    _anchor.find('.checkbox-container').removeClass('checked').addClass('unchecked');
            //});
            //$('.participant-list ul').html('');
        }
        $scope.dateChange = function () {
            if ($scope.attendence.EmployeeID != undefined && $scope.attendence.EmployeeID != 0) {
                $scope.$parent.isNameExist('Leave', $scope.attendence.EmployeeID, 'attendence', $scope.attendence.AttendenceDate).then(function (response) {
                    if (response.data) {
                        addNotification('On Leave', 'Employee is on leave in the selected date!', 'error');
                        $scope.attendence.TimeIn = '00:00';
                        $scope.attendence.TimeOut = '00:00';
                        timeChange();
                    }
                    else {
                        var _shift = getShiftDataById(getEmployeeDataById($scope.attendence.EmployeeID).ShiftID);
                        $scope.attendence.TimeIn = TimespanToString(_shift.StartTime);
                        $scope.attendence.TimeOut = TimespanToString(_shift.EndTime);
                        timeChange();
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlShift').modal("hide");
                });
            }

        }

        function timeChange() {
            if ($scope.attendence.EmployeeID > 0) {
                var _timeOut = moment($scope.attendence.TimeOut, "HH:mm:ss");
                var _timeIn = moment($scope.attendence.TimeIn, "HH:mm:ss");
                var miliseconds = _timeOut.diff(_timeIn);
                if (miliseconds < 0) {
                    $scope.attendence.TimeOut = '';
                    $scope.attendence.AttendenceStatus = 'Absence';
                    $scope.attendence.TotalWorkingHours = '00:00';
                    $scope.attendence.DailyWorkingHours = '00:00';
                    $scope.attendence.StatusID = getAttendenceStatusIDByName('Absence');
                    addNotification('Error','The Time In cannot be greater than Time Out!','error');
                }
                else{
                    var duration = moment.duration(miliseconds);
                    var difference = Math.floor(duration.asHours()) + moment.utc(miliseconds).format(":mm");
                    var _shift = getShiftDataById(getEmployeeDataById($scope.attendence.EmployeeID).ShiftID);
                    $scope.attendence.TotalWorkingHours = difference;
                    $scope.attendence.DailyWorkingHours = TimespanToString(_shift.TotalWorkingHours);
                    var _startTimeMinutes = _shift.StartTime.TotalMinutes;
                    var _endTimeMinutes = _shift.EndTime.TotalMinutes;
                    var _timeInMinutes = moment.duration($scope.attendence.TimeIn).asMinutes();
                    var _timeOutMinutes = moment.duration($scope.attendence.TimeOut).asMinutes();
                    if (miliseconds < 3600000) {
                        $scope.attendence.AttendenceStatus = 'Absence';
                        $scope.attendence.StatusID = getAttendenceStatusIDByName('Absence');
                    }
                    else if (_timeInMinutes > _startTimeMinutes && _timeOutMinutes < _endTimeMinutes) {
                        $scope.attendence.AttendenceStatus = 'LateIn/EarlyOut';
                        $scope.attendence.StatusID = getAttendenceStatusIDByName('LateIn/EarlyOut');
                    }
                    else if (_timeInMinutes > _startTimeMinutes) {
                        $scope.attendence.AttendenceStatus = 'LateIn';
                        $scope.attendence.StatusID = getAttendenceStatusIDByName('LateIn');
                    }
                    else if (_timeOutMinutes < _endTimeMinutes) {
                        $scope.attendence.AttendenceStatus = 'EarlyOut';
                        $scope.attendence.StatusID = getAttendenceStatusIDByName('EarlyOut');
                    }
                    else if (_timeInMinutes <= _startTimeMinutes && _timeOutMinutes >= _endTimeMinutes) {
                        $scope.attendence.AttendenceStatus = 'Normal';
                        $scope.attendence.StatusID = getAttendenceStatusIDByName('Normal');
                    }
                }
               
            }
            //else {
            //    $scope.attendence.AttendenceStatus = 'Absence';
            //    $scope.attendence.StatusID = getAttendenceStatusIDByName('Absence');
            //}
        }
        function loadEmployees() {
            employeeService.getAllEmployees().then(
                  function (response) {
                      $scope.employees = response;
                      //$scope.bulkEmployees = response;
                      loadShifts();
                  },
                function (data) {
                    $scope.message = data.error_description;
                });
        }
        function loadCompanies() {
            companyService.getAllCompanies().then(
                  function (response) {
                      $scope.companies = response;
                      loadAttendence();
                  },
                function (data) {
                    $scope.message = data.error_description;
                });
        }
       
        function getEmployeesById(Id) {
            var _employeeName;
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].EmployeeID === Id) {
                    _employeeName = $scope.employees[i].EmployeeName
                    break;
                }
            }
            return _employeeName;
        }
        function getEmployeeDataById(Id) {
            var _employee;
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].EmployeeID === Id) {
                    _employee = $scope.employees[i];
                    break;
                }
            }
            return _employee;
        }
        function getShiftById(Id) {
            var _shiftName;
            for (var i = 0; i < $scope.shifts.length; i++) {
                if ($scope.shifts[i].ShiftID === Id) {
                    _shiftName = $scope.shifts[i].ShiftName
                    break;
                }
            }
            return _shiftName;
        }
        function getShiftDataById(Id) {
            var _shift;
            for (var i = 0; i < $scope.shifts.length; i++) {
                if ($scope.shifts[i].ShiftID === Id) {
                    _shift = $scope.shifts[i];
                    break;
                }
            }
            return _shift;
        }
        function getAttendenceStatusById(Id) {
            var _attendenceStatusName;
            for (var i = 0; i < $scope.attendenceStatus.length; i++) {
                if ($scope.attendenceStatus[i].AttendenceStatusID === Id) {
                    _attendenceStatusName = $scope.attendenceStatus[i].AttendenceStatusName
                    break;
                }
            }
            return _attendenceStatusName;
        }
        function getAttendenceStatusIDByName(Name) {
            var _attendenceStatusID;
            for (var i = 0; i < $scope.attendenceStatus.length; i++) {
                if ($scope.attendenceStatus[i].AttendenceStatusName.indexOf(Name) > -1) {
                    _attendenceStatusID = $scope.attendenceStatus[i].AttendenceStatusID
                    break;
                }
            }
            return _attendenceStatusID;
        }


        $scope.triggerBulkAttendence = function () {
            $('#mdlAttendenceBulk').modal("show");
            clearDropdown();
            angular.forEach($scope.frmAttendenceBulk.$error.required, function (field) {
                field.$valid = true;
            });
            $scope.bulkEmployees = new Array();
        }

        $scope.bulkAttendence = function (allEmployees) {
            if (allEmployees == 'all') {
                if ($scope.attendenceBulk.CompanyID > 0) {
                    $scope.attendenceBulk.EmployeeID = 1;
                }
                for (var i = 0; i < $scope.bulkEmployees.length; i++) {
                    $scope.attendenceBulk.employees.push($scope.bulkEmployees[i].EmployeeID);
                }
                uploadBulkAttendence();
            }
            else {
                if ($scope.selectedParticipants.length > 0) {
                    $scope.attendenceBulk.EmployeeID = 1;
                }
                $scope.attendenceBulk.employees = $scope.selectedParticipants;
                uploadBulkAttendence();
            }
        }

        $scope.attendenceBulk = {
            EmployeeID: undefined,
            CompanyID: undefined,
            date: '',
            employees : new Array()
        };

        $scope.participants = new Array();
        $scope.selectedParticipants = new Array();
        function uploadBulkAttendence() {
            if ($scope.attendenceBulk.date == '' || $scope.attendenceBulk == undefined) {
                $scope.frmAttendenceBulk.txtMonthYear.$dirty = true;
            }
            if ($scope.attendenceBulk.EmployeeID == undefined) {
                $scope.frmAttendenceBulk.txtEmployeeID.$dirty = true;
            }
            if ($scope.attendenceBulk.CompanyID == undefined) {
                $scope.frmAttendenceBulk.txtCompanyID.$dirty = true;
            }
            if (($scope.attendenceBulk.date != '' && $scope.attendenceBulk != undefined) && $scope.attendenceBulk.EmployeeID != undefined && $scope.attendenceBulk.CompanyID != undefined) {
                attendenceService.bulkAttendence($scope.attendenceBulk).then(
                        function (response) {
                            if (response.data == true) {
                                addNotification('Success', 'New Record(s) successfully added!', 'success');
                                $('.participant-list ul').html('');
                                $('#mdlAttendenceBulk').modal("hide");
                                //var _totalParticipants = $scope.selectedParticipants.length;
                                //for (var i = 0; i < _totalParticipants; i++) {
                                //    removeParticipantFromList($scope.selectedParticipants[i]);
                                //}
                                clearDropDowns();
                                loadAttendence();
                                //$scope.attendenceBulk.CompanyID = 0;
                            }
                            else {
                                addNotification('Already Added', 'Selected Month record was already added before!', 'warning');
                                //var _employees = new Array();
                                //for (var i = 0; i < response.data.length; i++) {
                                //    var appointment = getAppointmentById(response.data[i].AppointmentID);
                                //    _employees.push((i + 1) + ' - ' + getEmployeesById(response.data[i].EmployeeID) + ' (' + appointment.AppointmentName + ' - ' + appointment.StartTime + ' - ' + appointment.EndTime + ')' + '\n');
                                //    removeParticipantFromList(response.data[i].EmployeeID);
                                //}
                                //addNotification('Warning', 'Following Employee(s) are busy with another Appointment! \n ' + _employees, 'warning');
                            }
                        },
                     function (data) {
                         if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     });
            }
        };
        $scope.toggleParticipant = function (employeeID, employeeName) {
            var _anchor = $('.checkbox-container[data-employeeID=' + employeeID + ']').parents('a');
            if (_anchor.find('input[type=checkbox]').is(':checked')) {
                removeParticipantFromList(employeeID);
            }
            else {
                addParticipantToList(employeeID, _anchor)
            }
        }
        $scope.setMonthYear = function (monthYear) {
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var _month = monthYear.split('-')[0].trim();
            var _year = monthYear.split('-')[1].trim();
            
            $scope.attendenceBulk.date = '01/' + (monthNames.indexOf(_month) + 1) + '/' + _year;
            $scope.attendenceBulk.MonthYear = monthYear;
            $scope.selectedMonthYear = monthYear;
        }
        $('.participant-list').on('click', 'ul li > span', function () {
            removeParticipantFromList($(this).first().attr('employeeID'));
        });

        function addParticipantToList(employeeID, _anchor) {
            if ($scope.selectedParticipants.indexOf(employeeID) == -1) {
                _anchor.find('input[type=checkbox]').prop('checked', true);
                var employeeName = _anchor.text();
                $scope.selectedParticipants.push(employeeID);
                $('.participant-list ul').append('<li  employeeID="' + employeeID + '"><span data-employeeID="' + employeeID + '" onclick="removeParticipantFromList("' + employeeID + '");" employeeID="' + employeeID + '" >X</span>' + employeeName + '</li>');
                _anchor.find('.checkbox-container').addClass('checked').removeClass('unchecked');
            }
        }
        function getParticipantById(Id) {
            var _participant;
            for (var i = 0; i < $scope.participants.length; i++) {
                if ($scope.participants[i].ParticipantID === Id) {
                    _participant = $scope.participants[i]
                    break;
                }
            }
            return _participant;
        }
        function removeParticipantFromList(employeeID) {
            var _anchor = $('.checkbox-container[data-employeeID=' + employeeID + ']').parents('a');
            $('.participant-list ul li').each(function (k, elm) {
                if ($(elm).attr('employeeID') == employeeID) {
                    _anchor.find('input[type=checkbox]').prop('checked', false);
                    $('.participant-list ul li').eq(k).remove();
                    _anchor.find('.checkbox-container').removeClass('checked').addClass('unchecked');
                }
            });
            for (var i = 0; i < $scope.selectedParticipants.length; i++) {
                if ($scope.selectedParticipants[i] == employeeID) {
                    $scope.selectedParticipants.splice(i, 1);
                }
            }
        }



        function clearDropdown() {
            $scope.selectedEmployeeName = 'Select Employee';
            $scope.selectedAttendenceStatusName = 'Select Attendence Status';
            $scope.selectedMonthYear = 'Select Month & Year';
            $scope.selectedCompanyName = 'Select Company';
        }
        


        // Attendence Status

        var isUpdateDataTable = false;
        var tblAttendenceStatus;
        $scope.attendenceStatus = {
            AttendenceStatusID: 0,
            AttendenceStatusName: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.attendenceStatus.AttendenceStatusName = '';
            $scope.attendenceStatus.Remarks = '';
            $('#mdlAttendenceStatus').modal("show");
            angular.forEach($scope.frmAttendenceStatus.$error.required, function (field) {
                field.$valid = true;
            });
        }

        function loadAttendenceStatuss() {

            attendenceService.getAllAttendenceStatuss().then(
                   function (response) {
                       if (window.location.href.toLowerCase().indexOf('attendancestatus') == -1) {
                           $scope.attendenceStatus = response;
                           loadEmployees();
                       }
                       else {

                           if ($.fn.dataTable.isDataTable('#tblAttendenceStatus')) {
                               $('#tblAttendenceStatus').DataTable().destroy();
                           }
                           tblAttendenceStatus = $('#tblAttendenceStatus').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "AttendenceStatusID" },
                                    { "data": "AttendenceStatusName" },
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
         $('#tblAttendenceStatus').on('click', 'tbody tr i.edit', function () {
             var rowData = $('#tblAttendenceStatus').DataTable().row($(this).parents('tr')).data();
             if (rowData != undefined) {
            $scope.$apply(function () {
                $scope.attendenceStatus.AttendenceStatusID = rowData.AttendenceStatusID;
                $scope.attendenceStatus.AttendenceStatusName = rowData.AttendenceStatusName;
                $scope.attendenceStatus.Remarks = rowData.Remarks;
                $scope.isCreate = false;
            });
            $('#mdlAttendenceStatus').modal("show");
        }
         });
         $('#tblAttendenceStatus').on('click', 'tbody tr i.delete', function () {
             var _ID = $(this).attr('ID');
             var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
             $scope.$apply(function () {
                 $scope.attendenceStatus.AttendenceStatusID = _ID;
                 $scope.deleteName = _deleteName;
             });
             $('#mdlAttendenceStatusDelete').modal("show");
         });
         $scope.createAttendenceStatus = function () {
             if (isFormValid($scope.frmAttendenceStatus)) {
                 $scope.$parent.isNameExist('Attendence', 0, 'status', $scope.attendenceStatus.AttendenceStatusName).then(function (response) {
                     if(response.data) addNotification('Error', 'Attedence Status with same name already exists!', 'error');
                     else{
                         attendenceService.createAttendenceStatus($scope.attendenceStatus).then(
                         function (response) {
                             addNotification('Success', 'New record is added in Attendence Status!', 'success');
                             $('#mdlAttendenceStatus').modal("hide");
                             loadAttendenceStatuss();
                         },
                         function (data) {
                          if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                             $('#mdlAttendenceStatus').modal("hide");
                         });
                     }
                 },function(data){
                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     $('#mdlAttendenceStatus').modal("hide");
                 });
             }
        };

         $scope.updateAttendenceStatus = function () {
             if (isFormValid($scope.frmAttendenceStatus)) {
                 $scope.$parent.isNameExist('Attendence', $scope.attendenceStatus.AttendenceStatusID, 'status', $scope.attendenceStatus.AttendenceStatusName).then(function (response) {
                     if (response.data) addNotification('Error', 'Attedence Status with same name already exists!', 'error');
                     else{
                         attendenceService.updateAttendenceStatus($scope.attendenceStatus).then(
                             function (response) {
                                 addNotification('Success', 'Record is successfully updated!', 'success');
                                 $('#mdlAttendenceStatus').modal("hide");
                                 loadAttendenceStatuss();
                             },
                             function (data) {
                               if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlAttendenceStatus').modal("hide");
                             });
                     }
                 }, function (response) {
                     if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     $('#mdlAttendenceStatus').modal("hide");
                 });
             }
        };

        $scope.deleteAttendenceStatus = function () {
            attendenceService.deleteAttendenceStatus($scope.attendenceStatus.AttendenceStatusID).then(
                function (response) {
                    loadAttendenceStatuss();
                },
             function (data) {
              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                 $('#mdlAttendenceStatusDelete').modal("hide");
             });
        };

        // Shift

        $scope.isCreateShift = false;
        $scope.shift = {
            ShiftID: 0,
            ShiftName: '',
            StartTime: '',
            EndTime: '',
            BreakStartTime: '',
            BreakEndTime: '',
            TotalTime: '',
            TotalBreakHours: '',
            TotalWorkingHours: '',
            Remarks: ''
        }

        $scope.triggerCreateShift = function () {
            $scope.isCreateShift = true;
            $scope.shift.ShiftID = '';
            $scope.shift.ShiftName = '';
            $scope.shift.StartTime = '';
            $scope.shift.EndTime = '';
            $scope.shift.BreakStartTime = '';
            $scope.shift.BreakEndTime = '';
            $scope.shift.TotalTime = '';
            $scope.shift.TotalBreakHours = '';
            $scope.shift.TotalWorkingHours = '';
            $scope.shift.Remarks = '';
            $('#mdlShift').modal("show");
            angular.forEach($scope.frmShift.$error.required, function (field) {
                field.$dirty = false;
            });
        }

        function loadShifts() {
            attendenceService.getAllShift().then(
                   function (response) {
                       if(window.location.href.toLowerCase().indexOf('attendance') > -1){
                           $scope.shifts = response;
                           loadCompanies();
                       }
                       else{
                       if ($.fn.dataTable.isDataTable('#tblShift')) {
                           $('#tblShift').DataTable().destroy();
                       }
                           $('#tblShift').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "ShiftID" },
                                    { "data": "ShiftName" },
                                    { "data": "StartTime" },
                                    { "data": "EndTime" },
                                    { "data": "BreakStartTime" },
                                    { "data": "BreakEndTime" },
                                    { "data": "TotalBreakHours" },
                                    { "data": "TotalWorkingHours" },
                                    { "data": "TotalTime" },
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
                                            return MinutesToTime(data.TotalMinutes);
                                        },
                                        "targets": 2
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return MinutesToTime(data.TotalMinutes);
                                        },
                                        "targets": 3
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return MinutesToTime(data.TotalMinutes);
                                        },
                                        "targets": 4
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return MinutesToTime(data.TotalMinutes);
                                        },
                                        "targets": 5
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return MinutesToTime(data.TotalMinutes);
                                        },
                                        "targets": 6
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return MinutesToTime(data.TotalMinutes);
                                        },
                                        "targets": 7
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return MinutesToTime(data.TotalMinutes);
                                        },
                                        "targets": 8
                                    }
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
         $('#tblShift').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblShift').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
            $scope.$apply(function () {
                $scope.shift.ShiftID = rowData.ShiftID;
                $scope.shift.ShiftName = rowData.ShiftName;
                $scope.shift.StartTime = MinutesToTime(rowData.StartTime.TotalMinutes);
                $scope.shift.EndTime = MinutesToTime(rowData.EndTime.TotalMinutes);
                $scope.shift.TotalTime = MinutesToTime(rowData.TotalTime.TotalMinutes);
                $scope.shift.BreakStartTime = MinutesToTime(rowData.BreakStartTime.TotalMinutes);
                $scope.shift.BreakEndTime = MinutesToTime(rowData.BreakEndTime.TotalMinutes);
                $scope.shift.TotalBreakHours = MinutesToTime(rowData.TotalBreakHours.TotalMinutes);
                $scope.shift.TotalWorkingHours = MinutesToTime(rowData.TotalWorkingHours.TotalMinutes);
                $scope.shift.Remarks = rowData.Remarks;
                $scope.isCreateShift = false;
            });
            $('#mdlShift').modal("show");

        }
         });
         $('#tblShift').on('click', 'tbody tr i.delete', function () {
             var _ID = $(this).attr('ID');
             var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
             $scope.$apply(function () {
                 $scope.shift.ShiftID = _ID;
                 $scope.deleteName = _deleteName;
             });
             $('#mdlShiftDelete').modal("show");
         });
         $scope.createShift = function () {
             if (isFormValid($scope.frmShift)) {
                 $scope.$parent.isNameExist('Attendence', 0, 'shift', $scope.shift.ShiftName).then(function (response) {
                     if (response.data) addNotification('Error', 'Shift with same name already exists!', 'error');
                     else{
                         attendenceService.createShift($scope.shift).then(
                              function (response) {
                                  addNotification('Success', 'New record is added in Shift!', 'success');
                                  $('#mdlShift').modal("hide");
                                  loadShifts();
                              },
                             function (data) {
                                
                             });
                     }
                 },function(){
                     if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     $('#mdlShift').modal("hide");
                 });
             }
        };

         $scope.updateShift = function () {
             if (isFormValid($scope.frmShift)) {
                 $scope.$parent.isNameExist('Attendence', $scope.shift.ShiftID, 'shift', $scope.shift.ShiftName).then(function (response) {
                     if(response.data) addNotification('Error', 'Location with same name already exists!', 'error');
                     else{
                         attendenceService.updateShift($scope.shift).then(
                             function (response) {
                                 addNotification('Success', 'Record is successfully updated!', 'success');
                                 $('#mdlShift').modal("hide");
                                 loadShifts();
                             },
                             function (data) {
                              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlShift').modal("hide");
                             });
                     }
                 }, function (response) {
                     if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     $('#mdlShift').modal("hide");
                 }); 
             }
        };

        $scope.deleteShift = function () {
            attendenceService.deleteShift($scope.shift.ShiftID).then(
                function (response) {
                    loadShifts();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

        $scope.shiftTimeChange = function () {
            if ($scope.shift.StartTime != '' && $scope.shift.StartTime != undefined && $scope.shift.EndTime != '' && $scope.shift.EndTime != undefined && $scope.shift.BreakStartTime != '' && $scope.shift.BreakStartTime != undefined && $scope.shift.BreakEndTime != '' && $scope.shift.BreakEndTime != undefined) {
                var _startTimeMinutes = moment.duration($scope.shift.StartTime).asMinutes();
                var _endTimeMinutes = moment.duration($scope.shift.EndTime).asMinutes();
                var _breakStartTimeMinutes = moment.duration($scope.shift.BreakStartTime).asMinutes();
                var _breakEndTimeMinutes = moment.duration($scope.shift.BreakEndTime).asMinutes();
                if (_breakStartTimeMinutes < _startTimeMinutes) {
                    $scope.shift.BreakStartTime = '';
                    addNotification('Error','Break Start Time cannnot be less then Shift Start Time!','error');
                }
                if (_breakStartTimeMinutes > _endTimeMinutes) {
                    $scope.shift.BreakStartTime = '';
                    addNotification('Error', 'Break Start Time cannnot be greater then Shift End Time!', 'error');
                }
                if (_breakEndTimeMinutes < _startTimeMinutes) {
                    $scope.shift.BreakEndTime = '';
                    addNotification('Error', 'Break End Time cannnot be less then Shift Start Time!', 'error');
                }
                if (_breakEndTimeMinutes > _endTimeMinutes) {
                    $scope.shift.BreakEndTime = '';
                    addNotification('Error', 'Break End Time cannnot be greater then Shift End Time!', 'error');
                }
            }

            
        }

        function isDropDownsValid(frm, model) {
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