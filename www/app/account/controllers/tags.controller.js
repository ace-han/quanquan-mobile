define([
	'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".TagsController";

    module.controller(name, TagsController);
                
    TagsController.$inject = ['$q', '$timeout', '$scope', 
        '$ionicModal', 
        'search.tagService', 'friend.friendService',
        namespace+'.basicInfoService', namespace+'.profileService',
        'profile', 'currentUser'];
    
    return TagsController;

    function TagsController($q, $timeout, $scope, 
            $ionicModal, 
            tagService, friendService, 
            basicInfoService, profileService,
            profile, currentUser) {
        var vm = this;
        
        angular.extend(vm, {
            profile: profile
            , currentUser: currentUser
            , modalErrMsg: ''
            , tagsToBeAdded: []
            , hasFriendship: false
            , friendTags: []
            , isCurrentUserHimself: isCurrentUserHimself
            , openTagEditModal: openTagEditModal
            , closeTagEditModal: closeTagEditModal
            , saveTags: saveTags
            , addTags: addTags
            , loadTags: loadTags
            , onInvalidTag: onInvalidTag
        });
        $scope.vm = vm;
        var modalRef = null
            , invalidTag;
        init();

        function isCurrentUserHimself() {
			return vm.currentUser.user_id == profile.user.id;
		}

        function openTagEditModal(){
            var templateModalName = isCurrentUserHimself()? 'owner': 'friend';
            $ionicModal.fromTemplateUrl('app/account/templates/tag_'+templateModalName+'_edit_modal.html', {
                scope: $scope, // this one needs the one with $new() method
                animation: 'slide-in-up'
            }).then(function(modal) {
                modalRef = modal;
                return modal.show();
            });
        }

        function closeTagEditModal(){
            modalRef.hide();
            modalRef.remove();
            modalRef = null;
            vm.modalErrMsg = '';
        }

        function saveTags(){
            return profileService.updateUserProfileInfo(vm.profile, ['tags'])
                        .then(function(){
                            vm.closeTagEditModal();
                        }, function(error){
                            vm.modalErrMsg = error.status + ' ' + error.statusText;
                        })
        }

        function addTags(){
            return profileService.addTags(vm.profile.id, vm.tagsToBeAdded)
                    .then(function(response){
                        vm.profile.tags = response;
                        vm.tagsToBeAdded = [];
                        vm.closeTagEditModal();
                    }, function(error){
                        vm.modalErrMsg = error.status + ' ' + error.statusText;
                    })
        }

        function loadTags($query){
            // this method should always returns a promise
            var deferred = $q.defer();
            tagService.getTags($query)
                .then(function(tags){
                    deferred.resolve(tags);
                }, function(error){
                    deferred.reject(error);
                })
            return deferred.promise;

        }

        function onInvalidTag(tag){
            invalidTag = tag;
            $timeout(function(){
                // any tips
                vm.modalErrMsg = invalidTag.name + ' not a valid tag';
            }, 500);
            console.info('tag', tag);
        }

        function init(){
            if(profile.user){
                profile.user.displayName = profile.user.nickname || profile.user.username;
                profile.user.selfie_path = profile.user.selfie_path || './img/anonymous.png';
            }

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
            basicInfoService.getCityList()
                .then(function(list){
                    angular.forEach(list, function(e, i){
                        if(vm.profile.city == e.value){
                            vm.profile.cityStr = e.label;
                            return false;
                        }
                    });
                });
            if(vm.profile.college){
                basicInfoService.getCollegeList()
                .then(function(list){
                    angular.forEach(list, function(e, i){
                        if(vm.profile.college.id == e.id){
                            vm.profile.collegeStr = e.name;
                            return false;
                        }
                    });
                });
            }
            if(vm.profile.high_school){
                basicInfoService.getHighSchoolList()
                .then(function(list){
                    angular.forEach(list, function(e, i){
                        if(vm.profile.high_school.id == e.id){
                            vm.profile.highSchoolStr = e.name;
                            return false;
                        }
                    });
                });
            }
            
            friendService.hasFriendship(vm.profile.user.id)
                .then(function(isFriend){
                    vm.hasFriendship = isFriend;
                })

            friendService.get1DegreeFriendTags(vm.profile.user.id)
                .then(function(tags){
                    vm.friendTags = tags;
                })

        }
	}
});
