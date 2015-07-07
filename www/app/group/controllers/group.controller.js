define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.GroupController';

    module.controller(name, GroupController);
                
    GroupController.$inject = ['$scope', '$timeout', '$ionicLoading', '$ionicPopover'
            , 'pullToRefreshService' ,namespace + '.groupService' ];

    return GroupController;

    function GroupController($scope, $timeout, $ionicLoading, $ionicPopover
                , pullToRefreshService, groupService) {
        var vm = this;

        vm.joinedGroups = [];
        vm.doRefresh = doRefresh;
        vm.moreDataCanBeLoaded = moreDataCanBeLoaded;
        vm.loadMore = loadMore;
        vm.openPopover = openPopover;
        vm.closePopover = closePopover;
        vm.group = {name: 'Test'
                    , owner: 'test'
                    , memberCount: 100
                    , brief: 'test test test test test to the end!!!'}
        vm.toggleGroup = toggleGroup;
        vm.isGroupShown = isGroupShown;

        $ionicPopover.fromTemplateUrl('app/group/templates/index_popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });


        function openPopover($event) {
            $scope.popover.show($event);
        };
        function closePopover() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
        // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
        // Execute action
        });
        // When the view is loaded, trigger the PTR event.
        // Use the delegate handle name from the view.
        $scope.$on("$ionicView.loaded", function() {
            console.log("View loaded! Triggering PTR");
            pullToRefreshService.triggerPtr('group-ptr-content');
        });

        // Used to know whether to show ititial items or new items for a manual refresh
        var refreshed = false;

        function doRefresh() {
            console.log('Refreshing!');

                if (!refreshed) {
                    groupService.getJoinedGroups()
            .then(
                function(groups){
                    angular.forEach(groups, function(group){
                        vm.joinedGroups.push({
                            slug: group.slug
                            , imgSrc: group.imgSrc
                            , name: group.name
                        });
                    });
                    refreshed = true;
                    //Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
            }
            , function(error){
                $timeout(function(){
                    $ionicLoading.show({ template: 'Load Failed! Retry later', 
                        noBackdrop: true, duration: 2000 });

                    //Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                }, 500); 
            });

                    
                } else {
                    //simulate async response
                    for(var i=0; i<10; i++){
                        vm.joinedGroups.unshift({slug: i
                                                , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                                                , name: ' New Item ' + Math.floor(Math.random() * 1000) + 4});
                    }

                    //Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                }

        };

        function moreDataCanBeLoaded(){
            // return true will trigger loadMore function
            var result = vm.joinedGroups.length > 2 && vm.joinedGroups.length <= 30;
            console.info('groupController.moreDataCanBeLoaded', result);
            return result;
        }

        function loadMore(){
            console.info('groupController.loadMore');
            $timeout(function(){
                console.info('loadMore')
                for(var i=0; i<3; i++){
                    vm.joinedGroups.push({slug: i
                                , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                                , name: ' New Item ' + Math.floor(Math.random() * 1000) + 4});
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);
        }


        function toggleGroup() {
            if (vm.isGroupShown(vm.group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = vm.group;
            }
        }

        function isGroupShown() {
            return $scope.shownGroup === vm.group;
        }

        
    }


});
