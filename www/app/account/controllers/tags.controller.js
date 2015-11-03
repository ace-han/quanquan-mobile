define([
	'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".TagsController";

    module.controller(name, TagsController);
                
    TagsController.$inject = ['auth.principalService', 'profile'];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return TagsController;

    function TagsController(principalService, profile) {
        var vm = this;
        
        angular.extend(vm, {
            profile: profile
            , currentUser: {}
            , isCurrentUserHimself: isCurrentUserHimself
        });
        
        init();

        function isCurrentUserHimself() {
			return vm.currentUser.user_id == profile.user.id;
		}

        function init(){
            if(profile.user){
                profile.user.displayName = profile.user.nickname || profile.user.username;
                profile.user.selfie_path = profile.user.selfie_path || './img/anonymous.png';
            }
            vm.currentUser = principalService.getCurrentUserInfo()
        }
	}


});
