
define([
    '../module'
],
function (module) {
    'use strict';
    
    // this directive now is not working since <label/> would steal the click event for any input
    // and ionic team has already planned in release 1.1
    // and user could live without this feature

    module.directive('cmnResetField', cmnResetField);

	cmnResetField.$inject = ['$compile', '$timeout'];

    return cmnResetField;

	function cmnResetField($compile, $timeout){
		var directive = {
			require: 'ngModel'
			
			, scope: {}
			, link: linkFunc
		}
		return directive;

		function linkFunc($scope, $element, $attrs, $controller) {
			 // limit to input element of specific types
			var inputTypes = /text|search|tel|url|email|password/i;
			if ($element[0].nodeName === "INPUT") {
				if (!inputTypes.test($attrs.type)) {
					throw new Error("Invalid input type for resetField: " + $attrs.type);
				}
			} else if ($element[0].nodeName !== "TEXTAREA") {
				throw new Error("resetField is limited to input and textarea elements");
			}

			var templateStr = '<i ng-show="enabled" ng-click="reset()" class="icon ion-android-close reset-field-icon"></i>';
			// var isLabelContainer = $element[0].parentElement.tagName == 'LABEL';
			// if( isLabelContainer ){
			// 	templateStr = templateStr.replace('></i>', ' style="position:absolute; right:2.5em; top:2em;"></i>');
			// }
			// // compiled reset icon template
			// var template = $compile(templateStr)($scope);
			// if (isLabelContainer){
			// 	$element.parent().after(template);
			// } else {
			// 	
			// }
			var template = $compile(templateStr)($scope);
			$element.after(template);
			$element.addClass("reset-field");

			$scope.reset = function() {
				$controller.$setViewValue(null);
				$controller.$render();
				$timeout(function() {
					$element[0].focus();
				}, 0, false);	// If set to false skips model dirty checking, otherwise will invoke fn within the $apply block.
				$scope.enabled = false;
			};

			$element.on('input', function() {
				$scope.enabled = !$controller.$isEmpty($element.val());
			})
			.on('focus', function() {
				$timeout(function() { //Timeout just in case someone else is listening to focus and alters model
					$scope.enabled = !$controller.$isEmpty($element.val());
					$scope.$apply();
				}, 0, false);
			})
			.on('blur', function() {
				$timeout(function() {
					$scope.enabled = false;
					$scope.$apply();
				}, 0, false);
			});
		};
	}
});
