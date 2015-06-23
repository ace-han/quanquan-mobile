define([
        'angular'
        , '../module'
    ]
    , function(angular, module) {
        'use strict';
        // may revise to a directive instead
        var name = 'pullToRefreshService';

        module.factory(name, pullToRefreshService);

        pullToRefreshService.$inject = ['$timeout', '$ionicScrollDelegate'];

        return pullToRefreshService;

        function pullToRefreshService($timeout, $ionicScrollDelegate) {
            var service = {
                triggerPtr: triggerPtr
            };
            return service;
            /**
             * Trigger the pull-to-refresh on a specific scroll view delegate handle.
             * @param {string} delegateHandle - The `delegate-handle` assigned to the `ion-content` in the view.
             */
            function triggerPtr(delegateHandle) {

                $timeout(function() {

                    var scrollView = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();

                    if (!scrollView) return;

                    scrollView.__publish(
                        scrollView.__scrollLeft, -scrollView.__refreshHeight,
                        scrollView.__zoomLevel, true);

                    var d = new Date();

                    scrollView.refreshStartTime = d.getTime();

                    scrollView.__refreshActive = true;
                    scrollView.__refreshHidden = false;
                    if (scrollView.__refreshShow) {
                        scrollView.__refreshShow();
                    }
                    if (scrollView.__refreshActivate) {
                        scrollView.__refreshActivate();
                    }
                    if (scrollView.__refreshStart) {
                        scrollView.__refreshStart();
                    }

                });

            }
        }
    }
);
