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
    , './quanquan/namespace'
    // for the convenience of invocation
    , 'ionic'
    , 'ngAnimate'
    , 'ngSanitize'
    , 'ngUiRouter'
    , 'ngUiRouterExtras'
    , 'ionicAngular'
    , 'ngMoment'
    , 'restangular'
    , './auth/module.require'
    , './account/module.require'
    , './contact/module.require'
    , './search/module.require'
    , './group/module.require'
    , './common/module.require'
    , './quanquan/module.require'
],
function (angular, namespace
    , authNamespace, accountNamespace
    , contactNamespace, searchNamespace
    , groupNamespace, commonNamespace
    , quanquanNamespace) {
    
    /* 
        App official entry point
    */

    'use strict';

    var app = angular.module(namespace, 
        ['ionic'
        , 'ct.ui.router.extras.future', 'ct.ui.router.extras.statevis' // this two should be manually added
        , 'angularMoment'
        , 'restangular'
        , authNamespace, accountNamespace
        , contactNamespace, searchNamespace
        , groupNamespace, commonNamespace
        , quanquanNamespace
        ])
        .config(['$ionicConfigProvider', 'RestangularProvider', 
                function($ionicConfigProvider, RestangularProvider) {
            // remove back button text completely
            $ionicConfigProvider.backButton.previousTitleText(false).text('');
            $ionicConfigProvider.navBar.alignTitle('left');

            // config global Restangular
            if(window.cordova){
                // for simplicity, when cordova is available
                RestangularProvider.setBaseUrl('http://onedegree.madeinace.com/api/v1');   
            } else {
                RestangularProvider.setBaseUrl('/api/v1');
            }
            RestangularProvider
                .setRequestSuffix('/')
                //.setFullResponse(true)
                .addResponseInterceptor(function(data, operation, what, url, response, deferred) {
                    // .. to look for getList operations
                    if (operation === "getList") {
                        // add totalCount according to doc. 
                        // refer to https://github.com/marmelab/ng-admin/blob/master/doc/API-mapping.md#total-number-of-results
                        if ('count' in data) {
                            response.totalCount = data.count;
                            return data.result; // so return data.result will suite our requirement
                        } else {
                            response.totalCount = data.length;
                            return data;
                        }
                    }
                    return data;
                });
            
        }])
        .run(['Restangular', 'localStorageService', 
                // in order to avoid dependency, I choose localStorageService over auth.principalService
                function (Restangular, localStorageService) {
            Restangular.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
                headers.Authorization = 'JWT ' + localStorageService.get('jwt_token');
                return {
                    headers: headers
                }
            });
        }])
    return app;
});