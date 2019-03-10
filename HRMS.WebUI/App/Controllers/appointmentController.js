(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('appointmentController', appointmentController);

    appointmentController.$inject = ['$scope', '$location', 'appointmentService', 'companyService', 'employeeService', 'designationService', ];

    function appointmentController($scope, $location, appointmentService, companyService, employeeService, designationService) {

        /////////////////////////// On Load ////////////////////////////
        if (window.location.href.toLowerCase().indexOf('participant') > -1) {
            loadParticipants();
        }
        else {
            loadCompanies();
        }
        clearDropDowns();
        

        ////////////////////////// Appointment /////////////////////////
        var isUpdateDataTable = false;
        var tblAppointment;
        $scope.appointment = {
            AppointmentID: 0,
            AppointmentName: '',
            StartTime: undefined,
            EndTime: undefined,
            Conclusion: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.appointment.AppointmentName = '';
            $scope.appointment.Remarks = '';
            $scope.selectedEmployeeName = 'Select Employee';
            $scope.selectedDesignationName = 'Select Designation';
            $scope.selectedCompanyName = 'Select Company';
            $('#mdlAppointment').modal("show");
            angular.forEach($scope.frmAppointment.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        function loadAppointmentWithOutParticipants() {
            appointmentService.getAppointmentWithOutParticipants().then(
            function (response) {
                var appointments = new Array();
                for (var i = 0; i < response.length; i++) {
                    appointments.push({
                        'AppointmentID': response[i].AppointmentID,
                        'AppointmentName': response[i].AppointmentName,
                        'AppointmentDate': ToJavaScriptDate( response[i].AppointmentDate),
                        'StartTime': TimespanToString( response[i].StartTime),
                        'EndTime': TimespanToString( response[i].EndTime),
                    });
                }
                $scope.appointments = appointments;
            },
            function (data) {
             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
            });


        }
        function loadAppointments() {

            appointmentService.getAllAppointments().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblAppointment')) {
                               $('#tblAppointment').DataTable().destroy();
                           }
                           tblAppointment = $('#tblAppointment').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "AppointmentID" },
                                    { "data": "AppointmentName" },
                                    { "data": "Remarks" },
                                    { "data": "AppointmentDate" },
                                    { "data": "StartTime" },
                                    { "data": "EndTime" },
                                    { "data": "CompanyID" },
                                    { "data": "EmployeeID" }
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
                                            return TimespanToString(data);
                                        },
                                        "targets": 4
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return TimespanToString(data);
                                        },
                                        "targets": 5
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getCompanyById(data);
                                        },
                                        "targets": 6
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getEmployeesById(data);
                                        },
                                        "targets": 7
                                    },
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                           
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        $('#tblAppointment').on('click', 'tbody tr i.edit', function () {
            var rowData = tblAppointment.row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.appointment.AppointmentID = rowData.AppointmentID;
                    $scope.appointment.AppointmentName = rowData.AppointmentName;
                    $scope.appointment.Conclusion = rowData.Conclusion;
                    $scope.appointment.AppointmentDate = ToJavaScriptDate(rowData.AppointmentDate);
                    $scope.appointment.StartTime = TimespanToString(rowData.StartTime);
                    $scope.appointment.EndTime = TimespanToString(rowData.EndTime);
                    $scope.appointment.CompanyID = rowData.CompanyID;
                    $scope.appointment.EmployeeID = rowData.EmployeeID;
                    $scope.appointment.DesignationID = rowData.DesignationID;
                    $scope.selectedCompanyName = getCompanyById(rowData.CompanyID);
                    $scope.selectedEmployeeName = getEmployeesById(rowData.EmployeeID);
                    $scope.selectedDesignationName = rowData.AppointmentName;
                    $scope.appointment.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlAppointment').modal("show");
            }
        });
        $('#tblAppointment').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.appointment.AppointmentID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlAppointmentDelete').modal("show");
        });
        $scope.createAppointment = function () {
            if (isDropDownsValid($scope.frmAppointment, $scope.appointment)) {
                $scope.$parent.isNameExist('Appointment', 0, '', $scope.appointment.AppointmentName + ':' + $scope.appointment.Remarks).then(function(response){
                    if (response.data) addNotification('Error', 'Appointment with same name and description already exists!', 'error');
                    else {
                        $scope.appointment.AppointmentDate = formatDateYYYYmmDD($scope.appointment.AppointmentDate);
                        appointmentService.createAppointment($scope.appointment).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Appointment!', 'success');
                                $('#mdlAppointment').modal("hide");
                                loadAppointments();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlAppointment').modal("hide");
                            });
                        }
                },
                    function (response) {
                        if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlAppointment').modal("hide");
                    });
                }
        };

        $scope.updateAppointment = function () {
            if (isDropDownsValid($scope.frmAppointment, $scope.appointment)) {
                $scope.$parent.isNameExist('Appointment', $scope.appointment.AppointmentID, '', $scope.appointment.AppointmentName + ':' + $scope.appointment.Remarks).then(function (response) {
                    if (response.data) addNotification('Error', 'Appointment with same name and description already exists!', 'error');
                    else {
                        $scope.appointment.AppointmentDate = formatDateYYYYmmDD($scope.appointment.AppointmentDate);
                        appointmentService.updateAppointment($scope.appointment).then(
                           function (response) {
                               addNotification('Success', 'Record is successfully updated!', 'success');
                               $('#mdlAppointment').modal("hide");
                               loadAppointments();
                           },
                         function (data) {
                          if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                             $('#mdlAppointment').modal("hide");
                         });
                    }
                }
                , function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlAppointment').modal("hide");
                });
            }
        };

        $scope.deleteAppointment = function () {
            appointmentService.deleteAppointment($scope.appointment.AppointmentID).then(
                function (response) {
                    isUpdateDataTable = true;
                    loadAppointments();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };

        $scope.dateChange = function () {
            try {
                if (new Date(formatDateMMddYYYY( $scope.appointment.AppointmentDate)) < new Date()) {
                    addNotification('Error', 'Appointment Date cannot be less than Current Date!', 'error');
                }
            }
            catch (e) { }
        };

        $scope.timeChange = function () {
            timeChange();
        };

        function timeChange() {
            if ($scope.appointment.StartTime != '00:00' && $scope.appointment.EndTime != '00:00' && $scope.appointment.StartTime != undefined && $scope.appointment.EndTime != undefined) {
                var _timeOut = moment($scope.appointment.EndTime, "HH:mm:ss");
                var _timeIn = moment($scope.appointment.StartTime, "HH:mm:ss");
                var miliseconds = _timeOut.diff(_timeIn);
                if (miliseconds < 0) {
                    $scope.appointment.EndTime = undefined;
                    addNotification('Error', 'The Start Time cannot be greater than End Time!', 'error');
                }
                else if (miliseconds < 600000) {
                    $scope.appointment.EndTime = undefined;
                    addNotification('Warning', 'The appointment cannot be less than 10 mint!', 'warning');
                }
            }
        }
        function loadCompanies() {
            companyService.getAllCompanies().then(
                  function (response) {
                      $scope.companies = response;
                      loadEmployees();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlAppointment').modal("hide");
                });
        }
        function loadEmployees() {
            employeeService.getAllEmployees().then(
                  function (response) {
                      $scope.employees = response;
                      if (window.location.href.toLowerCase().indexOf('participant') > -1) {
                          loadAppointmentWithOutParticipants();
                      }
                      else {
                          loadAppointments();
                      }
                  },
               function (data) {
                   if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                   $('#mdlAppointment').modal("hide");
               });
        }
        function loadDesignations() {
            designationService.getAllDesignations().then(
                  function (response) {
                      $scope.designations = response;
                      loadEmployees();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlAppointment').modal("hide");
                });
        }
        function loadParticipants() {
           
            appointmentService.getAllParticipants().then(
                  function (response) {
                      $scope.participants = response;
                      loadEmployees();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlAppointment').modal("hide");
                });
        }
        function getAppointmentById(Id) {
            var _appointment;
            for (var i = 0; i < $scope.appointments.length; i++) {
                if ($scope.appointments[i].AppointmentID === Id) {
                    _appointment = $scope.appointments[i];
                    break;
                }
            }
            return _appointment;
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
                if ($scope.employees[i].EmployeeID === Id) {
                    _employeeName = $scope.employees[i].EmployeeName
                    break;
                }
            }
            return _employeeName;
        }
        function getDesignationById(Id) {
            var _designationName;
            for (var i = 0; i < $scope.designations.length; i++) {
                if ($scope.designations[i].DesignationID === Id) {
                    _designationName = $scope.designations[i].DesignationName
                    break;
                }
            }
            return _designationName;
        }
        $scope.setCompany = function (ID, Name) {
            $scope.appointment.CompanyID = ID;
            $scope.selectedCompanyName = Name;
        }
        $scope.setAppointment = function (ID) {
            $('.participant-list ul').html('');
            $('.checkbox-container input[type=checkbox]').prop('checked',false);
            $('.checkbox-container').removeClass('checked').addClass('unchecked');
            $scope.selectedParticipants = new Array();

            for (var i = 0; i < $scope.participants.length; i++) {
                if ($scope.participants[i].AppointmentID == ID) {
                    addParticipantToList($scope.participants[i].EmployeeID, $('.checkbox-container[data-employeeID=' + $scope.participants[i].EmployeeID + ']').parents('a'));
                }
            }
            var _appointment = getAppointmentById(ID);
            if (_appointment != undefined) {
                $scope.selectedAppointmentName = _appointment.AppointmentName + ' - ' + _appointment.AppointmentDate + ' - ' + _appointment.StartTime + ' - ' + _appointment.EndTime;
            }
            $scope.participant.AppointmentID = ID;
           
        }
        $scope.setEmployee = function (ID, Name) {
            $scope.appointment.EmployeeID = ID;
            $scope.selectedEmployeeName = Name;
        }
        $scope.setDesignation = function (ID, Name) {
            $scope.appointment.DesignationID = ID;
            $scope.selectedDesignationName = Name;
        }

        ////////////////////////// Participants /////////////////////////
        $scope.participant = {
            AppointmentID : 0
        };
        $scope.participants = new Array();
        $scope.selectedParticipants = new Array();
        $scope.updateParticipant = function () {
            var _participants = new Array();
            if ($scope.selectedParticipants.length > 0) {
                for (var i = 0; i < $scope.selectedParticipants.length; i++) {
                    _participants.push({'EmployeeID' : $scope.selectedParticipants[i],'AppointmentID': $scope.participant.AppointmentID});
                }
            }
            else {
                _participants.push({ 'EmployeeID': 0, 'AppointmentID': $scope.participant.AppointmentID });
            }
                appointmentService.updateParticipant(_participants).then(
                    function (response) {
                        if (response.data == true) {
                            addNotification('Success', 'Participants successfully updated!', 'success');
                            $('.participant-list ul').html('');
                            //var _totalParticipants = $scope.selectedParticipants.length;
                            //for (var i = 0; i < _totalParticipants; i++) {
                            //    removeParticipantFromList($scope.selectedParticipants[i]);
                            //}
                            clearDropDowns();
                            $scope.participant.AppointmentID = 0;
                            loadParticipants();
                        }
                        else {
                            var _employees = new Array();
                            for (var i = 0; i < response.data.length; i++) {
                                var appointment = getAppointmentById(response.data[i].AppointmentID);
                                _employees.push((i + 1) + ' - ' + getEmployeesById(response.data[i].EmployeeID) + ' (' + appointment.AppointmentName + ' - ' + appointment.StartTime + ' - ' + appointment.EndTime + ')' + '\n');
                                removeParticipantFromList(response.data[i].EmployeeID);
                            }
                            addNotification('Warning', 'Following Employee(s) are busy with another Appointment! \n '+ _employees, 'warning');
                        } 
                    },
                 function (data) {
                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                 });
        };
        $scope.toggleParticipant = function(employeeID,employeeName){
            var _anchor = $('.checkbox-container[data-employeeID=' + employeeID + ']').parents('a');
            if (_anchor.find('input[type=checkbox]').is(':checked')) {
                removeParticipantFromList(employeeID);
            }
            else{
                addParticipantToList(employeeID, _anchor)
            }
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
            $('.participant-list ul li').each(function (k,elm) {
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


        function clearDropDowns() {
            $scope.selectedEmployeeName = 'Select Employee';
            $scope.selectedAppointmentName = 'Select Appointment';
        }

        function isDropDownsValid(frm, model) {
            var _result = true;
            if (model.CompanyID == undefined) {
                frm.txtCompanyID.$dirty = true;
                _result = false;
            }
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