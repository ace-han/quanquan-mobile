define([
    './module'
    , './namespace'
    , '../namespace'
],
function (searchModule, moduleNamespace, appNamespace) {
    'use strict';
    return searchModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(moduleNamespace, {
                url: '/search'
                , parent: appNamespace
                , abstract: true
              })
              .state(moduleNamespace + '.index', {
                url: '?q&category'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/index.html'
                  }
                }
              })
              .state(moduleNamespace + '.socialPath', {
                url: '/social-path'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/social_path.html'
                  }
                }
              });
        }]);
});