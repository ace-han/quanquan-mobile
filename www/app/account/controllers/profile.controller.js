define([
	'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".ProfileController";

    module.controller(name, ProfileController);
                
    ProfileController.$inject = ['$scope', '$ionicModal', '$ionicLoading',
                                'auth.principalService',  // since auth will be treated as a very special 
                                namespace + '.basicInfoService', 
                                namespace + '.profileService', 
                                'profile', 'currentUser'];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return ProfileController;

    function ProfileController($scope, $ionicModal, $ionicLoading, principalService,
                                basicInfoService, profileService, profile, currentUser) {
        var vm = this;
        
        angular.extend(vm, {
            profile: profile
            , currentUser: currentUser
            , genderChoices: []
            , cityChoices: []
            , highSchoolChoices: []
            , collegeChoices: []
            , modalErrMsg: ''
            , openEditModal: openEditModal
            , closeEditModal: closeEditModal
            , saveUserInfo: saveUserInfo
            , saveProfileInfo: saveProfileInfo
            , isCurrentUserHimself: isCurrentUserHimself
        });
        
        $scope.vm = vm;
        var modalRef = null, school;
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
            if(!isCurrentUserHimself()){
                $ionicLoading.show({ template: 'Not Authorized!', noBackdrop: true, duration: 1000 });
                return;
            }

            if(fieldName=='high_school' || fieldName=='college'){
                // since school is {id:,name:,}, schoolChoice is {value:,label:,}
                // properties just don't match
                var school = vm.profile[fieldName];
                vm.modalSchool = {
                    value: school? school.id: ''
                    , label: school? school.name: ''
                }
            }
            // determine which template to be show up
            $ionicModal.fromTemplateUrl('app/account/templates/'+fieldName+'_edit_modal.html', {
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
            vm.modalErrMsg = '';
        }

        function saveUserInfo(userInfoField){
            principalService.updateCurrentUserInfo(vm.profile.user, [userInfoField])
                .then(function(){
                    vm.closeEditModal();
                },function(response){
                    console.error(response.status, response.statusText);
                    vm.modalErrMsg = 'Server error, retry it later';
                })
        }

        function saveProfileInfo(profileInfoField){
            // if not success the modal won't close, so pre-assign the value is okay
            switch(profileInfoField){
                case 'gender':
                    angular.forEach(vm.genderChoices, function(choice, index){
                        if(vm.profile.gender == choice.value){
                            vm.genderStr = choice.label;
                            return false;
                        }
                    });
                    break;
                case 'city':
                    angular.forEach(vm.cityChoices, function(choice, index){
                        if(vm.profile.city == choice.value){
                            vm.cityStr = choice.label;
                            return false;
                        }
                    });
                    break;
                case 'high_school':
                    angular.forEach(vm.highSchoolChoices, function(choice, index){
                        if(vm.modalSchool.value == choice.value){
                            vm.profile.high_school= {
                                id: choice.value
                                , name: choice.label
                            }
                            return false;
                        }
                    });
                    break;
                case 'college':
                    angular.forEach(vm.collegeChoices, function(choice, index){
                        if(vm.modalSchool.value == choice.value){
                            vm.profile.college= {
                                id: choice.value
                                , name: choice.label
                            }
                            return false;
                        }
                    });
                    break;
                default:
                    ;
            }
            profileService.updateUserProfileInfo(vm.profile, [profileInfoField])
                .then(function(){
                    vm.closeEditModal();
                }, function(response){
                    console.error(response.status, response.statusText);
                    vm.modalErrMsg = 'Server error, retry it later';
                });
        }

        function isCurrentUserHimself() {
            return vm.currentUser.user_id == profile.user.id;
        }

        function init(){
            vm.profile.user.nickname = vm.profile.user.nickname || vm.profile.user.username;
            vm.profile.user.selfie_path = vm.profile.user.selfie_path || './img/anonymous.png';
            vm.genderStr = 'Unknown';
            vm.modalSchool = null; // for school edit in the modal only
            basicInfoService.getGenderChoices()
                .then(function(choices){
                    vm.genderChoices = choices;
                    angular.forEach(choices, function(choice, index){
                        if(vm.profile.gender == choice.value){
                            vm.genderStr = choice.label;
                            return false;
                        }
                    });
                });
            basicInfoService.getCityChoices()
                .then(function(choices){
                    vm.cityChoices = choices;
                    angular.forEach(choices, function(choice, index){
                        if(vm.profile.city == choice.value){
                            vm.cityStr = choice.label;
                            return false;
                        }
                    });
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
