(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('attendenceService', attendenceService);

    attendenceService.$inject = ['$resource', '$q', '$http'];

    function attendenceService($resource, $q, $http) {
        var resource = $resource('/attendence/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        // Attendence 

        var _uploadAttendenceFile = function (attendenceFile) {
            var deferred = $q.defer();

            $http.post('/Attendence/UploadAttendence/', attendenceFile)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _getAttendence = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllAttendences", param: "" },
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

        var _getAttendenceById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'AttendenceById', param: contactId },
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

        var _addAttendence = function (AttendenceType) {
            var deferred = $q.defer();

            $http.post('/Attendence/CreateAttendence', AttendenceType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateAttendence = function (AttendenceType) {
            var deferred = $q.defer();

            $http.post('/Attendence/UpdateAttendence/' + AttendenceType.id, AttendenceType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteAttendence = function (Id) {
            var deferred = $q.defer();

            $http.post('/Attendence/DeleteAttendence/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        var _bulkAttendence = function (bulk) {
            var deferred = $q.defer();

            $http.post('/Attendence/BulkAttendence/', bulk)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        // Attendence Status

        var _getAttendenceStatus = function () {
           // return $http.get('/attendence/AllattendenceStatuss')

            var deferred = $q.defer();
            resource.query({ action: "AllAttendenceStatuss", param: "" },
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

        var _getAttendenceStatusById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'AttendenceStatusById', param: contactId },
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

        var _addAttendenceStatus = function (attendenceStatus) {
            var deferred = $q.defer();

            $http.post('/Attendence/CreateAttendenceStatus', attendenceStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateAttendenceStatus = function (attendenceStatus) {
            var deferred = $q.defer();

            $http.post('/Attendence/UpdateAttendenceStatus/' + attendenceStatus.id, attendenceStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteAttendenceStatus = function (Id) {
            var deferred = $q.defer();

            $http.post('/Attendence/DeleteAttendenceStatus/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };


        // Shift

        var _getShift = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllShifts", param: "" },
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

        var _getShiftById = function (shiftId) {
            var deferred = $q.defer();
            resource.query({ action: 'ShiftById', param: shiftId },
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

        var _addShift = function (shift) {
            var deferred = $q.defer();

            $http.post('/Attendence/CreateShift', shift)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateShift = function (shift) {
            var deferred = $q.defer();

            $http.post('/Attendence/UpdateShift/' + shift.id, shift)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteShift = function (Id) {
            var deferred = $q.defer();

            $http.post('/Attendence/DeleteShift/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        


        return {

            // Attendence 

            uploadAttendenceFile : _uploadAttendenceFile,
            getAllAttendence: _getAttendence,
            getAttendenceById: _getAttendenceById,
            createAttendence: _addAttendence,
            updateAttendence: _updateAttendence,
            deleteAttendence: _deleteAttendence,
            bulkAttendence: _bulkAttendence,

            // Attendence Status

            getAllAttendenceStatuss: _getAttendenceStatus,
            getAttendenceStatusById: _getAttendenceStatusById,
            createAttendenceStatus: _addAttendenceStatus,
            updateAttendenceStatus: _updateAttendenceStatus,
            deleteAttendenceStatus: _deleteAttendenceStatus,

            // Shift

            getAllShift: _getShift,
            getShiftById: _getShiftById,
            createShift: _addShift,
            updateShift: _updateShift,
            deleteShift: _deleteShift
        };

    }

})();