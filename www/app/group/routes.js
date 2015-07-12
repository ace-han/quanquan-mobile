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
                    , controller: groupNamespace + '.GroupInfoController as groupInfoController'
                  }
                }
              })
              
              .state(groupNamespace + '.topic', {
                url: '/topic/:id'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/group/templates/topic.html'
                    , controller: groupNamespace + '.TopicController as topicController'
                  }
                }
              })

              .state(groupNamespace + '.topic.withReplies', {
                url: '/with-replies'  // here means with replies
                , cache: false
                , views: {
                  'topic-replies@group.topic': {
                    templateUrl: 'app/group/templates/reply_list.html'
                    , controller: groupNamespace + '.RepliesController as repliesController'
                  }
                }
              })
              
        }]);
});