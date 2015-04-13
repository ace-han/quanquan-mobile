
define([
    '../module'
],
function (module) {
    'use strict';

    var prefix = 'quanquan';

    return module.directive('quanquanMenuClose', ['$ionicHistory', function($ionicHistory) {
			  return {
			    restrict: 'AC',
			    link: function($scope, $element) {
			      $element.bind('click', function() {
			      	console.log('abc');
			        var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
			        if (sideMenuCtrl) {
			          $ionicHistory.nextViewOptions({
			            historyRoot: true,
			            disableAnimate: true,
			            expire: 300
			          });
			          sideMenuCtrl.close();
			        }
			      });
			    }
			  };
	}]);
});
