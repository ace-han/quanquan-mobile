define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".AccessDeniedController";

    module.controller(name, AccessDeniedController);
                
    AccessDeniedController.$inject = ['$stateParams'];
    
    return AccessDeniedController;

    function AccessDeniedController($stateParams) {
        var vm = this;

        angular.extend(vm, $stateParams, {});
    }


});
