define([
    './module'
    , './namespace'
    , '../namespace'
],
function (friendModule, moduleNamespace, appNamespace) {
    'use strict';
    return friendModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(moduleNamespace, {
                url: '/friend'
                , parent: appNamespace
                , abstract: true
              })
              .state(moduleNamespace + '.index', {
                url: ''
                , views: {
                  '@': {
                    templateUrl: 'app/friend/templates/index.html'
                    , controller: moduleNamespace + '.friendsController as friendsController'
                    
                  }
                }
              })
              .state(moduleNamespace + '.chat', {
                url: '/chat'
                , views: {
                  '@': {
                    templateUrl: 'app/friend/templates/chat.html'
                    , controller: moduleNamespace + '.ChatController as chatController'
                  }
                }
              })
        }]);
});