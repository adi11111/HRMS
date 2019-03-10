(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('designationController', designationController);

    designationController.$inject = ['$scope', '$location', 'designationService'];

    function designationController($scope, $location, designationService) {
        var isUpdateDataTable = false;
        var tblDesignation;
        $scope.designation = {
            DesignationID: 0,
            DesignationName: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.designation.DesignationName = '';
            $scope.designation.Remarks = '';
            $('#mdlDesignation').modal("show");
            angular.forEach($scope.frmDesignation.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        loadDesignations();
        function loadDesignations() {

            designationService.getAllDesignations().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblDesignation')) {
                               $('#tblDesignation').DataTable().destroy();
                           }
                           tblDesignation = $('#tblDesignation').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "DesignationID" },
                                    { "data": "DesignationName" },
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
        $('#tblDesignation').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblDesignation').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.designation.DesignationID = rowData.DesignationID;
                    $scope.designation.DesignationName = rowData.DesignationName;
                    $scope.designation.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlDesignation').modal("show");
            }
        });

        $('#tblDesignation').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.designation.DesignationID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDesignationDelete').modal("show");
        });

        $scope.createDesignation = function () {
            if (isFormValid($scope.frmDesignation)) {
                $scope.$parent.isNameExist('Designation', 0, '', $scope.designation.DesignationName).then(function(response){
                    if(response.data) addNotification('Error', 'Location with same name already exists!', 'error');
                    else{
                        designationService.createDesignation($scope.designation).then(
                             function (response) {
                                 addNotification('Success', 'New record is added in Designation!', 'success');
                                 $('#mdlDesignation').modal("hide");
                                 loadDesignations();
                             },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDesignation').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDesignation').modal("hide");
                });
            }
        };


        $scope.updateDesignation = function () {
            if (isFormValid($scope.frmDesignation)) {
                $scope.$parent.isNameExist('Designation', $scope.designation.DesignationID, '', $scope.designation.DesignationName).then(function (response) {
                    if (response.data) addNotification('Error', 'Designation with same name already exists!', 'error');
                    else {
                        designationService.updateDesignation($scope.designation).then(
                             function (response) {
                                 addNotification('Success', 'Record is successfully updated!', 'success');
                                 $('#mdlDesignation').modal("hide");
                                 loadDesignations();
                             },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDesignation').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDesignation').modal("hide");
                });
            }
        };


        $scope.deleteDesignation = function () {
            designationService.deleteDesignation($scope.designation.DesignationID).then(
                function (response) {
                    loadDesignations();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };


    }
})();