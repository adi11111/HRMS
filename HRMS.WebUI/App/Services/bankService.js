(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('bankService', bankService);

    bankService.$inject = ['$resource', '$q', '$http'];

    function bankService($resource, $q, $http) {
        var resource = $resource('/Bank/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });
        var _getBank = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllBanks", param: "" },
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

        var _getBankById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'BankById', param: contactId },
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

        var _addBank = function (bankType) {
            var deferred = $q.defer();

            $http.post('/Bank/CreateBank', bankType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateBank = function (bankType) {
            var deferred = $q.defer();

            $http.post('/Bank/UpdateBank/' + bankType.id, bankType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteBank = function (Id) {
            var deferred = $q.defer();

            $http.post('/Bank/DeleteBank/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllBank: _getBank,
            getBankById: _getBankById,
            createBank: _addBank,
            updateBank: _updateBank,
            deleteBank: _deleteBank
        };

    }

})();