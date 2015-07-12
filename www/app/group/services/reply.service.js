define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.replyService';

    module.factory(name, replyService);

    replyService.$inject = ['$http', '$q', '$window', '$timeout', 'moment' ];

    return replyService;

    function replyService($http, $q, $window, $timeout, Moment){

        var service = {
            getTopicReplies: getTopicReplies
        }

        return service;

        function getTopicReplies(topicId){
            var deferred = $q.defer();
            var content = 'bullshit bullshit bullshit bullshit bullshit bullshit bullshit ';
            $timeout(function(){
                var result = [
                    {
                        id: 1
                        , authorImg: 'http://ionicframework.com/img/docs/venkman.jpg' // if a topic has not img attached, then attach its author's profile
                        , authorName: 'Ace'
                        , replyCount: 100
                        , publishedAt: Moment().subtract(10, 'minutes')
                        , content: 'abc '+ content
                    }
                    , {
                        id: 2
                        , authorImg: 'http://ionicframework.com/img/docs/venkman.jpg'
                        , authorName: 'Bob'
                        , replyCount: 200
                        , publishedAt: Moment().subtract(1, 'months')
                        , content: 'def '+ content
                    }
                    , {
                        id: 3
                        , authorImg: 'http://ionicframework.com/img/docs/venkman.jpg'
                        , authorName: 'Cat'
                        , replyCount: 50
                        , publishedAt: Moment().subtract(10, 'days')
                        , content: content
                    }
                ];
                deferred.resolve(result);
            }, 1000);
            return deferred.promise;
            
        }

    }
});