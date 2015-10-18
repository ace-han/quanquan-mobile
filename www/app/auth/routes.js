define([
    './module'
    , './namespace'
    , '../namespace'
],
function (authModule, moduleNamespace, appNamespace) {
    'use strict';
    return authModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(moduleNamespace, {
                url: '/auth'
                , parent: appNamespace
                , abstract: true
              })
              .state(moduleNamespace + '.login', {
                url: '/login'
                // there is a warning on the official website says
                //  Warning: The controller will not be instantiated if template is not defined.
                //controller: moduleNamespace + '.LoginController as loginController',
                , views: {
                  '@': {
                    // found controller: 'XxxController as xxxController' is working with ionic now
                    // BUT NOT controllerAs syntax!!!
                    templateUrl: 'app/auth/templates/login.html'
                    , controller: moduleNamespace + '.LoginController as loginController'
                  }
                }
              })
              .state(moduleNamespace + '.register', {
                url: '/register'
                // The resolve keyword MUST be relative to state not views (in case you use multiple views).
                , resolve: {
                  cities: ['$ionicLoading', moduleNamespace+'.registerService', function($ionicLoading, registerService){
                    return registerService.getCityList()
                            .catch(function(){
                              $ionicLoading.show({ template: 'Load City List Failed! Retry later', 
                                      noBackdrop: true, duration: 1500 });
                            })
                            
                  }]
                }
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/register.html'
                    , controller: moduleNamespace + '.RegisterController as registerController'
                  }
                }
              })
              .state(moduleNamespace + '.resetPassword', {
                url: '/reset-password'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/password_reset_form.html' 
                  }
                }
              })
              .state(moduleNamespace + '.confirmResetPassword', {
                url: '/confirm-reset-password'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/password_reset_confirm.html' 
                  }
                }
              })
              .state(moduleNamespace + '.changePassword', {
                url: '/change-password'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/password_change_form.html' 
                  }
                }
              })
              .state(moduleNamespace + '.accessDenied', {
                url: '/403'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/403.html' 
                  }
                }
              })
        }]);
});