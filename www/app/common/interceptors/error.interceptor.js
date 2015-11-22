
define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
  module.run(['$timeout', '$state', 'Restangular',
            function ($timeout, $state, Restangular) {
              var timeoutPromise = null;

              function stateRedirect(stateName, extraParams){
                // avoid error redirect many times
                // the very last one wins
                if(timeoutPromise){
                  $timeout.cancel(timeoutPromise);
                }
                timeoutPromise = $timeout(function(){
                  timeoutPromise = null;
                  $state.go(stateName, extraParams);
                }, 500);
              }

              Restangular.setErrorInterceptor(function(response, deferred, responseHandler){
                if(response.status == 403){
                  var reason = response.data&&response.data.detail? response.data.detail: 'wierd unknown reason...';
                  if (reason.toLowerCase().indexOf('expiry') != -1) {
                    stateRedirect('auth.login', {reason: 'Login Expired!'});
                    //$state.go('auth.login', {reason: 'Login Expired!'});
                  }
                  else if( reason.toLowerCase().indexOf('signature') != -1 ){
                    stateRedirect('auth.login');
                    //$state.go('auth.login');
                  } else {
                    stateRedirect('auth.accessDenied', {reason: '403 '+reason});
                  }
                  return false; // error handled
                }
                console.error(response, deferred, responseHandler);
                return true; // error not handled
              });
            }])
});