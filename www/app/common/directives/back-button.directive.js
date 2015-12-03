
define([
    '../module'
],
function (module) {
    'use strict';

    module.directive('cmnBackButton', cmnBackButton);

	cmnBackButton.$inject = ['$ionicConfig', '$window', '$timeout'];

    return cmnBackButton;

	function cmnBackButton($ionicConfig, $window, $timeout){
		var directive = {
			restrict: 'E'
			, compile: compileFunc
		}
		return directive;

		function compileFunc(tElement, tAttrs) {
			// clone the back button, but as a <div>
			var buttonEle = $window.document.createElement('button');
			for (var n in tAttrs.$attr) {
				buttonEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
			}
			if (!tAttrs.ngClick) {
				buttonEle.setAttribute('ng-click', 'gbc.goBack()');
		    }

		    buttonEle.className = 'button back-button hide buttons ' + (tElement.attr('class') || '');
			buttonEle.innerHTML = tElement.html() || '';

			var childNode;
			var hasIcon = hasIconClass(tElement[0]);
			var hasInnerText;
			var hasButtonText;
			var hasPreviousTitle;

			for (var x = 0; x < tElement[0].childNodes.length; x++) {
				childNode = tElement[0].childNodes[x];
				if (childNode.nodeType === 1) {
					if (hasIconClass(childNode)) {
						hasIcon = true;
					} else if (childNode.classList.contains('default-title')) {
						hasButtonText = true;
					} else if (childNode.classList.contains('previous-title')) {
						hasPreviousTitle = true;
					}
				} else if (!hasInnerText && childNode.nodeType === 3) {
					hasInnerText = !!childNode.nodeValue.trim();
				}
			}

			function hasIconClass(ele) {
				return /ion-|icon/.test(ele.className);
			}

			var defaultIcon = $ionicConfig.backButton.icon();
			if (!hasIcon && defaultIcon && defaultIcon !== 'none') {
				buttonEle.innerHTML = '<i class="icon ' + defaultIcon + '"></i> ' + buttonEle.innerHTML;
				buttonEle.className += ' button-clear';
			}

			if (!hasInnerText) {
				var buttonTextEle = $window.document.createElement('span');
				buttonTextEle.className = 'back-text';

				if (!hasButtonText && $ionicConfig.backButton.text()) {
					buttonTextEle.innerHTML += '<span class="default-title">' + $ionicConfig.backButton.text() + '</span>';
				}
				if (!hasPreviousTitle && $ionicConfig.backButton.previousTitleText()) {
					buttonTextEle.innerHTML += '<span class="previous-title"></span>';
				}
				buttonEle.appendChild(buttonTextEle);
			}

			buttonEle.onclick = function(){
				console.info('very ugly...');
				$window.history.back();
			}

			tElement[0].parentNode.replaceChild(buttonEle, tElement[0]);

			return function link($scope, $element, $attr){

				$timeout(
					function(){
						var ionBackBtn = angular.element($window.document.querySelector('[nav-bar="active"]>ion-header-bar>.back-button'));
						console.info('ionBackBtn', ionBackBtn)
						var shouldShowCmnBackBtn = false;
						if(ionBackBtn.length == 0){
							shouldShowCmnBackBtn = true;
						} else {
							shouldShowCmnBackBtn = ionBackBtn.hasClass('hide');
						}
						console.info('shouldShowCmnBackBtn', shouldShowCmnBackBtn);
						if(shouldShowCmnBackBtn){
							$element.removeClass('hide');
						}
					}, 500
				)
				
			}
		}
	}
});
