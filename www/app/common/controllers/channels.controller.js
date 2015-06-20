define([
    'angular'
    , '../module'
],
function (angular, module) {
    'use strict';

    var name = 'ChannelsController';

    module.controller(name, ChannelsController);
                
    ChannelsController.$inject = ['$scope', '$timeout', '$ionicLoading', 
                    'channelService' ];

    return ChannelsController;

    function ChannelsController($scope, $timeout, $ionicLoading, 
                    channelService) {
        var vm = this;
        vm.tabs = [
                    {
                        title: "Recommendation"
                        , uiSref: "app.home.channel({channel: 'recommendation'})"
                        , viewName: "recommendation-tab"
                    }
                    , {
                        title: "Civilization"
                        , uiSref: "app.home.channel({channel: 'civilization'})"
                        , viewName: "civilization-tab"
                    }
                    , {
                        title: "Test"
                        , uiSref: "search.index"
                        , viewName: "search-tab"
                    }
                ];
        /*
        channelService.getChannelViews()
            .then(
                function(channels){
                vm.tabs = channels;
            }
            , function(error){
                $timeout(function(){
                    $ionicLoading.show({ template: 'Load Failed! Retry later', 
                        noBackdrop: true, duration: 2000 });
                }, 500); 
            })
        */
    }


});
