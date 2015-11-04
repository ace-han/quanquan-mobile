define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".profileService";
    
    module.factory(name, profileService);

    profileService.$inject = ['$q', 'Restangular', 'auth.principalService'];

    return profileService;

    function profileService($q, Restangular, principalService){
        var service = {
            getUserProfileInfo: getUserProfileInfo
            , getProfileInfo: getProfileInfo
            , updateUserProfileInfo: updateUserProfileInfo
        }

        var accountRestangular = Restangular.all('account')
            , profileRestangular = accountRestangular.all('user-profiles');
        return service;

        function getUserProfileInfo(userId, kwargs) {
            var deferred = $q.defer();
            var params = {user_id: userId}
            if(angular.isDefined(kwargs) ){
                angular.extend(params, kwargs)
            }
            profileRestangular.customGET('x/userwise/'
                            , params
                            // avoid 403 error
                            , {Authorization: 'JWT ' + principalService.getJwtToken()})
                            .then(function(response){
                                deferred.resolve(response);
                            })
            return deferred.promise;
        }

        function getProfileInfo(profileId){
            return accountRestangular.one('user-profiles', profileId).get();
        }

        function updateUserProfileInfo(profileInfo, fields){
            // userProfileInfo should provide profile id itself...
            // since user is assuming from a separated app/db, so we should handle the update for user in a diff service
            var params = {}
            if(fields && fields.length){
                angular.forEach(fields, function(field, i){
                    if(field in profileInfo){
                        params[field] = profileInfo[field];
                    }
                });
            } else {
                params = profileInfo;
            }
            for(var key in params){
                var value = params[key];
                if(angular.isObject(value)){
                    // for simple id update in complex object field
                    //params[key] = value.id;
                    // for the record we need to customize an update method in the server
                    params[key] = {id: value.id}; 
                }
            }
            var payload = principalService.getCurrentUserInfo();
            return accountRestangular.one('user-profiles', profileInfo.id)
                        .patch(params);

        }
    }
});