define([
        'angular', 
        '../module', 
        '../namespace'
    ],
    function(angular, module, namespace) {
        'use strict';

        var name = namespace + ".friendService";

        module.factory(name, friendService);

        friendService.$inject = ['$q', 'Restangular', 'auth.principalService'];

        return friendService;

        function friendService($q, Restangular, principalService) {
            var service = {
                hasFriendship: hasFriendship
                , get1DegreeFriendTags: get1DegreeFriendTags
            }
            var friendRestangular = Restangular.all('friend');
            
            return service;            

            function hasFriendship(profileId) {
                
                var deferred = $q.defer();
                friendRestangular.customGET('has-friendship'
                        , {profile_id: profileId}
                        , {Authorization: 'JWT ' + principalService.getJwtToken()}
                        ).then(function(response){
                            deferred.resolve(response.is_friend);
                        })

                return deferred.promise;
            }

            function get1DegreeFriendTags(userId){
                return friendRestangular.one('users', userId)
                    .customGETLIST('tags')
                    .then(function(response){
                        return response.plain();
                    })
            }


        }
    });
