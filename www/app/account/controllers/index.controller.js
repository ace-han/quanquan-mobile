define([
	'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".IndexController";

    module.controller(name, IndexController);
                
    IndexController.$inject = ['$state', '$ionicPopup', 'auth.principalService', 'userInfo'];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return IndexController;

    function IndexController($state, $ionicPopup, principalService, userInfo) {
        var vm = this;
        
        angular.extend(vm, {
            userInfo: userInfo
            , logout: logout
            , verify: verify});
        

        function logout() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'OneDegree'
				, template: 'Are you sure you want to logout?'
			});
			confirmPopup.then(function(result) {
				if(!result) {
					return;
				}
				principalService.logout();
				$state.go('quanquan.index');
				return result;
			});
		}

        function verify(){
            principalService.verify();
        }
	}


});
