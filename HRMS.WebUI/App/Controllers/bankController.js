(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('bankController', bankController);

    bankController.$inject = ['$scope', '$location', 'bankService', 'regionService', 'locationService', ];

    function bankController($scope, $location, bankService, regionService, locationService) {
        
        var tblBank;
        $scope.bank = {
            BankID: 0,
            BankName: '',
            BranchName: '',
            ContactPerson: '',
            ContactNumber: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";
        clearDropDowns();
        $scope.setLocation = function (ID, Name) {
            $scope.bank.LocationID = ID;
            $scope.selectedLocationName = Name;
        }
        $scope.setRegion = function (ID, Name) {
            $scope.bank.RegionID = ID;
            $scope.selectedRegionName = Name;
        }
        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.bank.BankName = '';
            $scope.bank.BranchName = '';
            $scope.bank.ContactPerson = '';
            $scope.bank.ContactNumber = '';
            $scope.bank.Remarks = '';
            $scope.bank.RegionID = undefined;
            $scope.bank.LocationID = undefined;
            clearDropDowns();
            $('#mdlBank').modal("show");
            angular.forEach($scope.frmBank.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        loadRegions();

        function loadBanks() {

            bankService.getAllBank().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblBank')) {
                               $('#tblBank').DataTable().destroy();
                           }
                           tblBank = $('#tblBank').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "BankID" },
                                    { "data": "BankName" },
                                    { "data": "BranchName" },
                                    { "data": "ContactPerson" },
                                    { "data": "ContactNumber" },
                                    { "data": "RegionID" },
                                    { "data": "LocationID" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                     {
                                         "render": function (data, type, row) {
                                             return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                         },
                                         "targets": 0
                                     },
                                    { className: "hide_column", "targets": [7] },
                                    {
                                        "render": function (data, type, row) {
                                            return getRegionById(data);
                                        },
                                        "targets": 5
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getLocationById(data);
                                        },
                                        "targets": 6
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
        if (window.location.href.toLowerCase().indexOf('report') == -1) {
            $('#tblBank').on('click', 'tbody tr i.edit', function () {
                var rowData = $('#tblBank').DataTable().row($(this).parents('tr')).data();
                if (rowData != undefined) {
                    $scope.$apply(function () {
                        $scope.bank.BankID = rowData.BankID;
                        $scope.bank.BankName = rowData.BankName;
                        $scope.bank.BranchName = rowData.BranchName;
                        $scope.bank.ContactPerson = rowData.ContactPerson;
                        $scope.bank.ContactNumber = rowData.ContactNumber;
                        $scope.bank.RegionID = rowData.RegionID;
                        $scope.bank.LocationID = rowData.LocationID;
                        $scope.bank.Remarks = rowData.Remarks;
                        $scope.selectedRegionName = getRegionById(rowData.RegionID);
                        $scope.selectedLocationName = getLocationById(rowData.LocationID);
                        $scope.isCreate = false;
                    });
                    $('#mdlBank').modal("show");
                }
            });
        }
        $('#tblBank').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.bank.BankID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlBankDelete').modal("show");
        });
        $scope.createBank = function () {
            if (isFormValid($scope.frmBank)) {
                $scope.$parent.isNameExist('Bank', 0, '', $scope.bank.BankName).then(function(response){
                    if (response.data) addNotification('Error', 'Bank with same name already exists!', 'error');
                    else{
                        bankService.createBank($scope.bank).then(
                           function (response) {
                               addNotification('Success', 'New record is added in Bank!', 'success');
                               $('#mdlBank').modal("hide");
                               loadBanks();
                           },
                             function (data) {
                              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlBank').modal("hide");
                             });
                    }
                },function(data){
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlBank').modal("hide");
                }); 
            }
        };

        $scope.updateBank = function () {
            if (isFormValid($scope.frmBank)) {
                $scope.$parent.isNameExist('Bank', $scope.bank.BankID, '', $scope.bank.BankName).then(function(response){
                    if (response.data) addNotification('Error', 'Bank with same name already exists!', 'error');
                    else{
                        bankService.updateBank($scope.bank).then(
                           function (response) {
                               addNotification('Success', 'Record is successfully updated!', 'success');
                               $('#mdlBank').modal("hide");
                               loadBanks();
                           },
                             function (data) {
                              if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                 $('#mdlBank').modal("hide");
                             });
                    }
                },function(data){
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlBank').modal("hide");
                }); 
            }
        };

        $scope.deleteBank = function () {
            bankService.deleteBank($scope.bank.BankID).then(
                function (response) {
                    isUpdateDataTable = true;
                    loadBanks();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

        function loadRegions() {
            regionService.getAllRegions().then(
                  function (response) {
                      $scope.regions = response;
                      loadLocations();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadLocations() {
            locationService.getAllLocations().then(
                  function (response) {
                      $scope.locations = response;
                      loadBanks();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function getRegionById(Id) {
            var _regionName;
            for (var i = 0; i < $scope.regions.length; i++) {
                if ($scope.regions[i].RegionID === Id) {
                    _regionName = $scope.regions[i].RegionName
                    break;
                }
            }
            return _regionName;
        }

        function getLocationById(Id) {
            var _locationName;
            for (var i = 0; i < $scope.locations.length; i++) {
                if ($scope.locations[i].LocationID === Id) {
                    _locationName = $scope.locations[i].LocationName
                    break;
                }
            }
            return _locationName;
        }

        function clearDropDowns() {
            $scope.selectedRegionName = "Select Region";
            $scope.selectedLocationName = "Select Location";
        }
    }
})();