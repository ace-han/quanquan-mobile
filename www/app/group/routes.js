define([
    './module'
    , './namespace'
    , '../namespace'
],
function (groupModule, groupNamespace, appNamespace) {
    'use strict';
    return groupModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(groupNamespace, {
                url: '/group'
                , parent: appNamespace
                , abstract: true
              })
              .state(groupNamespace + '.index', {
                url: ''
                , views: {
                  '@': {
                    templateUrl: 'app/group/templates/index.html'
                  }
                }
              })
              .state(groupNamespace + '.group', {
                url: '/group/:slug',
                views: {
                  '@': {
                    templateUrl: 'app/group/templates/group.html', 
                  }
                }
              })
              
        }]);
});