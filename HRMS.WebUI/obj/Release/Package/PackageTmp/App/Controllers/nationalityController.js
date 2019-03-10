(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('nationalityController', nationalityController);

    nationalityController.$inject = ['$scope', '$location', 'nationalityService'];

    function nationalityController($scope, $location, nationalityService) {
        var tblNationality;
        $scope.nationality = {
            NationalityID: 0,
            NationalityName: '',
            Remarks: ''
        }
        $scope.isCreate = false;

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.nationality.NationalityName = '';
            $scope.nationality.Remarks = '';
            $('#mdlNationality').modal("show");
            angular.forEach($scope.frmNationality.$error.required, function (field) {
                field.$valid = true;
            });
        }
        loadNationalitys();
        function loadNationalitys() {

            nationalityService.getAllNationality().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblNationality')) {
                               $('#tblNationality').DataTable().destroy();
                           }
                           tblNationality = $('#tblNationality').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "NationalityID" },
                                    { "data": "NationalityName" },
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
        $('#tblNationality').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblNationality').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.nationality.NationalityID = rowData.NationalityID;
                    $scope.nationality.NationalityName = rowData.NationalityName;
                    $scope.nationality.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlNationality').modal("show");
            }


        });
        $('#tblNationality').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.nationality.NationalityID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlNationalityDelete').modal("show");
        });

        $scope.createNationality = function () {
            if (isFormValid($scope.frmNationality)) {
                $scope.$parent.isNameExist('Nationality', 0, '', $scope.nationality.NationalityName).then(function(response){
                    if(response.data)    addNotification('Error', 'Nationality with same name already exists!', 'error');
                    else{
                        nationalityService.createNationality($scope.nationality).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Nationality!', 'success');
                                $('#mdlNationality').modal("hide");
                                loadNationalitys();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlNationality').modal("hide");
                            });
                    }
                },function(response){
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlNationality').modal("hide");
                });
            }
        };

        $scope.updateNationality = function () {
            if (isFormValid($scope.frmNationality)) {
                $scope.$parent.isNameExist('Nationality', $scope.nationality.NationalityID, '', $scope.nationality.NationalityName).then(function (response) {
                    if (response.data) addNotification('Error', 'Nationality with same name already exists!', 'error');
                    else {
                        nationalityService.updateNationality($scope.nationality).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlNationality').modal("hide");
                                loadNationalitys();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlNationality').modal("hide");
                            });
                    }
                }, function (response) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlNationality').modal("hide");
                });
            }
        };

        $scope.deleteNationality = function () {
            nationalityService.deleteNationality($scope.nationality.NationalityID).then(
                function (response) {
                    loadNationalitys();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

    }
})();