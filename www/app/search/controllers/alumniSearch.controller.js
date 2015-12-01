define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.AlumniSearchController';

    module.controller(name, AlumniSearchController);
                
    AlumniSearchController.$inject = ['$scope', '$stateParams'
                                , 'account.basicInfoService', 'friend.friendService'
                                , 'currentUser'];

    return AlumniSearchController;

    function AlumniSearchController($scope, $stateParams
                            , basicInfoService, friendService
                            , currentUser) {
        var vm = this;

        angular.extend(vm, {
            alumni: []
            , alumniTotalCount: 0
            , moreDataCanBeLoaded: moreDataCanBeLoaded
            , loadMore: loadMore
            , resolveGenderIconClass: resolveGenderIconClass    
        });

        var page = 1
        , pageSize = 20
        //, alumniTotalCount = 0 //avoid displaying No more items label, alumniTotalCount: 0.1 //avoid displaying No more items sign
        , schoolType = $stateParams.schoolType;
        init();

        function init(){
            console.log('init', schoolType);
            _initAlumni();
            
        }

        function _initAlumni(){
            // should be a variable recording the last refresh time
            // and a delta duration for force the refresh from the very begining like one hour/day
            friendService.getAlumni(schoolType, '', page, pageSize)
                .then(function(response){
                    Array.prototype.push.apply(vm.alumni, response.results);
                    vm.alumniTotalCount = response.count;
                    page++;
                });
            
        }
        
        function moreDataCanBeLoaded(){
            return (page-1)*pageSize < alumniTotalCount;
        }

        function loadMore(){
            console.log('loadMore', schoolType);
            friendService.getAlumni(schoolType, '', page, pageSize)
                .then(function(response){
                    Array.prototype.push.apply(vm.alumni, response.results);
                    vm.alumniTotalCount = response.count;
                    page++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }


        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

        
    }

});
