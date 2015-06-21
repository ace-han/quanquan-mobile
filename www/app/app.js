define([
    'angular'
    , './namespace'
    // add necessary app as you wish
    , './auth/namespace'
    , './account/namespace'
    , './contact/namespace'
    , './search/namespace'
    , './group/namespace'
    , './common/namespace'
    // for the convenience of invocation
    , 'ionic'
    , 'ngAnimate'
    , 'ngSanitize'
    , 'ngUiRouter'
    , 'ngUiRouterExtras'
    , 'ionicAngular'
    , './auth/module.require'
    , './account/module.require'
    , './contact/module.require'
    , './search/module.require'
    , './group/module.require'
    , './common/module.require'
],
function (angular, namespace, 
    authNamespace, accountNamespace, 
    contactNamespace, searchNamespace, 
    groupNamespace, commonNamespace) {
    
    /* 
        App official entry point
    */

    'use strict';

    var app = angular.module(namespace, 
        ['ionic'
        , 'ct.ui.router.extras.future', 'ct.ui.router.extras.statevis' // this two should manually add
        , authNamespace, accountNamespace
        , contactNamespace, searchNamespace
        , groupNamespace, commonNamespace
        ])
        .config(['$ionicConfigProvider', function($ionicConfigProvider) {
            // remove back button text completely
            $ionicConfigProvider.backButton.previousTitleText(false).text('');
            $ionicConfigProvider.navBar.alignTitle('left');
        }])
        .run(function () {
          
        })
    return app;
});