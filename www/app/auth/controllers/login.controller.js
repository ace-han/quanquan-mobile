define([
    '../module',
    '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + ".LoginController";

    module.controller(name, LoginController);
                
    LoginController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$ionicLoading', '$ionicHistory',
                                namespace + '.authService', namespace + '.EVENTS' ];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return LoginController;

    function LoginController($scope, $rootScope, $state, $timeout, $ionicLoading, 
                            $ionicHistory, authService, AUTH_EVENTS) {
        var vm = this;
        vm.crefidentials = {
            username: '',
            password: ''
        };

        vm.login = login;
        

        function login(crefidentials){
            $ionicLoading.show();
            authService.login(crefidentials.username, 
                crefidentials.password)
                .then(function(payload){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, payload);
                    if(payload.is_profile_filled){
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: true
                        });
                        $state.go('app.home');
                    } else {
                        
                        $state.go('app.home');
                        // $state.go('account.profile');
                    }
                }, function(){
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    $timeout(function(){
                        $ionicLoading.show({ template: 'Login Failed!', noBackdrop: true, duration: 2000 });
                    }, 500);                    
                })
                .finally(function(){
                    $ionicLoading.hide();
                });
        }
    }


});
