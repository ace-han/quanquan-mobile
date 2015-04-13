define([
    'angular'
    , './namespace'
    // add necessary app as you wish
    , './auth/namespace'
    // for the convenience of invocation
    , 'ionic'
    , 'ngAnimate'
    , 'ngSanitize'
    , 'ngUiRouter'
    , 'ionicAngular'
    , './auth/module.require'
    , '../components/module.require'
],
function (angular, namespace, namespaceAuth) {
    'use strict';

    var app = angular.module(namespace, 
        ['ionic'])
        .run(function () {
          //
        });
    return app;
});