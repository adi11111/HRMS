(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('departmentService', departmentService);

    departmentService.$inject = ['$resource', '$q', '$http'];

    function departmentService($resource, $q, $http) {
        var resource = $resource('/Department/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getDepartment = function () {
            // return $http.get('/Department/AllDepartment')

            return $http.get('/Department/AllDepartment').then(function (response) {
               // alert(response.data);
                return response.data;
            });


            //var deferred = $q.defer();
            //resource.query({ action: "AllDepartment", param: "" },
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

        var _getDepartmentById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'DepartmentById', param: contactId },
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

        var _addDepartment = function (department) {
            var deferred = $q.defer();

            $http.post('/Department/CreateDepartment', department)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDepartment = function (department) {
            var deferred = $q.defer();

            $http.post('/Department/UpdateDepartment/' + department.id, department)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDepartment = function (Id) {
            var deferred = $q.defer();

            $http.post('/Department/DeleteDepartment/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllDepartments: _getDepartment,
            getDepartmentById: _getDepartmentById,
            createDepartment: _addDepartment,
            updateDepartment: _updateDepartment,
            deleteDepartment: _deleteDepartment
        };

    }

})();