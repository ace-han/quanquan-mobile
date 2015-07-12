define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.RepliesController';

    module.controller(name, RepliesController);
                
    RepliesController.$inject = ['$scope', '$timeout', '$ionicLoading', '$ionicPopover'
            , '$stateParams', namespace+'.replyService' ];

    return RepliesController;

    function RepliesController($scope, $timeout, $ionicLoading, $ionicPopover
                , $stateParams, replyService) {
        var vm = this;
        vm.replies = [];

        vm.moreDataCanBeLoaded = moreDataCanBeLoaded;
        vm.loadMore = loadMore;
        
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

    }

    

});
