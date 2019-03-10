(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('staffService', staffService);

    staffService.$inject = ['$resource', '$q', '$http'];

    function staffService($resource, $q, $http) {
        var resource = $resource('/Staff/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getStaff = function () {
            // return $http.get('/Staff/AllStaff')

            var deferred = $q.defer();
            resource.query({ action: "AllStaff", param: "" },
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

        var _getStaffById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'StaffById', param: contactId },
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

        var _addStaff = function (staff) {
            var deferred = $q.defer();

            $http.post('/Staff/CreateStaff', staff)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateStaff = function (staff) {
            var deferred = $q.defer();

            $http.post('/Staff/UpdateStaff/' + staff.id, staff)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteStaff = function (Id) {
            var deferred = $q.defer();

            $http.post('/Staff/DeleteStaff/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllStaffs: _getStaff,
            getStaffById: _getStaffById,
            createStaff: _addStaff,
            updateStaff: _updateStaff,
            deleteStaff: _deleteStaff
        };

    }

})();