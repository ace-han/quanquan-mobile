define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.ChannelController';

    module.controller(name, ChannelController);
                
    ChannelController.$inject = ['$scope', '$state', '$timeout', 'pullToRefreshService' ];

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
    function ChannelController($scope, $state, $timeout, pullToRefreshService) {
        var vm = this;
        var stateName = $state.current.name.slice();
        vm.channelName = stateName.slice(stateName.lastIndexOf('.')+1);
        // Start with an empty items array
        vm.items = [];
        vm.doRefresh = doRefresh;
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

        // $scope.$on('$ionicView.loaded', function(){
        //     console.info('$ionicView.loaded ' + vm.channelName);
        // })
        // $scope.$on('$ionicView.beforeEnter', function(){
        //     console.info('$ionicView.beforeEnter ' + vm.channelName);
        // })
        // $scope.$on('$ionicView.afterEnter', function(){
        //     console.info('$ionicView.afterEnter ' + vm.channelName);
        // })
        // $scope.$on('$ionicView.enter', function(){
        //     console.info('$ionicView.enter ' + vm.channelName);
        // })
        // $scope.$on('$ionicView.unloaded', function(){
        //     console.info('$ionicView.unloaded ' + vm.channelName);
        // })
        // $scope.$on('$ionicView.beforeLeave', function(){
        //     console.info('$ionicView.beforeLeave ' + vm.channelName);
        // })
        // $scope.$on('$ionicView.afterLeave', function(){
        //     console.info('$ionicView.afterLeave ' + vm.channelName);
        // })
        // $scope.$on('$ionicView.leave', function(){
        //     console.info('$ionicView.leave ' + vm.channelName);
        // })



        // Used to know whether to show ititial items or new items for a manual refresh
        var refreshed = false;

        
        // When the view is loaded, trigger the PTR event.
        // Use the delegate handle name from the view.
        $scope.$on("$ionicView.loaded", function() {
            console.log("View loaded! Triggering PTR");
            pullToRefreshService.triggerPtr('ptr-content');
        });

        function doRefresh() {
            console.log('Refreshing!');
            $timeout(function() {
                if (!refreshed) {
                    vm.items = ['Item 1', 'Item 2', 'Item 3'];
                    refreshed = true;
                } else {
                    //simulate async response
                    vm.items.push(vm.channelName + ' New Item ' + Math.floor(Math.random() * 1000) + 4);

                }

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);

        };


    }
});
