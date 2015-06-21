define([
    '../module',
],
function (module) {
    'use strict';

    var name = 'ChannelController';

    module.controller(name, ChannelController);
                
    ChannelController.$inject = ['$scope', '$state', '$stateParams' ];

    return ChannelController;

    function ChannelController($scope, $state, $stateParams) {
        var vm = this;
        vm.viewName = $state.current.name;
    }


});
