(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('regionController', regionController);

    regionController.$inject = ['$scope', '$location', 'regionService'];

    function regionController($scope, $location, regionService) {
        var tblRegion;
        $scope.region = {
            RegionID: 0,
            RegionName: '',
            Remarks: ''
        }
        $scope.isCreate = false;

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.region.RegionName = '';
            $scope.region.Remarks = '';
            $('#mdlRegion').modal("show");
            angular.forEach($scope.frmRegion.$error.required, function (field) {
                field.$valid = true;
            });
        }
        loadRegions();
        function loadRegions() {

            regionService.getAllRegions().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblRegion')) {
                               $('#tblRegion').DataTable().destroy();
                           }
                           tblRegion = $('#tblRegion').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "RegionID" },
                                    { "data": "RegionName" },
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

        $('#tblRegion').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblRegion').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.region.RegionID = rowData.RegionID;
                    $scope.region.RegionName = rowData.RegionName;
                    $scope.region.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlRegion').modal("show");
            }
        });
        $('#tblRegion').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.region.RegionID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlRegionDelete').modal("show");
        });
        $scope.createRegion = function () {
            if (isFormValid($scope.frmRegion)) {
                $scope.$parent.isNameExist('Region', 0, '', $scope.region.RegionName).then(function(response){
                    if(response.data)    addNotification('Error', 'Region with same name already exists!', 'error');
                    else{
                        regionService.createRegion($scope.region).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Region!', 'success');
                                $('#mdlRegion').modal("hide");
                                loadRegions();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlRegion').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlRegion').modal("hide");
                });
            }
        };

        $scope.updateRegion = function () {
            if (isFormValid($scope.frmRegion)) {
                $scope.$parent.isNameExist('Region', $scope.region.RegionID, '', $scope.region.RegionName).then(function (response) {
                    if (response.data) addNotification('Error', 'Region with same name already exists!', 'error');
                    else {
                        regionService.updateRegion($scope.region).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlRegion').modal("hide");
                                loadRegions();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlRegion').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlRegion').modal("hide");
                });
            }
        };

        $scope.deleteRegion = function () {
            regionService.deleteRegion($scope.region.RegionID).then(
                function (response) {
                    loadRegions();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };
    }
})();