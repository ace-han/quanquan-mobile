define([
    'angular',
    'app/app',
    './auth/namespace'
],
function (angular, app, namespaceAuth) {
    'use strict';
    return app.config([
        '$stateProvider'
        , '$urlRouterProvider'
        , function($stateProvider, $urlRouterProvider){
            $stateProvider
                .state('app', {
                  url: "/app",
                  abstract: true,
                  templateUrl: "templates/main.html",
                })
                .state('app.home', {
                  url: "/home",
                  views: {
                    'mainContent': {
                      templateUrl: "templates/home.html",
                    }
                  }
                })
                .state('app.others', {
                  url: "/others",
                  views: {
                    'mainContent': {
                      templateUrl: "templates/others.html",
                    }
                  }
                })
                // if none of the above states are matched, use this as the fallback
                $urlRouterProvider.otherwise('/app/others');
            }]);
});