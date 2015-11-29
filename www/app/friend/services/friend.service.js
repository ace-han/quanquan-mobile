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
                , getAlumni: getAlumni
            }
            var friendRestangular = Restangular.all('friend')
            , alumniRestangular = friendRestangular.all('alumni')
            
            return service;            

            function hasFriendship(userId) {
                
                var deferred = $q.defer();
                friendRestangular.customGET('has-friendship'
                        , {user_id: userId}
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

            function getAlumni(schoolType, q, page, pageSize){
                /*
                    params: schoolType, q(for query string), page, pageSize

                    return response = {
                        results: []
                        count: n
                    }
                    let's align with drf's return format as much as possible

                    controller should be two layers, one for search, the other for normal scroll
                */
                var params = {
                    page: page? page: 1
                    , page_size: pageSize? pageSize: 20
                    , ordering: 'user__nickname,user__username'
                }
                if(schoolType){
                    params['school_type'] = schoolType;
                }
                if(q){
                    params['q'] = q;
                }
                return alumniRestangular.getList(params)
                    .then(function(response){
                        // let's align with drf's return format as much as possible
                        return {
                            results: response.plain()
                            , count: response.count
                        }
                    })
            }
        }
    });
