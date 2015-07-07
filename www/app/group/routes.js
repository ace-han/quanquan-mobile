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
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/group/templates/index.html'
                    , controller: groupNamespace + '.GroupsController as groupsController'
                  }
                }
              })
              .state(groupNamespace + '.group', {
                url: '/group/:slug'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/group/templates/group.html'
                    , controller: groupNamespace + '.GroupController as groupController'
                  }
                }
              })
              .state(groupNamespace + '.group.info', {
                url: '/info'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/group/templates/group_info.html'
                  }
                }
              })
              
        }]);
});