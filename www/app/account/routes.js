define([
    './module'
    , './namespace'
    , '../namespace'
],
function (accountModule, accountNamespace, appNamespace) {
    'use strict';
    return accountModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(accountNamespace, {
                url: '/account'
                , parent: appNamespace
                , data: {
                  loginRequired: true
                }
                , abstract: true
              })
              .state(accountNamespace + '.profile', {
                url: '/profile'
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/profile.html'
                  }
                }
              })
              .state(accountNamespace + '.settings', {
                url: '/settings'
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/settings.html'
                  }
                }
              })
        }]);
});