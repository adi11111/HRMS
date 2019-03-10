(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('userService', userService);

    userService.$inject = ['$resource', '$q', '$http'];

    function userService($resource, $q, $http) {
        var resource = $resource('/User/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        var serviceBase = 'http://localhost:8131/';

        //////////////////////// User ////////////////////////////////////

        var _getUser = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllUsers", param: "" },
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

        var _getUserById = function (UserId) {
            var deferred = $q.defer();
            resource.query({ action: 'UserById', param: UserId },
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

        var _addUser = function (user) {
            var deferred = $q.defer();

            $http.post('/User/CreateUser', user)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateUser = function (user) {
            var deferred = $q.defer();

            $http.post('/User/UpdateUser/' + user.id, user)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteUser = function (Id) {
            var deferred = $q.defer();

            $http.post('/User/DeleteUser/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        /////////////////////// User Role //////////////////////////////////

        var _getUserRoles = function () {
           // return $http.get('/User/AllUserRoles')

            var deferred = $q.defer();
            resource.query({ action: "AllUserRole", param: "" },
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


        var _getUserRoleById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'UserRoleById', param: contactId },
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



        var _addUserRole = function (userRole) {
            var deferred = $q.defer();

            $http.post('/User/CreateUserRole', userRole)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateUserRole = function (userRole) {
            var deferred = $q.defer();

            $http.post('/User/UpdateUserRole/' + userRole.id, userRole)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteUserRole = function (Id) {
            var deferred = $q.defer();

            $http.post('/User/DeleteUserRole/'+Id )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        ////////////////////// Interface /////////////////////////////////////

        var _getInterface = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllInterfaces", param: "" },
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

        var _getInterfaceById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'InterfaceById', param: contactId },
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

        var _addInterface = function (bankType) {
            var deferred = $q.defer();

            $http.post('/User/CreateInterface', bankType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateInterface = function (bankType) {
            var deferred = $q.defer();

            $http.post('/User/UpdateInterface/' + bankType.id, bankType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteInterface = function (Id) {
            var deferred = $q.defer();

            $http.post('/User/DeleteInterface/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };


        /////////////////////// User Access ///////////////////////


        var _getUserAccessByRoleId = function (roleID) {
            var deferred = $q.defer();
            $http.post('/User/AllUserAccessByRoleId/' + roleID)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;

        };

        var _getUserEvents = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllUserEvents", param: "" },
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

        var _addUserAccess = function (userAccess) {
            var deferred = $q.defer();

            $http.post('/User/CreateUserAccess', userAccess)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };



        return {
            // User 

            getAllUser: _getUser,
            getUserById: _getUserById,
            createUser: _addUser,
            updateUser: _updateUser,
            deleteUser: _deleteUser,

            // User Role

            getAllUserRoles: _getUserRoles,
            getUserRoleById: _getUserRoleById,
            createUserRole: _addUserRole,
            updateUserRole: _updateUserRole,
            deleteUserRole: _deleteUserRole,
            // User Access

            getAllUserAccessByRoleId : _getUserAccessByRoleId,
            getUserEvents: _getUserEvents,
            createUserAccess: _addUserAccess,

            // Interface

            getAllInterface: _getInterface,
            getInterfaceById: _getInterfaceById,
            createInterface: _addInterface,
            updateInterface: _updateInterface,
            deleteInterface: _deleteInterface
        };

    }

})();