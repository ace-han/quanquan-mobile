define([
    'angular'
    ,'../module'
],
function (angular, module) {
    'use strict';

    var name = 'MainMenuController';

    module.controller(name, MainMenuController);
                
    MainMenuController.$inject = ['$scope', '$state', 'auth.EVENTS', 'auth.principalService' ];

    return MainMenuController;

    function MainMenuController($scope, $state, AUTH_EVENTS, principalService) {
        var vm = this;

        angular.extend(vm, {
          nickname: ''
          , selfiePath: ''
          // methods
          , goAccountIndex: goAccountIndex
        });

        $scope.$on(AUTH_EVENTS.loginSuccess
            , function(event, payload) {
            console.info('MainMenuController, AUTH_EVENTS.loginSuccess', event);
            init(payload);
        });
        $scope.$on(AUTH_EVENTS.userInfoChanged
            , function(event, payload) {
            console.info('userInfoChanged, AUTH_EVENTS.userInfoChanged', event);
            init(payload);
        });
        $scope.$on(AUTH_EVENTS.logoutSuccess
            , function(event) {
            console.info(AUTH_EVENTS.logoutSuccess);
            init();            
        });

        init();

        // console.info(name + 'inited'); // it's inited after auth.config's authenticate()
                                            // I might as well inject the auth.principalService for inited
        principalService.identity().then(init)

        function goAccountIndex(){
            // a little ugly here...
            var hiddenAnchor = document.getElementById('accountIndexAnchor');
            angular.element(hiddenAnchor).triggerHandler('click');
        }

        function init(payload){
            payload = payload || {}; // avoid empty payload
            vm.nickname = payload.nickname || 'Anonymous';
            vm.selfiePath = payload.selfie_path || './img/anonymous.png';
        }
    }


});
