(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('staffController', staffController);

    staffController.$inject = ['$scope', '$location', 'staffService'];

    function staffController($scope, $location, staffService) {
        var tblStaff;
        $scope.staff = {
            StaffID: 0,
            StaffName: '',
            Remarks: ''
        }
        $scope.isCreate = false;

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.staff.StaffName = '';
            $scope.staff.Remarks = '';
            $('#mdlStaff').modal("show");
            angular.forEach($scope.frmStaff.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        loadStaffs();
        function loadStaffs() {

            staffService.getAllStaffs().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblStaff')) {
                               $('#tblStaff').DataTable().destroy();
                           }
                           tblStaff = $('#tblStaff').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "StaffID" },
                                    { "data": "StaffName" },
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
                      
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }

        $('#tblStaff').on('click', 'tbody tr i.edit', function () {
            var rowData = tblStaff.row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.staff.StaffID = rowData.StaffID;
                    $scope.staff.StaffName = rowData.StaffName;
                    $scope.staff.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlStaff').modal("show");
            }
        });
        $('#tblStaff').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.staff.StaffID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlStaffDelete').modal("show");
        });
        $scope.createStaff = function () {
            if (isFormValid($scope.frmStaff)) {
                $scope.$parent.isNameExist('Staff', 0, '', $scope.staff.StaffName).then(function(response){
                    if(response.data)    addNotification('Error', 'Staff with same name already exists!', 'error');
                    else{
                        staffService.createStaff($scope.staff).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Staff!', 'success');
                                $('#mdlStaff').modal("hide");
                                loadStaffs();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlStaff').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlStaff').modal("hide");
                });
            }
        };
        
        $scope.updateStaff = function () {
            if (isFormValid($scope.frmStaff)) {
                $scope.$parent.isNameExist('Staff', $scope.staff.StaffID, '', $scope.staff.StaffName).then(function (response) {
                    if (response.data) addNotification('Error', 'Staff with same name already exists!', 'error');
                    else {
                        staffService.updateStaff($scope.staff).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlStaff').modal("hide");
                                loadStaffs();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlStaff').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlStaff').modal("hide");
                });
            }
        };

        $scope.deleteStaff = function () {
            staffService.deleteStaff($scope.staff.StaffID).then(
                function (response) {
                    loadStaffs();
                },
             function (data) {
              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };
    }
})();