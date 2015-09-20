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
                url: '/auth'
                , parent: appNamespace
                , abstract: true
              })
              .state(authNamespace + '.login', {
                url: "/login"
                // there is a warning on the official website says
                //  Warning: The controller will not be instantiated if template is not defined.
                //controller: authNamespace + '.LoginController as loginController',
                , views: {
                  '@': {
                    // found controller: 'XxxController as xxxController' is working with ionic now
                    // BUT NOT controllerAs syntax!!!
                    templateUrl: "app/auth/templates/login.html"
                    , controller: authNamespace + '.LoginController as loginController'
                  }
                }
              })
              .state(authNamespace + '.register', {
                url: "/register"
                , views: {
                  '@': {
                    templateUrl: "app/auth/templates/register.html" 
                  }
                }
              })
              .state(authNamespace + '.resetPassword', {
                url: "/reset-password"
                , views: {
                  '@': {
                    templateUrl: "app/auth/templates/password_reset_form.html" 
                  }
                }
              })
              .state(authNamespace + '.confirmResetPassword', {
                url: "/confirm-reset-password"
                , views: {
                  '@': {
                    templateUrl: "app/auth/templates/password_reset_confirm.html" 
                  }
                }
              })
              .state(authNamespace + '.changePassword', {
                url: "/change-password"
                , views: {
                  '@': {
                    templateUrl: "app/auth/templates/password_change_form.html" 
                  }
                }
              })
              .state(authNamespace + '.accessDenied', {
                url: "/change-password"
                , views: {
                  '@': {
                    templateUrl: "app/auth/templates/403.html" 
                  }
                }
              })
        }]);
});