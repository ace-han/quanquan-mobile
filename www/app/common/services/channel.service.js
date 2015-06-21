define([
    'angular'
    , '../module'
],
function (angular, module) {
    'use strict';

    var name = 'channelService';

    module.factory(name, channelService);

    channelService.$inject = ['$http', '$q', '$window', '$timeout' ];

    return channelService;

    function channelService($http, $q, $window, $timeout){
        var _cache
        , PARENT_STATE = 'app.home'
        //, SELF_STATE = PARENT_STATE + '.channel'
        , VIEWNAME_POSTFIX = '-tab@' + PARENT_STATE

        var service = {
            _cache: _cache
            , getChannels: getChannels
            , getChannelStateSettings: getChannelStateSettings
        }

        return service;

        

        function doGetChannels(){
            // return a list [{name:'', title:'', templateUrl:''}, ...]
            var deferred = $q.defer();
            /*
            $http.post('/api/v1/auth/login/', 
                {   username: username
                    , password: password
                }).success(function (response, status, headers, config) {
                    if (response.token) {
                        // if token means success, we can extract the payload
                        var token = response.token;
                        var payload = angular.fromJson( $window.atob(token.split('.')[1]) );
                        service.setToken(response.token);

                        deferred.resolve(payload);
                    }
                    // for some other un-expected situation
                    deferred.resolve(response, status, headers, config);
                }).error(function (response, status, headers, config) {
                    deferred.reject(response, status, headers, config);
                });

            */
            $timeout(function(){
                var result = [
                    {
                        name: 'recommendation'
                        , title: 'Recommendation'
                        , templateUrl: 'templates/channel.html'
                        , controller: 'ChannelController as channelController'
                    }
                    , {
                        name: 'civilization'
                        , title: 'Civilization'
                        , templateUrl: 'templates/channel.html'
                        , controller: 'ChannelController as channelController'
                    }
                    , {
                        name: 'entertainment'
                        , title: 'Entertainment'
                        , templateUrl: 'templates/channel.html'
                        , controller: 'ChannelController as channelController'
                    }
                ];
                deferred.resolve(result);
            }, 1000);
            return deferred.promise;
        }

        function getChannels(){
            var deferred = $q.defer();
            if(!_cache) {
                doGetChannels().then(
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

        function getChannelStateSettings(){
            // return a promise
            var deferred = $q.defer();
            getChannels().then(
                function(channels){
                    // since I found below in $ionicTabs  ionic-angular.js
                    // this.tabMatchesState = function() {
                    //      return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
                    //  };
                    // That srefMatchesState() prevent us from sharing the same state, might as well do it in diff states
                    /*
                    var state = {
                        name: SELF_STATE
                        , url: '/channel/{channel:[-\\w]+}' // need double anti-slash here!!!
                        , parent: PARENT_STATE
                        , abstract: false
                        , views: {}
                        , type: 'general' // for app/routes.js futureStateFactory
                    }
                    angular.forEach(channels, function (channel) {
                        state.views[channel.name + VIEWNAME_POSTFIX] = {
                            templateUrl : channel.templateUrl
                        };
                    });
                    */
                    var states = [];
                    angular.forEach(channels, function (channel) {
                        var views = {};
                        views[ channel.name + VIEWNAME_POSTFIX ] = {
                            templateUrl : channel.templateUrl
                            , controller: channel.controller
                        }
                        var state = {
                            name: PARENT_STATE + '.' + channel.name
                            , title: channel.title
                            , url: '/channel/' + channel.name
                            , parent: PARENT_STATE
                            , abstract: false
                            , views: views
                            , type: 'general' // for app/routes.js futureStateFactory
                        }
                        states.push(state);
                    });
                    deferred.resolve(states);
                }
                , function(error){
                    deferred.reject('Could not resolve channel settings'+error);
                }
            )
            return deferred.promise;
            
        }

    }
});