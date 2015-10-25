define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + ".profileService";
    
    module.factory(name, profileService);

    profileService.$inject = ['$q', 'Restangular', 'auth.principalService'];

    return profileService;

    function profileService($q, Restangular, principalService){
        var service = {
            getUserProfileInfo: getUserProfileInfo
            , updateUserProfileInfo: updateUserProfileInfo
        }

        var accountRestangular = Restangular.all('account')
            , profileRestangular = accountRestangular.all('user-profiles')

        return service;

        function getUserProfileInfo(userId) {
            var deferred = $q.defer();
            profileRestangular.customGET('x/userwise/', {user_id: userId})
                            .then(function(response){
                                deferred.resolve(response);
                            })
            return deferred.promise;
        }

        function updateUserProfileInfo(userProfileInfo){
            // since user is assuming from a separated app/db, so we should handle the update for user in a diff service
            
        }
    }
});