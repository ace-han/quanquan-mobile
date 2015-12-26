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
                url: '/routes/:targetUser'
                , data: {
                  loginRequired: true
                }
                , cache: true
                , resolve: {
                  socialRoutes: ['search.socialService', '$stateParams', '$ionicLoading'
                    , function(socialService, $stateParams, $ionicLoading){
                    return socialService.getSocialRoutes($stateParams.targetUser)
                          .then(function(response){
                            return response.results
                          }, function(error){
                            console.error(error)
                            $ionicLoading.show({ template: 'Server Error!', noBackdrop: true, duration: 1000 });
                          });
                  }]
                }
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/routes.html'
                    , controller: moduleNamespace + '.SocialRoutesController as socialRoutesController'
                  }
                }
              })
              .state(moduleNamespace + '.routeDetail', {
                url: '/route-detail/:routeCode'
                , data: {
                  loginRequired: true
                }
                , cache: false
                , resolve: {
                  profiles: ['search.socialService', '$stateParams', '$ionicLoading'
                    , function(socialService, $stateParams, $ionicLoading){
                    return socialService.getRouteDetail($stateParams.routeCode)
                          .then(function(response){
                            return response.results
                          }, function(error){
                            console.error(error)
                            $ionicLoading.show({ template: 'Server Error!', noBackdrop: true, duration: 1000 });
                          });
                  }]
                }
                , views: {
                  '@': {
                    templateUrl: 'app/search/templates/route_detail.html'
                    , controller: moduleNamespace + '.RouteDetailController as routeDetailController'
                  }
                }
              })
              
        }]);
});