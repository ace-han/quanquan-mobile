define([
    './module'
    , './namespace'
    , '../namespace'
],
function (friendModule, moduleNamespace, appNamespace) {
  'use strict';

  //config.$inject = ['$stateProvider', '$urlRouterProvider'];
  config.$inject = ['$stateProvider'];
  // run.$inject = ['$rootScope', '$state'] // already done in quanquan's route config
  friendModule.config( config );

  return config;

  //function config($stateProvider, $urlRouterProvider){
  function config($stateProvider){
    // refer to https://github.com/angular-ui/ui-router/issues/1584#issuecomment-75137373
    // tested. Not working might as well change left-pannel.html
    //$urlRouterProvider.when('/friend', '/friend/phone-contacts');
    $stateProvider
    // a abstract view for each module view is necessary for the time being
    .state(moduleNamespace, {
      url: '/friend'
      , parent: appNamespace
      , abstract: true
    })
    .state(moduleNamespace + '.index', {
      url: ''
      //, redirectTo: moduleNamespace + '.index.phoneContacts'
      , data: {
        // data in parent state is inheritated by children state
        loginRequired: true
      }
      , resolve: {
        profile: ['auth.principalService', 'account.profileService', 
          function(principalService, profileService){
            var userInfo = principalService.getCurrentUserInfo();
            return profileService.getUserProfileInfo(userInfo.user_id, {fields: 'id,college,high_school'});
        }]
        , currentUser: ['auth.principalService', function(principalService){
          var userInfo = principalService.getCurrentUserInfo();
          return userInfo;
        }]
      }
      , cache: false
      , views: {
        '@': {
          templateUrl: 'app/friend/templates/index.html'
          , controller: moduleNamespace + '.FriendsController as friendsController'
          
        }
      }
    })
    .state(moduleNamespace + '.index.phoneContacts', {
      url: '/phone-contacts'
      ,cache: false
      , views: {
        'phone-contacts@friend.index': {
          templateUrl: 'app/friend/templates/phone_contacts.html'
          , controller: moduleNamespace + '.PhoneContactsController as phoneContactsController'
          
        }
      }
    })
    .state(moduleNamespace + '.index.college', {
      url: '/college'
      , cache: false
      , resolve: {
        schoolType: function(){ return 'college'; }
      }
      , views: {
        'college@friend.index': {
          templateUrl: 'app/friend/templates/college_alumni.html'
          , controller: moduleNamespace + '.AlumniController as alumniController'
          
        }
      }
    })
    .state(moduleNamespace + '.index.highSchool', {
      url: '/high-school'
      , cache: false
      , resolve:{
        schoolType: function(){ return 'high_school'; }
      }
      , views: {
        'high-school@friend.index': {
          templateUrl: 'app/friend/templates/high_school_alumni.html'
          , controller: moduleNamespace + '.AlumniController as alumniController'
          
        }
      }
    })
    .state(moduleNamespace + '.chat', {
      url: '/chat'
      , views: {
        '@': {
          templateUrl: 'app/friend/templates/chat.html'
          , controller: moduleNamespace + '.ChatController as chatController'
        }
      }
    })
  }
     
});