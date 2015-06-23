define([
    './module'
    , './namespace'
    , '../namespace'
],
function (quanquanModule, quanquanNamespace, appNamespace) {
    'use strict';
    return quanquanModule.config([
        '$stateProvider'
        , '$urlRouterProvider'
        , '$futureStateProvider'
        , function($stateProvider, $urlRouterProvider, $futureStateProvider){
          $stateProvider
            // it's necessary to declare this abstract one for state 'app' in app/routes.js have its direct children initialized!!!
            .state(quanquanNamespace, { 
              url: ''  // it's very important that with an empty string here to make it home page
              , abstract: true
              , parent: appNamespace
            })
            .state(quanquanNamespace + '.index', { 
              url: ''
              , views: {
                // with this '@' means unname view at root level
                // every submodule's root may define like this
                '@': {
                  // it's bad solution doing this
                  templateUrl: 'app/quanquan/templates/index.html'
                  // but the controller still could take resolved data
                  , controller: quanquanNamespace + '.ChannelsController as channelsController'
                }
              }
              // please be aware of using below on state level not view level
              // http://stackoverflow.com/questions/27719183/onenter-and-onexit-are-not-called-when-state-is-left-activated-in-angularjs-ui-r#answer-27721831
              // no necessary for the resolve section
              // , resolve: {
              //     isLoading: ['channelService']
              // }
              , onEnter: ['$state', '$ionicHistory', '$ionicLoading', quanquanNamespace + '.channelService', 
                      function ($state, $ionicHistory, $ionicLoading, channelService){
                channelService.getChannelStateSettings().then(
                    function success(states){
                        var firstState = states[0];
                        console.info('resolved 1st channel:', firstState.name);
                        $state.go(firstState.name);
                        // console.info($ionicHistory.viewHistory() );
                    }, function error(error){
                      $ionicLoading.show({ template: error, 
                          noBackdrop: true, duration: 2000 });
                    });
              }]
            })
            .state(quanquanNamespace + '.termsOfService', {
              url: '/terms-of-service'
              // cache setting I've decided placing them in routes.js
              , cache: false
              , views: {
                '@': {
                  templateUrl: 'app/quanquan/templates/terms_of_service.html'
                  
                }
              }
            })
            .state(quanquanNamespace + '.privacyPolicy', {
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
          loadAndRegisterFutureStates.$inject = [quanquanNamespace + '.channelService'];
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