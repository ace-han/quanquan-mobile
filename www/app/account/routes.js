define([
    './module'
    , './namespace'
    , '../namespace'
],
function (accountModule, moduleNamespace, appNamespace) {
    'use strict';
    return accountModule.config([
        '$stateProvider'
        , function($stateProvider){

            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(moduleNamespace, {
                url: '/account'
                , parent: appNamespace
                , abstract: true
              })
              .state(moduleNamespace + '.index', {
                url: '/index'
                , cache: false
                , data: {
                  loginRequired: true
                }
                , resolve: {
                  userInfo: ['auth.principalService', function(principalService){
                    var userInfo = principalService.getCurrentUserInfo();
                    if(!userInfo.selfie_path){
                      userInfo.selfie_path = './img/anonymous.png';
                    }
                    return userInfo;
                  }]
                }
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/index.html'
                    , controller: moduleNamespace + '.IndexController as indexController'
                  }
                }
              })
              .state(moduleNamespace + '.profile', {
                url: '/profile/:profileId'
                , cache: false
                , abstract: true
                , resolve: {
                  profile: ['$stateParams', moduleNamespace + '.profileService', 
                    function($stateParams, profileService){
                      return profileService.getProfileInfo($stateParams.profileId);
                  }]
                  , currentUser: ['auth.principalService', function(principalService){
                    var userInfo = principalService.getCurrentUserInfo();
                    return userInfo;
                  }]
                }
              })
              .state(moduleNamespace + '.profile.edit', {
                url: '/edit'
                , cache: false
                , data: {
                  loginRequired: true
                }
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/profile_edit.html'
                    , controller: moduleNamespace + '.ProfileController as profileController'
                  }
                }
              })
              .state(moduleNamespace + '.profile.home', {
                url: '/home'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/tag_list.html'
                    , controller: moduleNamespace + '.TagsController as tagsController'
                  }
                }
              })
              .state(moduleNamespace + '.profile.tags', {
                url: '/tags'
                , cache: false
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/tag_list.html'
                    , controller: moduleNamespace + '.TagsController as tagsController'
                  }
                }
              })
        }]);
});