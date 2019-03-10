(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('accountService', accountService);

    accountService.$inject = ['$resource', '$q', '$http'];

    function accountService($resource, $q, $http) {
        var resource = $resource('/Account/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getAccountTypes = function () {
           // return $http.get('/Account/AllAccountTypes')
            return $http.get('/Account/AllAccountTypes').then(function (response) {
                // alert(response.data);
                return response.data;
            });
            //var deferred = $q.defer();
            //resource.query({ action: "AllAccountTypes", param: "" },
			//	function (result) {
			//	    if (result == null) {
			//	        result = [];
			//	    };
			//	    deferred.resolve(result);
			//	},
			//	function (response) {
			//	    deferred.reject(response);
			//	});
            //return deferred.promise;

        };

        var _getAccountTypeById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'AccountTypeById', param: contactId },
				function (result) {
				    if (result == null) {
				        result = [];
				    };

				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;
        };

        var _addAccountType = function (accountType) {
            var deferred = $q.defer();

            $http.post('/Account/CreateAccountType', accountType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateAccountType = function (accountType) {
            var deferred = $q.defer();

            $http.post('/Account/UpdateAccountType/' + accountType.id, accountType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteAccountType = function (Id) {
            var deferred = $q.defer();

            $http.post('/Account/DeleteAccountType/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllAccountTypes: _getAccountTypes,
            getAccountTypeById: _getAccountTypeById,
            createAccountType: _addAccountType,
            updateAccountType: _updateAccountType,
            deleteAccountType: _deleteAccountType
        };

    }

})();