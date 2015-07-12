define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.TopicController';

    module.controller(name, TopicController);
                
    TopicController.$inject = ['$scope', '$timeout', '$ionicLoading', '$ionicPopover'
            , '$stateParams', namespace + '.topicService'];

    return TopicController;

    function TopicController($scope, $timeout, $ionicLoading, $ionicPopover
                , $stateParams, topicService) {
        var vm = this;


        vm.openPopover = openPopover;
        vm.closePopover = closePopover;

        vm.group = {name: 'Group Name'
                    , slug: 'group-slug'
                    }
        /*
        vm.replies = [];

        vm.moreDataCanBeLoaded = moreDataCanBeLoaded;
        vm.loadMore = loadMore;
        */
        $ionicPopover.fromTemplateUrl('app/group/templates/topic_popover.html', {
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

        });

        $ionicLoading.show({noBackdrop: true});

        topicService.getTopic($stateParams.id)
            .then(function(topic){
                vm.topic = topic;
                $ionicLoading.hide();
            }
            , function(error){
                $timeout(function(){
                    $ionicLoading.show({ template: 'Load Failed! Retry later', 
                        noBackdrop: true, duration: 2000 });
                }, 500); 
            });
        /*
        // replies
        replyService.getTopicReplies($stateParams.id)
            .then(function(replies){
                vm.replies = replies;
            }
            , function(error){
                $timeout(function(){
                    $ionicLoading.show({ template: 'Load Failed! Retry later', 
                        noBackdrop: true, duration: 2000 });
                }, 500); 
            });

        function moreDataCanBeLoaded(){
            // return true will trigger loadMore function
            var result = vm.replies.length > 2 && vm.replies.length <= 30;
            return result;
        }

        function loadMore(){

            replyService.getTopicReplies($stateParams.id)
                .then(function(replies){
                    for(var i=0; i<replies.length; i++){
                        vm.replies.push(replies[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                , function(error){
                    $timeout(function(){
                        $ionicLoading.show({ template: 'Load Failed! Retry later', 
                            noBackdrop: true, duration: 2000 });
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }, 500); 
                });
            
        }
        */

    }

});
