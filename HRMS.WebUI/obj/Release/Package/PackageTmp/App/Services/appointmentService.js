(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('appointmentService', appointmentService);

    appointmentService.$inject = ['$resource', '$q', '$http'];

    function appointmentService($resource, $q, $http) {
        var resource = $resource('/Appointment/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        ///////////////////////////// Appointment //////////////////////////////////


        var _getAppointmentWithOutParticipants = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllAppointmentsWithOutParticipants", param: "" },
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
        var _getAppointment = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllAppointments", param: "" },
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

        var _getAppointmentById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'AppointmentById', param: contactId },
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

        var _addAppointment = function (appointment) {
            var deferred = $q.defer();

            $http.post('/Appointment/CreateAppointment', appointment)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateAppointment = function (appointment) {
            var deferred = $q.defer();

            $http.post('/Appointment/UpdateAppointment/' + appointment.id, appointment)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteAppointment = function (Id) {
            var deferred = $q.defer();

            $http.post('/Appointment/DeleteAppointment/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        /////////////////////// Participant //////////////////////////////
        var _getParticipant = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllParticipants", param: "" },
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

        var _updateParticipant = function (participant) {
            var deferred = $q.defer();

            $http.post('/Appointment/UpdateParticipant/', participant)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        return {
            ///////////////////////////// Appointment //////////////////////////////////
            getAppointmentWithOutParticipants : _getAppointmentWithOutParticipants,
            getAllAppointments: _getAppointment,
            getAppointmentById: _getAppointmentById,
            createAppointment: _addAppointment,
            updateAppointment: _updateAppointment,
            deleteAppointment: _deleteAppointment,

            ///////////////////////////// Appointment //////////////////////////////////

            getAllParticipants: _getParticipant,
            updateParticipant: _updateParticipant
        };

    }

})();