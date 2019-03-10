(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('countryService', countryService);

    countryService.$inject = ['$resource', '$q', '$http'];

    function countryService($resource, $q, $http) {
        var resource = $resource('/Country/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getCountry = function () {
           // return $http.get('/Country/AllCountry')

            var deferred = $q.defer();
            resource.query({ action: "AllCountry", param: "" },
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

        var _getCountryById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'CountryById', param: contactId },
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

        var _addCountry = function (country) {
            var deferred = $q.defer();

            $http.post('/Country/CreateCountry', country)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateCountry = function (country) {
            var deferred = $q.defer();

            $http.post('/Country/UpdateCountry/', country)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteCountry = function (Id) {
            var deferred = $q.defer();

            $http.post('/Country/DeleteCountry/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllCountry: _getCountry,
            getCountryById: _getCountryById,
            createCountry: _addCountry,
            updateCountry: _updateCountry,
            deleteCountry: _deleteCountry
        };

    }

})();