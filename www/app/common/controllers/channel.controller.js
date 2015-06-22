define([
    '../module',
],
function (module) {
    'use strict';

    var name = 'ChannelController';

    module.controller(name, ChannelController);
                
    ChannelController.$inject = ['$scope', '$state', '$stateParams' ];

    return ChannelController;


    // Simple solution:
    // always have cached disabled and load the first 10 most matched records 
    // from server everytime entering the view

    // Fancy solution: (For no load nav back implementation)
    // We need to disable the cache by default, 
    // 1. everytime we enter the view we will load first most matched record
    //      if the latest record matches the key(pk?) in local(sqlite or memory) then do nothing
    //      else load latest 20 records from that channel
    // 2. always display stuff from page top
    // 3. when left the view store the first record's key(pk?) in local(sqlite or memory)
    // $ionicView.X event, e.g.:
    // $scope.$on('$ionicView.afterEnter', function(){
    //      Any thing you can think of
    // });
    function ChannelController($scope, $state, $stateParams) {
        var vm = this;
        vm.viewName = $state.current.name;
        if(!$scope.abc){
            $scope.abc = ' '
        }

// no cache version
// -> recommendation -> civilization
// app.home.recommendation Tue Jun 23 2015 01:26:40 GMT+0800 (CST)
// $ionicView.loaded app.home.recommendation
// $ionicView.beforeEnter app.home.recommendation
// $ionicView.afterEnter app.home.recommendation
// $ionicView.enter app.home.recommendation
// $ionicView.unloaded app.home.recommendation
// app.home.civilization Tue Jun 23 2015 01:26:49 GMT+0800 (CST)
// $ionicView.loaded app.home.civilization
// $ionicView.beforeEnter app.home.civilization
// $ionicView.afterEnter app.home.civilization
// $ionicView.enter app.home.civilization


// cache version
// -> recommendation -> civilization
// $ionicView.loaded app.home.recommendation
// $ionicView.beforeEnter app.home.recommendation
// $ionicView.afterEnter app.home.recommendation
// $ionicView.enter app.home.recommendation
// app.home.civilization Tue Jun 23 2015 01:28:28 GMT+0800 (CST)
// $ionicView.loaded app.home.civilization
// $ionicView.beforeEnter app.home.civilization
// $ionicView.beforeLeave app.home.recommendation
// $ionicView.afterEnter app.home.civilization
// $ionicView.enter app.home.civilization
// $ionicView.afterLeave app.home.recommendation
// $ionicView.leave app.home.recommendation
        console.info( vm.viewName + $scope.abc + new Date());

        $scope.$on('$ionicView.loaded', function(){
            console.info('$ionicView.loaded ' + vm.viewName);
        })
        $scope.$on('$ionicView.beforeEnter', function(){
            console.info('$ionicView.beforeEnter ' + vm.viewName);
        })
        $scope.$on('$ionicView.afterEnter', function(){
            console.info('$ionicView.afterEnter ' + vm.viewName);
        })
        $scope.$on('$ionicView.enter', function(){
            console.info('$ionicView.enter ' + vm.viewName);
        })
        $scope.$on('$ionicView.unloaded', function(){
            console.info('$ionicView.unloaded ' + vm.viewName);
        })
        $scope.$on('$ionicView.beforeLeave', function(){
            console.info('$ionicView.beforeLeave ' + vm.viewName);
        })
        $scope.$on('$ionicView.afterLeave', function(){
            console.info('$ionicView.afterLeave ' + vm.viewName);
        })
        $scope.$on('$ionicView.leave', function(){
            console.info('$ionicView.leave ' + vm.viewName);
        })
    }


});
