define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.AlumniController';

    module.controller(name, AlumniController);
                
    AlumniController.$inject = ['$scope', '$state', '$ionicModal'
                                , 'account.basicInfoService', 'account.profileService'
                                , namespace+'.friendService'
                                , 'profile', 'currentUser', 'schoolType'];

    return AlumniController;

    function AlumniController($scope, $state, $ionicModal
                            , basicInfoService, profileService
                            , friendService
                            , profile, currentUser, schoolType) {
        var vm = this;

        angular.extend(vm, {
            alumni: []
            , moreDataCanBeLoaded: moreDataCanBeLoaded
            , loadMore: loadMore
            , hasJoinedSchool: hasJoinedSchool
            , getSchoolName: getSchoolName
            // school edit modal setup...
            , highSchoolChoices: []
            , collegeChoices: []
            , modalErrMsg: ''
            , modalSchool: null
            , openEditModal: openEditModal
            , closeEditModal: closeEditModal
            , saveProfileInfo: saveProfileInfo
            , resolveGenderIconClass: resolveGenderIconClass
        });

        var modalRef = null
        , page = 1
        , pageSize = 20
        , alumniTotalCount=0;
        init();

        function init(){
            console.log('init', schoolType);
            
            $scope.vm = vm;

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

            _initAlumni();
            basicInfoService.getHighSchoolChoices()
                .then(function(choices){
                    vm.highSchoolChoices = choices;
                });
            basicInfoService.getCollegeChoices()
                .then(function(choices){
                    vm.collegeChoices = choices;
                });
        }

        function _initAlumni(){
            // should be a variable recording the last refresh time
            // and a delta duration for force the refresh from the very begining like one hour/day
            friendService.getAlumni(schoolType, '', page, pageSize)
                .then(function(response){
                    Array.prototype.push.apply(vm.alumni, response.results);
                    alumniTotalCount = response.count;
                    page++;
                });
            
        }
        
        function moreDataCanBeLoaded(){
            return (page-1)*pageSize < alumniTotalCount;
        }

        function loadMore(){
            console.log('loadMore', schoolType);
            friendService.getAlumni(schoolType, '', page, pageSize)
                .then(function(response){
                    Array.prototype.push.apply(vm.alumni, response.results);
                    alumniTotalCount = response.count;
                    page++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function hasJoinedSchool(){
            return !!profile[schoolType];
        }

        function getSchoolName(){
            return profile[schoolType]? profile[schoolType].name: 'Unknown';
        }
        

        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

        // school edit modal setup...
        function openEditModal(){
            var school = profile[schoolType];
            vm.modalSchool = {
                value: school? school.id: ''
                , label: school? school.name: ''
            }
            
            // determine which template to be show up
            $ionicModal.fromTemplateUrl('app/account/templates/'+schoolType+'_edit_modal.html', {
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

        function saveProfileInfo(){
            // since we will reload the whole state, no need to re-assign school back to profile
            profile[schoolType] = {
                id: vm.modalSchool.value
                //, name: vm.modalSchool.label
            }
            profileService.updateUserProfileInfo(profile, [schoolType])
                .then(function(){
                    vm.closeEditModal();
                    // easy most...
                    $state.reload();
                }, function(response){
                    console.error(response.status, response.statusText);
                    vm.modalErrMsg = 'Server error, retry it later';
                });
        }
    }

});
