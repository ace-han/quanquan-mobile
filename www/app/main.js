
require.config({
    // baseUrl in this config means path relative to index.html
    // 1. if no data-main defined then baseUrl relative to the folder where require.js lies
    // 2. if data-main defined then baseUrl relative to the folder where data-main="xxx" lies
    // 3. if in require.config({baseUrl: 'xxx'}) defined then base Url relative to the folder where index.html lies
    baseUrl: './', 
    waitSeconds: 0,
    paths: {
        'ngCordova': 'lib/ngCordova/dist/ng-cordova'
        ,'cordova': 'cordova'
        ,'ionic': 'lib/ionic/release/js/ionic'
        ,'ionicAngular': 'lib/ionic/release/js/ionic-angular'
        ,'angular': 'lib/angular/angular'
        ,'ngAnimate': 'lib/angular-animate/angular-animate'
        ,'ngSanitize': 'lib/angular-sanitize/angular-sanitize'
        ,'ngUiRouter': 'lib/angular-ui-router/release/angular-ui-router'
        ,'ngUiRouterExtras': 'lib/ui-router-extras/release/ct-ui-router-extras'
        ,'ngTimeline': 'lib/angular-timeline/dist/angular-timeline'
        ,'moment': 'lib/moment/min/moment-with-locales'
        ,'ngMoment': 'lib/angular-moment/angular-moment'
        ,'ngElastic': 'lib/angular-elastic/elastic'
        ,'AutoLinker': 'lib/Autolinker.js/dist/Autolinker'
        ,'lodash': 'lib/lodash/lodash'
        ,'restangular': 'lib/restangular/dist/restangular'
        ,'angular-loading-bar': 'lib/angular-loading-bar/build/loading-bar'
        ,'ng-tags-input': 'lib/ng-tags-input/ng-tags-input'
        ,'ionic-filter-bar': 'lib/ionic-filter-bar/dist/ionic.filter.bar'
        ,'google-libphonenumber': 'lib/google-libphonenumber/dist/browser/libphonenumber'

    },
    shim: {
        'angular': {exports: 'angular'}
        , 'ngCordova': {deps: ['angular']}
        , 'cordova': {deps: ['ngCordova']}
        , 'ionic': {deps: ['angular'], exports: 'ionic'}
        , 'ngAnimate': {deps: ['angular']}
        , 'ngSanitize': {deps: ['angular']}
        , 'ngUiRouter': {deps: ['angular']}
        , 'ngUiRouterExtras': {deps: ['ngUiRouter']}
        , 'ionicAngular': {deps: ['ngAnimate', 'ngSanitize', 'ngUiRouter', 'ionic']}
        , 'ngTimeline': {deps: ['angular']}
        , 'ngMoment': {deps: ['angular', 'moment']}
        , 'ngElastic': {deps: ['angular']}
        , 'AutoLinker': {deps: ['angular']}
        , 'restangular': {deps: ['angular', 'lodash']}
        , 'angular-loading-bar': {deps: ['angular']}
        , 'ng-tags-input': {deps: ['angular']}
        , 'ionic-filter-bar': {deps: ['ionic']}
        , 'google-libphonenumber': {exports: 'google-libphonenumber'}
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
            // since app/app depends on a lot of other stuff (by requirejs),
            // so we just need to bootstrap ['app'] then all stuff in this project is up
            angular.bootstrap(document, [namespace]);
       });
    });