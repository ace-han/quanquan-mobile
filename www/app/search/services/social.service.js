define([
        'angular'
        , '../module'
        , '../namespace'
    ],
    function(angular, module, namespace) {
        'use strict';

        var name = namespace + ".socialService";

        module.factory(name, socialService);

        socialService.$inject = ['$q', 'Restangular', 'auth.principalService'];

        return socialService;

        function socialService($q, Restangular, principalService) {
            var service = {
                getSocialProfile: getSocialProfile
                
            }
            var friendRestangular = Restangular.all('friend')
            , socialRestangular = friendRestangular.all('social-profiles')
            
            return service;            

            function getSocialProfile(q, page, pageSize) {
                
                var params = {
                    page: page? page: 1
                    , page_size: pageSize? pageSize: 20
                    , ordering: 'user__nickname,user__username'
                }
                if(q){
                    params['q'] = q;
                }
                return socialRestangular.getList(params)
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
