define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.LocalContactsController';

    module.controller(name, LocalContactsController);
                
    LocalContactsController.$inject = ['$q', '$timeout', '$state', '$ionicPopup'
                    , 'friend.phoneContactService'];

    return LocalContactsController;

    function LocalContactsController($q, $timeout, $state, $ionicPopup
                        , phoneContactService) {
        var vm = this;

        angular.extend(vm, {
            contacts: []
            , isNotSyncListShown: false
            , contactsNotInSyncList: []
            , isContactPluginEnabled: isContactPluginEnabled
            , isDevEnabled: isDevEnabled
            , onSyncListChange: onSyncListChange
            , syncLocalContacts2Server: syncLocalContacts2Server
            , toggleNotSyncList: toggleNotSyncList
            , removeFromNotSyncList: removeFromNotSyncList
        })
        init();

        function init(){
            getLocalContacts(true);

        }

        function isContactPluginEnabled(){
            return phoneContactService.isContactPluginEnabled();
        }

        function isDevEnabled(){
            return phoneContactService.isDevEnabled();
        }

        function getLocalContacts(forceRefresh){
            return $q.all( [
                phoneContactService.getPhoneLocalContacts()
                , phoneContactService.retrieveServerPhoneContactCount() 
                ])
                .then(function(response){
                    var contacts = response[0]
                    , serverContactCount = response[1];
                    if(forceRefresh){
                        vm.contacts.length = 0;
                    }

                    angular.forEach(contacts, function(contact, i){
                        contact.notSyncLabel = contact.localName + ' '+ contact.obfuscatedPhoneNumber;
                        vm.contacts.push(contact);
                        if(serverContactCount==0){
                            // for first time upload
                            contact.isNotInSyncList = false;
                            return true;
                        }
                        contact.isNotInSyncList = contact.isNotInServer;
                        if(contact.isNotInSyncList){
                            vm.contactsNotInSyncList.push(contact);
                        }
                    })
                    
                }, function(error){
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Can not read contacts, ' + error
                    });
                })
        }

        function onSyncListChange(contact){
            //if(!(contact.formattedPhoneNumber in formattedPhoneNumberNotInSyncListMap)){
            //}
            // might as well do it in timeout pattern...
            $timeout(function(){
                if(contact.isNotInSyncList){
                    addToNotSyncList(contact);
                } else {
                    removeFromNotSyncList(contact)
                }
            }, 500);
        }

        function removeFromNotSyncList(contact){
            contact.isNotInSyncList = false; // for those invoked directly from ngTagsInput
            var targetIndex = -1;
            angular.forEach(vm.contactsNotInSyncList, function(c, i){
                if(contact.formattedPhoneNumber == c.formattedPhoneNumber){
                    targetIndex = i;
                    return false;
                }
            });
            if(targetIndex != -1){
                vm.contactsNotInSyncList.splice(targetIndex, 1);
            }
        }

        function addToNotSyncList(contact){
            vm.contactsNotInSyncList.push(contact);
        }

        function syncLocalContacts2Server(){
            var syncList = []
            angular.forEach(vm.contacts, function(contact, i){
                if(contact.isNotInSyncList){
                    return true;
                }
                syncList.push(contact.formattedPhoneNumber);
            });
            return phoneContactService.createPhoneContacts(syncList)
                .then(function(response){
                    $state.go('friend.index.phoneContacts', {}, {reload: true});
                }, function(error){
                    console.error(error);
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Can not create contacts, try it again later' + error
                    });
                });
        }

        function toggleNotSyncList(){
            vm.isNotSyncListShown = !vm.isNotSyncListShown;
        }
    }

});
