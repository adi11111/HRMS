(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('locationController', locationController);

    locationController.$inject = ['$scope', '$location', 'locationService'];

    function locationController($scope, $location, locationService) {
        var tblLocation;
        $scope.location = {
            LocationID: 0,
            LocationName: '',
            Remarks: ''
        }
        $scope.isCreate = false;

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.location.LocationName = '';
            $scope.location.Remarks = '';
            $('#mdlLocation').modal("show");
            angular.forEach($scope.frmLocation.$error.required, function (field) {
                field.$valid = true;
            });
        }
        loadLocations();
        function loadLocations() {

            locationService.getAllLocations().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblLocation')) {
                               $('#tblLocation').DataTable().destroy();
                           }
                           tblLocation = $('#tblLocation').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "LocationID" },
                                    { "data": "LocationName" },
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
        $('#tblLocation').on('click', 'tbody tr i.edit', function () {
            var rowData = tblLocation.row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.location.LocationID = rowData.LocationID;
                    $scope.location.LocationName = rowData.LocationName;
                    $scope.location.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlLocation').modal("show");
            }             
        });
        $('#tblLocation').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.location.LocationID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlLocationDelete').modal("show");
        });
        $scope.createLocation = function () {
            if (isFormValid($scope.frmLocation)) {
                $scope.$parent.isNameExist('Location',0,'', $scope.location.LocationName).then(function(response){
                    if(response.data) addNotification('Error', 'Location with same name already exists!', 'error');
                    else{
                        locationService.createLocation($scope.location).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Location!', 'success');
                                $('#mdlLocation').modal("hide");
                                loadLocations();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlLocation').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlLocation').modal("hide");
                });
            }
        };

        $scope.updateLocation = function () {
            if (isFormValid($scope.frmLocation)) {
                $scope.$parent.isNameExist('Location', $scope.location.LocationID, '', $scope.location.LocationName).then(function (response) {
                    if (response.data) addNotification('Error', 'Location with same name already exists!', 'error');
                    else {
                        locationService.updateLocation($scope.location).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlLocation').modal("hide");
                                loadLocations();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlLocation').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlLocation').modal("hide");
                });
            }
        };

        $scope.deleteLocation = function () {
            locationService.deleteLocation($scope.location.LocationID).then(
                function (response) {
                    loadLocations();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

    }
})();