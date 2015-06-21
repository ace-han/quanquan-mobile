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

        vm.tabs = [];
        channelService.getChannelStateSettings()
            .then(
                function(stateSettings){
                    angular.forEach(stateSettings, function(state){
                        vm.tabs.push({
                            title: state.title
                            , uiSref: state.name
                            , url: state.url
                            , viewName: state.viewName
                        });
                    });
            }
            , function(error){
                $timeout(function(){
                    $ionicLoading.show({ template: 'Load Failed! Retry later', 
                        noBackdrop: true, duration: 2000 });
                }, 500); 
            })
        
    }


});
