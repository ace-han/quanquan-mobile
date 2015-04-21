define([
    '../module',
    '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + ".LoginController";

    module.controller(name, LoginController);
                
    LoginController.$inject = ['$scope', '$log', namespace + '.authService' ];
    
    // since we should return the module.controller returns module itself
    // we need this controller itself actually for requirejs semantic
    // it's okay to have no return sentence, then this xxx.controller.js will be undefined like:
    //
    // define([dependency1, ...], function(dependency1, ...){
    //     dependency1 === undefined
    // })
    return LoginController;

    function LoginController($scope, $log, authService) {
        var vm = this;
        vm.title = 'Some Title';

        $scope.$watch('vm.title', function(current, original) {
            $log.info('vm.title was %s', original);
            $log.info('vm.title is now %s', current);
        });
    }


});
