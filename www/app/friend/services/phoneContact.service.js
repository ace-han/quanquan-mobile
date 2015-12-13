define([
        'angular'
        , '../module' 
        , '../namespace'
        , 'google-libphonenumber'
    ],
    function(angular, module, namespace, libphonenumber) {
        'use strict';

        var name = namespace + ".phoneContactService";

        module.factory(name, phoneContactService);

        phoneContactService.$inject = ['$q', 'Restangular'];

        return phoneContactService;

        function phoneContactService($q, Restangular) {
            var service = {
                extractAllContactsFromPhone: extractAllContactsFromPhone
                , retrievePhoneContacts: retrievePhoneContacts    // from server
                , getPhoneContacts: getPhoneContacts              // combine server and local
                , syncContacts2Phone: syncContacts2Phone            // sync to phone
                , isContactPluginEnabled: isContactPluginEnabled
                , isDevEnabled: isDevEnabled
                , wipeOutAllLocalPhoneContacts: wipeOutAllLocalPhoneContacts
            }
            var friendRestangular = Restangular.all('friend');
            
            var PNF = libphonenumber.PhoneNumberFormat
                , phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()            

            return service;            

            
            function ensureContactPlugin(){
                if(!isContactPluginEnabled()){
                    throw 'Please grant permission to access your phone contact first!'
                }
            }

            function isContactPluginEnabled(){
                return !!navigator.contacts;
            }

            function isDevEnabled(){
                return !!window.LiveReload;
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

            function getContactName(c) {
                var name = c.displayName;
                if(!name || name === "") {
                    if(c.name.formatted) return c.name.formatted;
                    if(c.name.givenName && c.name.familyName) return c.name.givenName +" "+c.name.familyName;
                    return "Nameless";
                }
                return name;
            }   

            function setContactName(c, name){
                c.displayName = name;
                c.nickname = name;
                var _name = new ContactName();
                _name.formatted = name
                c.name = _name;
                return c
            }  

            function extractAllContactsFromPhone(){
                var deferred = $q.defer();
                if(!isContactPluginEnabled()){
                    deferred.resolve([]);
                    return deferred.promise;    
                }

                var options      = prepareContactFindOptions();                
                var fields       = prepareContactDesireFields();
                navigator.contacts.find(fields
                    , function(contacts){
                        //contacts = resolvePhoneContacts(contacts);
                        deferred.resolve(contacts);
                    }, function(contactError){
                        deferred.reject(contactError);
                    }, options);
                return deferred.promise;
            }
            

            function retrievePhoneContacts(){
                /*
                * user_id from the token we are using...
                */
                return friendRestangular.all('phone-contacts')
                    .getList({page: 1, page_size: 10000})
                    .then(function(response){
                        return {
                            results: response.plain()
                            , count: response.count
                        }
                    })
            }

            function getPhoneContacts(){
                // combine both and gen a list for display
                // return {
                //     results: []     // profiles that matched
                //     , noMatchCount: 0  // profiles from server found no matched in phone
                //     , localCount: 0 // all phone contacts count  
                // }
                return $q.all([
                        retrievePhoneContacts()
                        , extractAllContactsFromPhone()
                    ]).then(function(response){
                        var serverProfiles = response[0].results
                            , localeContacts = response[1]
                            , retVal = {
                                results: []     // profiles that matched
                                , noMatchCount: 0  // profiles from server found no matched in phone
                                , localCount: 0 // all phone contacts count  
                            }
                        var serverProfileMap = {}   // {formattedPhone#1: profile1, formattedPhone#2: profile2, ...} 
                            , localContactMap = {}  // {formattedPhone#1: contactName1, formattedPhone#2: contactName2, ...}
                            , phoneNumber
                            , formattedPhoneNumber
                            , profile

                        angular.forEach(serverProfiles, function(profile, i){
                            // profile.phone_num from server should never be empty
                            try{
                                phoneNumber = phoneUtil.parse(profile.phone_num, 'CN');
                            } catch(e){
                                return true;
                            }
                            
                            profile.formattedPhoneNumber = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
                            profile.displayName = profile.user? profile.user.display_name: '';
                            serverProfileMap[profile.formattedPhoneNumber] = profile;
                        })
                        if(isDevEnabled() && !isContactPluginEnabled()){
                            for(phoneNumber in serverProfileMap){
                                retVal.results.push( serverProfileMap[ phoneNumber ] );
                            }
                        } else {
                            // complex comparing job with local phone
                            angular.forEach(localeContacts, function(contact, i){
                                var contactName = getContactName(contact)
                                angular.forEach(contact.phoneNumbers, function(phoneNumber, j){
                                    try{
                                        phoneNumber = phoneUtil.parse(phoneNumber.value, 'CN');
                                    } catch(e){
                                        return true;
                                    }
                                    formattedPhoneNumber = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
                                    if(! (formattedPhoneNumber in localContactMap)){
                                        retVal.localCount++;
                                    }
                                    localContactMap[formattedPhoneNumber] = contactName;
                                })
                            })

                            for(formattedPhoneNumber in serverProfileMap){
                                if(! (formattedPhoneNumber in localContactMap) ){
                                    retVal.noMatchCount ++;
                                    continue;
                                }
                                profile = serverProfileMap[formattedPhoneNumber]
                                profile.displayName = localContactMap[formattedPhoneNumber];
                                retVal.results.push(profile);
                            }
                        }
                        retVal.results.sort(function(left, right){
                            // item1.attr.localeCompare(item2.attr);
                            return left.displayName.localeCompare(right.displayName);
                        })
                        return retVal;
                    })
            }

            function syncContacts2Phone(){
                // combine from server and local, not more than server result size to phone
                // return {
                //     results: []     // profiles that matched
                //     , noMatchCount: 0  // profiles from server found no matched in phone
                //     , localCount: 0 // all phone contacts count  
                // }
                return $q.all([
                        retrievePhoneContacts()
                        , extractAllContactsFromPhone()
                    ]).then( function(response){
                        var serverProfiles = response[0].results
                            , localeContacts = response[1]
                            , retVal = {
                                results: []     // profiles that matched
                                , noMatchCount: 0  // profiles from server found no matched in phone
                                , localCount: 0 // all phone contacts count  
                            }
                        var serverProfileMap = {}   // {formattedPhone#1: profile1, formattedPhone#2: profile2, ...} 
                            , localContactMap = {}  // {formattedPhone#1: contactName1, formattedPhone#2: contactName2, ...}
                            , phoneNumber
                            , formattedPhoneNumber
                            , profile
                            , contact

                        angular.forEach(serverProfiles, function(profile, i){
                            // profile.phone_num from server should never be empty
                            try{
                                phoneNumber = phoneUtil.parse(profile.phone_num, 'CN');
                            } catch(e){
                                return true;
                            }
                            
                            profile.formattedPhoneNumber = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
                            profile.displayName = profile.user? profile.user.display_name: '';
                            serverProfileMap[profile.formattedPhoneNumber] = profile;
                        })
                        if(!isContactPluginEnabled()){
                            for(phoneNumber in serverProfileMap){
                                retVal.results.push( serverProfileMap[ phoneNumber ] );
                            }
                        } else {
                            // complex comparing job with local phone
                            angular.forEach(localeContacts, function(contact, i){
                                var contactName = resolveContactName(contact)
                                angular.forEach(contact.phoneNumbers, function(phoneNumber, j){
                                    try{
                                        phoneNumber = phoneUtil.parse(phoneNumber.value, 'CN');
                                    } catch(e){
                                        return true;
                                    }
                                    formattedPhoneNumber = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
                                    if(! (formattedPhoneNumber in localContactMap)){
                                        retVal.localCount++;
                                    }
                                    localContactMap[formattedPhoneNumber] = contactName;
                                })
                            })
                            for(formattedPhoneNumber in serverProfileMap){
                                profile = serverProfileMap[formattedPhoneNumber]
                                if(formattedPhoneNumber in localContactMap ){
                                    profile.displayName = localContactMap[formattedPhoneNumber];
                                } else {
                                    localContactMap[formattedPhoneNumber] = profile.displayName;
                                    contact = navigator.contacts.create();
                                    setContactName(contact, profile.displayName)
                                    contact.phoneNumbers = [new ContactField('mobile', profile.phone_num, true)];
                                    contact.save(function(c){
                                        // just output for an record
                                        console.info('Successfully created local contact record', profile.displayName, formattedPhoneNumber);
                                    }, function(error){
                                        console.error('Error on creation for local contact record', 
                                            c.displayName, c.phone_num, error);
                                    })
                                    
                                }

                                retVal.results.push(profile);
                            }
                        }
                        retVal.results.sort(function(left, right){
                            // item1.attr.localeCompare(item2.attr);
                            return left.displayName.localeCompare(right.displayName);
                        })
                        return retVal;
                    })

            }

            function wipeOutAllLocalPhoneContacts(){
                // return promise with removed localContacts
                var deferred = $q.defer();
                if(!isContactPluginEnabled()){
                    var reason = 'Contact Plugin is unavailable';
                    console.error(reason);
                    deferred.reject(reason);
                }

               extractAllContactsFromPhone().then(function(localeContacts){
                    angular.forEach(localeContacts, function(contact){
                        contact.remove(angular.noop, function(error){
                            console.error('Error on remove', error.code);
                        });
                    });
                    deferred.resolve(localeContacts);
                });
                return deferred.promise;
            }
        }
    });
