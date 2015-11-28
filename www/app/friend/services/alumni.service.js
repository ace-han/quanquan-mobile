define([
        'angular', 
        '../module', 
        '../namespace'
    ],
    function(angular, module, namespace) {
        'use strict';

        var name = namespace + ".alumniService";

        module.factory(name, alumniService);

        alumniService.$inject = ['$q', 'Restangular', 'auth.principalService'];

        return alumniService;

        function alumniService($q, Restangular, principalService) {
            var service = {
                list: list
                //, get1DegreeFriendTags: get1DegreeFriendTags
            }
            var friendRestangular = Restangular.all('friend');
            
            return service;            

            function list(schoolType, q, page, pageSize) {
                /*
                    params: schoolType, q(for query string), page, pageSize
                    return result = {
                        data: []
                        pager: {
                            page: n
                            pageSize: n
                            count: n
                        }
                    }

                    controller should be two layers, one for search, the other for normal scroll
                */
                
                var deferred = $q.defer();
                friendRestangular.customGET('alumni'
                        , {user_id: userId}
                        , {Authorization: 'JWT ' + principalService.getJwtToken()}
                        ).then(function(response){
                            deferred.resolve(response.is_friend);
                        })

                return deferred.promise;
            }
        }
    });
