(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('accountController', accountController);

    accountController.$inject = ['$scope', '$location', 'accountService'];

    function accountController($scope, $location, accountService) {
        var isUpdateDataTable = false;
        var tblAccountType;
        $scope.accountType = {
            AccountTypeID : 0,
            AccountTypeName: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.accountType.AccountTypeName = '';
            $scope.accountType.Remarks = '';
            $('#mdlAccountType').modal("show");
            angular.forEach($scope.frmAccountType.$error.required, function (field) {
                field.$dirty = false;
            });
        }
        loadAccountTypes();
        function loadAccountTypes() {
           
        accountService.getAllAccountTypes().then(
               function (response) {
                       if ($.fn.dataTable.isDataTable('#tblAccountType')) {
                           $('#tblAccountType').DataTable().destroy();
                       }
                       tblAccountType =  $('#tblAccountType').DataTable({
                           data: response,
                           "order": [[ 1, "asc" ]] ,
                           "columns": [
                                { "data": "AccountTypeID" },
                                { "data": "AccountTypeName" },
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

        $('#tblAccountType').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblAccountType').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.accountType.AccountTypeID = rowData.AccountTypeID;
                    $scope.accountType.AccountTypeName = rowData.AccountTypeName;
                    $scope.accountType.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlAccountType').modal("show");
            }             
        });
        $('#tblAccountType').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.accountType.AccountTypeID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlAccountTypeDelete').modal("show");
        });
        $scope.createAccountType = function () {
            if (isFormValid($scope.frmAccountType)) {
                $scope.$parent.isNameExist('Account', 0, 'type', $scope.accountType.AccountTypeName).then(function (response) {
                    if (response.data) {
                        addNotification('Error', 'Account Type with same name already exists!', 'error');
                    }
                    else{
                        accountService.createAccountType($scope.accountType).then(
                           function (response) {
                               addNotification('Success', 'New record is added in Account Types!', 'success');
                               $('#mdlAccountType').modal("hide");
                               loadAccountTypes();
                           },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlAccountType').modal("hide");
                            });
                    }
                },function(data){
                     if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        $('#mdlAccountType').modal("hide");
                });
            }
        };

        $scope.updateAccountType = function () {
            if (isFormValid($scope.frmAccountType)) {
                $scope.$parent.isNameExist('Account', $scope.accountType.AccountTypeID, 'type', $scope.accountType.AccountTypeName).then(function (response) {
                    if (response.data) {
                        addNotification('Error', 'Account Type with same name already exists!', 'error');
                    }
                    else{
                        accountService.updateAccountType($scope.accountType).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlAccountType').modal("hide");
                                loadAccountTypes();
                            },
                         function (data) {
                          if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                             $('#mdlAccountType').modal("hide");
                         });
                    }
                },function(data){
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlAccountType').modal("hide");
                });
            }
        };

        $scope.deleteAccountType = function () {
            accountService.deleteAccountType($scope.accountType.AccountTypeID).then(
                function (response) {
                    loadAccountTypes();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

    }
})();