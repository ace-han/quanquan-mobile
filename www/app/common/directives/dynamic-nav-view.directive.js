
define([
    '../module'
],
function (module) {
    'use strict';
    
    // Since ionic do not support ionNavView with dynamic names inside ionTabs for the time being
    // 	https://github.com/driftyco/ionic/issues/1829
    // Temp solution:
    // 	https://github.com/driftyco/ionic/pull/1526
    // 
    // Note: 
    // Do not change the view name after initilized!!!

    // Update:
    // DOES NOT WORK WITH <ion-tabs/> YET!!!

    module.directive('cmnDynamicNavView', cmnDynamicNavView);

	cmnDynamicNavView.$inject = ['$compile'];

    return cmnDynamicNavView;

	function cmnDynamicNavView($compile){
		var directive = {
			restrict: 'ECA'
			, priority: -400
			, link: linkFunc
		}
		return directive;

		function linkFunc($scope, $element, $attrs, $controller) {
			var dynamicName = $attrs.name;
            $element.html('<ion-nav-view name="' + dynamicName + '" class="view-container tab-content"></ion-nav-view>');
            $compile($element.contents())($scope);
		};
	}
});
