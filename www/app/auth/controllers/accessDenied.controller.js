define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".accessDeniedController";

    module.controller(name, accessDeniedController);
                
    accessDeniedController.$inject = ['$stateParams'];
    
    return accessDeniedController;

    function accessDeniedController($stateParams) {
        var vm = this;

        angular.extend(vm, $stateParams, {});
    }


});
