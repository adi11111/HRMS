(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('regionService', regionService);

    regionService.$inject = ['$resource', '$q', '$http'];

    function regionService($resource, $q, $http) {
        var resource = $resource('/Region/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getRegion = function () {
            // return $http.get('/Region/AllRegion')

            var deferred = $q.defer();
            resource.query({ action: "AllRegion", param: "" },
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

        var _getRegionById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'RegionById', param: contactId },
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

        var _addRegion = function (region) {
            var deferred = $q.defer();

            $http.post('/Region/CreateRegion', region)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateRegion = function (region) {
            var deferred = $q.defer();

            $http.post('/Region/UpdateRegion/' + region.id, region)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteRegion = function (Id) {
            var deferred = $q.defer();

            $http.post('/Region/DeleteRegion/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllRegions: _getRegion,
            getRegionById: _getRegionById,
            createRegion: _addRegion,
            updateRegion: _updateRegion,
            deleteRegion: _deleteRegion
        };

    }

})();