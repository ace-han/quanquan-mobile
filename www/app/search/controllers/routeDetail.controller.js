define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.RouteDetailController';

    module.controller(name, RouteDetailController);
                
    RouteDetailController.$inject = [
                                'account.basicInfoService', 'search.socialService'
                                , 'profiles'
                                ];

    return RouteDetailController;

    function RouteDetailController(
                            basicInfoService, socialService
                            , profiles
                            ) {
        // currently only support mobile contacts and alumni
        var vm = this;

        angular.extend(vm, {
            items: profiles || []
            , resolveGenderIconClass: resolveGenderIconClass
        });


        init();

        function init(){

        }

        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

    }

});
