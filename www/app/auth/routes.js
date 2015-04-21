define([
    './module'
    , './namespace'
    , '../namespace'
],
function (authModule, authNamespace, appNamespace) {
    'use strict';
    return authModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(authNamespace, {
                url: '/auth',
                parent: appNamespace,
                abstract: true
              })
              .state(authNamespace + '.login', {
                url: "/login",
                // there is a warning on the official website says
                //  Warning: The controller will not be instantiated if template is not defined.
                //controller: authNamespace + '.LoginController as loginController',
                views: {
                  '@': {
                    // found controller: 'XxxController as xxxController' is working with ionic now
                    // BUT NOT controllerAs syntax!!!
                    templateUrl: "app/auth/templates/login.html", 
                    controller: authNamespace + '.LoginController as loginController'
                    
                  }
                }
              })
        }]);
});