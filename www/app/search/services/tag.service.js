define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + ".tagService";
    
    module.factory(name, tagService);

    tagService.$inject = ['$q', 'Restangular'];

    return tagService;

    function tagService($q, Restangular){
        var service = {
            getTags: getTags

        }

        var tagModuleRestangular = Restangular.all('tag')
            , tagRestangular = tagModuleRestangular.all('tags');
        return service;

        function getTags(queryString) {
            var deferred = $q.defer();
            var params = {
                q: queryString
            }
            tagRestangular.getList(
                                params
                            )
                            .then(function(response){
                                deferred.resolve(response.plain());
                            })
            return deferred.promise;

        }

    }
});