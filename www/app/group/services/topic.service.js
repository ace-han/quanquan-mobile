define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.topicService';

    module.factory(name, topicService);

    topicService.$inject = ['$http', '$q', '$window', '$timeout', 'moment' ];

    return topicService;

    function topicService($http, $q, $window, $timeout, Moment){
        var _cache = {};

        var service = {
            _cache: _cache
            , getGroupTopics: getGroupTopics
            , getTopic: getTopic
        }

        return service;

        

        function doGetGroupTopics(groupName){
            // return a list [{name:'', title:'', templateUrl:''}, ...]
            var deferred = $q.defer();
            var content = '<div class="scroller" style="height: 200px; overflow: hidden; width: auto;" data-initialized="1">'
                                                + '<p>'
                                                +     'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.'
                                                + '</p>'
                                                + '<p>'
                                                +     'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.'
                                                + '</p>'
                                                + '<p>'
                                                +     'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.'
                                                + '</p>'
                                            + '</div>'
            $timeout(function(){
                var result = [
                    {
                        id: 1
                        , title: 'Title for Topic A'
                        , slug: 'a'
                        , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg' // if a topic has not img attached, then attach its author's profile
                        , authorName: 'Ace'
                        , replyCount: 100
                        , publishedAt: Moment().subtract(10, 'minutes')
                        , groupName: 'Long long long long long long long long long long long long long group name'
                        , groupSlug: 'a'
                        , content: 'abc<br/><img src="http://ionicframework.com/img/docs/venkman.jpg"/><br/>' + content
                    }
                    , {
                        id: 2
                        , title: 'Title for Topic B long long long long long long long longlonglonglong long longlonglong'
                        , slug: 'b'
                        , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                        , authorName: 'Bob'
                        , replyCount: 200
                        , publishedAt: Moment().subtract(1, 'months')
                        , groupName: 'Long long long long long long long long long long group name'
                        , groupSlug: 'a'
                        , content: 'abc<br/><img src="http://ionicframework.com/img/docs/venkman.jpg"/><br/>' + content
                    }
                    , {
                        id: 3
                        , title: 'Title for Topic C'
                        , slug: 'c'
                        , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                        , authorName: 'Cat'
                        , replyCount: 50
                        , publishedAt: Moment().subtract(10, 'days')
                        , groupName: 'Long long long long long long long long long long group name'
                        , groupSlug: 'a'
                        , content: content
                    }
                ];
                deferred.resolve(result);
            }, 1000);
            return deferred.promise;
        }

        function getGroupTopics(groupName){
            var deferred = $q.defer();
            if( !(groupName in _cache) ) {
                doGetGroupTopics( groupName ).then(
                    function(topics){
                        _cache[ groupName ] = topics;
                        deferred.resolve(_cache[ groupName ]);
                    }
                    , function(error){
                        deferred.reject(error);
                    }
                )
            } else {
                deferred.resolve(_cache[ groupName ]);
            }
            return deferred.promise;
            
        }

        function getTopic(id){
            var deferred = $q.defer();

            doGetGroupTopics(id).then(function(topics){
                $timeout(function(){
                    deferred.resolve( topics[0] );
                }, 300);
            }, function(error){
                deferred.reject( error );
            });
            return deferred.promise;
        }

    }
});