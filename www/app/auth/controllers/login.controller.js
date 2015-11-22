define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".LoginController";

    module.controller(name, LoginController);
                
    LoginController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$ionicLoading', '$ionicHistory',
                                namespace + '.principalService'];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return LoginController;

    function LoginController($scope, $rootScope, $state, $stateParams, $ionicLoading, 
                            $ionicHistory, principalService) {
        var vm = this;
        angular.extend(vm, {
            crefidentials: {
                username: ''
                , password: ''
            }
            , login: login
        });
        
        init();

        function init(){
            if($stateParams.reason){
                $ionicLoading.show({ template: $stateParams.reason, noBackdrop: true, duration: 2000 });
            }
            
        }

        function login(){

            //$ionicLoading.show();
            principalService.authenticate(vm.crefidentials)
                .then(function(data){
                    $ionicHistory.nextViewOptions({
                            disableBack: true
                            , historyRoot: true
                        });

                    if(data.is_necessary_user_info_filled){
                        if(!!$rootScope.returnToState){
                            $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                            // some clean up
                            $timeout(function(){
                                $rootScope.returnToState = undefined;
                                $rootScope.returnToStateParams = undefined;
                            }
                            , 100   // wait for a little bit for $state setup
                            , false); // if need to invoke apply, no need
                        } else {
                            $state.go('quanquan.index');
                        }
                    } else {
                        $state.go('account.profile.edit', {userId: data.payload.user_id});
                    }
                    vm.crefidentials.username = '';
                    
                }, function(){
                    $ionicLoading.show({ template: 'Login Failed!', noBackdrop: true, duration: 2000 });
                })
                .finally(function(){
                    //$ionicLoading.hide();
                    // below won't work as controller declare in ui-router's way
                    // need to bind ng-controller to the dom explicitly

                    // and below just back to the state NOT the value
                    // $scope.loginForm.$setPristine();
                    vm.crefidentials.password = '';
                });
        }
    }


});
