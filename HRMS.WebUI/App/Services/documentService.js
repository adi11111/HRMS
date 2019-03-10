(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('documentService', documentService);

    documentService.$inject = ['$resource', '$q', '$http'];

    function documentService($resource, $q, $http) {
        var resource = $resource('/Document/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        //////////////////////////// Document ///////////////////////////////

        var _getDocument = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllDocuments", param: "" },
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

        var _getDocumentById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'DocumentById', param: contactId },
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
        var _checkSearchName = function (searchName) {
            var deferred = $q.defer();
            resource.query({ action: 'CheckSearchName', param: searchName },
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
        var _addDocument = function (document) {
            var deferred = $q.defer();

            $http.post('/Document/CreateDocument', document)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDocument = function (document) {
            var deferred = $q.defer();

            $http.post('/Document/UpdateDocument/', document)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDocument = function (Id) {
            var deferred = $q.defer();

            $http.post('/Document/DeleteDocument/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        ////////////////////////////// Document Category /////////////////////

        var _getDocumentCategory = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllDocumentCategorys", param: "" },
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

        var _getDocumentCategoryById = function (Id) {
            var deferred = $q.defer();
            resource.query({ action: 'DocumentCategoryById', param: Id },
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

        var _addDocumentCategory = function (documentCategory) {
            var deferred = $q.defer();

            $http.post('/Document/CreateDocumentCategory', documentCategory)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDocumentCategory = function (documentCategory) {
            var deferred = $q.defer();

            $http.post('/Document/UpdateDocumentCategory/' + documentCategory.id, documentCategory)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDocumentCategory = function (Id) {
            var deferred = $q.defer();

            $http.post('/Document/DeleteDocumentCategory/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        ////////////////////////////// Document Type /////////////////////////

        var _getDocumentTypes = function () {
           // return $http.get('/Document/AllDocumentTypes')

            var deferred = $q.defer();
            resource.query({ action: "AllDocumentTypes", param: "" },
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

        var _getDocumentTypeById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'DocumentTypeById', param: contactId },
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

        var _addDocumentType = function (document) {
            var deferred = $q.defer();

            $http.post('/Document/CreateDocumentType', document)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDocumentType = function (document) {
            var deferred = $q.defer();

            $http.post('/Document/UpdateDocumentType/' + document.id, document)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDocumentType = function (Id) {
            var deferred = $q.defer();

            $http.post('/Document/DeleteDocumentType/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        ///////////////////////////// Document Renewal Status ///////////////

        var _getDocumentRenewalStatus = function () {

            var deferred = $q.defer();
            resource.query({ action: "AllDocumentRenewalStatus", param: "" },
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

        var _getDocumentRenewalStatusById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'DocumentRenewalStatusById', param: contactId },
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

        var _addDocumentRenewalStatus = function (documentRenewalStatus) {
            var deferred = $q.defer();

            $http.post('/Document/CreateDocumentRenewalStatus', documentRenewalStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDocumentRenewalStatus = function (documentRenewalStatus) {
            var deferred = $q.defer();

            $http.post('/Document/UpdateDocumentRenewalStatus/' + documentRenewalStatus.id, documentRenewalStatus)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDocumentRenewalStatus = function (Id) {
            var deferred = $q.defer();

            $http.post('/Document/DeleteDocumentRenewalStatus/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        /////////////////////////// Setting /////////////////////////////////

        var _getSettings = function (Id) {
             var deferred = $q.defer();
             $http.post('/Setting/AllSettings/' + Id)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });
            //resource.query({ action: "AllSettings", param: "" },
			//	function (result) {
			//	    if (result == null) {
			//	        result = [];
			//	    };
			//	    deferred.resolve(result);
			//	},
			//	function (response) {
			//	    deferred.reject(response);
			//	});
            return deferred.promise;

        };

        var _getSettingById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'SettingById', param: contactId },
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

        var _addSetting = function (setting) {
            var deferred = $q.defer();

            $http.post('/Setting/CreateSetting', setting)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateSetting = function (setting) {
            var deferred = $q.defer();

            $http.post('/Setting/UpdateSetting/' + setting.id, setting)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteSetting = function (Id) {
            var deferred = $q.defer();

            $http.post('/Setting/DeleteSetting/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        return {

        ///////////////////////////// Document //////////////////////////

            getAllDocument: _getDocument,
            getDocumentById: _getDocumentById,
            checkSearchName : _checkSearchName,
            createDocument: _addDocument,
            updateDocument: _updateDocument,
            deleteDocument: _deleteDocument,

       /////////////////////////// Document Category ////////////////////

            getAllDocumentCategory: _getDocumentCategory,
            getDocumentCategoryById: _getDocumentCategoryById,
            createDocumentCategory: _addDocumentCategory,
            updateDocumentCategory: _updateDocumentCategory,
            deleteDocumentCategory: _deleteDocumentCategory,

        /////////////////////////// Document Type ///////////////////////

            getAllDocumentTypes: _getDocumentTypes,
            getDocumentTypeById: _getDocumentTypeById,
            createDocumentType: _addDocumentType,
            updateDocumentType: _updateDocumentType,
            deleteDocumentType: _deleteDocumentType,

        ////////////////////////// Document Renewal Status //////////////

            getAllDocumentRenewalStatus: _getDocumentRenewalStatus,
            getDocumentRenewalStatusById: _getDocumentRenewalStatusById,
            createDocumentRenewalStatus: _addDocumentRenewalStatus,
            updateDocumentRenewalStatus: _updateDocumentRenewalStatus,
            deleteDocumentRenewalStatus: _deleteDocumentRenewalStatus,

        ////////////////////////// Setting ///////////////////////////////

            getAllSettings: _getSettings,
            getSettingById: _getSettingById,
            createSetting: _addSetting,
            updateSetting: _updateSetting,
            deleteSetting: _deleteSetting
        };

    }

})();