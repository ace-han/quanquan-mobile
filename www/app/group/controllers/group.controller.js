define([
    '../module'
    , '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + '.GroupController';

    module.controller(name, GroupController);
                
    GroupController.$inject = ['$scope', '$timeout', '$ionicLoading', 
                    namespace + '.groupService' ];

    return GroupController;

    function GroupController($scope, $timeout, $ionicLoading, 
                    groupService) {
        var vm = this;

        vm.joinedGroups = [];
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
            }
            , function(error){
                $timeout(function(){
                    $ionicLoading.show({ template: 'Load Failed! Retry later', 
                        noBackdrop: true, duration: 2000 });
                }, 500); 
            })
        
    }


});
