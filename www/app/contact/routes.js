define([
    './module'
    , './namespace'
    , '../namespace'
],
function (contactModule, moduleNamespace, appNamespace) {
    'use strict';
    return contactModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(moduleNamespace, {
                url: '/contact'
                , parent: appNamespace
                , abstract: true
              })
              .state(moduleNamespace + '.index', {
                url: ''
                , views: {
                  '@': {
                    templateUrl: 'app/contact/templates/index.html'
                    , controller: moduleNamespace + '.ContactsController as contactsController'
                    
                  }
                }
              })
              .state(moduleNamespace + '.chat', {
                url: '/chat'
                , views: {
                  '@': {
                    templateUrl: 'app/contact/templates/chat.html'
                    , controller: moduleNamespace + '.ChatController as chatController'
                  }
                }
              })
        }]);
});