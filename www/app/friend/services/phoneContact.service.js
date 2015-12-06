define([
        'angular', 
        '../module', 
        '../namespace'
    ],
    function(angular, module, namespace) {
        'use strict';

        var name = namespace + ".phoneContactService";

        module.factory(name, phoneContactService);

        phoneContactService.$inject = ['$q', 'Restangular', 'auth.principalService'];

        return phoneContactService;

        function phoneContactService($q, Restangular, principalService) {
            var service = {
                retrieveAllContactsFromPhone: retrieveAllContactsFromPhone
                //, get1DegreeFriendTags: get1DegreeFriendTags
            }
            var friendRestangular = Restangular.all('friend');
            
            return service;            

            
            function ensureContactPlugin(){
                console.info('navigator', navigator.contacts)
                if(!navigator.contacts){
                    throw 'Please grant permission to access your phone contact first!'
                }
            }

            function prepareContactFindOptions(){
                var options      = new ContactFindOptions();
                options.multiple = true;
                //options.desiredFields = [navigator.contacts.fieldType.id];
                options.hasPhoneNumber = true;
                return options;
            }

            function prepareContactDesireFields(){
                return [
                    navigator.contacts.fieldType.displayName
                    , navigator.contacts.fieldType.name
                    , navigator.contacts.nickname
                    , navigator.contacts.fieldType.phoneNumbers];
            }

            function getName(c) {
                var name = c.displayName;
                if(!name || name === "") {
                    if(c.name.formatted) return c.name.formatted;
                    if(c.name.givenName && c.name.familyName) return c.name.givenName +" "+c.name.familyName;
                    return "Nameless";
                }
                return name;
            }

            function resolvePhoneContacts(contacts){
                var results = []
                    , i, j
                    , contact
                    , name
                    , phoneNumber
                    , phoneNumbers;
                for(i=0; i<contacts.length; i++){
                    contact = contacts[i]
                    name = getName(contact)
                    phoneNumbers = contact.phoneNumbers;
                    for(j=0; j<phoneNumbers.length; j++){
                        phoneNumber = phoneNumbers[j]; // maybe other properties like pref=true
                        //if(!phoneNumber || !phoneNumber.value){continue;}
                        results.push({
                            name: name
                            , phoneNumber: phoneNumber.value
                        });
                    }
                }
                return results
            }
            
            

            function retrieveAllContactsFromPhone(){

                ensureContactPlugin();
                var options      = prepareContactFindOptions();
                //options.filter   = "Bob";
                
                var fields       = prepareContactDesireFields();
                var deferred = $q.defer();
                navigator.contacts.find(fields
                    , function(contacts){
                        console.info('contact success', contacts);
                        contacts = resolvePhoneContacts(contacts);
                        deferred.resolve(contacts);
                    }, function(contactError){
                        console.error('contact error!', contactError);
                        deferred.reject(contactError);
                    }, options);
                return deferred.promise;
            }
            
/*
            function dummyContacts(){
                var result = [];
                for(var i=0; i<6; i++){
                    result.push({name: 'test'+i, phoneNumber: i});
                }
                return result;
            }

            function retrieveAllContactsFromPhone(){
                var deferred = $q.defer();
                deferred.resolve(dummyContacts());
                return deferred.promise;
            }
*/
            function list(q, page, pageSize) {
                
                ensureContactPlugin();
                var options      = new ContactFindOptions();
                options.filter   = "Bob";
                options.multiple = true;
                options.desiredFields = [navigator.contacts.fieldType.id];
                options.hasPhoneNumber = true;
                var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
                navigator.contacts.find(fields, onSuccess, onError, options);
            }
        }
    });
