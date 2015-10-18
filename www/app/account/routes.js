define([
    './module'
    , './namespace'
    , '../namespace'
],
function (accountModule, moduleNamespace, appNamespace) {
    'use strict';
    return accountModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(moduleNamespace, {
                url: '/account'
                , parent: appNamespace
                , data: {
                  loginRequired: true
                }
                , abstract: true
              })
              .state(moduleNamespace + '.profile', {
                url: '/profile'
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/profile.html'
                    , controller: moduleNamespace + '.ProfileController as profileController'
                  }
                }
              })
              .state(moduleNamespace + '.accountHome', {
                url: '/account-home'
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/account_home.html'
                  }
                }
              })
        }]);
});