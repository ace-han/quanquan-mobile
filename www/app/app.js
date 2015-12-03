define([
    'angular'
    , './namespace'
    // add necessary app as you wish
    , './auth/namespace'
    , './account/namespace'
    , './friend/namespace'
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
    , 'angular-loading-bar'
    , 'ng-tags-input'
    , 'ionic-filter-bar'
    , './auth/module.require'
    , './account/module.require'
    , './friend/module.require'
    , './search/module.require'
    , './group/module.require'
    , './common/module.require'
    , './quanquan/module.require'
],
function (angular, namespace
    , authNamespace, accountNamespace
    , friendNamespace, searchNamespace
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
        , 'angular-loading-bar'
        , 'ngTagsInput'
        , 'jett.ionic.filter.bar'
        , authNamespace, accountNamespace
        , friendNamespace, searchNamespace
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
                // RestangularProvider.setBaseUrl('http://192.168.56.1:8090/api/v1');
                if(window.LiveReload){
                    // local dev time!!!
                    RestangularProvider.setBaseUrl(window.location.origin+'/api/v1');
                }else if(window.cordova.env == 'qa'){
                    RestangularProvider.setBaseUrl('http://onedegree-qa.madeinace.com/api/v1');
                } else {
                	RestangularProvider.setBaseUrl('http://onedegree.madeinace.com/api/v1');   
                }
        
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
                        // plz note that we are not ng-admin. response.totalCount doesnt necessary meaning anything for us
                        if ('count' in data) {
                            // response.totalCount = data.count;
                            data.results.count = data.count;
                            return data.results; // so return data.results will suite our requirement
                        } else {
                            //response.totalCount = data.length;
                            data.count = data.length;
                            return data;
                        }
                    }
                    return data;
                });
            
        }])
        .run(['$window', '$ionicPlatform', function ($window, $ionicPlatform) {
            $ionicPlatform.ready(function () {
                if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
                    $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    $window.cordova.plugins.Keyboard.disableScroll(true);
                }
            });
        }])
    return app;
});
