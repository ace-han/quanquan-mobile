define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.ContactsController';

    module.controller(name, ContactsController);
                
    ContactsController.$inject = ['$scope', '$timeout'];

    console.log('enter contact controller');
    return ContactsController;

    function ContactsController($scope, $timeout) {
        var vm = this;

        vm.contacts = [];
        console.log('enter contact controller2');
        for(var i=0; i<3; i++){
            console.log('push contacts');
            vm.contacts.push({slug: i
                        , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                        , name: ' New Item ' + Math.floor(Math.random() * 1000) + 4});
        }
        
    }

});
