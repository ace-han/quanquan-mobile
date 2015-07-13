define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.TopicController';

    module.controller(name, TopicController);
                
    TopicController.$inject = ['$scope', '$timeout', '$ionicLoading', '$ionicPopover'
            , '$ionicModal', '$stateParams', namespace + '.topicService'];

    return TopicController;

    function TopicController($scope, $timeout, $ionicLoading, $ionicPopover
                , $ionicModal, $stateParams, topicService) {
        var vm = this;

        var attributes = {
            group: {name: 'Group Name'
                    , slug: 'group-slug'
                    }
            , topic: {}
            , replyTo: ''   // for modal reply
            , replyContent: ''
        };

        var methods = {
            openPopover: openPopover
            , closePopover: closePopover
            , openModal: openModal
            , closeModal: closeModal
        };


        vm = angular.extend(vm, attributes, methods);

        $scope.vm = vm;
        $ionicLoading.show({noBackdrop: true});

        topicService.getTopic($stateParams.id)
            .then(function(topic){
                vm.topic = topic;
                vm.replyTo = topic.title;
                $ionicLoading.hide();
            }
            , function(error){
                $timeout(function(){
                    $ionicLoading.show({ template: 'Load Failed! Retry later', 
                        noBackdrop: true, duration: 2000 });
                }, 500); 
            });
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

        $ionicModal.fromTemplateUrl('app/group/templates/reply_modal.html', {
            scope: $scope
            , animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        function openPopover($event) {
            $scope.popover.show($event);
        };
        function closePopover() {
            $scope.popover.hide();
        };

        function openModal($event) {
            $scope.modal.show($event);
        };
        function closeModal() {
            $scope.modal.hide();
        };

        
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
            $scope.modal.remove();
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
