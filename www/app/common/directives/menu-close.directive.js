
define([
    '../module'
],
function (module) {
    'use strict';
    module.directive('cmnMenuClose', cmnMenuClose);

	cmnMenuClose.$inject = ['$state', '$ionicHistory'];

    return cmnMenuClose;

	function cmnMenuClose($state, $ionicHistory){
		var directive = {
			restrict: 'A',
			link: linkFunc
		}
		return directive;

		function linkFunc($scope, $element, $attr) {
			$element.on('click', function() {
			  	var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
			    if (sideMenuCtrl) {
			    	sideMenuCtrl.close();
			    }
			});
		}
	}
});
