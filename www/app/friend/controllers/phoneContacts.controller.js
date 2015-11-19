define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.PhoneContactsController';

    module.controller(name, PhoneContactsController);
                
    PhoneContactsController.$inject = [];

    return PhoneContactsController;

    function PhoneContactsController() {
        var vm = this;

        angular.extend(vm, {
            contacts: []
        })

        init();

        function init(){
            if (navigator == null || navigator == undefined || navigator.contacts == undefined){
                for(var i=0; i<3; i++){
                    console.log('push contacts');
                    vm.contacts.push({slug: i
                                , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                                , name: ' New Item phoneContacts' + Math.floor(Math.random() * 1000) + 3});
                }
            } else {
                console.log("start to read contacts");
                var fields = ["displayName", "name", "phoneNumbers"];
                navigator.contacts.find(fields, OnReadContactsSucc);
            }
        }
        
        
                                    
        function OnReadContactsSucc(contacts){
            console.log("read contacts successfully");
            for(var i = 0; i < contacts.length; i++){
                vm.contacts.push({slug: i
                            , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                            , name: contacts[i].name.givenName
                            , phone: contacts[i].phoneNumbers[0].value});
            }
        }
    }

});
