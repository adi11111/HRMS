(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('userController', userController);

    userController.$inject = ['$scope', '$location', 'userService','employeeService'];

    function userController($scope, $location, userService, employeeService) {

        var url = window.location.href.toLowerCase();
        if (url.indexOf('interface') > -1) {
            loadInterfaces();
        }
        else if (url.indexOf('useraccess') == -1) {
            loadUserRoles();
        }
        else {
            loadUserRoles();
        }

        ///////////////////////////////// User ///////////////////////////////////


        var isUpdateUserDataTable = false;
        var tblUser;
        $scope.user = {
            UserID: 0,
            UserName: '',
            Password: '',
            UserRoleID: '',
            Remarks: ''
        }
        $scope.isCreateUser = false;
       
        $scope.triggerCreateUser = function () {
            $scope.isCreateUser = true;
            $scope.user.UserName = '';
            $scope.user.Password = '';
            $scope.user.UserRoleID = undefined;
            $scope.user.EmployeeID = undefined;
            $scope.user.Remarks = '';
            $('#mdlUser').modal("show");
            angular.forEach($scope.frmUser.$error.required, function (field) {
                field.$dirty = false;
            });
        }

        function loadUsers() {

            userService.getAllUser().then(
                   function (response) {
                       clearDropDowns();
                           if ($.fn.dataTable.isDataTable('#tblUser')) {
                               $('#tblUser').DataTable().destroy();
                           }
                           tblUser = $('#tblUser').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "UserID" },
                                    { "data": "UserName" },
                                    { "data": "Password" },
                                    { "data": "EmployeeID" },
                                    { "data": "UserRoleID" },
                                    { "data": "Remarks" },
                               ],
                               "columnDefs": [
                                    {
                                        "render": function (data, type, row) {
                                            return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                        },
                                        "targets": 0
                                    },
                                    { className: "hide_column", "targets": [3] },
                                    {
                                        "render": function (data, type, row) {
                                            return getEmployeeById (data);
                                        },
                                        "targets": 3
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getUserRoleById (data);
                                        },
                                        "targets": 4
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
        $('#tblUser').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblUser').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.user.UserID = rowData.UserID;
                    $scope.user.UserName = rowData.UserName;
                    $scope.user.Password = rowData.Password;
                    $scope.user.UserRoleID = rowData.UserRoleID;
                    $scope.user.EmployeeID = rowData.EmployeeID;
                    $scope.user.Remarks = rowData.Remarks;
                    $scope.selectedUserRoleName = getUserRoleById(rowData.UserRoleID);
                    $scope.selectedEmployeeName = getEmployeeById(rowData.EmployeeID);
                    $scope.isCreateUser = false;
                });
                $('#mdlUser').modal("show");
            }
        });
        $('#tblUser').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.user.UserID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlUserDelete').modal("show");
        });
        $scope.createUser = function () {
            if (isDropDownsValid($scope.frmUser, $scope.user)) {
                $scope.$parent.isNameExist('User', 0, '', $scope.user.UserName).then(function(response){
                    if(response.data)    addNotification('Error', 'User with same name already exists!', 'error');
                    else{
                        userService.createUser($scope.user).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Users!', 'success');
                                $('#mdlUser').modal("hide");
                                loadUsers();
                            },
                            function (data) {
                              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlUser').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlUser').modal("hide");
                });
            }
        };

        $scope.updateUser = function () {
            if (isDropDownsValid($scope.frmUser, $scope.user)) {
                $scope.$parent.isNameExist('User', $scope.user.UserID, '', $scope.user.UserName).then(function (response) {
                    if (response.data) addNotification('Error', 'User with same name already exists!', 'error');
                    else {
                        userService.updateUser($scope.user).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlUser').modal("hide");
                                loadUsers();
                            },
                            function (data) {
                              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlUser').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlUser').modal("hide");
                });
            }
        };

        $scope.deleteUser = function () {
            userService.deleteUser($scope.user.UserID).then(
                function (response) {
                    addNotification('Success', 'Record is successfully deleted!', 'success');
                    $('#mdlUserDelete').modal("hide");
                    loadUsers();
                },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlUserDelete').modal("hide");
                });
        };

        $scope.setUserRole = function (ID, Name) {
            $scope.user.UserRoleID = ID;
            $scope.selectedUserRoleName = Name;
        }
        $scope.setEmployee= function (ID, Name) {
            $scope.user.EmployeeID = ID;
            $scope.selectedEmployeeName = Name;
        }
        function getUserRoleById(Id) {
            var _userRoleName = '-';
            for (var i = 0; i < $scope.userRoles.length; i++) {
                if ($scope.userRoles[i].UserRoleID === Id) {
                    _userRoleName = $scope.userRoles[i].RoleName
                    break;
                }
            }
            return _userRoleName;
        }
        function loadEmployees() {
            employeeService.getAllEmployees().then(
                  function (response) {
                      $scope.employees = response;
                      loadUsers();
                  },
                function (data) {
                    $scope.message = data.error_description;
                });
        }
        function getEmployeeById(Id) {
            var _employeeName = '-';
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].EmployeeID === Id) {
                    _employeeName = $scope.employees[i].EmployeeName
                    break;
                }
            }
            return _employeeName;
        }


        ////////////////////////////////// User Role /////////////////////////////////

        var isUpdateDataTable = false;
        var tblUserRole;
        $scope.selectedRoleId;
        $scope.userRole = {
            UserRoleID: 0,
            RoleName: '',
            Remarks: ''
        }
        $scope.userAccessDetail = new Array();
        $scope.isCreate = false;

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.userRole.RoleName = '';
            $scope.userRole.Remarks = '';
            $('#mdlUserRole').modal("show");
            angular.forEach($scope.frmUserRole.$error.required, function (field) {
               // field.$valid = true;
                field.$dirty = false;
            });
        }
        
        function loadUserRoles() {

            userService.getAllUserRoles().then(
                   function (response) {
                       if ((url.indexOf('userrole') > -1)) {
                           if ($.fn.dataTable.isDataTable('#tblUserRole')) {
                               $('#tblUserRole').DataTable().destroy();
                           }
                           tblUserRole = $('#tblUserRole').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "UserRoleID" },
                                    { "data": "RoleName" },
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
                      
                       $scope.userRoles = response;
                       if (url.indexOf('useraccess') == -1 && url.indexOf('userrole') == -1) {
                           loadEmployees();
                       }
                       else if (url.indexOf('useraccess') > -1) {
                           loadInterfaces();
                       }
                   },
                function (data) {
                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        $('#tblUserRole').on('click', 'tbody tr i.edit', function () {
            var rowData = tblUserRole.row($(this).parents('tr')).data();
            $scope.$apply(function () {
                $scope.userRole.UserRoleID = rowData.UserRoleID;
                $scope.userRole.RoleName = rowData.RoleName;
                $scope.userRole.Remarks = rowData.Remarks;
                $scope.isCreate = false;
            });
            $('#mdlUserRole').modal("show");
        });
        $('#tblUserRole').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.userRole.UserRoleID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlUserRoleDelete').modal("show");
        });
        $scope.createUserRole = function () {
            if (isFormValid($scope.frmUserRole)) {
                $scope.$parent.isNameExist('User', 0, 'role', $scope.userRole.RoleName).then(function(response){
                    if(response.data)   addNotification('Error', 'User Role with same name already exists!', 'error');
                    else{
                        userService.createUserRole($scope.userRole).then(
                            function (response) {
                                addNotification('Success', 'New record is added in User Roles!', 'success');
                                $('#mdlUserRole').modal("hide");
                                loadUserRoles();
                            },
                            function (data) {
                              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlUserRole').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlUserRole').modal("hide");
                });
            }
        };

        $scope.updateUserRole = function () {
            if (isFormValid($scope.frmUserRole)) {
                $scope.$parent.isNameExist('User', $scope.userRole.UserRoleID, 'role', $scope.userRole.RoleName).then(function (response) {
                    if (response.data) addNotification('Error', 'User Role with same name already exists!', 'error');
                    else {
                        userService.updateUserRole($scope.userRole).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlUserRole').modal("hide");
                                loadUserRoles();
                            },
                            function (data) {
                              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else {addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlUserRole').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else {addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlUserRole').modal("hide");
                });
            }
        };

        $scope.deleteUserRole = function () {
            userService.deleteUserRole($scope.userRole.UserRoleID).then(
                function (response) {
                    loadUserRoles();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };


        /////////////////////// User Access ////////////////////////////////////////
        $scope.userAccess = {
            UserRoleID : undefined
        };

        function loadUserAccess() {
            
            userService.getAllUserAccessByRoleId($scope.userAccess.UserRoleID).then(
                  function (response) {
                      $scope.userAccesses = response.data;
                      DrawInterfaceTable();
                     // getUserAccessByRoleId($scope.selectedRoleId);
                  },
                function (data) {
                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadUserEvents() {
            userService.getUserEvents().then(
                  function (response) {
                      $scope.userEvents = response;
                      loadInterfaces();
                      //getUserAccessByRoleId($scope.selectedRoleId);
                  },
                function (data) {
                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        /////////////////////// Interface /////////////////////////////////////////

        var tblInterface;
        $scope.interface = {
            InterfaceID: 0,
            InterfaceName: '',
            ParentInterfaceID: 0,
            Remarks: ''
        }
        $scope.isCreateInterface = false;
        $scope.message = "";
        $scope.triggerCreateInterface = function () {
            $scope.isCreateInterface = true;
            $scope.interface.InterfaceName = '';
            $scope.interface.ParentInterfaceID = 0;
            $scope.interface.Remarks = '';
            $scope.selectedParentInterfaceName = 'Select Parent Interface';
            $('#mdlInterface').modal("show");
        }

        function loadInterfaces() {

            userService.getAllInterface().then(
                   function (response) {
                       $scope.interfaces = response;
                       if (window.location.href.toLowerCase().indexOf('access') > -1) {
                           if ($scope.userAccess.UserRoleID == undefined) {
                               $scope.userAccess.UserRoleID = $scope.userRoles[0].UserRoleID;
                               $scope.selectedUserRoleName = $scope.userRoles[0].RoleName;
                           }
                           loadUserAccess();
                       }
                       else {
                           getInterfacesWithoutParent();
                           if ($.fn.dataTable.isDataTable('#tblInterface')) {
                               $('#tblInterface').DataTable().destroy();
                           }
                           tblInterface = $('#tblInterface').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "InterfaceID" },
                                    { "data": "InterfaceName" },
                                    { "data": "ParentInterfaceID" },
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
                                            if (data == 0) {
                                                return ' -';
                                            }
                                            else {
                                                return getInterfaceById(data);
                                            }
                                        },
                                        "targets": 2
                                    }
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                           if (url.indexOf('useraccess') > -1) {
                               DrawInterfaceTable();
                           }
                               $scope.selectedParentInterfaceName = 'Select Parent Interface';
                        }
                   },
                function (data) {
                    $scope.message = data.error_description;
                });

        }
        $('#tblInterface').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblInterface').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.interface.InterfaceID = rowData.InterfaceID;
                    $scope.interface.InterfaceName = rowData.InterfaceName;
                    $scope.interface.ParentInterfaceID = rowData.ParentInterfaceID;
                    $scope.interface.Remarks = rowData.Remarks;
                    var _parentInterfaceName = getInterfaceById(rowData.ParentInterfaceID);
                    if ($.trim(_parentInterfaceName) == '') {
                        $scope.selectedParentInterfaceName = 'Select Parent Interface';
                    }
                    else {
                        $scope.selectedParentInterfaceName = _parentInterfaceName;
                    }
                    $scope.isCreateInterface = false;
                });

                $('#mdlInterface').modal("show");
            }
        });
        $('#tblInterface').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.interface.InterfaceID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlInterfaceDelete').modal("show");
        });

        //$(document).on('click', 'input[type=checkbox]', function () {
        //    if ($(this).is(':checked')) {
        //        $(this).addClass('checked');
        //    }
        //    else {
        //        $(this).removeClass('checked');
        //    }
        //});

        $('#tblUserAccess tbody').on('click', 'tr .checkbox-container', function () {
            //get back data
            var _checkbox = $(this).find('input[type="checkbox"]');
            //var _index = _checkbox.
            var _interfaceId = _checkbox.parents('tr').find('td:first').data('interfaceid');
            // if (_checkbox.is(':checked')) {
            if ($(this).hasClass('checked') == false) {
                $scope.userAccessDetail.push({
                    'UserRoleID': $scope.userAccess.UserRoleID,
                    //'InterfaceID': _tr[0],
                     'InterfaceID': _interfaceId ,
                    'EventAccess': _checkbox.val()
                });
                $(this).addClass('checked');
                //$('#tblUserAccess tbody tr').each(function () {
                    

                //});
                 //_checkbox.attr('checked','checked');
            }
            else {
                //_checkbox.removeAttr('checked');
                $(this).removeClass('checked');
                 removeUserAccess(_interfaceId);
            }
            //var _index = _checkbox.parents('tr').find(_checkbox.parent('td')).index();
            //////var rowData = tblUserRole.row($(this).parents('tr')).data();
            //var row = $('#tblUserAccess').DataTable().row(_checkbox.parents('tr'));
            //////$('#tblUserAccess').DataTable().row(this).data(row).draw();
            //$('#tblUserAccess').DataTable().cell(row, _index + 1).data(_checkbox[0].outerHTML).draw();


            //console.log(row.data());
        });

        $scope.createInterface = function () {
            $scope.$parent.isNameExist('User', 0, 'interface', $scope.interface.InterfaceName).then(function(response){
                if(response.data)   addNotification('Error', 'Interface with same name already exists!', 'error');
                else{
                    userService.createInterface($scope.interface).then(
                        function (response) {
                            addNotification('Success', 'New record is added in Interface!', 'success');
                            $('#mdlInterface').modal("hide");
                            loadInterfaces();
                        },
                        function (data) {
                          if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                            $('#mdlInterface').modal("hide");
                        });
                        }
                    }, function (response) {
                        if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlInterface').modal("hide");
                    });
        };

        $scope.updateInterface = function () {
            $scope.$parent.isNameExist('User', $scope.interface.InterfaceID, 'interface', $scope.interface.InterfaceName).then(function (response) {
                if (response.data) addNotification('Error', 'Interface with same name already exists!', 'error');
                else {
                    userService.updateInterface($scope.interface).then(
                        function (response) {
                            addNotification('Success', 'Record is successfully updated!', 'success');
                            $('#mdlInterface').modal("hide");
                            loadInterfaces();
                        },
                        function (data) {
                          if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                            $('#mdlInterface').modal("hide");
                        });
                }
            }, function (response) {
                if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                $('#mdlInterface').modal("hide");
            });
        };

        $scope.deleteInterface = function () {
            userService.deleteInterface($scope.interface.InterfaceID).then(
                function (response) {
                    loadInterfaces();
                },
             function (data) {
               if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };
        $scope.setUserAccessByRole = function (roleId,Name) {
            $scope.userAccess.UserRoleID = roleId;
            $scope.selectedUserRoleName = Name;
            //loadUserRoles();
            //loadUserEvents();
            loadUserAccess();
        }
        $scope.setParentInterface = function (ID, Name) {
            $scope.interface.ParentInterfaceID = ID;
            $scope.selectedParentInterfaceName = Name;
        }

        $scope.updateUserAccess = function () {
            var _userAccess = new Array();
           // $('#tblUserAccess').DataTable().rows().every(function (k) {
           //     //console.log(k);
           //// $('#tblUserAccess tbody tr').each(function () {
           //     var _tr = this.data();
           //     $.each(_tr, function (i) {
           //         if (i > 2) {
           //             var _td = this;
           //             //var _td = $(this).find('input[type=checkbox]');
           //             if (_td.length > 0) {
           //                 if ($(_td).is(':checked')) {
           //                     _userAccess.push({
           //                         'UserRoleID': $scope.userAccess.UserRoleID,
           //                         'InterfaceID': _tr[0],
           //                        // 'InterfaceID': _td.parents('tr').find('td:first').data('interfaceid'),
           //                         'EventAccess': $(_td).val()
           //                     });
           //                 }
           //             }
           //         }
                    
           //     });
                //if (_elm.find('.add').prop('checked')) {
                //    _userAccess.push({
                //        'UserRoleID': $scope.userAccess.UserRoleID,
                //        'InterfaceID': _elm.find('td:first').data('interfaceId'),
                //        'EventAccess': _elm.find('.add').val()
                //    });
                //}
                //if (_elm.find('.edit').prop('checked')) {
                //    _userAccess.push({
                //        'UserRoleID': $scope.userAccess.UserRoleID,
                //        'InterfaceID': _elm.find('td:first').data('interfaceId'),
                //        'EventAccess': _elm.find('.edit').val()
                //    });
                //}
                //if (_elm.find('.delete').prop('checked')) {
                //    _userAccess.push({
                //        'UserRoleID': $scope.userAccess.UserRoleID,
                //        'InterfaceID': _elm.find('td:first').data('interfaceId'),
                //        'EventAccess': _elm.find('.delete').val()
                //    });
                //}
                //if (_elm.find('.view').prop('checked')) {
                //    _userAccess.push({
                //        'UserRoleID': $scope.userAccess.UserRoleID,
                //        'InterfaceID': _elm.find('td:first').data('interfaceId'),
                //        'EventAccess': _elm.find('.view').val()
                //    });
                //}
                //if (_elm.find('.report').prop('checked')) {
                //    _userAccess.push({
                //        'UserRoleID': $scope.userAccess.UserRoleID,
                //        'InterfaceID': _elm.find('td:first').data('interfaceId'),
                //        'EventAccess': _elm.find('.report').val()
                //    });
                //}
                
            //});
            userService.createUserAccess($scope.userAccessDetail).then(
               function (response) {
                   addNotification('Success', 'User Access successfully updated!', 'success');
                   loadInterfaces();
               },
            function (data) {
                $scope.message = data.error_description;
            });
        }

        $scope.switchChecked = function (elm) {
            var _checkbox = $('#' + elm);//.find('input[type="checkbox"]');

            var index = _checkbox.parents('th').index() + 1;
            //var checked = _checkbox.prop('checked');
            var checked = _checkbox.parent('div').hasClass('checked');
            var table = $('#tblUserAccess').DataTable();
            if (checked) {
                _checkbox.parent('div').removeClass('checked');
                table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var data = this.data();
                    var _value = $(data[index]).find('input[type="checkbox"]')[0].value;
                    removeUserAccessByEvent(_value);
                });
            }
            else {
                _checkbox.parent('div').addClass('checked');
            }
            table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var data = this.data();
                var _value = $(data[index]).find('input[type="checkbox"]')[0].value;
                if (checked) {
                    data[index] = '<div class="icheckbox_flat-blue checkbox-container"> <input type="checkbox" value="' + _value + '"  class="flat" /> <ins class="iCheck-helper"></ins></div>';
                    removeUserAccessByEvent(_value);
                }
                else {
                    data[index] = '<div class="icheckbox_flat-blue checkbox-container checked"> <input type="checkbox" checked="checked" value="' + _value + '"  class="flat" /> <ins class="iCheck-helper"></ins></div>';
                    $scope.userAccessDetail.push({
                        'UserRoleID': $scope.userAccess.UserRoleID,
                        //'InterfaceID': _tr[0],
                        'InterfaceID': data[0],
                        'EventAccess': _value
                    });
                }
                this.data(data);
            });
            //$('#tblUserAccess tbody tr').each(function () {
            //    $(this).find('td:eq('+index+') > input[type=checkbox]').prop('checked',checked);
            //});
        }

        function DrawInterfaceTable() {
            var _tbody = $('#tblUserAccess tbody');
            $scope.userAccessDetail = new Array();
            $('#tblUserAccess tbody').html('');
            if ($.fn.dataTable.isDataTable('#tblUserAccess')) {
                $('#tblUserAccess').DataTable().clear();
                $('#tblUserAccess').DataTable().destroy();
            }
            var _parentInterfaces = getAllParentInterfaces();
            var _totalAdd = 0;
            var _totalEdit = 0;
            var _totalDelete = 0;
            var _totalView = 0;
            var _totalReport = 0;
            for (var i = 0; i < $scope.interfaces.length; i++) {
                if (_parentInterfaces.indexOf($scope.interfaces[i].InterfaceID) == -1) {
                    var isAllowAdd = '';
                    var isAllowEdit = '';
                    var isAllowDelete = '';
                    var isAllowView = '';
                    var isAllowReport = '';
                    var _userAccessEvents = getUserAccessEventsByInterfaceId($scope.interfaces[i].InterfaceID);
                    if (_userAccessEvents.indexOf($scope.userEvents.AllowAdd) > -1) {
                        $scope.userAccessDetail.push({
                            'UserRoleID': $scope.userAccess.UserRoleID,
                            //'InterfaceID': _tr[0],
                            'InterfaceID': $scope.interfaces[i].InterfaceID,
                            'EventAccess': $scope.userEvents.AllowAdd
                        });
                        _totalAdd++;
                        isAllowAdd = 'checked="checked"';
                    }
                    if (_userAccessEvents.indexOf($scope.userEvents.AllowEdit) > -1) {
                        $scope.userAccessDetail.push({
                            'UserRoleID': $scope.userAccess.UserRoleID,
                            //'InterfaceID': _tr[0],
                            'InterfaceID': $scope.interfaces[i].InterfaceID,
                            'EventAccess': $scope.userEvents.AllowEdit
                        });
                        _totalEdit++;
                        isAllowEdit = 'checked="checked"';
                    }
                    if (_userAccessEvents.indexOf($scope.userEvents.AllowDelete) > -1) {
                        $scope.userAccessDetail.push({
                            'UserRoleID': $scope.userAccess.UserRoleID,
                            //'InterfaceID': _tr[0],
                            'InterfaceID': $scope.interfaces[i].InterfaceID,
                            'EventAccess': $scope.userEvents.AllowDelete
                        });
                        _totalDelete++;
                        isAllowDelete = 'checked="checked"';
                    }
                    if (_userAccessEvents.indexOf($scope.userEvents.AllowView) > -1) {
                        $scope.userAccessDetail.push({
                            'UserRoleID': $scope.userAccess.UserRoleID,
                            //'InterfaceID': _tr[0],
                            'InterfaceID': $scope.interfaces[i].InterfaceID,
                            'EventAccess': $scope.userEvents.AllowView
                        });
                        _totalView++;
                        isAllowView = 'checked="checked"';
                    }
                    if (_userAccessEvents.indexOf($scope.userEvents.AllowReport) > -1) {
                        $scope.userAccessDetail.push({
                            'UserRoleID': $scope.userAccess.UserRoleID,
                            //'InterfaceID': _tr[0],
                            'InterfaceID': $scope.interfaces[i].InterfaceID,
                            'EventAccess': $scope.userEvents.AllowReport
                        });
                        _totalReport++;
                        isAllowReport = 'checked="checked"';
                    }
                    var _tr = '<tr><td>' + $scope.interfaces[i].InterfaceID + '</td><td data-interfaceid="' + $scope.interfaces[i].InterfaceID + '">' + getInterfaceById($scope.interfaces[i].ParentInterfaceID) +
                        '</td><td> ' + getInterfaceById($scope.interfaces[i].InterfaceID) + '</td>' +
                        '<td><div class="icheckbox_flat-blue checkbox-container ' + isAllowAdd.split('=')[0] + ' "> <input type="checkbox" ' + isAllowAdd + ' value="' + $scope.userEvents.AllowAdd + '" class="flat"  /><ins class="iCheck-helper"></ins></div> </td>' +
                        '<td><div class="icheckbox_flat-blue checkbox-container ' + isAllowEdit.split('=')[0] + ' "> <input type="checkbox" ' + isAllowEdit + ' value="' + $scope.userEvents.AllowEdit + '"   class="flat"  /><ins class="iCheck-helper"></ins></div> </td>' +
                        '<td><div class="icheckbox_flat-blue checkbox-container ' + isAllowDelete.split('=')[0] + ' ">  <input type="checkbox" ' + isAllowDelete + ' value="' + $scope.userEvents.AllowDelete + '"   class="flat"  /><ins class="iCheck-helper"></ins></div> </td>' +
                        '<td><div class="icheckbox_flat-blue checkbox-container ' + isAllowView.split('=')[0] + ' "> <input type="checkbox" ' + isAllowView + ' value="' + $scope.userEvents.AllowView + '"   class="flat"  /><ins class="iCheck-helper"></ins></div> </td>' +
                        '<td><div class="icheckbox_flat-blue checkbox-container ' + isAllowReport.split('=')[0] + ' ">  <input type="checkbox" ' + isAllowReport + ' value="' + $scope.userEvents.AllowReport + '"  class="flat"  /><ins class="iCheck-helper"></ins></div> </td>' +
                        '</tr>'
                    _tbody.append(_tr);
                    //var row = _table.insertRow(-1);
                    //var cell1 = row.insertCell(0);
                    //var cell2 = row.insertCell(1);
                    //cell1.innerHTML =  getInterfaceById($scope.interfaces[i].ParentInterfaceID);
                    //cell2.innerHTML = getInterfaceById($scope.interfaces[i].InterfaceID);
                }
            }
            var _totalRecords = $('#tblUserAccess tbody tr').length;
            if (_totalAdd == _totalRecords) {
                $('#chkAllowAddAll').parent('div').addClass('checked');
                $('#chkAllowAddAll').prop('checked', true);
            }
            if (_totalEdit == _totalRecords) {
                $('#chkAllowEditAll').parent('div').addClass('checked');
                $('#chkAllowEditAll').prop('checked', true);
            }
            if (_totalDelete == _totalRecords) {
                $('#chkAllowDeleteAll').parent('div').addClass('checked');
                $('#chkAllowDeleteAll').prop('checked', true);
            }
            if (_totalView == _totalRecords) {
                $('#chkAllowViewAll').parent('div').addClass('checked');
                $('#chkAllowViewAll').prop('checked', true);
            }
            if (_totalReport == _totalRecords) {
                $('#chkAllowReportAll').parent('div').addClass('checked');
                $('#chkAllowReportAll').prop('checked', true);
            }
            // sortTable($('#tblUserAccess'), 'asc');
           
            $('#tblUserAccess').DataTable({
                "order": [[0, "asc"]],
                "columnDefs": [
                 { "visible": false, "targets": 0 }
                ]
            });
           // loadUserAccess();

        }
        function sortTable(table, order) {
            var asc = order === 'asc',
                tbody = table.find('tbody');

            tbody.find('tr').sort(function (a, b) {
                if (asc) {
                    return $('td:first', a).text().localeCompare($('td:first', b).text());
                } else {
                    return $('td:first', b).text().localeCompare($('td:first', a).text());
                }
            }).appendTo(tbody);
        }
        function getAllParentInterfaces() {
            var _parentInterfaces = new Array();
            for (var i = 0; i < $scope.interfaces.length; i++) {
                if ($scope.interfaces[i].ParentInterfaceID != 0) {
                    if (_parentInterfaces.indexOf($scope.interfaces[i].ParentInterfaceID) == -1) {
                        _parentInterfaces.push($scope.interfaces[i].ParentInterfaceID);
                    }
                }
            }
            return _parentInterfaces;
        }
        function getUserAccessEventsByInterfaceId(interfaceId) {
            var _userAccessEvent = new Array;
            for (var i = 0; i < $scope.userAccesses.length; i++) {
                if ($scope.userAccesses[i].InterfaceID == interfaceId) {
                    _userAccessEvent.push($scope.userAccesses[i].EventAccess);
                }
            }
            return _userAccessEvent;
        }
        function getInterfacesWithoutParent() {
            $scope.interfacesWithoutParent = new Array();
            for (var i = 0; i < $scope.interfaces.length; i++) {
                if ($scope.interfaces[i].ParentInterfaceID == 0) {
                    $scope.interfacesWithoutParent.push($scope.interfaces[i]);
                }
            }
        }
     //$scope.fruits =
     //      [{'name':'apple',status:false},
     //  {'name':'Mary',status:false},
     //  {'name':'Mike',status:false},
     //  {'name':'Adam',status:false},
     //  {'name':'Julie',status:false}]
     //   $scope.events = {
     //       AllowAdd : 1,
     //       AllowEdit : 2,
     //       AllowDelete : 3,
     //       AllowView : 4,
     //       AllowReport : 5

     //   };
        $scope.userEvents = {
            AllowAdd: 1,
            AllowEdit: 2,
            AllowDelete: 3,
            AllowView: 4,
            AllowReport: 5
        };


        function getUserAccessByRoleId(Id) {
            for (var i = 0; i < $scope.userAccesses.length; i++) {
                if ($scope.userAccesses[i].UserRoleID == Id) {

                }
            }
        }
        function getInterfaceById(Id) {
            var _interfaceName;
            for (var i = 0; i < $scope.interfaces.length; i++) {
                if ($scope.interfaces[i].InterfaceID === Id) {
                    _interfaceName = $scope.interfaces[i].InterfaceName
                    break;
                }
            }
            return _interfaceName;
        }
        function removeUserAccess(interfaceId) {
            for (var i = 0; i < $scope.userAccessDetail.length; i++) {
                if ($scope.userAccessDetail[i].InterfaceID == interfaceId) {
                    $scope.userAccessDetail.splice(i, 1);
                    break;
                }
            }
        }
        function removeUserAccessByEvent(event) {
            for (var i = 0; i < $scope.userAccessDetail.length; i++) {
                if ($scope.userAccessDetail[i].EventAccess == event) {
                    $scope.userAccessDetail.splice(i, 1);
                    break;
                }
            }
        }
       
        $scope.checkItems = function () {
            var i;
            for (i = 0; i < arr_to_be_checked.length; i++) {
                data[arr_to_be_checked[i]].checked = true;
            }
        };

        function clearDropDowns() {
            $scope.selectedUserRoleName = "Select User Role";
            $scope.selectedEmployeeName = "Select Employee";
        }

        function isDropDownsValid(frm, model) {
            var _result = true;
            if (model.UserRoleID == undefined) {
                frm.txtUserRoleID.$dirty = true;
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