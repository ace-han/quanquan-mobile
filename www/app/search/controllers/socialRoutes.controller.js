define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.SocialRoutesController';

    module.controller(name, SocialRoutesController);
                
    SocialRoutesController.$inject = [ '$ionicLoading'
                                    , 'account.basicInfoService'
                                    , namespace+'.socialService'
                                    , 'socialRoutes'
                                ];

    return SocialRoutesController;

    function SocialRoutesController( $ionicLoading
                                    , basicInfoService
                                    , socialService
                                    , socialRoutes ) {
        // currently only support mobile contacts and alumni
        var vm = this;

        angular.extend(vm, {
            socialRoutes: socialRoutes || []
            , resolveGenderIconClass: resolveGenderIconClass
            , toggleRouteDetail: toggleRouteDetail
        });

        init();

        function init(){
            angular.forEach(vm.socialRoutes, function(route, i){
                route.expandable = true;
                if(i==0){
                    toggleRouteDetail(route);
                    return true;
                }
                
            });
        }

        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

        function toggleRouteDetail(route){
            if (route.detailItems){
                route.expandable = !route.expandable;
                return;
            }
            socialService.getRouteDetail(route.route_code, true)
                .then(function(response){
                    route.detailItems = response.results
                    route.expandable = !route.expandable;
                }, function(error){
                    console.error(error)
                    $ionicLoading.show({ template: 'Server Error!', noBackdrop: true, duration: 1000 });
                })
        }
    }

});
