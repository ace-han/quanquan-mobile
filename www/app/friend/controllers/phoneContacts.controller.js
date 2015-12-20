define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.PhoneContactsController';

    module.controller(name, PhoneContactsController);
                
    PhoneContactsController.$inject = ['$scope', '$ionicPopup', '$ionicPopover'
                    , '$state'
                    , 'account.basicInfoService', 'friend.phoneContactService'];

    return PhoneContactsController;

    function PhoneContactsController($scope, $ionicPopup, $ionicPopover
                        , $state
                        , basicInfoService, phoneContactService) {
        var vm = this;

        angular.extend(vm, {
            contacts: []
            , noMatchCount: 0 // profiles from server found no matched in phone
            , localCount: 0
            , isContactPluginEnabled: isContactPluginEnabled
            , isDevEnabled: isDevEnabled
            , syncContacts2Phone: syncContacts2Phone
            , wipeOutAllLocalPhoneContacts: wipeOutAllLocalPhoneContacts
            , openDevToolkitPopover: openDevToolkitPopover
            , closeDevToolkitPopover: closeDevToolkitPopover
            , resolveGenderIconClass: resolveGenderIconClass
            , goUserHome: goUserHome
            , goSyncContactsPage: goSyncContactsPage
        })
        
        var popoverRef = null;
        init();

        function init(){
            $scope.vm = vm;
            $scope.$on('$destroy', function() {
                if(popoverRef){
                    closeDevToolkitPopover();
                }
            });
            // Execute action on hide modal
            $scope.$on('popover.hidden', function() {
            // Execute action
            });
            // Execute action on remove modal
            $scope.$on('popover.removed', function() {
            // Execute action
            });

            getPhoneContacts(true);
        }

        function isContactPluginEnabled(){
            return phoneContactService.isContactPluginEnabled();
        }

        function isDevEnabled(){
            return phoneContactService.isDevEnabled();
        }

        function getPhoneContacts(forceRefresh){
            phoneContactService.getPhoneContacts()
                .then(function(response){
                    if(forceRefresh){
                        vm.contacts.length = 0;
                    }
                    Array.prototype.push.apply(vm.contacts, response.results);
                    vm.noMatchCount = response.noMatchCount;
                    vm.localCount = response.localCount;
                }, function(error){
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Can not read contacts, ' + error
                    });
                })
        }

        function syncContacts2Phone(){
            console.info('syncContacts2Phone');
            phoneContactService.syncContacts2Phone()
                .then(function(response){
                    vm.contacts.length = 0;
                    Array.prototype.push.apply(vm.contacts, response.results);
                    vm.noMatchCount = response.noMatchCount;
                    vm.localCount = response.localCount;
                    popoverRef.hide();
                }, function(error){
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Can not read contacts, ' + error
                    });
                    
                })
                .finally(function() {
                    // Always execute this on both error and success
                    popoverRef.hide();
                });

        }

        function wipeOutAllLocalPhoneContacts(){
            phoneContactService.wipeOutAllLocalPhoneContacts()
                .then(function(){
                    getPhoneContacts(true);
                })
                .finally(function() {
                    // Always execute this on both error and success
                    popoverRef.hide();
                });
            
        }

        function openDevToolkitPopover($event){
            if(popoverRef){
                popoverRef.show($event);
                return
            }
            $ionicPopover.fromTemplateUrl('app/friend/templates/phone_contact_toolkit_popover.html', {
                scope: $scope, // this one needs the one with $new() method
            }).then(function(popover) {
                popoverRef = popover;
                return popover.show($event);
            });
        }

        function closeDevToolkitPopover(){
            popoverRef.hide();
            popoverRef.remove();
            popoverRef = null;
        }

        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

        function goUserHome(contact){
            if(!contact.user){
                return;
                
            } 
            $state.go('account.profile.home', {userId: contact.user.id});
        }

        function goSyncContactsPage(){
            popoverRef.hide();
            $state.go(namespace + '.localContacts');
        }
    }

});
