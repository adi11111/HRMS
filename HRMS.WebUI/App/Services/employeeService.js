(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('employeeService', employeeService);

    employeeService.$inject = ['$resource', '$q', '$http'];

    function employeeService($resource, $q, $http) {
        var resource = $resource('/Employee/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getEmployees = function (all) {
           // return $http.get('/Employee/AllEmployees')

            var deferred = $q.defer();
            resource.query({ action: "AllEmployees", param: all },
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

        var _getEmployeeById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'EmployeeById', param: contactId },
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

        var _addEmployee = function (employee) {
            var deferred = $q.defer();

            $http.post('/Employee/CreateEmployee', employee)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateEmployee = function (employee) {
            var deferred = $q.defer();

            $http.post('/Employee/UpdateEmployee/' + employee.EmployeeID, employee)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteEmployee = function (Id) {
            var deferred = $q.defer();

            $http.post('/Employee/DeleteEmployee/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllEmployees: _getEmployees,
            getEmployeeById: _getEmployeeById,
            createEmployee: _addEmployee,
            updateEmployee: _updateEmployee,
            deleteEmployee: _deleteEmployee
        };

    }

})();