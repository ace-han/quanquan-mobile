define([
    'angular'
    , './namespace'
    // add necessary app as you wish
    , './auth/namespace'
    , './account/namespace'
    , './common/namespace'
    // for the convenience of invocation
    , 'ionic'
    , 'ngAnimate'
    , 'ngSanitize'
    , 'ngUiRouter'
    , 'ionicAngular'
    , './auth/module.require'
    , './account/module.require'
    , './common/module.require'
],
function (angular, namespace, authNamespace, accountNamespace, commonNamespace) {
    'use strict';

    var app = angular.module(namespace, 
        ['ionic', authNamespace, accountNamespace, commonNamespace])
        .config(function($ionicConfigProvider) {
            // remove back button text completely
            $ionicConfigProvider.backButton.previousTitleText(false).text('');
            $ionicConfigProvider.navBar.alignTitle('left');
        })
        .run(function () {
          
        })
    return app;
});