define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.ContactsController';

    module.controller(name, ContactsController);
                
    ContactsController.$inject = ['$scope', '$timeout'];

    return ContactsController;

    function ContactsController($scope, $timeout) {
        var vm = this;

        vm.contacts = [];
        
        if (navigator == null || navigator == undefined || navigator.contacts == undefined)
        {
            for(var i=0; i<3; i++){
                console.log('push contacts');
                vm.contacts.push({slug: i
                            , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                            , name: ' New Item ' + Math.floor(Math.random() * 1000) + 4});
            }
        }
        else
        {
            console.log("start to read contacts");
            var fields = ["displayName", "name", "phoneNumbers"];
            navigator.contacts.find(fields, OnReadContactsSucc);
        }
                                    
        function OnReadContactsSucc(contacts)
        {
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
