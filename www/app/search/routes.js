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
                , resolve: {
                  currentUser: ['auth.principalService', function(principalService){
                    var userInfo = principalService.getCurrentUserInfo();
                    return userInfo;
                  }]
                }
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
              .state(moduleNamespace + '.alumniSearch', {
                url: '/alumni/search?schoolType'
                , data: {
                  loginRequired: true
                }
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/alumni_search.html'
                    , controller: moduleNamespace + '.AlumniSearchController as alumniSearchController'
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