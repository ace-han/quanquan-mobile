define([
        'angular', 'AutoLinker', '../module'

    ],
    function(angular, AutoLinker, module) {
        'use strict';

        module.directive('autolinker', cmnAutolinker);

        cmnAutolinker.$inject = ['$timeout'];

        return cmnAutolinker;

        function cmnAutolinker($timeout) {
            var directive = {
                restrict: 'A',
                link: linkFunc
            }
            return directive;

            function linkFunc($scope, $element, $attrs, $controller) {
                $timeout(function() {
                    var eleHtml = $element.html();

                    if (eleHtml === '') {
                        return false;
                    }

                    var text = Autolinker.link(eleHtml, {
                        className: 'autolinker',
                        newWindow: false
                    });

                    $element.html(text);

                    var autolinks = $element[0].getElementsByClassName('autolinker');

                    for (var i = 0; i < autolinks.length; i++) {
                        angular.element(autolinks[i]).bind('click', function(e) {
                            var href = e.target.href;
                            console.log('autolinkClick, href: ' + href);

                            if (href) {
                                //window.open(href, '_system');
                                window.open(href, '_blank');
                            }

                            e.preventDefault();
                            return false;
                        });
                    }
                }, 0);

            };
        }
    });
