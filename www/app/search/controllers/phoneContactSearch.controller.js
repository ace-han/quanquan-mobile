define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.PhoneContactSearchController';

    module.controller(name, PhoneContactSearchController);
                
    PhoneContactSearchController.$inject = ['$window', '$scope', '$state', '$stateParams', '$timeout'
                                , '$ionicFilterBar'
                                , 'account.basicInfoService', 'friend.phoneContactService'
                                , 'currentUser'];

    return PhoneContactSearchController;

    function PhoneContactSearchController($window, $scope, $state, $stateParams, $timeout
                            , $ionicFilterBar
                            , basicInfoService, phoneContactService
                            , currentUser) {
        var vm = this;

        angular.extend(vm, {
            q: $stateParams.q || ''
            , items: []
            , mayShowNoMore: false
            , matchCount: 0
            , moreDataCanBeLoaded: moreDataCanBeLoaded
            , loadMore: loadMore
            , resolveGenderIconClass: resolveGenderIconClass
            , goBack: goBack
        });

        var page = 1    // deprecated
        , pageSize = 20
        , filterBarInstance = null
        , schoolType = $stateParams.schoolType
        , currentStateName = $state.current.name;
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

            $timeout(function(){
                filterBarInstance = $ionicFilterBar.show({
                    debounce: true
                    , items: vm.items // dont care if it is an empty list
                    , search: function(filterText){
                        return phoneContactService.getPhoneContacts(filterText)
                            .then(function(response){
                                page = 2; // direct jump to next page for ifiniteLoad
                                vm.mayShowNoMore = false;
                                vm.matchCount = response.results.length;
                                return response.results;
                            })

                    }
                    , update: function (filteredItems, filterText) {
                        // we'd better keep the same reference instead of a new one
                        vm.q = filterText;
                        vm.items.length = 0;
                        Array.prototype.push.apply(vm.items, filteredItems);
                    }
                    , cancel: function(){
                        vm.goBack();
                    }
                });
            }, 200);
        }

        function moreDataCanBeLoaded(){
            return ((page-1)||1)*pageSize < vm.matchCount;
        }

        function loadMore(){
            phoneContactService.getPhoneContacts(schoolType, vm.q, page, pageSize)
                .then(function(response){
                    Array.prototype.push.apply(vm.items, response.results);
                    vm.matchCount = response.results.length;
                    page++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }


        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

        function goBack(){
            // only go back from the current page, not from an already left page from this current page
            $timeout(function(){
                if(currentStateName != $state.current.name){return;}
                $window.history.back();
            }, 100)
            
        }
    }

});
