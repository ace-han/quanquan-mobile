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

    principalService.$inject = ['$q', '$rootScope', 'Restangular', 'localStorageService', 'base64Service', namespace + '.EVENTS' ];

    var _identity = undefined
        , _authenticated = false;

    return principalService;

    function principalService($q, $rootScope, Restangular, localStorageService, base64Service, AUTH_EVENTS){
        var service = {
            isIdentityResolved: isIdentityResolved
            , isAuthenticated: isAuthenticated
            , isInRole: isInRole
            , isInAnyRole: isInAnyRole
            , authenticate: authenticate
            , identity: identity
            , logout: logout
            , getJwtToken: getJwtToken
            , setJwtToken: setJwtToken
            , onLoginSuccessful: onLoginSuccessful
            , onLoginFailed: onLoginFailed
            , verify: verify
        }

        var authRestangular = Restangular.all('auth')
            , tokenRestangular = authRestangular.all('token');
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

        function onLoginSuccessful(token, deferred, is_necessary_user_info_filled){
            var payload = resolvePayloadClaims(token);
            _identity = payload;
            _authenticated = true;
            //console.info('authentication successful inited');
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, payload);
            deferred.resolve({
                payload: payload
                , is_necessary_user_info_filled: is_necessary_user_info_filled
            });
        }

        function onLoginFailed(deferred){
            logout();
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            deferred.reject(null);
        }
        
        function authenticate(crefidential) {
            var deferred = $q.defer();
            if(!! crefidential){
                authRestangular
                    // .costomPOST(
                    //     crefidential // elem => post body
                    //     , 'login'   //route
                    //     , {}    // query parameter
                    //     , {}    // headers
                    //     )
                    .customPOST(crefidential, 'login')
                    .then(function(response){
                        setJwtToken(response.token);
                        onLoginSuccessful(response.token, deferred, response.is_necessary_user_info_filled);
                    }, function(response) {
                        onLoginFailed(deferred);
                    })
            } else {
                // look up the token in the localstorage or sqlite to retrieve the user identity
                var token = getJwtToken();
                if(!!token){
                    onLoginSuccessful(token, deferred);       
                } else {
                    onLoginFailed(deferred);
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
            localStorageService.remove('jwt_token');
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        }

        function getJwtToken(){
            return localStorageService.get('jwt_token');
        }

        function setJwtToken(token){
            localStorageService.set('jwt_token', token);
        }

        function resolvePayloadClaims(token){
            var tokens = token.split('.'); //tokens[0]->header, tokens[1]->payload, tokens[2]->signature
            var payload = base64Service.decode(tokens[1]);
            return JSON.parse(payload);
        }

        function verify(){
            // verify only cares about username and its integrity
            // no password, nickname or city update will break the token usage
            var token = getJwtToken();
            tokenRestangular
                    // .costomPOST(
                    //     crefidential // elem => post body
                    //     , 'login'   //route
                    //     , {}    // query parameter
                    //     , {}    // headers
                    //     )
                    .customPOST({token: token}, 'verify')
                    .then(function(response){
                        console.info(response);
                    }, function(response) {
                        console.info(response);
                    })

        }
    }
});