define([
    './module'
    , './namespace'
    , '../namespace'
],
function (searchModule, searchNamespace, appNamespace) {
    'use strict';
    return searchModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(searchNamespace, {
                url: '/search'
                , parent: appNamespace
                , abstract: true
              })
              .state(searchNamespace + '.index', {
                url: ""
                , cache: false
                , views: {
                  '@': {
                    templateUrl: "app/search/templates/index.html"
                  }
                }
              });
        }]);
});