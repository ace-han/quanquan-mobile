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
                controller: authNamespace + '.LoginController as loginController',
                views: {
                  '@': {
                    templateUrl: "app/auth/templates/login.html"
                  }
                }
              })
        }]);
});