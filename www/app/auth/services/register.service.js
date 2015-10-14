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

    registerService.$inject = ['$q', 'Restangular', namespace+'.principalService'];

    return registerService;

    function registerService($q, Restangular, principalService){
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

        function register(registerInfo) {
        	var deferred = $q.defer();
			authRestangular.customPOST(registerInfo, 'register')
            				.then(function(response){
            					// response = {'token': 'xxxxxxxx', is_necessary_user_info_filled: true/false}
            					principalService.setJwtToken(response.token);
            					principalService.onLoginSuccessful(response.token, deferred, response.is_necessary_user_info_filled);
            				}
            				, function(response){
            					// getting the error
            					console.error(response);
            					deferred.reject(response);
            				})
        	return deferred.promise;
            
        }
    }
});