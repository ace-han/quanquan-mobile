define([
    'angular'
    , '../module'
],
function (angular, module) {
    'use strict';

    var name = 'pullToRefreshService';

    module.factory(name, pullToRefreshService);

    pullToRefreshService.$inject = ['$http', '$q', '$window', '$timeout' ];

    return pullToRefreshService;

    function pullToRefreshService($http, $q, $window, $timeout){
        console.info('pullToRefreshService');

    }
});