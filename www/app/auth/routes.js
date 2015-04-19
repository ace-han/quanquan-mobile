define([
    './module'
    , './namespace'
    
],
function (authModule, authNamespace) {
    'use strict';
    return authModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(authNamespace, {
                url: '/auth',
                abstract: true
              })
              .state(authNamespace + '.login', {
                url: "/login",
                views: {
                  '@': {
                    templateUrl: "app/auth/templates/login.html"
                  }
                }
              })
        }]);
});