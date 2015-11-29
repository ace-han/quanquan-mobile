define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.AlumniSearchController';

    module.controller(name, AlumniSearchController);
                
    AlumniSearchController.$inject = ['$window', '$scope', '$stateParams'
                                , namespace+'.friendService'
                                , 'profile', 'currentUser'];

    return AlumniSearchController;

    function AlumniSearchController($window, $scope, $stateParams
                            , friendService
                            , profile, currentUser) {
        var vm = this;

        angular.extend(vm, {
            alumni: []
            , moreDataCanBeLoaded: moreDataCanBeLoaded
            , loadMore: loadMore
            , hasJoinedSchool: hasJoinedSchool
            , getSchoolName: getSchoolName
            , goBack: goBack
            
        });

        var page = 1
        , pageSize = 20
        , alumniTotalCount = 0.1 //avoid displaying No more items label, alumniTotalCount: 0.1 //avoid displaying No more items sign
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
                    alumniTotalCount = response.count;
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
                    alumniTotalCount = response.count;
                    page++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function hasJoinedSchool(){
            return !!profile[schoolType];
        }

        function getSchoolName(){
            return profile[schoolType]? profile[schoolType].name: 'Unknown';
        }
        
        function goBack(){
            // Currently found this work
            // Don't use ionic $ionicHistory.goBack(); it does not work on tab view...
            $window.history.back();
        }

        function resolveGenderIconClass(nGender){
            return basicInfoService.resolveGenderIconClass(nGender);
        }

        function getAlumniTotalCount(){
            // since it would be 0.1...
            return parseInt( alumniTotalCount );
        }
        
    }

});
