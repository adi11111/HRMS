(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('designationService', designationService);

    designationService.$inject = ['$resource', '$q', '$http'];

    function designationService($resource, $q, $http) {
        var resource = $resource('/Designation/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getDesignation = function () {
            // return $http.get('/Designation/AllDesignation')


            return $http.get('/Designation/AllDesignation').then(function (response) {
                return response.data;
            });
            //var deferred = $q.defer();
            //resource.query({ action: "AllDesignation", param: "" },
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

        var _getDesignationById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'DesignationById', param: contactId },
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

        var _addDesignation = function (designation) {
            var deferred = $q.defer();

            $http.post('/Designation/CreateDesignation', designation)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDesignation = function (designation) {
            var deferred = $q.defer();

            $http.post('/Designation/UpdateDesignation/' + designation.id, designation)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDesignation = function (Id) {
            var deferred = $q.defer();

            $http.post('/Designation/DeleteDesignation/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllDesignations: _getDesignation,
            getDesignationById: _getDesignationById,
            createDesignation: _addDesignation,
            updateDesignation: _updateDesignation,
            deleteDesignation: _deleteDesignation
        };

    }

})();