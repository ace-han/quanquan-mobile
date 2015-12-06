define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.FriendsController';

    module.controller(name, FriendsController);
                
    FriendsController.$inject = [];

    return FriendsController;

    function FriendsController() {
        var vm = this;

        angular.extend(vm, {
            tabs: []
        })
        
        init();

        function init(){
            vm.tabs.push({title: 'Phone Contacts', uiSref: 'friend.index.phoneContacts'});
            vm.tabs.push({title: 'College Alumni', uiSref: 'friend.index.college'});
            vm.tabs.push({title: 'High School Alumni', uiSref: 'friend.index.highSchool'});
        }
        
    }

});
