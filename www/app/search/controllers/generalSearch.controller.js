define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.GeneralSearchController';

    module.controller(name, GeneralSearchController);
                
    GeneralSearchController.$inject = ['$scope', '$stateParams'
                                , '$ionicFilterBar'
                                , 'account.basicInfoService', 'search.socialService'
                                ];

    return GeneralSearchController;

    function GeneralSearchController($scope, $stateParams
                            , $ionicFilterBar
                            , basicInfoService, socialService
                            ) {
        // currently only support mobile contacts and alumni
        var vm = this;

        angular.extend(vm, {
            q: $stateParams.q || ''
            , items: []
            , mayShowNoMore: false
            , matchCount: 0
            , moreDataCanBeLoaded: moreDataCanBeLoaded
            , loadMore: loadMore
            , resolveGenderIconClass: resolveGenderIconClass
            , showFilterBar: showFilterBar
        });

        var page = 1
        , pageSize = 20
        , filterBarInstance = null
        init();

        function init(){
            
            $scope.$on('$ionicView.leave', function(){
                console.info('$ionicView.leave');
                if (filterBarInstance) {
                    filterBarInstance(); // this is some sort of clean handler
                    filterBarInstance = null;
                }
            })

            $scope.$on('scroll.infiniteScrollComplete', function(){
                vm.mayShowNoMore = true;
            });


        }

        function moreDataCanBeLoaded(){
            return ((page-1)||1)*pageSize < vm.matchCount;
        }

        function loadMore(){
            return socialService.getSocialProfile(vm.q, page, pageSize)
                .then(function(response){
                    Array.prototype.push.apply(vm.items, response.results);
                    vm.matchCount = response.count;
                    page++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

        function showFilterBar(){
            filterBarInstance = $ionicFilterBar.show({
                    debounce: true
                    , items: vm.items // dont care if it is an empty list
                    , search: function(filterText){
                        vm.q = filterText;
                        return socialService.getSocialProfile(filterText, 1, pageSize)
                            .then(function(response){
                                page = 2; // direct jump to next page for ifiniteLoad
                                vm.mayShowNoMore = false;
                                vm.matchCount = response.count;
                                return response.results;
                            })

                    }
                    , update: function (filteredItems, filterText) {
                        // we'd better keep the reference the same instead of an
                        vm.items = filteredItems;
                    }
                    , cancel: function(){
                        vm.q = '';
                    }
                });
        }
    }

});
