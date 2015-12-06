define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.PhoneContactsController';

    module.controller(name, PhoneContactsController);
                
    PhoneContactsController.$inject = ['$ionicPopup', 'friend.phoneContactService'];

    return PhoneContactsController;

    function PhoneContactsController($ionicPopup, phoneContactService) {
        var vm = this;

        angular.extend(vm, {
            contacts: []
        })

        init();

        function init(){
            phoneContactService.retrieveAllContactsFromPhone()
                .then(function(contacts){
                    vm.contacts = contacts;
                }, function(error){
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Can not read contacts, ' + error
                    });
                })
        }
        
    }

});
