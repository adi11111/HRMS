(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('leaveService', leaveService);

    leaveService.$inject = ['$resource', '$q', '$http'];

    function leaveService($resource, $q, $http) {
        var resource = $resource('/Leave/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });


        // Leave 

        var _getLeaves = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllLeaves", param: "" },
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

        var _getLeaveById = function (leaveId) {
            var deferred = $q.defer();
            resource.query({ action: 'LeaveById', param: leaveId },
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

        var _addLeave = function (Leave) {
            var deferred = $q.defer();

            $http.post('/Leave/CreateLeave', Leave)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateLeave = function (Leave) {
            var deferred = $q.defer();

            $http.post('/Leave/UpdateLeave/' + Leave.id, Leave)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteLeave = function (Id) {
            var deferred = $q.defer();

            $http.post('/Leave/DeleteLeave/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };


        // Leave Types

        var _getLeaveTypes = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllLeaveTypes", param: "" },
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

        var _getLeaveTypeById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'LeaveTypeById', param: contactId },
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

        var _addLeaveType = function (leaveType) {
            var deferred = $q.defer();

            $http.post('/Leave/CreateLeaveType', leaveType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateLeaveType = function (leaveType) {
            var deferred = $q.defer();

            $http.post('/Leave/UpdateLeaveType/' + leaveType.id, leaveType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteLeaveType = function (Id) {
            var deferred = $q.defer();

            $http.post('/Leave/DeleteLeaveType/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };


        // Leave Status

        var _getLeaveStatus = function () {
            // return $http.get('/Account/AllleaveTypes')

            var deferred = $q.defer();
            resource.query({ action: "AllLeaveStatus", param: "" },
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

        var _getLeaveStatusById = function (leaveStatusId) {
            var deferred = $q.defer();
            resource.query({ action: 'LeaveStatusById', param: leaveStatusId },
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

        var _addLeaveStatus = function (leaveStatus) {
            var deferred = $q.defer();

            $http.post('/Leave/CreateLeaveStatus', leaveStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateLeaveStatus = function (leaveStatus) {
            var deferred = $q.defer();

            $http.post('/Leave/UpdateLeaveStatus/' + leaveStatus.id, leaveStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteLeaveStatus = function (Id) {
            var deferred = $q.defer();

            $http.post('/Leave/DeleteLeaveStatus/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };




        return {
            // Leave 
            getAllLeave: _getLeaves,
            getLeaveById: _getLeaveById,
            createLeave: _addLeave,
            updateLeave: _updateLeave,
            deleteLeave: _deleteLeave,

            // Leave Types

            getAllLeaveTypes: _getLeaveTypes,
            getLeaveTypeById: _getLeaveTypeById,
            createLeaveType: _addLeaveType,
            updateLeaveType: _updateLeaveType,
            deleteLeaveType: _deleteLeaveType,

            // Leave Status

            getAllLeaveStatus: _getLeaveStatus,
            getLeaveStatusById: _getLeaveStatusById,
            createLeaveStatus: _addLeaveStatus,
            updateLeaveStatus: _updateLeaveStatus,
            deleteLeaveStatus: _deleteLeaveStatus
        };

    }

})();