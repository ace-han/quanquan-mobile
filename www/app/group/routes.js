define([
        './module', './namespace', '../namespace'
    ],
    function(groupModule, moduleNamespace, appNamespace) {
        'use strict';
        return groupModule.config([
            '$stateProvider',
            function($stateProvider) {
                $stateProvider
                // a abstract view for each module view is necessary for the time being
                    .state(moduleNamespace, {
                        url: '/group',
                        parent: appNamespace,
                        abstract: true
                    })
                    .state(moduleNamespace + '.index', {
                        url: '',
                        cache: false,
                        views: {
                            '@': {
                                templateUrl: 'app/group/templates/index.html',
                                controller: moduleNamespace + '.GroupsController as groupsController'
                            }
                        }
                    })
                    .state(moduleNamespace + '.group', {
                        url: '/group/:slug',
                        cache: false,
                        views: {
                            '@': {
                                templateUrl: 'app/group/templates/group.html',
                                controller: moduleNamespace + '.GroupController as groupController'
                            }
                        }
                    })
                    .state(moduleNamespace + '.group.info', {
                        url: '/info',
                        cache: false,
                        views: {
                            '@': {
                                templateUrl: 'app/group/templates/group_info.html',
                                controller: moduleNamespace + '.GroupInfoController as groupInfoController'
                            }
                        }
                    })

                .state(moduleNamespace + '.topic', {
                    url: '/topic/:id',
                    cache: false,
                    views: {
                        '@': {
                            templateUrl: 'app/group/templates/topic.html',
                            controller: moduleNamespace + '.TopicController as topicController'
                        }
                    }
                })

                .state(moduleNamespace + '.topic.withReplies', {
                    url: '/with-replies' // here means with replies
                        ,
                    cache: false,
                    views: {
                        'topic-replies@group.topic': {
                            templateUrl: 'app/group/templates/reply_list.html',
                            controller: moduleNamespace + '.RepliesController as repliesController'
                        }
                    }
                })

            }
        ]);
    });
