define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".RegisterController";

    module.controller(name, RegisterController);
                
    RegisterController.$inject = ['$timeout', '$ionicLoading', namespace+'.registerService', 'cities'];
    
    return RegisterController;

    function RegisterController($timeout, $ionicLoading, registerService, cities) {
        var vm = this;

        angular.extend(vm, {
          username: ''
          , password: ''
          , phoneNum: ''
          , city: cities.length? cities[0].code: 'guangzhou' // guangzhou as default  
          , cities: cities

          // methods
          , register: register
        });
        
        

        function register(){

            
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
