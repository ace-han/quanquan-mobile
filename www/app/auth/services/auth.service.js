define([
    '../module',
    '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + ".authService";

    module.factory(name, authService);

    authService.$inject = ['$http', '$location', '$q', '$window' ];

    return authService;

    function authService($http, $location, $q, $window){
        var service = {
            setToken: setToken,
            getToken: getToken,
            deleteToken: deleteToken,
            login: login,
            logout: logout
        }

        return service;

        function getToken() {
            return $window.localStorage.getItem('token');
        }

        function setToken(token) {
            $window.localStorage.setItem('token', token);
        }

        function deleteToken() {
            $window.localStorage.removeItem('token');
        }

        function login(username, password){
            console.log(username, password);
            var deferred = $q.defer();

            $http.post('/api/v1/account/login/', 
                {   username: username, 
                    password: password
                }).success(function (response, status, headers, config) {
                    if (response.token) {
                        service.setToken(response.token);
                    }

                    deferred.resolve(response, status, headers, config);
                }).error(function (response, status, headers, config) {
                    deferred.reject(response, status, headers, config);
                });

            return deferred.promise;
        }

        function logout() {
          service.deleteToken();
        }
    }
});