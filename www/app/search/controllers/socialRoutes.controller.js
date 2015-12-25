define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.SocialRoutesController';

    module.controller(name, SocialRoutesController);
                
    SocialRoutesController.$inject = [ 'account.basicInfoService'
                                    , 'socialRoutes'
                                ];

    return SocialRoutesController;

    function SocialRoutesController( basicInfoService, socialRoutes ) {
        // currently only support mobile contacts and alumni
        var vm = this;

        angular.extend(vm, {
            socialRoutes: socialRoutes || []
            , resolveGenderIconClass: resolveGenderIconClass
        });

        init();

        function init(){
            angular.forEach(vm.socialRoutes, function(route, i){
                route.expandable = i!=0;
            });
        }

        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }
    }

});
