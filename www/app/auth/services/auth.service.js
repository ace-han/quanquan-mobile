
define([
    'angular'
    , '../module'
    , '../namespace'

],
function (angular, module, namespace) {
    'use strict';
    // Second, you need a service that checks the state the user wants to go to, 
    // makes sure they're logged in,  and then does a role check
    // refer to http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication

    var name = namespace + ".authService";
    
    
    module.factory(name, authService);

    authService.$inject = ['$rootScope', '$state', 'auth.principalService' ];

    return authService;

    function authService($rootScope, $state, principalService){
        var service = {
            authenticate: authenticate
            , authorize: authorize
        }

        return service;

        function authorize(){
            return principalService
                .identity()
                .then(function() {
                    var isAuthenticated = principalService.isAuthenticated();

                    if ($rootScope.toState.data
                        && $rootScope.toState.data.roles 
                        && $rootScope.toState.data.roles.length > 0 
                        && !principalService.isInAnyRole($rootScope.toState.data.roles)) {
                        if (isAuthenticated){
                            $state.go('auth.accessDenied', {reason: 'Not Authorized'}); // user is signed in but not authorized for desired state
                        } else {
                            // user is not authenticated. stow the state they wanted before you
                            // send them to the signin state, so you can return them when you're done
                            $rootScope.returnToState = $rootScope.toState;
                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                            // now, send them to the signin state so they can log in
                            $state.go('auth.login');
                        }
                    }
                });
        }

        function authenticate(){
            return principalService
                .identity()
                .then(function() {
                    var isAuthenticated = principalService.isAuthenticated();

                    if ($rootScope.toState.data
                        && $rootScope.toState.data.loginRequired 
                        && !isAuthenticated ) {
                        // user is not authenticated. stow the state they wanted before you
                        // send them to the signin state, so you can return them when you're done
                        $rootScope.returnToState = $rootScope.toState;
                        $rootScope.returnToStateParams = $rootScope.toStateParams;

                        // now, send them to the signin state so they can log in
                        $state.go('auth.login');
                    }
                });
        }
    }
});