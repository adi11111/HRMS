(function () {
    'use strict';

    angular.module('HRMS', ['ngResource', 'ngRoute'
       //'ngAnimate', 'ngCookies', 'ngResource', 'ngRoute'//, 'ngSanitize', 'ngTouch', 'ui.bootstrap'
    ])


    .factory('httpRequestInterceptor', function ($q, $location,$rootScope) {
        return {
            //'responseError': function(rejection) {
                // do something on error
                //if(rejection.status === 404){
                //    $location.path('404');                    
                //}
                //else if (rejection.status === 403) {
                //    $location.path('403');
                //}
                //else if (rejection.status !== 200) {
                //    $location.path('500');
                //}
            //    $scope.loading = true;
            //    return $q.reject(rejection);
            //},
            request: function (config) {
                $rootScope.loading = true;
                return config;
            },
            requestError: function (rejection) {
                $rootScope.loading = false;
                //$log.error('Request error:', rejection);
                return $q.reject(rejection);
            },
            response: function (response) {
                $rootScope.loading = false;
                return response;
            },
            responseError: function (rejection) {
                $rootScope.loading = false;
                //$log.error('Request error:', rejection);
                return $q.reject(rejection);
            },
        };
    });
    
    angular.module('HRMS').config( function ($httpProvider, $interpolateProvider, $routeProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');

        //$routeProvider
        //.when('/404', {
        //templateUrl : 'partials/404.tmpl.html',
        //controller: '404Ctrl',
        //resolve: {
        //project: function ($route) {
        //// return a dummy project, with only id populated
        //            return {id: $route.current.params.projectId};
        //}
        //}
        //});
    });


    //angular.module('HRMS', [
    //    'ngAnimate', 'ngCookies', 'ngResource', 'ngRoute'//, 'ngSanitize', 'ngTouch', 'ui.bootstrap'
    //])
    //.config(['$httpProvider', function ($httpProvider) {
    //    $httpProvider.interceptors.push('xmlHttpInteceptor');
    //    if (!$httpProvider.defaults.headers.get) {
    //        $httpProvider.defaults.headers.get = {};
    //    }
    //    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    //    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    //}]);

    //function errorHandler(status, message) {
    //    var scope = angular.element($('html')).scope();
    //    scope.errorHandler(status, message);
    //};
})();