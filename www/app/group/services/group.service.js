define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.groupService';

    module.factory(name, groupService);

    groupService.$inject = ['$http', '$q', '$window', '$timeout' ];

    return groupService;

    function groupService($http, $q, $window, $timeout){
        var _cache;

        var service = {
            _cache: _cache
            , getJoinedGroups: getJoinedGroups
        }

        return service;

        

        function doGetJoinedGroups(){
            // return a list [{name:'', title:'', templateUrl:''}, ...]
            var deferred = $q.defer();
            
            $timeout(function(){
                var result = [
                    {
                        name: 'Team A'
                        , slug: 'a'
                        , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                    }
                    , {
                        name: 'Team B'
                        , slug: 'b'
                        , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                    }
                    , {
                        name: 'Team C'
                        , slug: 'c'
                        , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                    }
                ];
                deferred.resolve(result);
            }, 1000);
            return deferred.promise;
        }

        function getJoinedGroups(){
            var deferred = $q.defer();
            if(!_cache) {
                doGetJoinedGroups().then(
                    function(channels){
                        _cache = channels;
                        deferred.resolve(_cache);
                    }
                    , function(error){
                        deferred.reject(error);
                    }
                )
            } else {
                deferred.resolve(_cache);
            }
            return deferred.promise;
            
        }

    }
});