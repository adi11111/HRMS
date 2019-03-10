(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('shareholderService', shareholderService);

    shareholderService.$inject = ['$resource', '$q', '$http'];

    function shareholderService($resource, $q, $http) {
        var resource = $resource('/Shareholder/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        ////////////////////////// Shareholder Type /////////////////////////


        var _getShareHolderType = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllShareHolderTypes", param: "" },
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

        var _getShareHolderTypeById = function (shareHolderTypeId) {
            var deferred = $q.defer();
            resource.query({ action: 'ShareHolderTypeById', param: shareHolderTypeId},
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

        var _addShareHolderType = function (shareHolderType) {
            var deferred = $q.defer();

            $http.post('/ShareHolder/CreateShareHolderType', shareHolderType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateShareHolderType = function (shareHolderType) {
            var deferred = $q.defer();

            $http.post('/ShareHolder/UpdateShareHolderType/' + shareHolderType.id, shareHolderType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteShareHolderType = function (Id) {
            var deferred = $q.defer();

            $http.post('/ShareHolder/DeleteShareholderType/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };


        ////////////////////////// Shareholder //////////////////////////////

        var _getShareholder = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllShareholders", param: "" },
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

        var _getShareholderById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'ShareholderById', param: contactId },
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

        var _addShareholder = function (shareholderType) {
            var deferred = $q.defer();

            $http.post('/Shareholder/CreateShareholder', shareholderType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        };

        var _updateShareholder = function (shareholderType) {
            var deferred = $q.defer();

            $http.post('/Shareholder/UpdateShareholder/' + shareholderType.id, shareholderType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteShareholder = function (Id) {
            var deferred = $q.defer();

            $http.post('/Shareholder/DeleteShareholder/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {
            ////////////////////////// Shareholder Type /////////////////////////

            getAllShareHolderType: _getShareHolderType,
            getShareHolderTypeById: _getShareHolderTypeById,
            createShareHolderType: _addShareHolderType,
            updateShareHolderType: _updateShareHolderType,
            deleteShareHolderType: _deleteShareHolderType,

            ////////////////////////// Shareholder //////////////////////////////

            getAllShareholder: _getShareholder,
            getShareholderById: _getShareholderById,
            createShareholder: _addShareholder,
            updateShareholder: _updateShareholder,
            deleteShareholder: _deleteShareholder

        };

    }

})();