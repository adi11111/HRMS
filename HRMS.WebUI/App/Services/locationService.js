(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('locationService', locationService);

    locationService.$inject = ['$resource', '$q', '$http'];

    function locationService($resource, $q, $http) {
        var resource = $resource('/Location/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getLocations = function () {
           // return $http.get('/Location/AllLocations')

            var deferred = $q.defer();
            resource.query({ action: "AllLocation", param: "" },
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

        var _getLocationById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'LocationById', param: contactId },
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

        var _addLocation = function (locationType) {
            var deferred = $q.defer();

            $http.post('/Location/CreateLocation', locationType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateLocation = function (locationType) {
            var deferred = $q.defer();

            $http.post('/Location/UpdateLocation/' + locationType.id, locationType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteLocation = function (Id) {
            var deferred = $q.defer();

            $http.post('/Location/DeleteLocation/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllLocations: _getLocations,
            getLocationById: _getLocationById,
            createLocation: _addLocation,
            updateLocation: _updateLocation,
            deleteLocation: _deleteLocation
        };

    }

})();