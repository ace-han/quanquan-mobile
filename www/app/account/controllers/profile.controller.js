define([
	'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".ProfileController";

    module.controller(name, ProfileController);
                
    ProfileController.$inject = ['$scope', '$ionicPopup',
                                namespace + '.basicInfoService', 'profile'];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return ProfileController;

    function ProfileController($scope, $ionicPopup, basicInfoService, profile) {
        var vm = this;
        
        angular.extend(vm, {
            profile: profile
            , genderChoices: []
            , cityChoices: []
            , highSchoolChoices: []
            , collegeChoices: []
            , openEditModal: openEditModal
        });
        
        init();

        // for some controller $scope injection is innevitable, like $on('event', function(){})
        $scope.$on('$destroy', function() {
            //$scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
        // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
        // Execute action
        });


        function openEditModal(fieldName){
            var widget;
            if(fieldName == 'gender'){
                widget = {}
            }
        }

        function init(){
            vm.profile.user.nickname = vm.profile.user.nickname || vm.profile.user.username;
            vm.profile.user.selfie_path = vm.profile.user.selfie_path || './img/anonymous.png';
            vm.profile.genderStr = 'Unknown';
            basicInfoService.getGenderChoices()
                .then(function(choices){
                    vm.genderChoices = choices;
                    angular.forEach(choices, function(choice, index){
                        if(vm.gender == choice.value){
                            vm.genderStr = choice.label;
                        }
                    });
                });
            basicInfoService.getCityChoices()
                .then(function(choices){
                    vm.cityChoices = choices;
                });
            basicInfoService.getHighSchoolChoices()
                .then(function(choices){
                    vm.highSchoolChoices = choices;
                });
            basicInfoService.getCollegeChoices()
                .then(function(choices){
                    vm.collegeChoices = choices;
                });   
        }
	}


});
