define([
    '../module',
],
function (module) {
    'use strict';

    var name = 'ChannelController';

    module.controller(name, ChannelController);
                
    ChannelController.$inject = ['$scope', '$state', '$stateParams', 'auth.EVENTS' ];

    return ChannelController;

    function ChannelController($scope, $state, $stateParams, AUTH_EVENTS) {
        var vm = this;
        // vm.selectedChannel = $stateParams.channel;
        vm.tabs = 'Anonymous';
        
        $scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
            vm.nickname = args.nickname;
        });
    }


});
