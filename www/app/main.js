
require.config({
    baseUrl: '/', // let's move back to 'www' folder
    waitSeconds: 0,
    paths: {
        "ngCordova": 'lib/ngCordova/dist/ng-cordova'
        ,"cordova": 'cordova'
        ,"ionic": 'lib/ionic/js/ionic'
        ,"ionicAngular": 'lib/ionic/js/ionic-angular'
        ,"angular": 'lib/angular/angular'
        ,"ngAnimate": 'lib/angular-animate/angular-animate'
        ,"ngSanitize": 'lib/angular-sanitize/angular-sanitize'
        ,"ngUiRouter": 'lib/angular-ui-router/release/angular-ui-router'

    },
    shim: {
        "angular": {exports: 'angular'}
        , "ngCordova": {deps: ['angular']}
        , "cordova": {deps: ['ngCordova']}
        , "ionic": {exports: 'ionic'}
        , "ngAnimate": {deps: ['angular']}
        , "ngSanitize": {deps: ['angular']}
        , "ngUiRouter": {deps: ['angular']}
        , "ionicAngular": {deps: ['ngAnimate', 'ngSanitize', 'ngUiRouter', 'ionic']}
    }
});

require([
        'cordova'
        ,'angular'
        ,'app/namespace'
        ,'app/app'
        ,'app/routes'
    ],
    function (cordova, angular, namespace) {
        angular.element(document).ready(function() {
             angular.bootstrap(document, [namespace]);
       });
    });