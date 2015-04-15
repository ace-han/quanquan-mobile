define([
    'angular'
    , './namespace'
    // add necessary app as you wish
    , './auth/namespace'
    , './common/namespace'
    // for the convenience of invocation
    , 'ionic'
    , 'ngAnimate'
    , 'ngSanitize'
    , 'ngUiRouter'
    , 'ionicAngular'
    , './auth/module.require'
    , './common/module.require'
],
function (angular, namespace, namespaceAuth, namespaceCommon) {
    'use strict';

    var app = angular.module(namespace, 
        ['ionic', namespaceAuth, namespaceCommon])
        .run(function () {
          //
        })
        /*
        .directive('quanquanMenuClose', ['$ionicHistory', function($ionicHistory) {
            return {
                restrict: 'A',
                link: function($scope, $element) {
                  $element.bind('click', function() {
                    console.log('click')
                  //   var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
                  //   if (sideMenuCtrl) {
                  //     $ionicHistory.nextViewOptions({
                  //       historyRoot: true,
                  //       disableAnimate: true,
                  //       expire: 300
                  //     });
                  //     sideMenuCtrl.close();
                  //   }
                  });
                }
            };
        }]);
*/
    return app;
});