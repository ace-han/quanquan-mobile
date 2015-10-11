define([
    './module'
    , './namespace'
    , '../namespace'
],
function (authModule, authNamespace, appNamespace) {
    'use strict';
    return authModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(authNamespace, {
                url: '/auth'
                , parent: appNamespace
                , abstract: true
              })
              .state(authNamespace + '.login', {
                url: '/login'
                // there is a warning on the official website says
                //  Warning: The controller will not be instantiated if template is not defined.
                //controller: authNamespace + '.LoginController as loginController',
                , views: {
                  '@': {
                    // found controller: 'XxxController as xxxController' is working with ionic now
                    // BUT NOT controllerAs syntax!!!
                    templateUrl: 'app/auth/templates/login.html'
                    , controller: authNamespace + '.LoginController as loginController'
                  }
                }
              })
              .state(authNamespace + '.register', {
                url: '/register'
                // The resolve keyword MUST be relative to state not views (in case you use multiple views).
                , resolve: {
                  cities: ['$ionicLoading', authNamespace+'.registerService', function($ionicLoading, registerService){
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
                    , controller: authNamespace + '.RegisterController as registerController'
                  }
                }
              })
              .state(authNamespace + '.resetPassword', {
                url: '/reset-password'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/password_reset_form.html' 
                  }
                }
              })
              .state(authNamespace + '.confirmResetPassword', {
                url: '/confirm-reset-password'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/password_reset_confirm.html' 
                  }
                }
              })
              .state(authNamespace + '.changePassword', {
                url: '/change-password'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/password_change_form.html' 
                  }
                }
              })
              .state(authNamespace + '.accessDenied', {
                url: '/403'
                , views: {
                  '@': {
                    templateUrl: 'app/auth/templates/403.html' 
                  }
                }
              })
        }]);
});