(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('nationalityService', nationalityService);

    nationalityService.$inject = ['$resource', '$q', '$http'];

    function nationalityService($resource, $q, $http) {
        var resource = $resource('/Nationality/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';


        var _getNationality = function () {
           // return $http.get('/Nationality/AllNationality')

            return $http.get('/Nationality/AllNationality').then(function (response) {
               // alert(response.data);
                return response.data;
            });

            //var deferred = $q.defer();
            //resource.query({ action: "AllNationality", param: "" },
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

        var _getNationalityById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'NationalityById', param: contactId },
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

        var _addNationality = function (nationality) {
            var deferred = $q.defer();

            $http.post('/Nationality/CreateNationality', nationality)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateNationality = function (nationality) {
            var deferred = $q.defer();

            $http.post('/Nationality/UpdateNationality/' + nationality.id, nationality)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteNationality = function (Id) {
            var deferred = $q.defer();

            $http.post('/Nationality/DeleteNationality/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            getAllNationality: _getNationality,
            getNationalityById: _getNationalityById,
            createNationality: _addNationality,
            updateNationality: _updateNationality,
            deleteNationality: _deleteNationality
        };

    }

})();