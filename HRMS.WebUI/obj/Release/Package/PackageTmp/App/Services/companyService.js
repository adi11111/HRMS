(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('companyService', companyService);

    companyService.$inject = ['$resource', '$q', '$http'];

    function companyService($resource, $q, $http) {
        var resource = $resource('/Company/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        // Company 

        var _getCompanies = function () {
           // return $http.get('/Company/AllCompany')

            var deferred = $q.defer();
            resource.query({ action: "AllCompanies", param: "" },
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

        var _getCompanyById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'CompanyById', param: contactId },
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

        var _addCompany = function (companyType) {
            var deferred = $q.defer();

            $http.post('/Company/CreateCompany', companyType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateCompany = function (companyType) {
            var deferred = $q.defer();

            $http.post('/Company/UpdateCompany/' + companyType.id, companyType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteCompany = function (Id) {
            var deferred = $q.defer();

            $http.post('/Company/DeleteCompany/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        // Company Status

        var _getCompanyStatus = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllCompanyStatuss", param: "" },
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

        var _getCompanyStatusById = function (Id) {
            var deferred = $q.defer();
            resource.query({ action: 'CompanyStatusById', param: Id },
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

        var _addCompanyStatus = function (companyStatus) {
            var deferred = $q.defer();

            $http.post('/Company/CreateCompanyStatus', companyStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateCompanyStatus = function (companyStatus) {
            var deferred = $q.defer();

            $http.post('/Company/UpdateCompanyStatus/' + companyStatus.id, companyStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteCompanyStatus = function (Id) {
            var deferred = $q.defer();

            $http.post('/Company/DeleteCompanyStatus/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };





        // Company Types

        var _getCompanyTypes = function () {
            // return $http.get('/Company/AllCompany')

            var deferred = $q.defer();
            resource.query({ action: "AllCompanyTypes", param: "" },
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

        var _getCompanyTypeById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'CompanyTypeById', param: contactId },
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

        var _addCompanyType = function (companyType) {
            var deferred = $q.defer();

            $http.post('/Company/CreateCompanyType', companyType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateCompanyType = function (companyType) {
            var deferred = $q.defer();

            $http.post('/Company/UpdateCompanyType/' + companyType.id, companyType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteCompanyType = function (Id) {
            var deferred = $q.defer();

            $http.post('/Company/DeleteCompanyType/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        // Graduity Settings

        var _getGraduitySettings = function () {
            // return $http.get('/GraduitySetting/AllGraduitySetting')

            var deferred = $q.defer();
            resource.query({ action: "AllGraduitySettings", param: "" },
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

        var _getGraduitySettingById = function (Id) {
            var deferred = $q.defer();
            resource.query({ action: 'GraduitySettingById', param: Id },
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

        var _addGraduitySetting = function (graduitySetting) {
            var deferred = $q.defer();

            $http.post('/Company/CreateGraduitySetting', graduitySetting)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateGraduitySetting = function (graduitySetting) {
            var deferred = $q.defer();

            $http.post('/Company/UpdateGraduitySetting/', graduitySetting)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteGraduitySetting = function (Id) {
            var deferred = $q.defer();

            $http.post('/Company/DeleteGraduitySetting/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        // Gratuity 

        var _generateGratuityByMonth = function (month) {
            var deferred = $q.defer();
            $http.post('/Company/GenerateGratuity/', month)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });

            return deferred.promise;
        };

        var _addGratuity = function (gratuity) {
            var deferred = $q.defer();

            $http.post('/Company/CreateGratuity', gratuity)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        return {
            // Company
            getAllCompanies: _getCompanies,
            getCompanyById: _getCompanyById,
            createCompany: _addCompany,
            updateCompany: _updateCompany,
            deleteCompany: _deleteCompany,

            // Company Status

            getAllCompanyStatus: _getCompanyStatus,
            getCompanyStatusById: _getCompanyStatusById,
            createCompanyStatus: _addCompanyStatus,
            updateCompanyStatus: _updateCompanyStatus,
            deleteCompanyStatus: _deleteCompanyStatus,

            // Company Types
            getAllCompanyTypes: _getCompanyTypes,
            getCompanyTypeById: _getCompanyTypeById,
            createCompanyType: _addCompanyType,
            updateCompanyType: _updateCompanyType,
            deleteCompanyType: _deleteCompanyType,

            // Graduity Settings

            getAllGraduitySettings: _getGraduitySettings,
            getGraduitySettingById: _getGraduitySettingById,
            createGraduitySetting: _addGraduitySetting,
            updateGraduitySetting: _updateGraduitySetting,
            deleteGraduitySetting: _deleteGraduitySetting,

            // Gratuity
            generateGratuityByMonth: _generateGratuityByMonth,
            createGratuity: _addGratuity
        };

    }

})();