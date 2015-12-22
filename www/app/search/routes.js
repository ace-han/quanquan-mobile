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
                url: '?q'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/index.html'
                    , controller: moduleNamespace + '.GeneralSearchController as generalSearchController'
                  }
                }
              })
              .state(moduleNamespace + '.alumniSearch', {
                url: '/alumni/search?schoolType&q'
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
              .state(moduleNamespace + '.phoneContactSearch', {
                url: '/phone-contact/search?q'
                , data: {
                  loginRequired: true
                }
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/phone_contact_search.html'
                    , controller: moduleNamespace + '.PhoneContactSearchController as phoneContactSearchController'
                  }
                }
              })
              .state(moduleNamespace + '.routes', {
                url: '/routes?targetUserId'
                , data: {
                  loginRequired: true
                }
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/routes.html'
                    //, controller: moduleNamespace + '.SocialRoutesController as socialRoutesController'
                  }
                }
              })
              .state(moduleNamespace + 'routes.detail', {
                url: '/detail?routeHash'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/route_detail.html'
                  }
                }
              })
              .state(moduleNamespace + '.reference', {
                url: '/reference?q&category'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/reference.html'
                  }
                }
              });
        }]);
});