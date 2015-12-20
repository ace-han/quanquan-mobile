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
                , retrieveServerPhoneContacts: retrieveServerPhoneContacts    // from server
                , getPhoneContacts: getPhoneContacts              // combine server and local
                , syncContacts2Phone: syncContacts2Phone            // sync to phone
                , isContactPluginEnabled: isContactPluginEnabled
                , isDevEnabled: isDevEnabled
                , wipeOutAllLocalPhoneContacts: wipeOutAllLocalPhoneContacts
                , getPhoneLocalContacts: getPhoneLocalContacts
                , retrieveServerPhoneContactCount: retrieveServerPhoneContactCount
                , createPhoneContacts: createPhoneContacts
            }
            var friendRestangular = Restangular.all('friend')
                ,phoneContactRestangular = friendRestangular.all('phone-contacts') ;
            
            var PNF = libphonenumber.PhoneNumberFormat
                , phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()            

            return service;            

            
            function ensureContactPlugin(){
                if(!isContactPluginEnabled()){
                    throw 'Please grant permission to access your phone contacts first!'
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

            function getFormattedMobileNumber(phoneNumberStr, desiredType, countryCode){
                var mobileNumberObj = parseMobileNumber(phoneNumberStr, countryCode)
                    desiredType =  desiredType || PNF.E164;
                if(!mobileNumberObj){
                    return ''
                }
                return phoneUtil.format(mobileNumberObj, desiredType);
            }

            function parseMobileNumber(phoneNumberStr, countryCode){
                var phoneNumberObj = parsePhoneNumber(phoneNumberStr, countryCode)
                    , numberType;
                if(!phoneNumberObj){
                    return null;
                }
                numberType = phoneUtil.getNumberType(phoneNumberObj)
                if(libphonenumber.PhoneNumberType.MOBILE != numberType){
                    return null;
                }
                return phoneNumberObj;
            }

            function parsePhoneNumber(phoneNumberStr, ountryCode){
                // 
                var phoneNumberObj
                    , countryCode = countryCode || 'CN';
                try{
                    phoneNumberObj = phoneUtil.parse(phoneNumberStr, countryCode);
                } catch(e){
                    console.error(e, phoneNumberStr)
                    return null;
                }
                return phoneNumberObj;
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
                        var result = []
                        
                        angular.forEach(contacts, function(contact, i){
                            var contactName = getContactName(contact);

                            angular.forEach(contact.phoneNumbers, function(phoneNumber, j){
                                var formattedPhoneNumber = getFormattedMobileNumber(phoneNumber.value);
                                if(!formattedPhoneNumber){
                                    return true;
                                }
                                result.push({
                                    name: contactName
                                    , formattedPhoneNumber: formattedPhoneNumber
                                });
                            })
                        })
                        deferred.resolve(result);
                    }, function(contactError){
                        deferred.reject(contactError);
                    }, options);
                return deferred.promise;
            }
            

            // function retrieveServerPhoneContacts(queryStr /*, page, pageSize*/){
            function retrieveServerPhoneContacts(queryStr){
                /*
                * user_id from the token we are using...
                */
                // var params = {
                //     page: page? page: 1
                //     , page_size: pageSize? pageSize: 10000
                //     , ordering: 'user__nickname,user__username'
                // }
                var params = {
                    page: 1
                    , page_size: 10000
                    , ordering: 'user__nickname,user__username'
                }

                if(queryStr){
                    params.q = queryStr
                }

                return phoneContactRestangular
                    .getList(params)
                    .then(function(response){
                        return {
                            results: response.plain()
                            , count: response.count
                        }
                    })
            }

            function getPhoneContacts(queryStr){
                // combine both and gen a list for display
                // no pagination its way too complicated for the time being
                // return {
                //     results: []     // profiles that matched
                //     , noMatchCount: 0  // profiles from server found no matched in phone
                //     , localCount: 0 // all phone contacts count  
                // }
                return $q.all([
                        retrieveServerPhoneContacts(queryStr)
                        , extractAllContactsFromPhone()
                    ]).then(function(response){
                        var serverProfiles = response[0].results
                            , localeContacts = response[1]  // [{name: 'xxx', formattedPhoneNumber: 'yyy'}, {...}, ...]
                            , retVal = {
                                results: []     // profiles that matched
                                , noMatchCount: 0  // profiles from server found no matched in phone
                                , localCount: 0 // all phone contacts count  
                            }
                        var serverProfileMap = {}   // {formattedPhone#1: profile1, formattedPhone#2: profile2, ...} 
                            , localContactMap = {}  // {formattedPhone#1: contactName1, formattedPhone#2: contactName2, ...}
                            , formattedPhoneNumber
                            , profile

                        angular.forEach(serverProfiles, function(profile, i){
                            // profile.phone_num from server should never be empty
                            formattedPhoneNumber = getFormattedMobileNumber(profile.phone_num)
                            if(!formattedPhoneNumber){return true;}

                            profile.formattedPhoneNumber = formattedPhoneNumber;
                            profile.displayName = profile.user? profile.user.display_name: '';
                            profile.localName = profile.displayName;
                            serverProfileMap[profile.formattedPhoneNumber] = profile;
                        })
                        if(isDevEnabled() && !isContactPluginEnabled()){
                            for(formattedPhoneNumber in serverProfileMap){
                                retVal.results.push( serverProfileMap[ formattedPhoneNumber ] );
                            }
                        } else {
                            // complex comparing job with local phone
                            angular.forEach(localeContacts, function(contact, i){
                                if(! (contact.formattedPhoneNumber in localContactMap)){
                                    retVal.localCount++;
                                }
                                localContactMap[contact.formattedPhoneNumber] = contact.name;
                            })

                            for(formattedPhoneNumber in serverProfileMap){
                                if(! (formattedPhoneNumber in localContactMap) ){
                                    retVal.noMatchCount ++;
                                    continue;
                                }
                                profile = serverProfileMap[formattedPhoneNumber]
                                profile.localName = localContactMap[formattedPhoneNumber];
                                retVal.results.push(profile);
                            }
                        }
                        retVal.results.sort(function(left, right){
                            // item1.attr.localeCompare(item2.attr);
                            return left.displayName.localeCompare(right.displayName);
                        })
                        if(queryStr){
                            // when query String is enabled, then no more MatchCount
                            retVal.noMatchCount = 0;
                        }
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
                        retrieveServerPhoneContacts()
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
                            , formattedPhoneNumber
                            , profile
                            , contact

                        angular.forEach(serverProfiles, function(profile, i){
                            // profile.phone_num from server should never be empty
                            formattedPhoneNumber = getFormattedMobileNumber(profile.phone_num)
                            if(!formattedPhoneNumber){return true;}

                            profile.formattedPhoneNumber = formattedPhoneNumber;
                            profile.displayName = profile.user? profile.user.display_name: '';
                            profile.localName = profile.displayName;
                            serverProfileMap[profile.formattedPhoneNumber] = profile;
                        })
                        if(!isContactPluginEnabled()){
                            for(formattedPhoneNumber in serverProfileMap){
                                retVal.results.push( serverProfileMap[ formattedPhoneNumber ] );
                            }
                        } else {
                            
                            // complex comparing job with local phone
                            angular.forEach(localeContacts, function(contact, i){
                                if(! (contact.formattedPhoneNumber in localContactMap)){
                                    retVal.localCount++;
                                }
                                localContactMap[contact.formattedPhoneNumber] = contact.name;
                            })
                            for(formattedPhoneNumber in serverProfileMap){
                                profile = serverProfileMap[formattedPhoneNumber]
                                if(formattedPhoneNumber in localContactMap ){
                                    profile.localName = localContactMap[formattedPhoneNumber];
                                } else {
                                    localContactMap[formattedPhoneNumber] = profile.displayName; 
                                    contact = navigator.contacts.create();
                                    setContactName(contact, profile.displayName)
                                    contact.phoneNumbers = [new ContactField('mobile', formattedPhoneNumber, true)];
                                    contact.save(function(c){
                                        // just output for an record
                                        console.info('Successfully created local contact record'
                                            , getContactName(c), c.phoneNumbers);
                                    }, function(error){
                                        console.error('Error on creation for local contact record'
                                            , getContactName(c), c.phoneNumbers, error);
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

                var options      = prepareContactFindOptions();                
                var fields       = prepareContactDesireFields();
                navigator.contacts.find(fields
                    , function(contacts){
                        angular.forEach(contacts, function(contact, i){
                            contact.remove(angular.noop, function(error){
                                console.error('Error on remove', error.code);
                            });
                        })
                        deferred.resolve(); // resolve with nothing, just a notification
                    }, function(contactError){
                        deferred.reject(contactError);
                    }, options);

                return deferred.promise;
            }

            function obfuscatePhoneNumber(phoneNumberStr){
                return '****' + phoneNumberStr.slice(-4)
            }

            function getMapSize(obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            };

            function getPhoneLocalContacts(){
                // return a list as in 
                // [{name: xxx, formattedPhoneNumber: yyy, obfuscatedPhoneNumber: zzz, isNotInServer: boolean}, ...]
                return $q.all([
                            retrieveServerPhoneContacts()
                            , extractAllContactsFromPhone()
                        ]).then( function(response){
                            var serverProfiles = response[0].results
                                , localeContacts = response[1]
                                // , retVal = {
                                //     localPhoneContacts: []     
                                //     , recordsNotInServer: []
                                // }
                                , retVal = []; // with [{name: xxx, formattedPhoneNumber: yyy, obfuscatedPhoneNumber: zzz, isNotInServer: boolean}, ...]
                            var serverProfileMap = {}   // {formattedPhone#1: profile1, formattedPhone#2: profile2, ...} 
                                , localContactMap = {}  // {formattedPhone#1: contactName1, formattedPhone#2: contactName2, ...}
                                , formattedPhoneNumber
                                , profile
                                , contact

                            angular.forEach(serverProfiles, function(profile, i){
                                // profile.phone_num from server should never be empty
                                formattedPhoneNumber = getFormattedMobileNumber(profile.phone_num)
                                if(!formattedPhoneNumber){return true;}

                                profile.formattedPhoneNumber = formattedPhoneNumber;
                                profile.obfuscatedPhoneNumber = obfuscatePhoneNumber(formattedPhoneNumber);
                                profile.isNotInServer = false;
                                profile.displayName = profile.user? profile.user.display_name: '';
                                profile.localName = profile.displayName
                                serverProfileMap[profile.formattedPhoneNumber] = profile;
                            })
                            if(!isContactPluginEnabled()){
                                for(formattedPhoneNumber in serverProfileMap){

                                    retVal.push( serverProfileMap[ formattedPhoneNumber ] );
                                }
                            } else {
                                
                                // complex comparing job with local phone
                                angular.forEach(localeContacts, function(contact, i){
                                    localContactMap[contact.formattedPhoneNumber] = contact.name;
                                })

                                for(formattedPhoneNumber in localContactMap){
                                    if(formattedPhoneNumber in serverProfileMap){
                                        contact = serverProfileMap[formattedPhoneNumber];
                                        retVal.push(contact);
                                    } else {
                                        contact = {
                                            displayName: localContactMap[formattedPhoneNumber]
                                            , localName: localContactMap[formattedPhoneNumber]
                                            , formattedPhoneNumber: formattedPhoneNumber
                                            , obfuscatedPhoneNumber: obfuscatePhoneNumber(formattedPhoneNumber)
                                            , isNotInServer: true
                                        }
                                        retVal.push(contact);
                                    }
                                }
                            }
                            retVal.sort(function(left, right){
                                // item1.attr.localeCompare(item2.attr);
                                return left.displayName.localeCompare(right.displayName);
                            })
                            return retVal;
                        })
            }

            function retrieveServerPhoneContactCount(){
                return phoneContactRestangular.customGET('count')
                    .then(function(response){
                        // cus plain number 0 would be resolved as an undefined
                        return !!response? response: 0;
                    })
            }

            function createPhoneContacts(phoneNumberStrList){
                var elementToPost = [];
                angular.forEach(phoneNumberStrList, function(phoneNumberStr, i){
                    var formattedPhoneNumber = getFormattedMobileNumber(phoneNumberStr);
                    if(!formattedPhoneNumber){
                        return true;
                    }
                    elementToPost.push(formattedPhoneNumber);
                }) 
                return phoneContactRestangular.post(elementToPost)
                    .then(function(createdCount){
                        return createdCount;
                    })
            }
        }
    });
