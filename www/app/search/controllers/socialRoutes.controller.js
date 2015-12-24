define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.SocialRoutesController';

    module.controller(name, SocialRoutesController);
                
    SocialRoutesController.$inject = [
                                    'socialRoutes'
                                ];

    return SocialRoutesController;

    function SocialRoutesController( socialRoutes ) {
        // currently only support mobile contacts and alumni
        var vm = this;

        angular.extend(vm, {
            socialRoutes: socialRoutes || []
        });

        init();

        function init(){
            
        }
    }

});
