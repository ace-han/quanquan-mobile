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
                , getSocialRoutes: getSocialRoutes
                , getRouteDetail: getRouteDetail
                
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

            function getSocialRoutes(targetUser){
                var params = {
                    target_user: targetUser
                };
                return socialRestangular.customGETLIST('social-routes', params)
                    .then(function(response){
                        return {
                            results: response.plain()
                            , count: response.count
                        }
                    })
            }

            function getRouteDetail(routeCode, simple){
                // simple => simple result that has no tags on the profile
                var params = {
                    route_code: routeCode
                };
                if(simple){
                    params.fields = ['id,user,gender,city,age,college,high_school,occupations']
                }
                return socialRestangular.customGETLIST('social-route-detail', params)
                    .then(function(response){
                        return {
                            results: response.plain()
                            , count: response.count
                        }
                    })
            }

        }
    });
