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
            login: login
        }

        return service;

        function login(username, password){
            console.log(username, password);
        }
    }
});