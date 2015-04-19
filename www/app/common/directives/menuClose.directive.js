
define([
    '../module'
],
function (module) {
    'use strict';
    module.directive('cmnMenuClose', ['$state', '$ionicHistory', function($state, $ionicHistory) {
		return {
			restrict: 'A',
			link: function($scope, $element, $attr) {
			  $element.on('click', function() {
			  	var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
			     if (sideMenuCtrl) {
			       sideMenuCtrl.close();
			     }
			  });
			}
		};
	}]);
});
