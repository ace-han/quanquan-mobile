define([
    'angular'
    , '../module'
    , '../namespace'

],
function (angular, module, namespace) {
    'use strict';
    // all you need to do is listen in on ui-router's $stateChangeStart. 
    // refer to http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
    
    module.run(['$rootScope', '$state', '$stateParams', 
                'auth.authService', 'auth.principalService',
        function($rootScope, $state, $stateParams, authService, principal) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                // track the state the user wants to go to; authService service needs this
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
                // check if already login on every state change
                authService.authenticate();
                // if the principal is resolved, do an authService check immediately. otherwise,
                // it'll be done when the state it resolved.
                if (principal.isIdentityResolved()){
                    authService.authorize();
                }
            });
        }
    ]);
});