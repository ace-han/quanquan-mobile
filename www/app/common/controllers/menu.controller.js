define([
    '../module'
],
function (module) {
    'use strict';

    var name = 'MainMenuController';

    module.controller(name, MainMenuController);
                
    MainMenuController.$inject = ['$scope', '$state', 'auth.EVENTS' ];

    return MainMenuController;

    function MainMenuController($scope, $state, AUTH_EVENTS) {
        var vm = this;

        vm.nickname = 'Anonymous';
        
        $scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
            vm.nickname = args.nickname;
        });
    }


});
