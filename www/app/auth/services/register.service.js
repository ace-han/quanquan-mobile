define([
    'angular'
    , '../module'
    , '../namespace'

],
function (angular, module, namespace) {
    'use strict';
    // First, you need a service to store the user's identity
    // refer to http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication

    var name = namespace + ".registerService";
    
    
    module.factory(name, registerService);

    registerService.$inject = ['Restangular'];

    return registerService;

    function registerService(Restangular){
        var service = {
            getCityList: getCityList
            , register: register
        }

        var accountRestangular = Restangular.all('account')
            , citiesRestangular = accountRestangular.all('cities')
            , authRestangular = Restangular.all('auth')

        return service;
        
        function getCityList() {
        	return citiesRestangular.getList()
        		.then(function(data){
        			// we just need the unrestangularized data;
        			return data.plain();
        		});
        }

        function register() {
            
        }
    }
});