define([
	'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".ProfileController";

    module.controller(name, ProfileController);
                
    ProfileController.$inject = ['$scope', '$ionicModal',
                                'auth.principalService',  // since auth will be treated as a very special 
                                namespace + '.basicInfoService', 
                                namespace + '.profileService', 
                                'profile'];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return ProfileController;

    function ProfileController($scope, $ionicModal, principalService,
                                basicInfoService, profileService, profile) {
        var vm = this;
        
        angular.extend(vm, {
            profile: profile
            , genderChoices: []
            , cityChoices: []
            , highSchoolChoices: []
            , collegeChoices: []
            , modalErrMsg: ''
            , openEditModal: openEditModal
            , closeEditModal: closeEditModal
            , saveUserInfo: saveUserInfo
            , saveProfileInfo: saveProfileInfo
        });
        
        $scope.vm = vm;
        var modalRef = null;
        init();

        
        // for some controller $scope injection is innevitable, like $on('event', function(){})


        // a modal will broadcast 'modal.shown', 'modal.hidden', and 'modal.removed' 
        // events from its originating scope, passing in itself as an event argument.
        $scope.$on('$destroy', function() {
            if(modalRef){
                modalRef.remove();
            }
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
            // var widget;
            // if(fieldName == 'gender'){
            //     widget = {}
            // }

            // if(widgetType == 'text'){

            // } else if(widgetType == 'select'){

            // } else {
            //     // maybe imageType
            // }

            // determine which template to be show up
            $ionicModal.fromTemplateUrl('account-profile-edit-'+fieldName+'-modal.html', {
                scope: $scope, // this one needs the one with $new() method
                animation: 'slide-in-up'
            }).then(function(modal) {
                modalRef = modal;
                return modal.show();
            });

            
        }

        function closeEditModal(){
            modalRef.hide();
            modalRef.remove();
        }

        function saveUserInfo(){
            principalService.updateCurrentUserInfo(vm.profile.user)
                .then(function(){
                    vm.closeEditModal();
                },function(response){
                    console.error(response.status, response.statusText);
                    vm.modalErrMsg = 'Server error, retry it later';
                })
        }

        function saveProfileInfo(){

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
