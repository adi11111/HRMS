(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('departmentController', departmentController);

    departmentController.$inject = ['$scope', '$location', 'departmentService'];

    function departmentController($scope, $location, departmentService) {
        var isUpdateDataTable = false;
        var tblDepartment;
        $scope.department = {
            DepartmentID: 0,
            DepartmentName: '',
            Remarks: ''
        }
        $scope.isCreate = false;

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.department.DepartmentName = '';
            $scope.department.Remarks = '';
            $('#mdlDepartment').modal("show");
            angular.forEach($scope.frmDepartment.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        loadDepartments();
        function loadDepartments() {

            departmentService.getAllDepartments().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblDepartment')) {
                               $('#tblDepartment').DataTable().destroy();
                           }
                           tblDepartment = $('#tblDepartment').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "DepartmentID" },
                                    { "data": "DepartmentName" },
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
        $('#tblDepartment').on('click', 'tbody tr i.edit', function () {
            var rowData = tblDepartment.row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.department.DepartmentID = rowData.DepartmentID;
                    $scope.department.DepartmentName = rowData.DepartmentName;
                    $scope.department.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlDepartment').modal("show");
            }
        });
        $('#tblDepartment').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.department.DepartmentID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDepartmentDelete').modal("show");
        });
        $scope.createDepartment = function () {
            if (isFormValid($scope.frmDepartment)) {
                $scope.$parent.isNameExist('Department', 0, '', $scope.department.DepartmentName).then(function (response) {
                    if (response.data) addNotification('Error', 'Location with same name already exists!', 'error');
                    else {
                        departmentService.createDepartment($scope.department).then(
                               function (response) {
                                   addNotification('Success', 'New record is added in departments!', 'success');
                                   $('#mdlDepartment').modal("hide");
                                   loadDepartments();
                               },
                                function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlDepartment').modal("hide");
                                });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                }); 
            }
        };

        $scope.updateDepartment = function () {
            if (isFormValid($scope.frmDepartment)) {
                $scope.$parent.isNameExist('Department', $scope.department.DepartmentID, '', $scope.department.DepartmentName).then(function (response) {
                    if (response.data) addNotification('Error', 'Department with same name already exists!', 'error');
                    else {
                        departmentService.updateDepartment($scope.department).then(
                           function (response) {
                               addNotification('Success', 'Record is successfully updated!', 'success');
                               $('#mdlDepartment').modal("hide");
                               loadDepartments();
                           },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDepartment').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
            }
        };
        $scope.deleteDepartment = function () {
            departmentService.deleteDepartment($scope.department.DepartmentID).then(
                function (response) {
                    loadDepartments();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

    }
})();