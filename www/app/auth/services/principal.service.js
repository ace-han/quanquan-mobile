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

    principalService.$inject = ['$http', '$q', '$timeout', 'Restangular' ];

    var _identity = undefined
        , _authenticated = false;

    return principalService;

    function principalService($http, $q, $timeout, Restangular){
        var service = {
            isIdentityResolved: isIdentityResolved
            , isAuthenticated: isAuthenticated
            , isInRole: isInRole
            , isInAnyRole: isInAnyRole
            , authenticate: authenticate
            , identity: identity
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

        // function authenticate(identity) {
        //     _identity = identity;
        //     _authenticated = !!identity ;
        // }
        
        function authenticate(crefidential) {
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
                        _identity = response;
                        _authenticated = true;
                        deferred.resolve(_identity);
                    }, function(response) {
                        _identity = null;
                        _authenticated = false;
                        deferred.reject(_identity);
                    })
            } else {
                // look up the token in the localstorage or sqlite to retrieve the user identity
                deferred.reject(null);
            }
            return deferred.promise;
        }


        function identity(force) {
            // retrieve the current identity (with username, roles and stuff... )
            var deferred = $q.defer();
        
            if (!!force) {
                _identity = undefined;
            } 

            // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
              deferred.resolve(_identity);

              return deferred.promise;
            }

            // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
            //                   $http.get('/svc/account/identity', { ignoreErrors: true })
            //                        .success(function(data) {
            //                            _identity = data;
            //                            _authenticated = true;
            //                            deferred.resolve(_identity);
            //                        })
            //                        .error(function () {
            //                            _identity = null;
            //                            _authenticated = false;
            //                            deferred.resolve(_identity);
            //                        });

            // for the sake of the demo, fake the lookup by using a timeout to create a valid
            // fake identity. in reality,  you'll want something more like the $http request
            // commented out above. in this example, we fake looking up to find the user is
            // not logged in

            authenticate().then(function(identity){
                console.info(' principalService.identity#authenticate successful');
                deferred.resolve(identity);
            }, function(){
                console.info(' principalService.identity#authenticate failed');
                deferred.resolve(null);
            })
            return deferred.promise;
        } 
    }
});