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
        , '$stickyStateProvider'
        , '$futureStateProvider'
        , function($stateProvider, $urlRouterProvider, $stickyStateProvider, $futureStateProvider){
          //var quanquanNamespace = 'quanquan';
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
                .state(namespace + '.others', {
                  url: '/others'
                  , views: {
                    '@': {
                      templateUrl: 'templates/others.html'
                    }
                  }
                })
          $stickyStateProvider.enableDebug(true);
          $urlRouterProvider
                  // if none of the above states are matched, use this as the fallback
                .otherwise('/others');

          
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
})