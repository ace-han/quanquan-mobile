define([
    '../module'
],
function (module) {
    'use strict';

    var name = 'MainMenuController';

    module.controller(name, MainMenuController);
                
    MainMenuController.$inject = ['$scope', '$state', 'auth.EVENTS', 'auth.principalService' ];

    return MainMenuController;

    function MainMenuController($scope, $state, AUTH_EVENTS, principalService) {
        var vm = this;

        init();

        principalService.identity()
                    .then(function(payload){
                        payload = payload || {}; // avoid empty payload
                        vm.nickname = payload.nickname || 'Anonymous';
                        vm.selfiePath = payload.selfie_path || './img/anonymous.png';
                    })
        // console.info(name + 'inited'); // it's inited after auth.config's authenticate()
                                            // I might as well inject the auth.principalService for inited
        
        $scope.$on(AUTH_EVENTS.loginSuccess, function(event, payload) {
            console.info('MainMenuController', AUTH_EVENTS.loginSuccess);
            vm.nickname = payload.nickname;
        });
        $scope.$on(AUTH_EVENTS.logoutSuccess, function(event) {
            console.info(AUTH_EVENTS.logoutSuccess);
            init();            
        });

        function init(){
            vm.nickname = 'Anonymous';
            vm.selfiePath = './img/anonymous.png';
        }
    }


});
