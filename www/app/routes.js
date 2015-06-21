define([
    'angular'
    , 'app/app'
    , './namespace'

]
,function (angular, appModule, namespace) {
    'use strict';
    return appModule.config([
        '$stateProvider'
        , '$urlRouterProvider'
        , '$futureStateProvider'
        , '$stickyStateProvider'
        , function($stateProvider, $urlRouterProvider, $futureStateProvider, $stickyStateProvider){
            $stateProvider
                .state(namespace, {
                  abstract: true
                  , views: {
                    'left-panel': {
                      templateUrl: 'templates/left_panel.html'
                      , controller: 'MainMenuController as mainMenuController'
                    }
                  }
                })
                .state(namespace + '.home', {
                  url: ''  // it's very important that with an empty string here to make it home page
                  , views: {
                    // with this '@' means unname view at root level
                    // every submodule's root may define like this
                    '@': {
                      // it's bad solution doing this
                      templateUrl: 'templates/home.html'
                      // but the controller still could take resolved data
                      , controller: 'ChannelsController as channelsController'
                    }
                  }
                  // please be aware of using below on state level not view level
                  // http://stackoverflow.com/questions/27719183/onenter-and-onexit-are-not-called-when-state-is-left-activated-in-angularjs-ui-r#answer-27721831
                  // no necessary for the resolve section
                  // , resolve: {
                  //     isLoading: ['channelService']
                  // }
                  , onEnter: ['$state', '$ionicHistory', '$ionicLoading', 'channelService', 
                          function ($state, $ionicHistory, $ionicLoading, channelService){
                    channelService.getChannels().then(
                        function success(channels){
                            var firstChannel = channels[0];
                            console.info('resolved 1st channel:', namespace + '.home.'+ firstChannel.name);
                            $state.go(namespace + '.home.'+ firstChannel.name);
                            // $state.go('app.home.a');
                            // console.info($ionicHistory.viewHistory() );
                        }, function error(error){
                          $ionicLoading.show({ template: error, 
                              noBackdrop: true, duration: 2000 });
                        });
                  }]
                })
                .state(namespace + '.others', {
                  url: '/others'
                  , views: {
                    '@': {
                      templateUrl: 'templates/others.html'
                    }
                  }
                })
                .state(namespace + '.termsOfService', {
                  url: '/terms-of-service'
                  , views: {
                    '@': {
                      templateUrl: 'templates/terms_of_service.html'
                      
                    }
                  }
                })
                .state(namespace + '.privacyPolicy', {
                  url: '/privacy-policy'
                  , views: {
                    '@': {
                      templateUrl: 'templates/privacy_policy.html'
                      
                    }
                  }
                })

                // .state(namespace + '.home.a', {
                //   url: '/channel/a'
                //   , views: {
                //     'a@app.home': {
                //       templateUrl: 'templates/channel1.html'
                      
                //     }
                //   }
                // })
                // .state(namespace + '.home.b', {
                //   url: '/channel/b'
                //   , views: {
                //     'b@app.home': {
                //       templateUrl: 'templates/channel2.html'
                      
                //     }
                //   }
                // })
          $stickyStateProvider.enableDebug(true);
          $futureStateProvider.stateFactory('general', generalStateFactory);
          $futureStateProvider.addResolve(loadAndRegisterFutureStates);

          
          $urlRouterProvider
                  // if none of the above states are matched, use this as the fallback
                .otherwise('/others');

          // resolver just setting retrieval
          loadAndRegisterFutureStates.$inject = ['channelService'];
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

/*
    let's assume that `root` is `index.html` as well
    state `app` is `main.html`
    then `app.search`

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.search.test', {
    url: "/test",
    // This will get automatically plugged into the unnamed ui-view 
    // of the parent(ancestor) state template. 
    // absolutely targets the unnamed view in root unnamed state.
    // <ion-nav-view/> within index.html
    // this will lose any nav bar setting in main.html, bad!
    
    views: {
        '@' :{
    templateUrl: "templates/test.html"
          
        }
      }
    
  })
  
  // this one is parallel level to app.search it breaaks the hierachy properties inheritance
  // but nav-bar nav setting in main.html works ok
  // Relatively targets the 'detail' view in this state's parent state, 'app'.
  // <ion-nav-view name="mainMenuContent"> within main.html
  // but lose the heirachical that we used to think it is
  .state('app.test', {
    url: "/test",
views: {
        'menuContent' :{
          templateUrl: "templates/test.html"
        }
      }
  })
    
    // every view gets assigned an absolute name that follows a scheme of viewname@statename
    // this works fine, but we need to explicitly write `@app`
  .state('app.search.test', {
    url: "/test",
    views: {
      'menuContent@app': {
        templateUrl: "templates/search.html"
      }
    }
  })
*/
  }])
  //.run();
})