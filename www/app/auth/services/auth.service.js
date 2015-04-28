define([
    'angular',
    '../module',
    '../namespace'

],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".authService";

    module.factory(name, authService);

    authService.$inject = ['$http', '$q', '$window' ];

    return authService;

    function authService($http, $q, $window){
        var service = {
            login: login,
            logout: logout,
            currentUser: currentUser,
            setToken: setToken,
            getToken: getToken,
            deleteToken: deleteToken
        }

        return service;

        

        function login(username, password){

            var deferred = $q.defer();

            $http.post('/api/v1/auth/login/', 
                {   username: username, 
                    password: password
                }).success(function (response, status, headers, config) {
                    if (response.token) {
                        // if token means success, we can extract the payload
                        var token = response.token;
                        var payload = angular.fromJson( $window.atob(token.split('.')[1]) );
                        service.setToken(response.token);

                        deferred.resolve(payload);
                    }
                    // for some other un-expected situation
                    deferred.resolve(response, status, headers, config);
                }).error(function (response, status, headers, config) {
                    deferred.reject(response, status, headers, config);
                });
            return deferred.promise;
        }

        function logout() {
          service.deleteToken();
        }

        var _currentUser;

        function currentUser(){
            return _currentUser;
        }

        function isAuthenticated(){
            return !!_currentUser;
        }

        function getToken() {
            return $window.localStorage.getItem('token');
        }

        function setToken(token) {
            $window.localStorage.setItem('token', token);
        }

        function deleteToken() {
            $window.localStorage.removeItem('token');
        }
    }
});