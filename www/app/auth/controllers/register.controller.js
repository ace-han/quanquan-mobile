define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".RegisterController";

    module.controller(name, RegisterController);
                
    RegisterController.$inject = ['$timeout', '$state', '$ionicLoading',  '$ionicHistory', namespace+'.registerService', 'cities'];
    
    return RegisterController;

    function RegisterController($timeout, $state, $ionicLoading, $ionicHistory, registerService, cities) {
        var vm = this;

        angular.extend(vm, {
          username: ''
          , password: ''
          , phoneNum: ''
          , city: cities&&cities.length? cities[0].code: 'guangzhou' // guangzhou as default  
          , cities: cities

          // methods
          , register: register
        });
        
        

        function register(){
          $ionicLoading.show();

          registerService.register({
            username: vm.username
            , password: vm.password
            , phone_num: vm.phoneNum
            , city: vm.city
          }).then(function(data){
            $ionicHistory.nextViewOptions({
                            disableBack: true
                            , historyRoot: true
                        });
            if(data.is_necessary_user_info_filled){
                $state.go('quanquan.index');
            } else {
                $state.go('account.profile');
            }
          }, function(data){
            $timeout(function(){
                $ionicLoading.show({ template: data, noBackdrop: true, duration: 2000 });
            }, 500); 
          })
          .finally(function(){
            $ionicLoading.hide();
          })
            
        }

        function validate(){
          validateUsername();
          validatePhoneNum();
        }

        function validateUsername(){

        }

        function validatePhoneNum(){

        }
    }


});
