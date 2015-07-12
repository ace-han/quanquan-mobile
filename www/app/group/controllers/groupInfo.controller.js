define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.GroupInfoController';

    module.controller(name, GroupInfoController);
                
    GroupInfoController.$inject = ['$scope', '$timeout', '$ionicLoading', '$ionicPopover'
            , 'pullToRefreshService' ,namespace + '.groupService' ];

    return GroupInfoController;

    function GroupInfoController($scope, $timeout, $ionicLoading, $ionicPopover
                , pullToRefreshService, groupService) {
        var vm = this;

        vm.groupBrief = 'I am an <code>HTML</code>string with ' +
                '<a href="#">links!</a> and other <em>stuff</em>';
        
    }


});
