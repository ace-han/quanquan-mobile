define([
    './module'
    , './namespace'
    , '../namespace'
],
function (quanquanModule, moduleNamespace, appNamespace) {
    'use strict';
    return quanquanModule.config([
        '$stateProvider'
        , '$urlRouterProvider'
        , '$futureStateProvider'
        , function($stateProvider, $urlRouterProvider, $futureStateProvider){
          $stateProvider
            // it's necessary to declare this abstract one for state 'app' in app/routes.js have its direct children initialized!!!
            .state(moduleNamespace, { 
              url: ''  // it's very important that with an empty string here to make it home page
              , abstract: true
              , parent: appNamespace
            })
            .state(moduleNamespace + '.index', { 
              url: ''
              , views: {
                // with this '@' means unname view at root level
                // every submodule's root may define like this
                '@': {
                  // it's bad solution doing this
                  templateUrl: 'app/quanquan/templates/index.html'
                  // but the controller still could take resolved data
                  , controller: moduleNamespace + '.ChannelsController as channelsController'
                }
              }
              // please be aware of using below on state level not view level
              // http://stackoverflow.com/questions/27719183/onenter-and-onexit-are-not-called-when-state-is-left-activated-in-angularjs-ui-r#answer-27721831
              // no necessary for the resolve section
              // , resolve: {
              //     isLoading: ['channelService']
              // }
              , onEnter: ['$state', '$ionicHistory', '$ionicLoading', moduleNamespace + '.channelService', 
                      function ($state, $ionicHistory, $ionicLoading, channelService){
                channelService.getChannelStateSettings().then(
                    function success(states){
                        var firstState = states[0];
                        console.info('resolved 1st channel:', firstState.name);
                        $state.go(firstState.name);
                        // console.info($ionicHistory.viewHistory() );
                    }, function error(err){
                      $ionicLoading.show({ template: err, 
                          noBackdrop: true, duration: 2000 });
                    });
              }]
            })
            .state(moduleNamespace + '.termsOfService', {
              url: '/terms-of-service'
              // cache setting I've decided placing them in routes.js
              , cache: false
              , views: {
                '@': {
                  templateUrl: 'app/quanquan/templates/terms_of_service.html'
                  
                }
              }
            })
            .state(moduleNamespace + '.privacyPolicy', {
              url: '/privacy-policy'
              , cache: false
              , views: {
                '@': {
                  templateUrl: 'app/quanquan/templates/privacy_policy.html'
                  
                }
              }
            })


          $futureStateProvider.stateFactory('quanquan', generalStateFactory);
          $futureStateProvider.addResolve(loadAndRegisterFutureStates);

          // resolver just setting retrieval
          loadAndRegisterFutureStates.$inject = [moduleNamespace + '.channelService'];
          function loadAndRegisterFutureStates(channelService){
            // may change to a general url service later
            return channelService.getChannelStateSettings().then(
                        function(stateSettings){
                           angular.forEach(stateSettings, function (fstate) {
                            $futureStateProvider.futureState(fstate);
                          });
                        }
                    );
          }
          // setFactory will actually do the new state register
          generalStateFactory.$inject = ['$q', 'futureState'];

          function generalStateFactory($q, futureState){
            // later, we will add other url
            // futureState's struct depends on the return value from loadAndRegisterFutureStates function
            return $q.when(futureState);
          }
  }])
})