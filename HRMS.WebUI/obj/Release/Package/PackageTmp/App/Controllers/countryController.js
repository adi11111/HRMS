(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('countryController', countryController);

    countryController.$inject = ['$scope', '$location', 'countryService'];

    function countryController($scope, $location, countryService) {
        var tblCountry;
        $scope.country = {
            CountryID : 0,
            CountryName: '',
            ShortForm: '',
            Currency: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";
        // var tblCountry;

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.country.CountryName = '';
            $scope.country.Remarks = '';
            $('#mdlCountry').modal("show");
            angular.forEach($scope.frmCountry.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        loadCountrys();
        function loadCountrys() {
           
        countryService.getAllCountry().then(
               function (response) {
                       if ($.fn.dataTable.isDataTable('#tblCountry')) {
                           $('#tblCountry').DataTable().destroy();
                       }
                       tblCountry =  $('#tblCountry').DataTable({
                           data: response,
                           "order": [[1, "asc"]],
                           "columns": [
                                { "data": "CountryID" },
                                { "data": "CountryName" },
                                { "data": "ShortForm" },
                                { "data": "Currency" },
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
        $('#tblCountry').on('click', 'tbody tr i.edit', function () {
            var rowData = tblCountry.row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.country.CountryID = rowData.CountryID;
                    $scope.country.CountryName = rowData.CountryName;
                    $scope.country.ShortForm = rowData.ShortForm;
                    $scope.country.Currency = rowData.Currency;
                    $scope.country.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlCountry').modal("show");
            }
        });
        $('#tblCountry').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.country.CountryID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlCountryDelete').modal("show");
        });
        $scope.createCountry = function () {
            if (isFormValid()) {
                $scope.$parent.isNameExist('Country', 0, 'company', $scope.country.CountryName).then(function(response){
                    if (response.data) addNotification('Error', 'Country with same name already exists!', 'error');
                    else{
                        countryService.createCountry($scope.country).then(
                        function (response) {
                            addNotification('Success', 'New record is added in Country!', 'success');
                            $('#mdlCountry').modal("hide");
                            loadCountrys();
                        },
                        function (data) {
                         if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                            $('#mdlCountry').modal("hide");
                        });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlCountry').modal("hide");
                
                });
            }
        };

        function isFormValid() {
            if ($scope.frmCountry.$invalid) {
                angular.forEach($scope.frmCountry.$error.required, function (field) {
                    field.$setDirty();
                    field.$valid = false;
                });
            }
            else{
                return true;
            }
        }
        $scope.updateCountry = function () {
            if (isFormValid()) {
                $scope.$parent.isNameExist('Country', $scope.country.CountryID, 'company', $scope.country.CountryName).then(function (response) {
                    if (response.data) addNotification('Error', 'Country with same name already exists!', 'error');
                    else {
                        countryService.updateCountry($scope.country).then(
                        function (response) {
                            addNotification('Success', 'Record is successfully updated!', 'success');
                            $('#mdlCountry').modal("hide");
                            loadCountrys();
                        },
                        function (data) {
                         if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                            $('#mdlCountry').modal("hide");
                        });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlCountry').modal("hide");

                });
            }
        };


        $scope.deleteCountry = function () {
            countryService.deleteCountry($scope.country.CountryID).then(
                function (response) {
                    loadCountrys();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };


    }
})();