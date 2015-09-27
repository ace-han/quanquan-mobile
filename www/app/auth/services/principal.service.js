define([
    'angular'
    , '../module'
    , '../namespace'

],
function (angular, module, namespace) {
    'use strict';
    // First, you need a service to store the user's identity
    // refer to http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication

    var name = namespace + ".principalService";
    
    
    module.factory(name, principalService);

    principalService.$inject = ['$http', '$q', '$timeout', '$rootScope', 'Restangular', 'localStorageService', 'base64Service', namespace + '.EVENTS' ];

    var _identity = undefined
        , _authenticated = false;

    return principalService;

    function principalService($http, $q, $timeout, $rootScope, Restangular, localStorageService, base64Service, AUTH_EVENTS){
        var service = {
            isIdentityResolved: isIdentityResolved
            , isAuthenticated: isAuthenticated
            , isInRole: isInRole
            , isInAnyRole: isInAnyRole
            , authenticate: authenticate
            , identity: identity
            , logout: logout
            , getJwtToken: getToken
        }

        var authRestangular = Restangular.all('auth'), 
            tokenRestangular = authRestangular.all('token');
        return service;

        function isIdentityResolved(){
            return angular.isDefined(_identity);
        }

        function isAuthenticated() {
            return _authenticated;
        }

        function isInRole(role) {
            if (!_authenticated || !_identity.roles){
                return false;
            }
            return _identity.roles.indexOf(role) != -1;
        }

        function isInAnyRole(roles) {
            if (!_authenticated || !_identity.roles) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) {
                    return true;
                }
            }

            return false;
        }
        
        function authenticate(crefidential) {
            function onSuccess(token, deferred){
                var payload = resolvePayloadClaims(token);
                _identity = payload;
                _authenticated = true;
                //console.info('authentication successful inited');
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, payload);
                deferred.resolve(_identity);
            }

            function onFailure(deferred){
                logout();
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                deferred.reject(null);
            }

            var deferred = $q.defer();
            if(!! crefidential){
                tokenRestangular
                    // .costomPOST(
                    //     crefidential // elem => post body
                    //     , 'login'   //route
                    //     , {}    // query parameter
                    //     , {}    // headers
                    //     )
                    .post(crefidential)
                    .then(function(response){
                        setToken(response.token);
                        onSuccess(response.token, deferred);
                    }, function(response) {
                        onFailure(deferred);
                    })
            } else {
                // look up the token in the localstorage or sqlite to retrieve the user identity
                var token = getToken();
                if(!!token){
                    onSuccess(token, deferred);       
                } else {
                    onFailure(deferred);
                }                
            }
            return deferred.promise;
        }


        function identity(force) {
            // retrieve the current identity (with username, roles and stuff... )
            var deferred = $q.defer();


            // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
              deferred.resolve(_identity);

              return deferred.promise;
            }

            authenticate().then(function(identity){
                console.info(' principalService.identity#authenticate successful');
                deferred.resolve(identity);
            }, function(){
                console.info(' principalService.identity#authenticate failed');
                deferred.resolve(null);
            })
            return deferred.promise;
        }

        function logout(){
            _identity = undefined;
            _authenticated = false;
            return localStorageService.remove('jwt_token');
        }

        function getToken(){
            return localStorageService.get('jwt_token');
        }

        function setToken(token){
            localStorageService.set('jwt_token', token);
        }

        function resolvePayloadClaims(token){
            var tokens = token.split('.'); //tokens[0]->header, tokens[1]->payload, tokens[2]->signature
            var payload = base64Service.decode(tokens[1]);
            return JSON.parse(payload);
        }
    }
});