
define([
    '../module'
],
function (module) {
    'use strict';
    console.log('abc');
    module.directive('quanquanMenuClose', ['$ionicHistory', function($ionicHistory) {
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
});
