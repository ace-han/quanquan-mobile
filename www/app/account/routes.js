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
                , data: {
                  loginRequired: true
                }
                , abstract: true
              })
              .state(moduleNamespace + '.index', {
                url: '/index'
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
                url: '/profile'
                , resolve: {
                  profile: [moduleNamespace + '.profileService', 'auth.principalService', 
                    function(profileService, principalService){
                      var userId = principalService.getCurrentUserInfo().user_id;
                      return profileService.getUserProfileInfo(userId);
                  }]
                }
                , views: {
                  '@': {
                    templateUrl: 'app/account/templates/profile.html'
                    , controller: moduleNamespace + '.ProfileController as profileController'
                  }
                }
              })
              
        }]);
});